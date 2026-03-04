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
  
  for (const [address, dev] of developers) {
    const hasMigrations = dev.migratedTokens > 0;
    const has24hVolume = dev.volume24h > 1;
    
    const winRate = dev.totalDeployments > 0 
      ? Math.round((dev.wins / dev.totalDeployments) * 100) 
      : 0;

    devs.push({
      address,
      name: `${address.slice(0, 6)}...${address.slice(-4)}`,
      totalDeployments: dev.totalDeployments,
      migratedTokens: dev.migratedTokens,
      totalVolume: dev.totalVolume.toFixed(2),
      volume24h: dev.volume24h.toFixed(2),
      wins: dev.wins,
      winRate: `${winRate}%`,
      hasMigrations,
      has24hVolume,
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
    let developers_data = calculateDeveloperStats();
    
    if (filter === 'migrations') {
      developers_data = developers_data.filter(d => d.hasMigrations);
    } else if (filter === 'volume') {
      developers_data = developers_data.filter(d => d.has24hVolume);
    } else if (filter === 'active') {
      developers_data = developers_data.filter(d => d.hasMigrations && d.has24hVolume);
    }
    
    const limit = parseInt(req.query.limit) || 20;
    developers_data = developers_data.slice(0, limit);
    
    const topTokens = getTopTokens(10);
    
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
