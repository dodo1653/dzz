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
    console.error('Error fetching pump.fun transactions:', error);
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

function parseTokenCreation(tx, signature) {
  try {
    if (!tx || !tx.meta || !tx.transaction) return null;

    const instructions = tx.transaction.message.instructions || [];
    let creator = null;
    let tokenMint = null;
    let solAmount = 0;

    for (const ix of instructions) {
      if (ix.parsed) {
        if (ix.parsed.type === 'create' || ix.parsed.type === 'createAccount') {
          if (ix.parsed.info?.mint) tokenMint = ix.parsed.info.mint;
          if (ix.parsed.info?.source) creator = ix.parsed.info.source;
        }
        if (ix.parsed.info?.lamports) {
          solAmount = ix.parsed.info.lamports / 1e9;
        }
      }
    }

    if (!creator || !tokenMint) return null;

    return {
      signature,
      slot: tx.slot,
      timestamp: tx.blockTime,
      creator,
      tokenMint,
      solAmount,
    };
  } catch (error) {
    return null;
  }
}

async function indexRecentTransactions() {
  if (isIndexing) return;
  
  const now = Date.now();
  if (now - lastIndexTime < 30000) return;
  
  isIndexing = true;

  try {
    const signatures = await getTransactionsForProgram(50);
    
    for (const sigInfo of signatures) {
      if (sigInfo.slot <= lastProcessedSlot) continue;

      const tx = await getTransactionDetails(sigInfo.signature);
      const creation = parseTokenCreation(tx, sigInfo.signature);

      if (creation) {
        tokens.set(creation.tokenMint, {
          ...creation,
          status: 'active',
          currentMarketCap: 0,
          buyers: 0,
          volume: 0
        });

        if (!developers.has(creation.creator)) {
          developers.set(creation.creator, {
            address: creation.creator,
            name: `${creation.creator.slice(0, 4)}...${creation.creator.slice(-4)}`,
            tokens: [],
            totalDeployments: 0,
            totalVolume: 0,
            wins: 0,
            losses: 0,
            totalPnl: 0,
            lastActive: Date.now()
          });
        }

        const dev = developers.get(creation.creator);
        dev.tokens.push(creation.tokenMint);
        dev.totalDeployments++;
        dev.totalVolume += creation.solAmount;
        dev.lastActive = Date.now();
      }

      lastProcessedSlot = sigInfo.slot;
    }
    
    lastIndexTime = Date.now();
  } catch (error) {
    console.error('Indexing error:', error);
  } finally {
    isIndexing = false;
  }
}

function calculateDeveloperStats() {
  const devs = [];
  
  for (const [address, dev] of developers) {
    const todayTokens = dev.tokens.length;
    const todayVolume = dev.totalVolume;
    const winRate = dev.totalDeployments > 0 
      ? Math.round((dev.wins / dev.totalDeployments) * 100) 
      : 0;
    
    const totalPnl = dev.totalPnl;
    const pnlPercent = todayVolume > 0 
      ? Math.round((totalPnl / todayVolume) * 100) 
      : 0;

    devs.push({
      address,
      name: dev.name,
      todayTokens,
      todayVolume: `${todayVolume.toFixed(2)} SOL`,
      todayWins: dev.wins,
      winRate: `${winRate}%`,
      totalPnl: `${totalPnl.toFixed(2)} SOL`,
      pnlPercent: `${pnlPercent}%`,
      lastActive: getRelativeTime(dev.lastActive),
      trend: totalPnl > 0 ? 'up' : 'down'
    });
  }

  return devs.sort((a, b) => 
    parseFloat(b.totalPnl) - parseFloat(a.totalPnl)
  );
}

function getRelativeTime(timestamp) {
  if (!timestamp) return 'N/A';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await indexRecentTransactions();
    
    const limit = parseInt(req.query.limit) || 20;
    const developers_data = calculateDeveloperStats().slice(0, limit);
    
    res.json({
      success: true,
      data: developers_data,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch developers' });
  }
}
