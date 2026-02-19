import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [prices, setPrices] = useState({
    solana: 0,
    bitcoin: 0,
    ethereum: 0,
    bonk: 0,
    jupiter: 0
  });

  const navLinks = [
    { name: 'Terminal', path: '/' },
    { name: 'Context Engine', path: '/context-engine' },
    { name: 'Twitter', path: '/twitter-tracker' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin,ethereum,bonk,jupiter-exchange-solana&vs_currencies=usd&include_24hr_change=true');
        if (!response.ok) throw new Error('CORS or Network error');
        const data = await response.json();
        setPrices({
          solana: data.solana,
          bitcoin: data.bitcoin,
          ethereum: data.ethereum,
          bonk: data.bonk,
          jupiter: data['jupiter-exchange-solana']
        });
      } catch (error) {
        console.warn("Ticker fetch paused: Using baseline values", error);
        setPrices({
          solana: { usd: 142.38, usd_24h_change: 2.4 },
          bitcoin: { usd: 68432.15, usd_24h_change: -0.3 },
          ethereum: { usd: 2567.21, usd_24h_change: 1.2 },
          bonk: { usd: 0.000021, usd_24h_change: 5.7 },
          jupiter: { usd: 0.84, usd_24h_change: -1.2 }
        });
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (e, link) => {
    e.preventDefault();
    navigate(link.path);
  };

  const TickerItem = ({ symbol, data }) => {
    if (!data) return null;
    const change = data.usd_24h_change;
    const isPositive = change >= 0;
    
    return (
      <div className="ticker-item">
        <span className="ticker-symbol">{symbol}</span>
        <span className="ticker-price">${data.usd < 1 ? data.usd.toFixed(6) : data.usd.toLocaleString()}</span>
        <span className={`ticker-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
        </span>
      </div>
    );
  };

  return (
    <>
      <nav className="glass-nav" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(8, 8, 14, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
      }}>
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <div className="logo-glitch" data-text="dzz">dzz</div>
          </div>

          <div className="nav-links">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={(e) => handleNavClick(e, link)}
                className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="nav-active-bar"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="nav-socials" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <a
              href="https://twitter.com/dazzoxx"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://discord.gg/Y3uh3hN2"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
          </div>
        </div>
      </nav>

      <div className="ticker-bar">
        <div className="ticker-track">
          <div className="ticker-content">
            <TickerItem symbol="SOL" data={prices.solana} />
            <TickerItem symbol="BTC" data={prices.bitcoin} />
            <TickerItem symbol="ETH" data={prices.ethereum} />
            <TickerItem symbol="BONK" data={prices.bonk} />
            <TickerItem symbol="JUP" data={prices.jupiter} />
            <TickerItem symbol="SOL" data={prices.solana} />
            <TickerItem symbol="BTC" data={prices.bitcoin} />
            <TickerItem symbol="ETH" data={prices.ethereum} />
            <TickerItem symbol="BONK" data={prices.bonk} />
            <TickerItem symbol="JUP" data={prices.jupiter} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
