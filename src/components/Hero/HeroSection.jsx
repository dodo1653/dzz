import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../../hooks/useReducedMotion';

const stats = [
  { label: 'wallets tracked', value: '2,847' },
  { label: 'signals detected', value: '23' },
  { label: 'uptime', value: '99.9%' },
];

const TypingCharText = memo(function TypingCharText({ text, delay = 0, charDelay = 0.04, gradient = false }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setVisible(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [inView, delay]);

  return (
    <span ref={ref} style={{ display: 'inline-flex', overflow: 'hidden' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
          animate={visible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{
            duration: 0.4,
            delay: delay + i * charDelay,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ 
            display: 'inline-block',
            background: gradient ? 'linear-gradient(135deg, rgba(100, 140, 180, 0.8), rgba(80, 120, 160, 0.6))' : 'none',
            WebkitBackgroundClip: gradient ? 'text' : 'unset',
            WebkitTextFillColor: gradient ? 'transparent' : 'unset',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
});

const HeroSection = function HeroSection({
  title = "AI DEGEN RADAR",
  onTitleRevealComplete,
  children,
}) {
  const [titleComplete, setTitleComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (reducedMotion) {
      setTitleComplete(true);
      setShowContent(true);
      onTitleRevealComplete?.();
      return;
    }

    setTitleComplete(true);
    const timer = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(timer);
  }, [reducedMotion, onTitleRevealComplete]);

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Background */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{
          fontFamily: "'Archivo', sans-serif",
          fontSize: 'clamp(8rem, 25vw, 20rem)',
          fontWeight: 700,
          color: 'transparent',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.05em',
          textTransform: 'lowercase',
        }}>
          is this you?
        </span>
      </div>

      {/* Minimal Background Orbs */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(40, 60, 100, 0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            right: '5%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(30, 50, 80, 0.05) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Main Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '120px 24px 80px' : '140px 40px 100px',
        }}
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', maxWidth: '900px' }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(3rem, 10vw, 5rem)',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.08em',
              marginBottom: '0.5rem',
            }}
          >
            dzz
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.25)',
              letterSpacing: '0.2em',
              marginBottom: '3rem',
              textTransform: 'lowercase',
            }}
          >
            v2.0 — live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontSize: 'clamp(1.8rem, 5vw, 3rem)',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.72)',
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              marginBottom: '1.5rem',
            }}
          >
            <TypingCharText text="stop guessing." delay={0.4} charDelay={0.055} />
            <br />
            <TypingCharText text="start knowing." delay={1.3} charDelay={0.055} gradient={true} />
          </motion.h1>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: isMobile ? '2rem' : '4rem',
              marginBottom: '4rem',
              flexWrap: 'wrap',
            }}
          >
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontSize: '1.8rem',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '-0.02em',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontSize: '0.65rem',
                  color: 'rgba(255, 255, 255, 0.25)',
                  letterSpacing: '0.08em',
                  marginTop: '0.35rem',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Wallet Card */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                width: '100%',
                maxWidth: '720px',
                marginBottom: '6rem',
              }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSection;
