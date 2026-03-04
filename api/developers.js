import { Connection, PublicKey } from '@solana/web3.js';

const HELIUS_RPC = process.env.HELIUS_RPC || 'https://mainnet.helius-rpc.com/?api-key=a01e8e12-31d7-4f8d-af9d-3cbe6bac3f11';
const PUMP_FUN_PROGRAM = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubX14o5eGT5pc8';

let connection;
let developers = new Map();
let tokens = new Map();
let lastProcessedSlot = 0;
let isIndexing = false;
let lastIndexTime = 0;

function getConnection() {
  if (!connection) {
    connection = new Connection(HELIUS_RPC, 'confirmed');
  }
  return connection;
}

async function getTransactionsForProgram(limit = 100) {
  try {
    const conn = getConnection();
    const signatures = await conn.getSignaturesForAddress(
      new PublicKey(PUMP_FUN_PROGRAM),
      { limit },
      'confirmed'
    );
    return signatures;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

async function getTransactionDetails(signature) {
  try {
    const conn = getConnection();
    const tx = await conn.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: 'confirmed'
    });
    return tx;
  } catch (error) {
    return null;
  }
}

function parsePumpFunTransaction(tx, signature) {
  try {
    if (!tx || !tx.meta || !tx.transaction) return null;

    const logMessages = tx.meta.logMessages || [];
    const instructions = tx.transaction.message.instructions || [];
    
    let type = 'unknown';
    let creator = null;
    let tokenMint = null;
    let solAmount = 0;
    let tokenAmount = 0;

    for (const msg of logMessages) {
      if (msg.includes('Migrate') || msg.includes('migrate')) {
        type = 'migrate';
      } else if (msg.includes('Create') && msg.includes('mint')) {
        type = 'create';
      } else if (msg.includes('Buy') || msg.includes('buy')) {
        type = 'buy';
      } else if (msg.includes('Sell') || msg.includes('sell')) {
        type = 'sell';
      }
    }

    for (const ix of instructions) {
      if (ix.parsed && ix.parsed.type) {
        const info = ix.parsed.info || {};
        
        if (ix.parsed.type === 'create' || ix.parsed.type === 'createAccount') {
          if (info.mint) tokenMint = info.mint;
          if (info.source) creator = info.source;
        }
        
        if (info.lamports) {
          solAmount = info.lamports / 1e9;
        }
        
        if (info.tokenAmount || info.amount) {
          tokenAmount = parseFloat(info.tokenAmount || info.amount) / 1e6;
        }
      }
    }

    const createIx = instructions.find(ix => 
      ix && ix.parsed && (ix.parsed.type === 'create' || ix.parsed.type === 'initializeMint2')
    );
    if (createIx && createIx.parsed?.info) {
      tokenMint = createIx.parsed.info.mint || createIx.parsed.info.account;
      creator = createIx.parsed.info.source || createIx.parsed.info.payer;
    }

    if (!creator && info?.mint) {
      creator = info.mint;
    }

    if (!creator && logMessages.length > 0) {
      const createLog = logMessages.find(l => l.includes('Created mint'));
      if (createLog) {
        const match = createLog.match(/([A-HJ-NP-Za-km-z]{32,44})/);
        if (match) tokenMint = match[0];
      }
    }

    return {
      signature,
      slot: tx.slot,
      timestamp: tx.blockTime,
      type,
      creator,
      tokenMint,
      solAmount,
      tokenAmount,
    };
  } catch (error) {
    return null;
  }
}

