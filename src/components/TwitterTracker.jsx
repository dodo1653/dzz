import React, { memo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../hooks/useReducedMotion';

const ComingSoonBadge = memo(function ComingSoonBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'linear-gradient(135deg, rgba(123, 92, 246, 0.15) 0%, rgba(0, 212, 255, 0.1) 100%)',
        border: '1px solid rgba(123, 92, 246, 0.3)',
        borderRadius: '100px',
        marginBottom: '1.5rem',
      }}
    >
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'rgba(123, 92, 246, 0.8)',
          boxShadow: '0 0 10px rgba(123, 92, 246, 0.5)',
        }}
      />
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.7rem',
        fontWeight: 500,
        color: 'rgba(123, 92, 246, 0.9)',
        letterSpacing: '0.1em',
      }}>
        COMING SOON
      </span>
    </motion.div>
  );
});

const LockIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" opacity="0.4"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" opacity="0.6"/>
    <circle cx="12" cy="16" r="1" fill="currentColor" opacity="0.8"/>
  </svg>
);

const FeaturePreview = memo(function FeaturePreview({ icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        borderRadius: '12px',
      }}
    >
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: 'rgba(255, 255, 255, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: 'rgba(255, 255, 255, 0.4)',
      }}>
        {icon}
      </div>
      <div>
        <h4 style={{
          fontFamily: "'Archivo', sans-serif",
          fontSize: '0.9rem',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.7)',
          margin: '0 0 0.35rem 0',
        }}>
          {title}
        </h4>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem',
          color: 'rgba(255, 255, 255, 0.35)',
          margin: 0,
          lineHeight: 1.5,
        }}>
          {description}
        </p>
      </div>
    </motion.div>
  );
});

const TwitterTracker = memo(function TwitterTracker() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current || reducedMotion || isMobile) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) / 40;
    const rotateY = (e.clientX - centerX) / 40;
    setRotation({ x: -rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsSubscribed(true);
        setEmail('');
      }
    } catch (err) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  const featureIcons = {
    feed: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" opacity="0.6"/>
        <circle cx="5" cy="19" r="2" fill="currentColor" opacity="0.8"/>
      </svg>
    ),
    alert: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" opacity="0.6"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0" opacity="0.8"/>
      </svg>
    ),
    analytics: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10" opacity="0.6"/>
        <line x1="12" y1="20" x2="12" y2="4" opacity="0.7"/>
        <line x1="6" y1="20" x2="6" y2="14" opacity="0.5"/>
      </svg>
    ),
  };

  const features = [
    {
      icon: featureIcons.feed,
      title: 'Real-time Feed',
      description: 'Track tweets from top KOLs and influencers in milliseconds.',
    },
    {
      icon: featureIcons.alert,
      title: 'Signal Alerts',
      description: 'Get notified when tracked accounts mention tokens.',
    },
    {
      icon: featureIcons.analytics,
      title: 'Sentiment Analysis',
      description: 'AI-powered mood tracking across crypto Twitter.',
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '6rem 1.5rem 2rem' : '8rem 2rem 2rem',
    }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(123, 92, 246, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <ComingSoonBadge />
        
        <h1 style={{
          fontFamily: "'Archivo', sans-serif",
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.95)',
          letterSpacing: '-0.02em',
          marginBottom: '1rem',
        }}>
          Twitter Tracker
        </h1>
        
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.4)',
          maxWidth: '500px',
          margin: '0 auto 3rem',
          lineHeight: 1.7,
        }}>
          Track crypto influencers and pump signals in real-time.
          <br />
          <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Currently in development.
          </span>
        </p>
      </motion.div>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
          background: 'rgba(8, 8, 14, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '24px',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          overflow: 'hidden',
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.15s ease-out',
          boxShadow: `
            0 0 0 1px rgba(255, 255, 255, 0.02) inset,
            0 40px 80px -20px rgba(0, 0, 0, 0.6)
          `,
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(123, 92, 246, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        <motion.div
          animate={{ y: ['-100%', '400%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(123, 92, 246, 0.1) 50%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        <div style={{ position: 'relative', zIndex: 3, padding: '3rem 2rem' }}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(123, 92, 246, 0.15) 0%, rgba(0, 212, 255, 0.1) 100%)',
              border: '1px solid rgba(123, 92, 246, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(123, 92, 246, 0.6)',
            }}
          >
            <LockIcon />
          </motion.div>

          <h2 style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            marginBottom: '0.5rem',
          }}>
            Feature Locked
          </h2>
          
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.35)',
            textAlign: 'center',
            marginBottom: '2rem',
          }}>
            Get notified when it launches
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '2rem',
          }}>
            {features.map((feature, i) => (
              <FeaturePreview key={i} {...feature} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {isSubscribed ? (
              <motion.div
                key="subscribed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '1rem',
                  background: 'rgba(74, 222, 128, 0.08)',
                  border: '1px solid rgba(74, 222, 128, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.75rem',
                  color: 'rgba(74, 222, 128, 0.8)',
                }}>
                  You'll be notified when this feature launches
                </span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubscribe}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    flex: 1,
                    padding: '0.85rem 1.15rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.85rem 1.5rem',
                    background: 'linear-gradient(135deg, rgba(123, 92, 246, 0.2) 0%, rgba(0, 212, 255, 0.15) 100%)',
                    border: '1px solid rgba(123, 92, 246, 0.3)',
                    borderRadius: '12px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.8)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(123, 92, 246, 0.3) 0%, rgba(0, 212, 255, 0.2) 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(123, 92, 246, 0.2) 0%, rgba(0, 212, 255, 0.15) 100%)';
                  }}
                >
                  NOTIFY ME
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div style={{
          position: 'absolute',
          inset: -1,
          borderRadius: '25px',
          border: '1px solid transparent',
          background: 'linear-gradient(135deg, rgba(123, 92, 246, 0.2), transparent, rgba(0, 212, 255, 0.15))',
          backgroundClip: 'padding-box',
          WebkitBackgroundClip: 'padding-box',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          display: 'flex',
          gap: '2rem',
          marginTop: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {[
          { label: 'PLANNED ACCOUNTS', value: '100+' },
          { label: 'UPDATE SPEED', value: '<1s' },
          { label: 'SIGNAL TYPES', value: '12' },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              padding: '1rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '12px',
            }}
          >
            <div style={{
              fontFamily: "'Archivo', sans-serif",
              fontSize: '1.25rem',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.7)',
            }}>
              {stat.value}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6rem',
              color: 'rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.1em',
              marginTop: '0.25rem',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
});

export default TwitterTracker;
