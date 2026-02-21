import React, { useRef, useState, useEffect, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../hooks/useReducedMotion';

const TypingCharText = memo(function TypingCharText({ text, delay = 0, charDelay = 0.04 }) {
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
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
});

const GlassDot = memo(function GlassDot({ isActive, onClick, label }) {
  const reducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'relative',
        width: isActive ? '36px' : '14px',
        height: '14px',
        borderRadius: '7px',
        background: isActive 
          ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.4) 0%, rgba(74, 222, 128, 0.15) 100%)'
          : 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isActive 
          ? '1px solid rgba(74, 222, 128, 0.5)' 
          : '1px solid rgba(255,255,255,0.1)',
        boxShadow: isActive 
          ? '0 0 25px rgba(74, 222, 128, 0.4), inset 0 1px 1px rgba(255,255,255,0.2)'
          : '0 0 15px rgba(255,255,255,0.08)',
        cursor: 'pointer',
        transition: reducedMotion ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
      }}
    >
      {isHovered && label && (
        <motion.span
          initial={{ opacity: 0, x: 10, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 10, scale: 0.9 }}
          style={{
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '0.4rem 0.75rem',
            background: 'rgba(0, 0, 0, 0.85)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.9)',
            whiteSpace: 'nowrap',
            letterSpacing: '0.02em',
            pointerEvents: 'none',
          }}
        >
          {label}
        </motion.span>
      )}
    </motion.button>
  );
});

const ScrollNavigationDots = memo(function ScrollNavigationDots({ sections, activeSection, onSectionClick }) {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const scrollToSection = (index) => {
    if (onSectionClick) {
      onSectionClick(index);
      return;
    }
    
    const sectionIds = ['hero', 'demos', 'features', 'pricing'];
    const element = document.getElementById(sectionIds[index]);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{
        position: 'fixed',
        right: isMobile ? '1rem' : '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 1000,
      }}
    >
      {sections.map((section, index) => (
        <GlassDot
          key={section.id}
          isActive={activeSection === index}
          onClick={() => scrollToSection(index)}
          label={section.label}
        />
      ))}
    </motion.div>
  );
});

const icons = {
  radar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 10 10" />
      <path d="M12 6a6 6 0 0 1 6 6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" />
      <path d="M9 12l2 2 4-4" strokeWidth="2" />
    </svg>
  ),
  pulse: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  rocket: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    </svg>
  ),
  brain: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  chart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <polyline points="7 14 10 10 13 13 17 8" />
    </svg>
  ),
};

const FeatureCard = memo(function FeatureCard({ feature }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      style={{
        flexShrink: 0,
        width: '260px',
        padding: '1.25rem',
        background: isHovered ? 'rgba(14, 14, 24, 0.95)' : 'rgba(10, 10, 18, 0.9)',
        borderRadius: '4px',
        border: isHovered ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.04)',
        boxShadow: isHovered 
          ? '0 20px 40px -15px rgba(0, 0, 0, 0.5)'
          : '0 8px 20px -10px rgba(0, 0, 0, 0.4)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.7rem',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '4px',
          background: feature.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255, 255, 255, 0.85)',
        }}>
          {icons[feature.icon]}
        </div>
        <h3 style={{
          fontFamily: "'Inter', -apple-system, sans-serif",
          fontSize: '0.85rem',
          fontWeight: 500,
          color: isHovered ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.6)',
          margin: 0,
        }}>
          {feature.title}
        </h3>
      </div>
      <p style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: '0.8rem',
        color: 'rgba(255, 255, 255, 0.4)',
        lineHeight: 1.55,
        margin: 0,
      }}>
        {feature.description}
      </p>
    </motion.div>
  );
});

const PremiumFeatureSection = memo(function PremiumFeatureSection({ features }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: false });
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const allFeatures = [...features, ...features, ...features];
  
  return (
    <section
      id="features"
      ref={ref}
      style={{
        padding: isMobile ? '4rem 0' : '5rem 0',
        maxWidth: '100%',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
          maxWidth: '1100px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: isMobile ? '0 1.5rem' : '0 2rem',
        }}
      >
        <p style={{
          fontFamily: "'Inter', -apple-system, sans-serif",
          fontSize: '0.7rem',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.15em',
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
        }}>
          Your Arsenal
        </p>
        <h2 style={{
          fontFamily: "'Inter', -apple-system, sans-serif",
          fontSize: 'clamp(1.6rem, 4vw, 2rem)',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.85)',
          letterSpacing: '-0.02em',
        }}>
          <TypingCharText text="Every tool you " delay={0.2} charDelay={0.05} />
          <span style={{ color: 'rgba(130, 255, 180, 0.85)' }}>
            <TypingCharText text="need" delay={0.95} charDelay={0.05} />
          </span>
          <TypingCharText text="." delay={1.15} charDelay={0.05} />
        </h2>
      </motion.div>
      
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="features-scroll-container"
          style={{
            display: 'flex',
            gap: '1rem',
            padding: isMobile ? '0 1.5rem' : '0 2rem',
            width: 'max-content',
            animation: reducedMotion || isMobile ? 'none' : 'scroll-features 25s linear infinite',
          }}
        >
          {allFeatures.map((feature, idx) => (
            <FeatureCard
              key={idx}
              feature={feature}
            />
          ))}
        </div>
        
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '150px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(8, 8, 14, 1) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '150px',
            background: 'linear-gradient(-90deg, transparent 0%, rgba(8, 8, 14, 1) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <style>{`
        @keyframes scroll-features {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${features.length * 290}px);
          }
        }
        
        .features-scroll-container:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
});

export { ScrollNavigationDots, PremiumFeatureSection };
