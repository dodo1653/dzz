import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../hooks/useReducedMotion';

const avatars = ['👑', '🚀', '🧙', '🎯', '📡', '⚡', '🔥', '💎', '🦊', '🐺', '🦁', '🐉', '⚔️', '🛡️', '🌟', '💰', '🎮', '🔮', '🪐', '🌙'];

const TopDevelopersPage = memo(function TopDevelopersPage() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [developers, setDevelopers] = useState([]);
  const [recentWins, setRecentWins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const devsRes = await fetch('/api/developers?limit=20');
      const devsData = await devsRes.json();
      
      if (devsData.success) {
        const devsWithAvatars = devsData.data.map((dev, i) => ({
          ...dev,
          avatar: avatars[i % avatars.length],
          rank: i + 1
        }));
        setDevelopers(devsWithAvatars);
      }
      
      const recentRes = await fetch('/api/developers-recent?limit=10');
      const recentData = await recentRes.json();
      
      if (recentData.success) {
        setRecentWins(recentData.data);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching developer data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatAddress = (addr) => {
    if (!addr) return 'Unknown';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatVolume = (vol) => {
    if (typeof vol === 'string') return vol;
    if (typeof vol === 'number') return `${vol.toFixed(2)} SOL`;
    return '0 SOL';
  };

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
          top: '5%',
          left: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(60, 80, 120, 0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '20%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(40, 60, 100, 0.05) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <h1 style={{
                fontFamily: "'Archivo', sans-serif",
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}>
                Top Developers
              </h1>
              <span style={{
                padding: '0.25rem 0.6rem',
                background: 'rgba(80, 100, 140, 0.15)',
                borderRadius: '6px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem',
                color: 'rgba(100, 130, 170, 0.8)',
                letterSpacing: '0.05em',
              }}>
                LIVE
              </span>
            </div>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.4)',
            }}>
              Top performing developers on pump.fun
            </p>
          </div>
          <button
            onClick={fetchData}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(80, 100, 140, 0.1)',
              border: '1px solid rgba(80, 100, 140, 0.2)',
              borderRadius: '8px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              color: 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            REFRESH
          </button>
        </motion.div>

        {loading && developers.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '2px solid rgba(80, 100, 140, 0.2)', 
              borderTopColor: 'rgba(80, 100, 140, 0.8)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'rgba(255, 100, 100, 0.8)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>{error}</p>
            <button onClick={fetchData} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'rgba(80, 100, 140, 0.2)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem' }}>Retry</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: '1.5rem', marginBottom: '2rem' }}>
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div style={{
                background: 'linear-gradient(135deg, rgba(10, 14, 22, 0.8) 0%, rgba(6, 8, 16, 0.9) 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'rgba(74, 222, 128, 0.8)',
                    boxShadow: '0 0 10px rgba(74, 222, 128, 0.4)',
                    animation: 'pulse 2s infinite'
                  }} />
                  <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
                  <span style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}>
                    Today's Leaders
                  </span>
                  <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.3)' }}>
                    {developers.length} devs
                  </span>
                </div>

                <div style={{ padding: '0.5rem' }}>
                  {developers.slice(0, 5).map((dev, index) => (
                    <motion.div
                      key={dev.address}
                      initial={reducedMotion ? {} : { opacity: 0, x: -10 }}
                      animate={reducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        marginBottom: '0.25rem',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: dev.rank === 1 
                          ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 193, 7, 0.1))'
                          : dev.rank === 2
                          ? 'linear-gradient(135deg, rgba(156, 163, 175, 0.2), rgba(156, 163, 175, 0.1))'
                          : dev.rank === 3
                          ? 'linear-gradient(135deg, rgba(205, 127, 50, 0.2), rgba(205, 127, 50, 0.1))'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: dev.rank <= 3 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                      }}>
                        {dev.avatar}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                          <span style={{
                            fontFamily: "'Archivo', sans-serif",
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: 'rgba(255, 255, 255, 0.85)',
                          }}>
                            {formatAddress(dev.address)}
                          </span>
                          {dev.rank <= 3 && (
                            <span style={{
                              fontFamily: "'Archivo', sans-serif",
                              fontSize: '0.6rem',
                              color: dev.rank === 1 ? 'rgba(255, 193, 7, 0.8)' : dev.rank === 2 ? 'rgba(156, 163, 175, 0.8)' : 'rgba(205, 127, 50, 0.8)',
                              letterSpacing: '0.05em',
                            }}>
                              #{dev.rank}
                            </span>
                          )}
                        </div>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.6rem',
                          color: 'rgba(255, 255, 255, 0.3)',
                        }}>
                          {dev.todayTokens || 0} tokens · {dev.winRate || '0%'} wins
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          fontFamily: "'Archivo', sans-serif",
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          color: 'rgba(74, 222, 128, 0.9)',
                          margin: 0,
                        }}>
                          {formatVolume(dev.todayVolume)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div style={{
                background: 'linear-gradient(135deg, rgba(10, 14, 22, 0.8) 0%, rgba(6, 8, 16, 0.9) 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                overflow: 'hidden',
                height: '100%',
              }}>
                <div style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}>
                    Recent Deployments
                  </span>
                </div>

                <div style={{ padding: '0.5rem 0.75rem' }}>
                  {recentWins.length > 0 ? recentWins.map((win, index) => (
                    <motion.div
                      key={win.tokenMint || index}
                      initial={reducedMotion ? {} : { opacity: 0, x: 10 }}
                      animate={reducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '10px',
                        marginBottom: '0.35rem',
                        background: 'rgba(255, 255, 255, 0.01)',
                        border: '1px solid rgba(255, 255, 255, 0.02)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <div>
                          <span style={{
                            fontFamily: "'Archivo', sans-serif",
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: 'rgba(255, 255, 255, 0.85)',
                          }}>
                            {win.tokenMint ? formatAddress(win.tokenMint) : 'Unknown'}
                          </span>
                        </div>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.55rem',
                          color: 'rgba(255, 255, 255, 0.3)',
                        }}>
                          {win.time}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.6rem',
                          color: 'rgba(255, 255, 255, 0.4)',
                        }}>
                          by {win.developer}
                        </span>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.55rem',
                          color: 'rgba(74, 222, 128, 0.7)',
                        }}>
                          {formatVolume(win.solAmount)}
                        </span>
                      </div>
                    </motion.div>
                  )) : (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.3)' }}>No recent deployments</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(10, 14, 22, 0.8) 0%, rgba(6, 8, 16, 0.9) 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontFamily: "'Archivo', sans-serif",
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.8)',
              }}>
                All Developers
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem',
                color: 'rgba(255, 255, 255, 0.35)',
              }}>
                Showing {developers.length} developers
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.6rem',
                    color: 'rgba(255, 255, 255, 0.35)',
                    letterSpacing: '0.05em',
                  }}>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left' }}>RANK</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>DEVELOPER</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>TOKENS</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>VOLUME</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>WIN RATE</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>LAST ACTIVE</th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right' }}>TOTAL PnL</th>
                  </tr>
                </thead>
                <tbody>
                  {developers.map((dev) => (
                    <tr 
                      key={dev.address}
                      style={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{
                          fontFamily: "'Archivo', sans-serif",
                          fontSize: '0.85rem',
                          color: dev.rank === 1 ? 'rgba(255, 193, 7, 0.8)' : dev.rank === 2 ? 'rgba(156, 163, 175, 0.8)' : dev.rank === 3 ? 'rgba(205, 127, 50, 0.8)' : 'rgba(255, 255, 255, 0.4)',
                        }}>
                          #{dev.rank}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.2rem' }}>{dev.avatar}</span>
                            <div>
                              <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>{formatAddress(dev.address)}</p>
                            </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>{dev.todayTokens || 0}</span>
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>{formatVolume(dev.todayVolume)}</span>
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: 'rgba(74, 222, 128, 0.8)' }}>{dev.winRate || '0%'}</span>
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)' }}>{dev.lastActive || 'N/A'}</span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: 'rgba(74, 222, 128, 0.9)' }}>{formatVolume(dev.totalPnl)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

export default TopDevelopersPage;
