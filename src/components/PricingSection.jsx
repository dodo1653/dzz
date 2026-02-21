import React, { useRef, useState, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../hooks/useReducedMotion';

const pricingFeatures = [
  'AI-powered KOL tracking',
  'AI risk scanner & rug detection',
  'Neural network alpha predictions',
  'Real-time pump.fun feed',
  'Personal AI chat agent',
  'Discord alpha community',
  'Priority AI model access'
];

const PricingCard = memo(function PricingCard() {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.01 }}
      style={{
        maxWidth: '420px',
        margin: '0 auto',
        background: isHovered 
          ? 'linear-gradient(180deg, rgba(20, 20, 32, 0.98) 0%, rgba(14, 14, 24, 0.98) 100%)'
          : 'linear-gradient(180deg, rgba(14, 14, 24, 0.98) 0%, rgba(10, 10, 18, 0.98) 100%)',
        border: isHovered 
          ? '1px solid rgba(255, 255, 255, 0.12)' 
          : '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '28px',
        padding: '3rem',
        boxShadow: isHovered 
          ? '0 50px 100px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.03) inset'
          : '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.02) inset',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          background: 'rgba(123, 92, 246, 0.1)',
          border: '1px solid rgba(123, 92, 246, 0.2)',
          borderRadius: '20px',
          marginBottom: '2rem',
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'rgba(123, 92, 246, 0.8)',
          }} />
          <p style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'rgba(167, 139, 250, 0.9)',
            letterSpacing: '0.08em',
            margin: 0,
          }}>
            PRO ACCESS
          </p>
        </div>

        <div style={{
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: '10px',
        }}>
          <span style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '4rem',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.95)',
            letterSpacing: '-0.04em',
            lineHeight: '1',
          }}>
            0.1
          </span>
          <span style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '1.35rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.7)',
          }}>
            SOL
          </span>
          <span style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '1rem',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.4)',
          }}>
            /mo
          </span>
        </div>

        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          margin: '0 -1rem 2rem',
        }} />

        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: '0 0 2.5rem',
          textAlign: 'left'
        }}>
          {pricingFeatures.map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04 }}
              style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'default',
              }}
            >
              <span style={{
                width: '22px',
                height: '22px',
                borderRadius: '7px',
                background: 'rgba(74, 222, 128, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(74, 222, 128, 0.9)',
                fontSize: '0.65rem',
                flexShrink: 0,
              }}>
                ✓
              </span>
              {item}
            </motion.li>
          ))}
        </ul>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: 'rgba(255, 255, 255, 0.85)',
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontWeight: 600,
            fontSize: '0.9rem',
            padding: '1.1rem 1.5rem',
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          Coming Soon
        </motion.button>

        <p style={{
          fontFamily: "'Inter', -apple-system, sans-serif",
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.35)',
          marginTop: '1.5rem'
        }}>
          Beta launching soon. Join Discord for early access.
        </p>
      </div>
    </motion.div>
  );
});

const PricingSection = memo(function PricingSection() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <section
      id="pricing"
      style={{
        padding: isMobile ? '4rem 1.5rem 5rem' : '5rem 2rem 6rem',
        maxWidth: '1100px',
        margin: '0 auto'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '3.5rem' }}
      >
        <p style={{
          fontFamily: "'Inter', -apple-system, sans-serif",
          fontSize: '0.7rem',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.35)',
          letterSpacing: '0.15em',
          marginBottom: '1rem',
          textTransform: 'uppercase',
        }}>
          Membership
        </p>
        <h2 style={{
          fontFamily: "'Inter', -apple-system, sans-serif",
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.95)',
          letterSpacing: '-0.03em',
        }}>
          Simple pricing.
        </h2>
        <p style={{
          fontFamily: "'Inter', -apple-system, sans-serif",
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.45)',
          marginTop: '0.75rem',
        }}>
          Pay with SOL. Cancel anytime.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <PricingCard />
      </motion.div>
    </section>
  );
});

export default PricingSection;
