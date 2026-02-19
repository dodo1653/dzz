import React, { useRef, useState, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (reducedMotion || isMobile) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
        maxWidth: '440px',
        margin: '0 auto',
      }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100%',
          background: 'linear-gradient(180deg, rgba(16, 16, 26, 0.95), rgba(10, 10, 18, 0.98))',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '20px',
          padding: '2.5rem',
          backdropFilter: 'blur(20px)',
          boxShadow: isHovered 
            ? '0 30px 60px -20px rgba(0, 0, 0, 0.6), 0 0 40px -10px rgba(130, 200, 255, 0.1)'
            : '0 20px 50px -15px rgba(0, 0, 0, 0.5)',
          rotateX: reducedMotion || isMobile ? 0 : rotateX,
          rotateY: reducedMotion || isMobile ? 0 : rotateY,
          transformStyle: 'preserve-3d',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Glow effect on hover */}
        {isHovered && !reducedMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: -1,
              background: 'linear-gradient(135deg, rgba(130, 200, 255, 0.1), rgba(147, 130, 255, 0.1))',
              borderRadius: '20px',
              zIndex: -1,
              filter: 'blur(20px)',
            }}
          />
        )}

        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.15em',
              marginBottom: '1.5rem',
              textTransform: 'lowercase',
            }}
          >
            pro access
          </motion.div>

          <motion.div
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '3rem',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.7)',
              letterSpacing: '-0.02em',
              lineHeight: '1',
            }}>
              0.1
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '1.5rem',
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.5)',
              }}>
                SOL
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.3)',
              }}>
                /month
              </span>
            </div>
          </motion.div>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '2rem 0',
            textAlign: 'left'
          }}>
            {pricingFeatures.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ x: 4 }}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.45)',
                  marginBottom: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  cursor: 'default',
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                  style={{
                    color: 'rgba(130, 255, 180, 0.6)',
                    fontSize: '0.85rem',
                  }}
                >
                  ✓
                </motion.span>
                {item}
              </motion.li>
            ))}
          </ul>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 500,
              fontSize: '0.8rem',
              padding: '0.9rem',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            coming soon
          </motion.button>

          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: 'rgba(255, 255, 255, 0.25)',
            marginTop: '1.25rem'
          }}>
            beta launching soon. join discord for early access.
          </p>
        </div>
      </motion.div>
    </div>
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
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: 'rgba(255, 255, 255, 0.35)',
            letterSpacing: '0.2em',
            marginBottom: '1rem',
            textTransform: 'lowercase',
          }}
        >
          membership
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.6)',
            letterSpacing: '-0.01em',
            marginBottom: '0.5rem',
          }}
        >
          simple pricing.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.35)',
            marginTop: '0.5rem',
          }}
        >
          pay with SOL. cancel anytime.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <PricingCard />
      </motion.div>
    </section>
  );
});

export default PricingSection;
