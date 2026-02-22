import React, { useEffect, useState, useRef, memo } from 'react';
import { motion } from 'framer-motion';

const basePrices = {
  solana: { usd: 145.32, usd_24h_change: 3.45 },
  bitcoin: { usd: 96450.00, usd_24h_change: 1.82 },
  ethereum: { usd: 3420.15, usd_24h_change: -0.95 },
  bonk: { usd: 0.00002847, usd_24h_change: 12.34 },
  jupiter: { usd: 1.23, usd_24h_change: 5.67 },
  wif: { usd: 0.89, usd_24h_change: -2.15 },
  render: { usd: 8.45, usd_24h_change: 4.23 },
  jito: { usd: 2.87, usd_24h_change: 1.56 },
  pyth: { usd: 0.42, usd_24h_change: -1.23 },
};

const symbolMap = {
  solana: 'SOL',
  bitcoin: 'BTC',
  ethereum: 'ETH',
  bonk: 'BONK',
  jupiter: 'JUP',
  wif: 'WIF',
  render: 'RNDR',
  jito: 'JTO',
  pyth: 'PYTH',
};

const TickerItem = memo(function TickerItem({ symbol, price, change }) {
  const isPositive = change >= 0;
  
  const formatPrice = (p) => {
    if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (p >= 1) return `$${p.toFixed(2)}`;
    if (p >= 0.0001) return `$${p.toFixed(6)}`;
    return `$${p.toFixed(8)}`;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '0 16px',
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.65rem',
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 0.5)',
        letterSpacing: '0.08em',
      }}>
        {symbol}
      </span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.65rem',
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.35)',
        letterSpacing: '-0.01em',
      }}>
        {formatPrice(price)}
      </span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.6rem',
        fontWeight: 400,
        color: isPositive ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.35)',
        letterSpacing: '0.02em',
      }}>
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </span>
      <div style={{
        width: '3px',
        height: '3px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
      }} />
    </div>
  );
});

const CryptoTicker = memo(function CryptoTicker() {
  const [prices, setPrices] = useState(basePrices);
  const scrollRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin,ethereum,bonk,jupiter,wif,render,jito,pyth&vs_currencies=usd&include_24hr_change=true'
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data && Object.keys(data).length > 0) {
            setPrices(prev => ({
              ...prev,
              ...Object.fromEntries(
                Object.entries(data).map(([key, val]) => [
                  key,
                  { 
                    usd: val.usd ?? prev[key]?.usd ?? 0, 
                    usd_24h_change: val.usd_24h_change ?? prev[key]?.usd_24h_change ?? 0 
                  }
                ])
              )
            }));
          }
        }
      } catch (error) {
        // silently use baseline prices
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const tickerItems = Object.entries(prices).map(([id, data]) => ({
    id,
    symbol: symbolMap[id] || id.toUpperCase(),
    price: data.usd,
    change: data.usd_24h_change || 0,
  }));

  const allItems = [...tickerItems, ...tickerItems, ...tickerItems];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const itemWidth = 180;
    const totalWidth = tickerItems.length * itemWidth;
    let currentX = 0;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      
      currentX -= delta * 0.035;
      
      if (currentX <= -totalWidth) {
        currentX += totalWidth;
      }
      
      setScrollX(currentX);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [tickerItems.length]);

  return (
    <div style={{
      position: 'fixed',
      top: '60px',
      left: 0,
      right: 0,
      zIndex: 9998,
      background: 'rgba(8, 8, 14, 0.85)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      overflow: 'hidden',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          transform: `translateX(${scrollX}px)`,
          willChange: 'transform',
        }}
      >
        {allItems.map((item, idx) => (
          <TickerItem
            key={`${item.id}-${idx}`}
            symbol={item.symbol}
            price={item.price}
            change={item.change}
          />
        ))}
      </div>
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '60px',
        background: 'linear-gradient(90deg, rgba(8, 8, 14, 0.9) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '60px',
        background: 'linear-gradient(-90deg, rgba(8, 8, 14, 0.9) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
});

export default CryptoTicker;