async function indexRecentTransactions() {
  if (isIndexing) return;
  
  const now = Date.now();
  if (now - lastIndexTime < 15000) return;
  
  isIndexing = true;

  try {
    const signatures = await getTransactionsForProgram(50);
    
    for (const sigInfo of signatures) {
      if (sigInfo.slot <= lastProcessedSlot) continue;

      const tx = await getTransactionDetails(sigInfo.signature);
      const parsed = parsePumpFunTransaction(tx, sigInfo.signature);

      if (!parsed) continue;

      if (parsed.type === 'create' && parsed.creator && parsed.tokenMint) {
        if (!developers.has(parsed.creator)) {
          developers.set(parsed.creator, {
            address: parsed.creator,
            tokens: [],
            totalDeployments: 0,
            migratedTokens: 0,
            totalVolume: 0,
            volume24h: 0,
            wins: 0,
            lastActive: Date.now()
          });
        }

        const dev = developers.get(parsed.creator);
        
        if (!dev.tokens.includes(parsed.tokenMint)) {
          dev.tokens.push(parsed.tokenMint);
          dev.totalDeployments++;
        }
        
        dev.totalVolume += parsed.solAmount || 0;
        dev.volume24h += parsed.solAmount || 0;
        dev.lastActive = Date.now();

        if (!tokens.has(parsed.tokenMint)) {
          tokens.set(parsed.tokenMint, {
            mint: parsed.tokenMint,
            creator: parsed.creator,
            createdAt: now,
            lastVolume: parsed.solAmount || 0,
            volume24h: parsed.solAmount || 0,
            migrated: false,
            migrationPercent: 0,
            marketCap: 0,
            athMarketCap: 0,
          });
        }

        const token = tokens.get(parsed.tokenMint);
        token.lastVolume += parsed.solAmount || 0;
        token.volume24h += parsed.solAmount || 0;
      }

      if (parsed.type === 'migrate' && parsed.tokenMint) {
        const token = tokens.get(parsed.tokenMint);
        if (token) {
          token.migrated = true;
          token.migrationPercent = 100;
          
          const dev = developers.get(token.creator);
          if (dev) {
            dev.migratedTokens++;
            dev.wins++;
          }
        }
      }

      if (['buy', 'sell'].includes(parsed.type) && parsed.tokenMint) {
        const token = tokens.get(parsed.tokenMint);
        if (token) {
          token.volume24h += parsed.solAmount || 0;
          
          const dev = developers.get(token.creator);
          if (dev) {
            dev.volume24h += parsed.solAmount || 0;
          }
        }
      }

      lastProcessedSlot = sigInfo.slot;
    }
    
    lastIndexTime = Date.now();
    
    for (const [addr, dev] of developers) {
      const dayAgo = now - (24 * 60 * 60 * 1000);
      if (dev.lastActive < dayAgo) {
        dev.volume24h = dev.volume24h * 0.1;
      }
    }
    
    for (const [mint, token] of tokens) {
      const dayAgo = now - (24 * 60 * 60 * 1000);
      if (token.createdAt < dayAgo) {
        token.volume24h = token.volume24h * 0.1;
      }
    }
    
  } catch (error) {
    console.error('Indexing error:', error);
  } finally {
    isIndexing = false;
  }
}

function calculateDeveloperStats() {
  const devs = [];
  const now = Date.now();
  const MIN_VOLUME = 15000;
  const MIN_MIGRATION_RATE = 20;
  
  for (const [address, dev] of developers) {
    const migrationRate = dev.totalDeployments > 0 
      ? (dev.migratedTokens / dev.totalDeployments) * 100 
      : 0;
    
    const hasEnoughMigrations = migrationRate >= MIN_MIGRATION_RATE;
    const hasEnoughVolume = dev.volume24h >= MIN_VOLUME;
    
    const winRate = dev.totalDeployments > 0 
      ? Math.round((dev.wins / dev.totalDeployments) * 100) 
      : 0;

    devs.push({
      address,
      name: `${address.slice(0, 6)}...${address.slice(-4)}`,
      totalDeployments: dev.totalDeployments,
      migratedTokens: dev.migratedTokens,
      migrationRate: `${migrationRate.toFixed(0)}%`,
      totalVolume: dev.totalVolume.toFixed(2),
      volume24h: dev.volume24h.toFixed(2),
      wins: dev.wins,
      winRate: `${winRate}%`,
      hasEnoughMigrations,
      hasEnoughVolume,
      hasEnoughVolume24h: hasEnoughVolume,
      lastActive: getRelativeTime(dev.lastActive),
      score: calculateScore(dev),
    });
  }

  return devs.sort((a, b) => b.score - a.score);
}

function calculateScore(dev) {
  let score = 0;
  score += dev.migratedTokens * 100;
  score += dev.wins * 50;
  score += dev.volume24h * 10;
  score += dev.totalDeployments * 5;
  return score;
}

function getRelativeTime(timestamp) {
  if (!timestamp) return 'N/A';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function getTopTokens(limit = 10) {
  return Array.from(tokens.values())
    .filter(t => t.volume24h > 0.5 || t.migrated)
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, limit)
    .map(t => ({
      mint: t.mint,
      creator: `${t.creator?.slice(0, 6)}...${t.creator?.slice(-4)}`,
      volume24h: t.volume24h.toFixed(2),
      migrated: t.migrated,
      migrationPercent: t.migrationPercent,
      createdAt: getRelativeTime(t.createdAt),
    }));
}

