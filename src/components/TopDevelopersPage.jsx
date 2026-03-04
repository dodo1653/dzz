import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../hooks/useReducedMotion';

const mockDailyLeaders = [
  { 
    rank: 1, 
    address: '7xKXtg2r8s9Qm3qF', 
    name: 'SniperKing',
    todayTokens: 12,
    todayVolume: '2,340 SOL',
    todayWins: 9,
    winRate: '75%',
    totalPnl: '4,230 SOL',
    bestToken: 'PEPE',
    bestReturn: '+890%',
    avatar: '👑'
  },
  { 
    rank: 2, 
    address: '9mNpq5t3w8Kj2Lr6',
    name: 'PumpMaster',
    todayTokens: 8,
    todayVolume: '1,890 SOL',
    todayWins: 5,
    winRate: '63%',
    totalPnl: '3,890 SOL',
    bestToken: 'DOGE2',
    bestReturn: '+520%',
    avatar: '🚀'
  },
  { 
    rank: 3, 
    address: '2kLqv1x8wP3Nm5H4',
    name: 'DeployWizard',
    todayTokens: 15,
    todayVolume: '1,450 SOL',
    todayWins: 8,
    winRate: '53%',
    totalPnl: '2,150 SOL',
    bestToken: 'WIF2',
    bestReturn: '+340%',
    avatar: '🧙'
  },
  { 
    rank: 4, 
    address: '5pRt9y4z6Wc8N2Q3',
    name: 'TokenHunter',
    todayTokens: 6,
    todayVolume: '980 SOL',
    todayWins: 4,
    winRate: '67%',
    totalPnl: '1,890 SOL',
    bestToken: 'BONK3',
    bestReturn: '+280%',
    avatar: '🎯'
  },
  { 
    rank: 5, 
    address: '8wXy3u6v5T7R1K9',
    name: 'AlphaCaller',
    todayTokens: 4,
    todayVolume: '720 SOL',
    todayWins: 3,
    winRate: '75%',
    totalPnl: '1,450 SOL',
    bestToken: 'SOL2',
    bestReturn: '+210%',
    avatar: '📡'
  },
];

const mockRecentWins = [
  { token: 'PEPE', developer: 'SniperKing', return: '+890%', time: '2m ago', buyers: '1,240' },
  { token: 'DOGE2', developer: 'PumpMaster', return: '+520%', time: '15m ago', buyers: '890' },
  { token: 'WIF2', developer: 'DeployWizard', return: '+340%', time: '32m ago', buyers: '2,100' },
  { token: 'BONK3', developer: 'TokenHunter', return: '+280%', time: '45m ago', buyers: '560' },
  { token: 'SOL2', developer: 'AlphaCaller', return: '+210%', time: '1h ago', buyers: '1,890' },
];

const TopDevelopersPage = memo(function TopDevelopersPage() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeTab, setActiveTab] = useState('today');

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
          style={{ marginBottom: '2.5rem' }}
        >
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
              TODAY
            </span>
          </div>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.4)',
          }}>
            Top performing developers on pump.fun today
          </p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
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
                }} />
                <span style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.8)',
                }}>
                  Today's Leaders
                </span>
              </div>

              <div style={{ padding: '0.5rem' }}>
                {mockDailyLeaders.map((dev, index) => (
                  <motion.div
                    key={dev.rank}
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
                          {dev.name}
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
                        {dev.address}
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
                        {dev.todayVolume}
                      </p>
                      <p style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.6rem',
                        color: 'rgba(255, 255, 255, 0.4)',
                        margin: 0,
                      }}>
                        {dev.todayTokens} tokens · {dev.winRate} wins
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
                  Recent Wins
                </span>
              </div>

              <div style={{ padding: '0.5rem 0.75rem' }}>
                {mockRecentWins.map((win, index) => (
                  <motion.div
                    key={index}
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
                          {win.token}
                        </span>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.6rem',
                          color: 'rgba(74, 222, 128, 0.9)',
                          marginLeft: '0.5rem',
                        }}>
                          {win.return}
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
                        color: 'rgba(255, 255, 255, 0.3)',
                      }}>
                        {win.buyers} buyers
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

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
                Showing {mockDailyLeaders.length} developers
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
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>TODAY TOKENS</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>VOLUME</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>WIN RATE</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>BEST TODAY</th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right' }}>TOTAL PnL</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDailyLeaders.map((dev) => (
                    <tr 
                      key={dev.rank}
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
                            <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>{dev.name}</p>
                            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.3)', margin: 0 }}>{dev.address}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>{dev.todayTokens}</span>
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>{dev.todayVolume}</span>
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: 'rgba(74, 222, 128, 0.8)' }}>{dev.winRate}</span>
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>{dev.bestToken}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'rgba(74, 222, 128, 0.7)', marginLeft: '0.35rem' }}>{dev.bestReturn}</span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.85rem', color: 'rgba(74, 222, 128, 0.9)' }}>{dev.totalPnl}</span>
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
