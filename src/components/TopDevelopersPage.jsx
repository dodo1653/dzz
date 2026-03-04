import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../hooks/useReducedMotion';

const TopDevelopersPage = memo(function TopDevelopersPage() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [developers, setDevelopers] = useState([]);
  const [topTokens, setTopTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const filterParam = activeFilter !== 'all' ? `&filter=${activeFilter}` : '';
      const res = await fetch(`/api/developers?limit=20${filterParam}`);
      const data = await res.json();
      
      if (data.success) {
        const devsWithAvatars = data.data.map((dev, i) => ({
          ...dev,
          rank: i + 1
        }));
        setDevelopers(devsWithAvatars);
        setTopTokens(data.topTokens || []);
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
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [activeFilter]);

  const formatVolume = (vol) => {
    if (typeof vol === 'string') {
      const num = parseFloat(vol);
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return `${num.toFixed(2)} SOL`;
    }
    if (typeof vol === 'number') {
      if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
      return `${vol.toFixed(2)} SOL`;
    }
    return '0 SOL';
  };

  const filters = [
    { id: 'all', label: 'ALL' },
    { id: 'active', label: 'MIGRATED + VOLUME' },
    { id: 'migrations', label: 'MIGRATED' },
    { id: 'volume', label: '24H VOLUME' },
  ];

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
          style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
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
                background: 'rgba(74, 222, 128, 0.15)',
                borderRadius: '6px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem',
                color: 'rgba(74, 222, 128, 0.8)',
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
              Developers with migrated tokens + 24h volume
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

        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}
        >
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              style={{
                padding: '0.5rem 0.75rem',
                background: activeFilter === filter.id ? 'rgba(80, 100, 140, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${activeFilter === filter.id ? 'rgba(80, 100, 140, 0.4)' : 'rgba(255, 255, 255, 0.04)'}`,
                borderRadius: '8px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                color: activeFilter === filter.id ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {filter.label}
            </button>
          ))}
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
              transition={{ duration: 0.5, delay: 0.15 }}
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
                    Top Developers
                  </span>
                  <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.3)' }}>
                    {developers.length} active
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
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                          <span style={{
                            fontFamily: "'Archivo', sans-serif",
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: 'rgba(255, 255, 255, 0.85)',
                          }}>
                            {dev.name}
                          </span>
                          {dev.hasEnoughMigrations && (
                            <span style={{
                              padding: '0.1rem 0.35rem',
                              background: 'rgba(74, 222, 128, 0.15)',
                              borderRadius: '4px',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.5rem',
                              color: 'rgba(74, 222, 128, 0.8)',
                            }}>
                              {dev.migrationRate} MIGRATED
                            </span>
                          )}
                        </div>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.6rem',
                          color: 'rgba(255, 255, 255, 0.3)',
                        }}>
                          {dev.totalDeployments} deployed · {dev.migrationRate} migrated
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
                          {formatVolume(dev.volume24h)}/24h
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
                    Hot Tokens
                  </span>
                </div>

                <div style={{ padding: '0.5rem 0.75rem' }}>
                  {topTokens.length > 0 ? topTokens.map((token, index) => (
                    <motion.div
                      key={token.mint || index}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.65rem',
                            color: 'rgba(255, 255, 255, 0.4)',
                          }}>
                            #{index + 1}
                          </span>
                          <span style={{
                            fontFamily: "'Archivo', sans-serif",
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: 'rgba(255, 255, 255, 0.85)',
                          }}>
                            {token.mint?.slice(0, 8)}...
                          </span>
                          {token.migrated && (
                            <span style={{
                              padding: '0.1rem 0.3rem',
                              background: 'rgba(74, 222, 128, 0.15)',
                              borderRadius: '4px',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.45rem',
                              color: 'rgba(74, 222, 128, 0.8)',
                            }}>
                              ✓
                            </span>
                          )}
                        </div>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.55rem',
                          color: 'rgba(255, 255, 255, 0.3)',
                        }}>
                          {token.createdAt}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.6rem',
                          color: 'rgba(255, 255, 255, 0.4)',
                        }}>
                          by {token.creator}
                        </span>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.7rem',
                          color: 'rgba(74, 222, 128, 0.8)',
                        }}>
                          {formatVolume(token.volume24h)}
                        </span>
                      </div>
                    </motion.div>
                  )) : (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.3)' }}>No active tokens</p>
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
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>DEPLOYED</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>MIGRATION</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>24H VOLUME</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>WIN RATE</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>STATUS</th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right' }}>LAST ACTIVE</th>
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
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>{dev.name}</span>
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>{dev.totalDeployments}</span>
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: parseFloat(dev.migrationRate) >= 20 ? 'rgba(74, 222, 128, 0.8)' : 'rgba(255, 255, 255, 0.4)' }}>{dev.migrationRate}</span>
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: parseFloat(dev.volume24h) >= 15000 ? 'rgba(74, 222, 128, 0.8)' : 'rgba(255, 255, 255, 0.4)' }}>{formatVolume(dev.volume24h)}</span>
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: dev.hasEnoughMigrations ? 'rgba(74, 222, 128, 0.8)' : 'rgba(255, 255, 255, 0.4)' }}>{dev.migratedTokens}</span>
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: 'rgba(74, 222, 128, 0.8)' }}>{dev.winRate}</span>
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'right' }}>
                        {dev.hasEnoughMigrations && dev.hasEnoughVolume24h ? (
                          <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(74, 222, 128, 0.15)', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'rgba(74, 222, 128, 0.8)' }}>ACTIVE</span>
                        ) : dev.hasEnoughMigrations ? (
                          <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255, 193, 7, 0.15)', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'rgba(255, 193, 7, 0.8)' }}>MIGRATED</span>
                        ) : dev.hasEnoughVolume24h ? (
                          <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(0, 212, 255, 0.15)', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'rgba(0, 212, 255, 0.8)' }}>VOLUME</span>
                        ) : (
                          <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.3)' }}>NEW</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)' }}>{dev.lastActive}</span>
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
