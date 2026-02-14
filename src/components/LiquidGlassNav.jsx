import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LiquidGlassNav = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [hoveredSection, setHoveredSection] = useState(null);

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      if (window.__lenis) {
        window.__lenis.scrollTo(offsetTop, {
          duration: 2.0,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      style={{
        position: 'fixed',
        right: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px 16px',
        background: 'linear-gradient(135deg, rgba(20, 15, 40, 0.4), rgba(10, 8, 25, 0.5))',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: '24px',
        border: '1px solid rgba(123, 92, 246, 0.2)',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          0 0 40px rgba(123, 92, 246, 0.15)
        `,
      }}
    >
      {/* Liquid glow effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '24px',
        background: 'radial-gradient(circle at 50% 0%, rgba(123, 92, 246, 0.15), transparent 70%)',
        pointerEvents: 'none',
        animation: 'liquidPulse 3s ease-in-out infinite',
      }} />

      {sections.map((section, index) => {
        const isActive = activeSection === section.id;
        const isHovered = hoveredSection === section.id;

        return (
          <div key={section.id} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Dot button */}
            <motion.button
              onClick={() => scrollToSection(section.id)}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: isActive ? '12px' : '10px',
                height: isActive ? '12px' : '10px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.2, 0, 0.2, 1)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(123, 92, 246, 0.9), rgba(0, 212, 255, 0.9))'
                  : 'rgba(255, 255, 255, 0.3)',
                boxShadow: isActive
                  ? '0 0 20px rgba(123, 92, 246, 0.6), 0 0 40px rgba(0, 212, 255, 0.4)'
                  : 'none',
              }}
            >
              {/* Liquid ripple effect */}
              {(isActive || isHovered) && (
                <motion.div
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    inset: -4,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(123, 92, 246, 0.4), rgba(0, 212, 255, 0.4))',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </motion.button>

            {/* Label on hover */}
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : -10,
                scale: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                right: 'calc(100% + 16px)',
                whiteSpace: 'nowrap',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, rgba(20, 15, 40, 0.95), rgba(10, 8, 25, 0.95))',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                border: '1px solid rgba(123, 92, 246, 0.3)',
                fontFamily: "'Space Grotesk', 'Sora', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), 0 0 30px rgba(123, 92, 246, 0.2)',
                pointerEvents: 'none',
              }}
            >
              {section.label}
            </motion.div>
          </div>
        );
      })}

      <style>{`
        @keyframes liquidPulse {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          50% {
            opacity: 0.6;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default LiquidGlassNav;