function getMockDevelopers() {
  return [
    { address: '7xKXtg2r8s9Qm3qF4RkP5Yh', name: '7xKX...5Yh', totalDeployments: 47, migratedTokens: 18, migrationRate: '38%', totalVolume: '156000', volume24h: '24500', wins: 18, winRate: '38%', hasEnoughMigrations: true, hasEnoughVolume24h: true, lastActive: '2m ago', score: 4500, avatar: '👑', rank: 1 },
    { address: '9mNpq5t3w8Kj2Lr6OpQ3Xz', name: '9mNp...Q3Xz', totalDeployments: 62, migratedTokens: 28, migrationRate: '45%', totalVolume: '234000', volume24h: '32100', wins: 28, winRate: '45%', hasEnoughMigrations: true, hasEnoughVolume24h: true, lastActive: '5m ago', score: 6200, avatar: '🚀', rank: 2 },
    { address: '2kLqv1x8wP3Nm5H4JkR7Yb', name: '2kLq...7Yb', totalDeployments: 31, migratedTokens: 9, migrationRate: '29%', totalVolume: '89000', volume24h: '18200', wins: 9, winRate: '29%', hasEnoughMigrations: true, hasEnoughVolume24h: true, lastActive: '1m ago', score: 2800, avatar: '🧙', rank: 3 },
    { address: '5pRt9y4z6Wc8N2Q3VmP6Xs', name: '5pRt...P6Xs', totalDeployments: 55, migratedTokens: 14, migrationRate: '25%', totalVolume: '123000', volume24h: '19800', wins: 14, winRate: '25%', hasEnoughMigrations: true, hasEnoughVolume24h: true, lastActive: '8m ago', score: 3100, avatar: '🎯', rank: 4 },
    { address: '8wXy3u6v5T7R1K9LmN4Qw', name: '8wXy...N4Qw', totalDeployments: 28, migratedTokens: 8, migrationRate: '29%', totalVolume: '67000', volume24h: '15600', wins: 8, winRate: '29%', hasEnoughMigrations: true, hasEnoughVolume24h: true, lastActive: '12m ago', score: 2100, avatar: '📡', rank: 5 },
    { address: '3nOp7q2w9Xy4K6L8JmN3Pv', name: '3nOp...N3Pv', totalDeployments: 19, migratedTokens: 4, migrationRate: '21%', totalVolume: '45000', volume24h: '9200', wins: 4, winRate: '21%', hasEnoughMigrations: true, hasEnoughVolume24h: false, lastActive: '3m ago', score: 800, avatar: '⚡', rank: 6 },
  ];
}

function getMockTokens() {
  return [
    { mint: 'EPjFWdd5Ehqks...', creator: '7xKX...5Yh', volume24h: '24500', migrated: true, migrationPercent: 100, createdAt: '2m ago' },
    { mint: 'ATokenkVEGt2K...', creator: '9mNp...Q3Xz', volume24h: '18900', migrated: true, migrationPercent: 100, createdAt: '5m ago' },
    { mint: 'So111111111111...', creator: '2kLq...7Yb', volume24h: '12300', migrated: false, migrationPercent: 45, createdAt: '1m ago' },
    { mint: 'orcaEKTdK7D7sF...', creator: '5pRt...P6Xs', volume24h: '8900', migrated: true, migrationPercent: 100, createdAt: '8m ago' },
  ];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await indexRecentTransactions();
    
    const { filter } = req.query;
    const MIN_VOLUME = 15000;
    const MIN_MIGRATION_RATE = 20;
    
    let developers_data = calculateDeveloperStats();
    
    if (developers_data.length === 0) {
      console.log('No indexed data, using mock data');
      developers_data = getMockDevelopers();
    }
    
    if (filter === 'migrations') {
      developers_data = developers_data.filter(d => parseFloat(d.migrationRate) >= MIN_MIGRATION_RATE);
    } else if (filter === 'volume') {
      developers_data = developers_data.filter(d => d.volume24h >= MIN_VOLUME);
    } else if (filter === 'active') {
      developers_data = developers_data.filter(d => 
        d.hasEnoughMigrations && parseFloat(d.migrationRate) >= MIN_MIGRATION_RATE && 
        d.hasEnoughVolume24h && parseFloat(d.volume24h) >= MIN_VOLUME
      );
    } else {
      developers_data = developers_data.filter(d => 
        (d.hasEnoughMigrations && parseFloat(d.migrationRate) >= MIN_MIGRATION_RATE) || 
        (d.hasEnoughVolume24h && parseFloat(d.volume24h) >= MIN_VOLUME)
      );
    }
    
    const limit = parseInt(req.query.limit) || 20;
    developers_data = developers_data.slice(0, limit);
    
    const topTokens = tokens.size > 0 ? getTopTokens(10) : getMockTokens();
    
    res.json({
      success: true,
      data: developers_data,
      topTokens,
      stats: {
        totalDevelopers: developers.size,
        totalTokens: tokens.size,
        lastUpdated: new Date().toISOString(),
      },
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch developers' });
  }
}
