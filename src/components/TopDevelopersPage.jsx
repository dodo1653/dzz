import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../hooks/useReducedMotion';

const TopDevelopersPage = memo(function TopDevelopersPage() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '4rem 1.5rem 2rem' : '5rem 2rem 2rem',
    }}>
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
        }}
      >
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem',
          color: 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.2em',
          marginBottom: '1rem',
        }}>
          COMING SOON
        </p>
        <h1 style={{
          fontFamily: "'Archivo', sans-serif",
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.9)',
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
        }}>
          Top Developers
        </h1>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.45)',
          maxWidth: '480px',
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Track the most profitable developers on pump.fun.
        </p>
      </motion.div>
    </div>
  );
});

export default TopDevelopersPage;
