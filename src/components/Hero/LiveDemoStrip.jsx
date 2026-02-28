import React, { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../../hooks/useReducedMotion';
import TiltCard from '../TiltCard.jsx';

const mockTweets = [
  { user: 'elonmusk', text: 'Just deployed $DOGE2 on pump.fun 🚀', time: '2s', signal: true },
  { user: 'saylor', text: 'Bitcoin is the future. $BTC', time: '45s', signal: false },
  { user: 'VitalikButerin', text: 'Interesting new token on Solana...', time: '1m', signal: false },
  { user: 'cobie', text: 'This one looks promising $WIF2', time: '2m', signal: true },
  { user: 'pumpdotfun', text: 'New launch: $BONK3 - Volume: 500 SOL', time: '3m', signal: false },
];

const mockTokens = [
  { name: '$PEPE2', mcap: '$45K', change: '+234%', bundle: false },
  { name: '$WOJAK', mcap: '$12K', change: '+89%', bundle: false },
  { name: '$DOGE3', mcap: '$8K', change: '+156%', bundle: true },
  { name: '$FROG', mcap: '$67K', change: '+412%', bundle: false },
  { name: '$MOON', mcap: '$23K', change: '+78%', bundle: false },
];

const MiniTwitterFeed = memo(function MiniTwitterFeed() {
  const [tweets, setTweets] = useState(mockTweets.slice(0, 3));
  const [newTweet, setNewTweet] = useState(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      const randomTweet = mockTweets[Math.floor(Math.random() * mockTweets.length)];
      const tweetWithId = { ...randomTweet, id: Date.now() };
      setNewTweet(tweetWithId);
      setTweets(prev => [tweetWithId, ...prev.slice(0, 2)]);
      setTimeout(() => setNewTweet(null), 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div style={{ padding: '12px', height: '100%', overflow: 'hidden' }}>
      <AnimatePresence mode="popLayout">
        {tweets.map((tweet, i) => (
          <motion.div
            key={tweet.id || i}
            initial={reducedMotion ? {} : { opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            style={{
              background: tweet.id === newTweet?.id 
                ? 'rgba(80, 100, 140, 0.1)' 
                : 'rgba(255, 255, 255, 0.03)',
              border: tweet.id === newTweet?.id 
                ? '1px solid rgba(100, 130, 170, 0.25)' 
                : '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '8px 10px',
              marginBottom: '6px',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '4px',
            }}>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                fontWeight: 600,
                color: 'rgba(100, 130, 170, 0.7)',
              }}>@{tweet.user}</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                color: 'rgba(255, 255, 255, 0.4)',
              }}>{tweet.time}</span>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '9px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
              lineHeight: 1.4,
            }}>{tweet.text}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

const MiniRiskScanner = memo(function MiniRiskScanner() {
  const [scanProgress, setScanProgress] = useState(0);
  const [score, setScore] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setScanProgress(100);
      setScore(78);
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setScanProgress(Math.min(progress, 100));
      setScore(Math.floor(78 * (progress / 100)));
      if (progress >= 100) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  const getScoreColor = () => {
    if (score >= 80) return 'rgba(255, 71, 87, 0.9)';
    if (score >= 60) return 'rgba(255, 193, 7, 0.9)';
    return 'rgba(74, 222, 128, 0.9)';
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px',
    }}>
      <div style={{
        position: 'relative',
        width: '80px',
        height: '80px',
      }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={getScoreColor()}
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: score / 100 }}
            transition={{ duration: reducedMotion ? 0 : 0.5 }}
            style={{
              filter: `drop-shadow(0 0 8px ${getScoreColor()})`,
            }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 700,
            color: getScoreColor(),
            textShadow: `0 0 10px ${getScoreColor()}`,
          }}>{score}</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '8px',
            color: 'rgba(255, 255, 255, 0.5)',
          }}>RISK</span>
        </div>
      </div>
      
      {!reducedMotion && scanProgress > 80 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            color: 'rgba(255, 193, 7, 0.9)',
          }}>
            <span>⚠</span>
            <span>2 ISSUES FOUND</span>
          </div>
        </motion.div>
      )}
    </div>
  );
});

const MiniPumpFeed = memo(function MiniPumpFeed() {
  const [tokens, setTokens] = useState(mockTokens.slice(0, 4));
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      const shuffled = [...mockTokens].sort(() => Math.random() - 0.5);
      setTokens(shuffled.slice(0, 4));
    }, 5000);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      padding: '8px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '6px',
    }}>
      {tokens.map((token, i) => (
        <motion.div
          key={`${token.name}-${i}`}
          initial={reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          style={{
            background: token.bundle 
              ? 'rgba(255, 71, 87, 0.1)' 
              : 'rgba(255, 255, 255, 0.03)',
            border: token.bundle 
              ? '1px solid rgba(255, 71, 87, 0.3)' 
              : '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            padding: '8px',
            position: 'relative',
          }}
        >
          {token.bundle && (
            <div style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              fontSize: '7px',
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(255, 71, 87, 0.9)',
              background: 'rgba(255, 71, 87, 0.2)',
              padding: '2px 4px',
              borderRadius: '4px',
            }}>BUNDLE</div>
          )}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: '4px',
          }}>{token.name}</div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}>{token.mcap}</span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              color: 'rgba(74, 222, 128, 0.9)',
            }}>{token.change}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

const LiveDemoStrip = memo(function LiveDemoStrip() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const demos = [
    { title: 'TWITTER TRACKER', component: MiniTwitterFeed, color: 'rgba(100, 130, 170, 0.7)' },
    { title: 'RISK SCANNER', component: MiniRiskScanner, color: 'rgba(80, 100, 140, 0.7)' },
    { title: 'PUMP.FUN FEED', component: MiniPumpFeed, color: 'rgba(90, 110, 150, 0.7)' },
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '16px',
          padding: '0 16px',
        }}
      >
        {demos.map((demo, index) => {
          const Component = demo.component;
          
          return (
            <TiltCard key={demo.title} intensity={6}>
              <div
                initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  background: 'rgba(10, 10, 20, 0.8)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  height: '100%',
                }}
              >
                <div style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: demo.color,
                    boxShadow: `0 0 8px ${demo.color}`,
                  }} />
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.7)',
                    letterSpacing: '0.1em',
                  }}>{demo.title}</span>
                </div>
                <div style={{ height: isMobile ? '140px' : '160px' }}>
                  <Component />
                </div>
              </div>
            </TiltCard>
          );
        })}
      </motion.div>
    </div>
  );
});

export default LiveDemoStrip;