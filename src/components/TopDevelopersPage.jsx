import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../hooks/useReducedMotion';

const mockDevelopers = [
  { address: '7xKX...2r8s', name: 'SniperKing', pnl: '4,230 SOL', pnlPercent: '+312%', tokens: 47, wins: 38, avgHold: '4.2m', lastActive: '2m ago', trend: 'up', following: true },
  { address: '9mNp...5t3w', name: 'PumpMaster', pnl: '3,890 SOL', pnlPercent: '+245%', tokens: 62, wins: 45, avgHold: '6.1m', lastActive: '5m ago', trend: 'up', following: false },
  { address: '2kLq...8v1x', name: 'DeployWizard', pnl: '2,150 SOL', pnlPercent: '+189%', tokens: 31, wins: 22, avgHold: '3.8m', lastActive: '1m ago', trend: 'up', following: true },
  { address: '5pRt...9y4z', name: 'TokenHunter', pnl: '1,890 SOL', pnlPercent: '+156%', tokens: 55, wins: 35, avgHold: '5.5m', lastActive: '8m ago', trend: 'down', following: false },
  { address: '8wXy...3u6v', name: 'AlphaCaller', pnl: '1,450 SOL', pnlPercent: '+98%', tokens: 28, wins: 18, avgHold: '7.2m', lastActive: '12m ago', trend: 'up', following: false },
  { address: '3nOp...7q2w', name: 'SolanaDev', pnl: '980 SOL', pnlPercent: '+72%', tokens: 19, wins: 12, avgHold: '4.9m', lastActive: '3m ago', trend: 'up', following: false },
  { address: '6gHs...4t9y', name: 'BundleHunter', pnl: '750 SOL', pnlPercent: '+45%', tokens: 42, wins: 24, avgHold: '8.1m', lastActive: '15m ago', trend: 'down', following: true },
  { address: '1jKm...6p3x', name: 'LaunchPad', pnl: '520 SOL', pnlPercent: '+38%', tokens: 15, wins: 9, avgHold: '5.8m', lastActive: '1m ago', trend: 'up', following: false },
];

const timeFilters = ['1H', '6H', '24H', '7D', '30D'];

const TopDevelopersPage = memo(function TopDevelopersPage() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeTimeFilter, setActiveTimeFilter] = useState('24H');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('pnl');
  const [showFilters, setShowFilters] = useState(false);

  const filteredDevelopers = mockDevelopers
    .filter(dev => dev.name.toLowerCase().includes(searchQuery.toLowerCase()) || dev.address.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'pnl') return parseFloat(b.pnl.replace(/[+,SOL]/g, '')) - parseFloat(a.pnl.replace(/[+,SOL]/g, ''));
      if (sortBy === 'tokens') return b.tokens - a.tokens;
      if (sortBy === 'wins') return b.wins - a.wins;
      return 0;
    });

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      padding: isMobile ? '5rem 1rem 2rem' : '6rem 2rem 2rem',
    }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(60, 80, 120, 0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(40, 60, 100, 0.05) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '2rem' }}
        >
          <h1 style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.9)',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
          }}>
            Top Developers
          </h1>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.4)',
          }}>
            Track top deployer wallets on pump.fun
          </p>
        </motion.div>

        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div style={{
            display: 'flex',
            gap: '0.25rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
            padding: '4px',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}>
            {timeFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveTimeFilter(filter)}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: activeTimeFilter === filter ? 'rgba(80, 100, 140, 0.15)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  color: activeTimeFilter === filter ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search developer or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '0.6rem 1rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.8)',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
          />

          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '0.6rem 1rem',
              background: showFilters ? 'rgba(80, 100, 140, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="10" y1="12" x2="20" y2="12" />
              <line x1="7" y1="18" x2="20" y2="18" />
            </svg>
            Filters
          </button>
        </motion.div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                overflow: 'hidden',
                marginBottom: '1.5rem',
                padding: '1rem',
                background: 'rgba(8, 8, 14, 0.5)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>MIN PNL (SOL)</p>
                  <input type="number" placeholder="0" style={{ width: '100px', padding: '0.4rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', outline: 'none' }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>MIN TOKENS</p>
                  <input type="number" placeholder="0" style={{ width: '100px', padding: '0.4rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', outline: 'none' }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>MIN WIN RATE %</p>
                  <input type="number" placeholder="0" style={{ width: '100px', padding: '0.4rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', outline: 'none' }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>SORT BY</p>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: '0.4rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="pnl">PnL</option>
                    <option value="tokens">Tokens</option>
                    <option value="wins">Wins</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: 'rgba(8, 8, 14, 0.6)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            overflow: 'hidden',
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr 1fr 1fr 80px',
            gap: '1rem',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            color: 'rgba(255, 255, 255, 0.35)',
            letterSpacing: '0.05em',
          }}>
            {!isMobile && <span>DEVELOPER</span>}
            <span>PNL</span>
            <span>TOKENS</span>
            <span>WIN RATE</span>
            {!isMobile && <span>AVG HOLD</span>}
            {!isMobile && <span>LAST ACTIVE</span>}
            <span></span>
          </div>

          {filteredDevelopers.map((dev, index) => (
            <motion.div
              key={dev.address}
              initial={reducedMotion ? {} : { opacity: 0, x: -10 }}
              animate={reducedMotion ? {} : { opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr 1fr 1fr 80px',
                gap: '1rem',
                padding: '1rem 1.5rem',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)', width: '20px' }}>#{index + 1}</span>
                <div>
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>{dev.name}</p>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.35)', margin: 0 }}>{dev.address}</p>
                </div>
              </div>
              
              <div>
                <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: 'rgba(74, 222, 128, 0.9)', margin: 0 }}>{dev.pnl}</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'rgba(74, 222, 128, 0.6)', margin: 0 }}>{dev.pnlPercent}</p>
              </div>
              
              <div>
                <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>{dev.tokens}</p>
              </div>
              
              <div>
                <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>{Math.round(dev.wins / dev.tokens * 100)}%</p>
              </div>
              
              {!isMobile && (
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)', margin: 0 }}>{dev.avgHold}</p>
                </div>
              )}
              
              {!isMobile && (
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.35)', margin: 0 }}>{dev.lastActive}</p>
                </div>
              )}
              
              <button
                style={{
                  padding: '0.4rem 0.6rem',
                  background: dev.following ? 'rgba(80, 100, 140, 0.15)' : 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.6rem',
                  color: dev.following ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.35)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {dev.following ? 'FOLLOWING' : 'FOLLOW'}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
});

export default TopDevelopersPage;
