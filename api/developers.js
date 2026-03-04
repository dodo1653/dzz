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

async function getRecentSignatures(limit = 100) {
  try {
    const conn = getConnection();
    const sigs = await conn.getSignaturesForAddress(
      new PublicKey(PUMP_FUN_PROGRAM),
      { limit },
      'confirmed'
    );
    return sigs;
  } catch (error) {
    console.error('Error getting signatures:', error.message);
    return [];
  }
}

async function getTransactionsParsed(signatures) {
  try {
    const conn = getConnection();
    const txs = await conn.getParsedTransactions(
      signatures.map(s => s.signature),
      { maxSupportedTransactionVersion: 0, commitment: 'confirmed' }
    );
    return txs;
  } catch (error) {
    console.error('Error getting transactions:', error.message);
    return [];
  }
}

function extractPumpFunData(tx, signature, slot, blockTime) {
  try {
    if (!tx || !tx.transaction || !tx.meta) return null;

    const instructions = tx.transaction.message.instructions || [];
    const innerInstructions = tx.meta.innerInstructions || [];
    
    let type = 'unknown';
    let creator = null;
    let mint = null;
    let solIn = 0;
    let tokenBalanceChange = 0;
    
    for (const ix of instructions) {
      if (ix.parsed) {
        const info = ix.parsed.info || {};
        
        if (ix.parsed.type === 'create' || ix.parsed.type === 'createAccount') {
          type = 'create';
          if (info.mint) mint = info.mint;
          if (info.source || info.payer) creator = info.source || info.payer;
        }
        
        if (ix.parsed.type === 'initializeMint2' || ix.parsed.type === 'initializeMint') {
          type = 'create';
        }
        
        if (ix.parsed.type === 'transfer' || ix.parsed.type === 'transferChecked') {
          if (info.mint === undefined) {
            solIn += (info.lamports || 0) / 1e9;
          }
        }
        
        if (ix.parsed.type === 'buy' || ix.parsed.type === 'swap') {
          type = 'buy';
        }
        
        if (ix.parsed.type === 'sell') {
          type = 'sell';
        }
      }
    }
    
    for (const ix of innerInstructions) {
      for (const innerIx of ix.instructions || []) {
        if (innerIx.parsed) {
          const info = innerIx.parsed.info || {};
          
          if (innerIx.parsed.type === 'create' || innerIx.parsed.type === 'createAccount') {
            type = 'create';
            if (info.mint) mint = info.mint;
            if (info.source) creator = info.source;
          }
          
          if (innerIx.parsed.type === 'initializeMint2' || innerIx.parsed.type === 'initializeMint') {
            type = 'create';
          }
          
          if (innerIx.parsed.type === 'transfer' && !info.mint) {
            solIn += (info.lamports || 0) / 1e9;
          }
        }
      }
    }
    
    if (!creator) {
      const logMessages = tx.meta.logMessages || [];
      for (const log of logMessages) {
        if (log.includes('Create account') || log.includes('Initialize account')) {
          const match = log.match(/([A-HJ-NP-Za-km-z]{32,44})/g);
          if (match && !creator) {
            creator = match[0];
          }
        }
      }
    }
    
    if (mint && creator) {
      return {
        type,
        signature,
        slot,
        timestamp: blockTime,
        creator,
        mint,
        solIn,
        tokenBalanceChange
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

async function indexTransactions() {
  if (isIndexing) return;
  
  const now = Date.now();
  if (now - lastIndexTime < 15000) return;
  
  isIndexing = true;

  try {
    console.log('Fetching pump.fun transactions...');
    const signatures = await getRecentSignatures(50);
    console.log(`Got ${signatures.length} signatures, last slot: ${lastProcessedSlot}`);
    
    const newSigs = signatures.filter(s => s.slot > lastProcessedSlot);
    console.log(`Processing ${newSigs.length} new transactions`);
    
    if (newSigs.length === 0) {
      isIndexing = false;
      return;
    }
    
    const txs = await getTransactionsParsed(newSigs);
    
    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i];
      const sigInfo = newSigs[i];
      
      if (!tx) continue;
      
      const data = extractPumpFunData(tx, sigInfo.signature, sigInfo.slot, tx.blockTime);
      
      if (!data) continue;
      
      if (data.type === 'create' && data.creator && data.mint) {
        if (!tokens.has(data.mint)) {
          tokens.set(data.mint, {
            mint: data.mint,
            creator: data.creator,
            createdAt: now,
            createdSlot: data.slot,
            volume: data.solIn,
            buyVolume: data.solIn,
            sells: 0,
            migrated: false,
            marketCap: 0,
            peakMarketCap: 0,
            holderCount: 0,
          });
        }
        
        const token = tokens.get(data.mint);
        token.volume += data.solIn;
        token.buyVolume += data.solIn;
        
        if (!developers.has(data.creator)) {
          developers.set(data.creator, {
            address: data.creator,
            totalDeployments: 0,
            tokens: new Set(),
            volume: 0,
            volume24h: 0,
            migrations: 0,
            wins: 0,
            lastActive: now,
          });
        }
        
        const dev = developers.get(data.creator);
        if (!dev.tokens.has(data.mint)) {
          dev.tokens.add(data.mint);
          dev.totalDeployments++;
        }
        dev.volume += data.solIn;
        dev.volume24h += data.solIn;
        dev.lastActive = now;
      }
      
      if ((data.type === 'buy' || data.type === 'sell') && data.mint) {
        const token = tokens.get(data.mint);
        if (token) {
          if (data.type === 'sell') {
            token.sells++;
          }
          token.volume += data.solIn;
          
          const dev = developers.get(token.creator);
          if (dev) {
            dev.volume += data.solIn;
            dev.volume24h += data.solIn;
          }
        }
      }
      
      lastProcessedSlot = sigInfo.slot;
    }
    
    for (const [addr, dev] of developers) {
      const dayAgo = now - (24 * 60 * 60 * 1000);
      if (dev.lastActive < dayAgo) {
        dev.volume24h = dev.volume24h * 0.1;
      }
    }
    
    for (const [mint, token] of tokens) {
      const dayAgo = now - (24 * 60 * 60 * 1000);
      if (token.createdAt < dayAgo) {
        token.volume = token.volume * 0.1;
      }
      
      if (token.volume > 5000 && !token.migrated) {
        token.migrated = true;
        token.migrationTime = now;
        
        const dev = developers.get(token.creator);
        if (dev) {
          dev.migrations++;
          dev.wins++;
        }
      }
      
      if (token.volume > token.peakMarketCap) {
        token.peakMarketCap = token.volume;
      }
    }
    
    lastIndexTime = now;
    console.log(`Indexed. Total devs: ${developers.size}, Total tokens: ${tokens.size}`);
    
  } catch (error) {
    console.error('Indexing error:', error.message);
  } finally {
    isIndexing = false;
  }
}

function getDeveloperStats() {
  const now = Date.now();
  const devs = [];
  const MIN_VOLUME = 15000;
  const MIN_MIGRATION_RATE = 20;
  
  for (const [address, dev] of developers) {
    const migrationRate = dev.totalDeployments > 0 
      ? (dev.migrations / dev.totalDeployments) * 100 
      : 0;
    
    const hasEnoughVolume = dev.volume24h >= MIN_VOLUME;
    const hasEnoughMigrations = migrationRate >= MIN_MIGRATION_RATE;
    
    const winRate = dev.totalDeployments > 0 
      ? Math.round((dev.wins / dev.totalDeployments) * 100) 
      : 0;
    
    devs.push({
      address,
      name: address.slice(0, 8) + '...' + address.slice(-4),
      totalDeployments: dev.totalDeployments,
      migrations: dev.migrations,
      migrationRate: `${Math.round(migrationRate)}%`,
      volume: dev.volume.toFixed(2),
      volume24h: dev.volume24h.toFixed(2),
      wins: dev.wins,
      winRate: `${winRate}%`,
      hasEnoughVolume,
      hasEnoughMigrations,
      lastActive: getRelativeTime(dev.lastActive),
      score: dev.wins * 100 + dev.volume24h * 10 + dev.totalDeployments * 5,
    });
  }
  
  return devs.sort((a, b) => b.score - a.score);
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
    .sort((a, b) => b.volume - a.volume)
    .slice(0, limit)
    .map(t => ({
      mint: t.mint.slice(0, 12) + '...',
      creator: t.creator.slice(0, 6) + '...',
      volume: t.volume.toFixed(2),
      migrated: t.migrated,
      createdAt: getRelativeTime(t.createdAt),
    }));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await indexTransactions();
    
    const MIN_VOLUME = 15000;
    const MIN_MIGRATION_RATE = 20;
    
    let devs = getDeveloperStats();
    
    devs = devs.filter(d => 
      (d.hasEnoughVolume || d.hasEnoughMigrations)
    );
    
    const limit = parseInt(req.query.limit) || 20;
    devs = devs.slice(0, limit);
    
    const topTokens = getTopTokens(10);
    
    res.json({
      success: true,
      data: devs,
      topTokens,
      stats: {
        totalDevelopers: developers.size,
        totalTokens: tokens.size,
        lastSlot: lastProcessedSlot,
        lastUpdated: new Date().toISOString(),
      },
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Handler error:', error.message);
    res.status(500).json({ error: 'Failed to fetch developers' });
  }
}
