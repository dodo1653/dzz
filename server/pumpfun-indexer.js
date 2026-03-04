import { Connection, PublicKey } from '@solana/web3.js';

const HELIUS_RPC = process.env.HELIUS_RPC || 'https://mainnet.helius-rpc.com/?api-key=a01e8e12-31d7-4f8d-af9d-3cbe6bac3f11';
const PUMP_FUN_PROGRAM = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubX14o5eGT5pc8';

class PumpFunIndexer {
  constructor() {
    this.connection = new Connection(HELIUS_RPC, 'confirmed');
    this.developers = new Map();
    this.tokens = new Map();
    this.lastProcessedSlot = 0;
    this.isIndexing = false;
  }

  async getTransactionsForProgram(limit = 100, before = null) {
    try {
      const options = {
        limit,
        ...(before && { before })
      };

      const signatures = await this.connection.getSignaturesForAddress(
        new PublicKey(PUMP_FUN_PROGRAM),
        options,
        'confirmed'
      );

      return signatures;
    } catch (error) {
      console.error('Error fetching pump.fun transactions:', error);
      return [];
    }
  }

  async getTransactionDetails(signature) {
    try {
      const tx = await this.connection.getParsedTransaction(signature, {
        maxSupportedTransactionVersion: 0,
        commitment: 'confirmed'
      });
      return tx;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }
  }

  parseTokenCreation(tx, signature) {
    try {
      if (!tx || !tx.meta || !tx.transaction) return null;

      const logMessages = tx.meta.logMessages || [];
      const instructions = tx.transaction.message.instructions || [];
      
      let creator = null;
      let tokenMint = null;
      let tokenName = null;
      let tokenSymbol = null;
      let solAmount = 0;

      for (const msg of logMessages) {
        if (msg.includes('InitializeMint2') || msg.includes('Create')) {
          const parsed = msg.match(/([A-HJ-NP-Za-km-z]{32,44})/g);
          if (parsed && !creator) creator = parsed[0];
        }
      }

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

      if (!tokenMint) {
        const tokenKeyIndex = instructions.findIndex(ix => 
          ix && ix.parsed && ix.parsed.type === 'initializeMint'
        );
        if (tokenKeyIndex > 0) {
          const createIx = instructions[tokenKeyIndex - 1];
          if (createIx && createIx.parsed && createIx.parsed.info) {
            tokenMint = createIx.parsed.info.mint || createIx.parsed.info.account;
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
        tokenName: tokenName || 'Unknown',
        tokenSymbol: tokenSymbol || 'UNK'
      };
    } catch (error) {
      return null;
    }
  }

  async indexRecentTransactions() {
    if (this.isIndexing) return;
    this.isIndexing = true;

    try {
      const signatures = await this.getTransactionsForProgram(50);
      
      for (const sigInfo of signatures) {
        if (sigInfo.slot <= this.lastProcessedSlot) continue;

        const tx = await this.getTransactionDetails(sigInfo.signature);
        const creation = this.parseTokenCreation(tx, sigInfo.signature);

        if (creation) {
          this.tokens.set(creation.tokenMint, {
            ...creation,
            status: 'active',
            currentMarketCap: 0,
            buyers: 0,
            volume: 0
          });

          if (!this.developers.has(creation.creator)) {
            this.developers.set(creation.creator, {
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

          const dev = this.developers.get(creation.creator);
          dev.tokens.push(creation.tokenMint);
          dev.totalDeployments++;
          dev.totalVolume += creation.solAmount;
          dev.lastActive = Date.now();
        }

        this.lastProcessedSlot = sigInfo.slot;
      }
    } catch (error) {
      console.error('Indexing error:', error);
    } finally {
      this.isIndexing = false;
    }
  }

  calculateDeveloperStats() {
    const devs = [];
    
    for (const [address, dev] of this.developers) {
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
        lastActive: this.getRelativeTime(dev.lastActive),
        trend: totalPnl > 0 ? 'up' : 'down'
      });
    }

    return devs.sort((a, b) => 
      parseFloat(b.totalPnl) - parseFloat(a.totalPnl)
    );
  }

  getRelativeTime(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  getTopDevelopers(limit = 20) {
    return this.calculateDeveloperStats().slice(0, limit);
  }

  getRecentTokens(limit = 10) {
    const tokens = Array.from(this.tokens.values());
    return tokens
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
      .map(t => ({
        tokenMint: t.tokenMint,
        developer: `${t.creator.slice(0, 6)}...${t.creator.slice(-4)}`,
        solAmount: t.solAmount,
        time: this.getRelativeTime(t.timestamp * 1000)
      }));
  }

  async startIndexing(intervalMs = 30000) {
    console.log('🔄 Starting pump.fun developer indexer...');
    
    await this.indexRecentTransactions();
    
    setInterval(async () => {
      await this.indexRecentTransactions();
    }, intervalMs);
  }
}

const indexer = new PumpFunIndexer();

export default indexer;
