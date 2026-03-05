export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const pumpFunResponse = await fetch('https://frontend-api.pumpfun.com/v1/coins?offset=0&limit=50&sort=created_at&order=desc', {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!pumpFunResponse.ok) {
      throw new Error(`Pump.fun API error: ${pumpFunResponse.status}`);
    }

    const coinsData = await pumpFunResponse.json();
    
    const developers = new Map();
    const tokensList = [];
    
    const now = Date.now();

    for (const coin of coinsData) {
      const creator = coin.creator;
      const mint = coin.mint;
      const createdAt = new Date(coin.created_at).getTime();
      const isMigrated = coin.market_cap >= 5000;
      const volume24h = coin.volume_24h || 0;
      
      tokensList.push({
        mint: mint.slice(0, 12) + '...',
        creator: creator.slice(0, 6) + '...',
        name: coin.name || 'Unknown',
        symbol: coin.symbol || '???',
        volume: volume24h.toFixed(2),
        migrated: isMigrated,
        marketCap: coin.market_cap || 0,
        createdAt: getRelativeTime(createdAt),
      });

      if (!developers.has(creator)) {
        developers.set(creator, {
          address: creator,
          totalDeployments: 0,
          migrations: 0,
          volume: 0,
          volume24h: 0,
          wins: 0,
          tokens: new Set(),
        });
      }

      const dev = developers.get(creator);
      if (!dev.tokens.has(mint)) {
        dev.tokens.add(mint);
        dev.totalDeployments++;
      }
      
      dev.volume += coin.market_cap || 0;
      dev.volume24h += volume24h;
      
      if (isMigrated) {
        dev.migrations++;
        dev.wins++;
      }
    }

    const devs = [];
    for (const [address, dev] of developers) {
      const migrationRate = dev.totalDeployments > 0 
        ? (dev.migrations / dev.totalDeployments) * 100 
        : 0;
      
      const hasEnoughVolume = dev.volume24h >= 15000;
      const hasEnoughMigrations = migrationRate >= 20;
      
      if (!hasEnoughVolume && !hasEnoughMigrations) continue;

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
        score: dev.wins * 100 + dev.volume24h * 10 + dev.totalDeployments * 5,
      });
    }

    devs.sort((a, b) => b.score - a.score);
    
    const limit = parseInt(req.query.limit) || 20;
    const topDevelopers = devs.slice(0, limit);

    res.json({
      success: true,
      data: topDevelopers,
      topTokens: tokensList.slice(0, 10),
      stats: {
        totalDevelopers: developers.size,
        totalTokens: tokensList.length,
        lastUpdated: new Date().toISOString(),
      },
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch developers', message: error.message });
  }
}

function getRelativeTime(timestamp) {
  if (!timestamp) return 'N/A';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
