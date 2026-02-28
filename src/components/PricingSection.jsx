import React, { useRef, useState, useEffect, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../hooks/useReducedMotion';

const TypingCharText = memo(function TypingCharText({ text, startDelay = 0, charDelay = 0.05 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setVisible(true), startDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [inView, startDelay]);

  return (
    <span ref={ref} style={{ display: 'inline-flex', overflow: 'hidden' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
          animate={visible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{
            duration: 0.35,
            delay: startDelay + i * charDelay,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
});

const pricingFeatures = [
  'AI-powered KOL tracking',
  'AI risk scanner & rug detection',
  'Neural network alpha predictions',
  'Real-time pump.fun feed',
  'Personal AI chat agent',
  'Discord alpha community',
  'Priority AI model access'
];

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PricingCard = memo(function PricingCard() {
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={reducedMotion ? {} : { y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        maxWidth: '420px',
        margin: '0 auto',
        background: isHovered 
          ? 'linear-gradient(180deg, rgba(14, 18, 28, 0.98) 0%, rgba(10, 12, 20, 0.98) 100%)'
          : 'linear-gradient(180deg, rgba(10, 14, 22, 0.95) 0%, rgba(6, 8, 16, 0.98) 100%)',
        border: isHovered 
          ? '1px solid rgba(60, 90, 130, 0.12)' 
          : '1px solid rgba(255, 255, 255, 0.025)',
        borderRadius: '24px',
        padding: '3rem',
        boxShadow: isHovered 
          ? '0 35px 70px -20px rgba(0, 0, 0, 0.6), 0 0 40px rgba(30, 50, 80, 0.05)'
          : '0 25px 50px -15px rgba(0, 0, 0, 0.45)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(40, 60, 100, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      
      <motion.div
        animate={{ height: isHovered ? '1px' : '0px' }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(60, 90, 130, 0.3), transparent)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(30, 50, 80, 0.15)',
            border: '1px solid rgba(50, 80, 120, 0.15)',
            borderRadius: '24px',
            marginBottom: '0.5rem',
          }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'rgba(80, 110, 150, 0.8)',
                boxShadow: '0 0 8px rgba(80, 110, 150, 0.4)',
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: '8px',
          }}>
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontSize: 'clamp(3rem, 8vw, 4rem)',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.92)',
              letterSpacing: '-0.04em',
              lineHeight: '1',
            }}>
            0.1
          </motion.span>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontSize: '1.25rem',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.5)',
            }}>
            SOL
          </motion.span>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontSize: '0.9rem',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.3)',
            }}>
            /mo
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
            margin: '0 -1rem 2rem',
            transformOrigin: 'center',
          }}
        />

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 2.5rem',
            textAlign: 'left'
          }}>
          {pricingFeatures.map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 + idx * 0.05, duration: 0.4 }}
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontSize: '0.88rem',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'default',
              }}
            >
              <motion.span 
                whileHover={{ scale: 1.1 }}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  background: 'rgba(50, 80, 120, 0.12)',
                  border: '1px solid rgba(60, 90, 130, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(90, 120, 160, 0.8)',
                  fontSize: '0.6rem',
                  flexShrink: 0,
                }}>
                <CheckIcon />
              </motion.span>
              <span>{item}</span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.button
          whileHover={!reducedMotion ? { scale: 1.02, y: -2 } : {}}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            width: '100%',
            background: isHovered
              ? 'linear-gradient(135deg, rgba(50, 80, 120, 0.15) 0%, rgba(40, 60, 100, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.025) 0%, rgba(255, 255, 255, 0.01) 100%)',
            border: isHovered
              ? '1px solid rgba(60, 90, 130, 0.25)'
              : '1px solid rgba(255, 255, 255, 0.04)',
            color: 'rgba(255, 255, 255, 0.65)',
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 500,
            fontSize: '0.9rem',
            padding: '1.1rem 1.5rem',
            borderRadius: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.span
            animate={{ x: isHovered ? ['0%', '100%'] : '-100%' }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '30%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
            }}
          />
          <span style={{ position: 'relative', zIndex: 1 }}>Coming Soon</span>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.28)',
            marginTop: '1.5rem',
            textAlign: 'center',
          }}
        >
          Beta launching soon. Join Discord for early access.
        </motion.p>
      </div>
    </motion.div>
  );
});

const PricingSection = memo(function PricingSection() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2, once: false });

  return (
    <section
      id="pricing"
      ref={sectionRef}
      style={{
        padding: isMobile ? '8rem 1.5rem 6rem' : '10rem 2rem 8rem',
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'transparent',
        position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '5%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(30, 50, 80, 0.06) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(25, 45, 75, 0.05) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 1 }}
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.25)',
            letterSpacing: '0.28em',
            marginBottom: '1rem',
          }}
        >
          MEMBERSHIP
        </motion.p>
        <h2 style={{
          fontFamily: "'Archivo', sans-serif",
          fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.72)',
          letterSpacing: '-0.025em',
        }}>
          <TypingCharText text="Simple pricing." startDelay={0.2} charDelay={0.04} />
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.3)',
            marginTop: '0.75rem',
            letterSpacing: '0.02em',
          }}
        >
          Pay with SOL. Cancel anytime.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <PricingCard />
      </motion.div>
    </section>
  );
});

export default PricingSection;
