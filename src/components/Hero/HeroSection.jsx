import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HolographicTerminal from './HolographicTerminal';
import PremiumChatAgent from './PremiumChatAgent';
import TypingText from '../TypingText';
import { useReducedMotion, useMediaQuery } from '../../hooks/useReducedMotion';

const HeroSection = memo(function HeroSection({
  title = "AI DEGEN RADAR",
  tagline = "AI-powered pump.fun tracking. Never miss a launch.",
  onTitleRevealComplete,
  children,
}) {
  const [titleComplete, setTitleComplete] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (reducedMotion) {
      setTitleComplete(true);
      setShowTerminal(true);
      onTitleRevealComplete?.();
      return;
    }

    setTitleComplete(true);
    const timer1 = setTimeout(() => setShowTerminal(true), 350);

    return () => {
      clearTimeout(timer1);
    };
  }, [reducedMotion, onTitleRevealComplete]);

  return (
    <section
      style={{
        position: 'relative',
        minHeight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '100px 16px 40px' : '120px 24px 60px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            marginBottom: isMobile ? '16px' : '24px',
            textAlign: 'center',
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{
              fontFamily: "'Archivo', 'Inter', sans-serif",
              fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, rgba(220,215,255,0.97) 0%, rgba(180,200,255,0.88) 50%, rgba(160,220,255,0.92) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 25px rgba(200,215,255,0.3))',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </motion.h1>
        </div>

        <AnimatePresence>
          {titleComplete && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                textAlign: 'center',
                marginBottom: isMobile ? '24px' : '32px',
                maxWidth: '520px',
                padding: '0 16px',
              }}
            >
              <p style={{
                fontSize: isMobile ? '1rem' : '1.1rem',
                color: 'rgba(255, 255, 255, 0.55)',
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                letterSpacing: '0.02em',
                lineHeight: 1.75,
              }}>
                <TypingText text={tagline} speed={30} delay={120} triggerOnScroll={false} />
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTerminal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              style={{
                marginBottom: isMobile ? '24px' : '32px',
              }}
            >
              <HolographicTerminal />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTerminal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
              style={{
                marginBottom: isMobile ? '24px' : '32px',
              }}
            >
              <PremiumChatAgent />
            </motion.div>
          )}
        </AnimatePresence>

        {children}
      </div>
    </section>
  );
});

export default HeroSection;
