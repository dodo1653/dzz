import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'terminal', path: '/' },
    { name: 'context engine', path: '/context-engine' },
    { name: 'twitter', path: '/twitter-tracker' },
    { name: 'contact', path: '/contact' },
  ];

  const handleNavClick = (e, link) => {
    e.preventDefault();
    navigate(link.path);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(8, 8, 14, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 2.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4rem',
        }}>
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.55)',
              letterSpacing: '0.1em',
            }}>
              dzz
            </span>
          </motion.button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.1rem',
          }}>
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.path;
              return (
                <motion.button
                  key={link.name}
                  onClick={(e) => handleNavClick(e, link)}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem 0.85rem',
                    position: 'relative',
                  }}
                >
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.7rem',
                    fontWeight: 400,
                    color: isActive ? 'rgba(255, 255, 255, 0.55)' : 'rgba(255, 255, 255, 0.3)',
                    letterSpacing: '0.08em',
                    transition: 'color 0.25s ease',
                  }}>
                    {link.name}
                  </span>
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        initial={{ opacity: 0, scaleX: 0.5 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0.5 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          position: 'absolute',
                          bottom: '1px',
                          left: '0.85rem',
                          right: '0.85rem',
                          height: '1px',
                          background: 'rgba(255, 255, 255, 0.15)',
                          transformOrigin: 'center',
                        }}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <motion.a
              href="https://twitter.com/dazzoxx"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '26px',
                height: '26px',
                borderRadius: '5px',
                color: 'rgba(255, 255, 255, 0.35)',
                textDecoration: 'none',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </motion.a>
            <motion.a
              href="https://discord.gg/Y3uh3hN2"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '26px',
                height: '26px',
                borderRadius: '5px',
                color: 'rgba(255, 255, 255, 0.35)',
                textDecoration: 'none',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </motion.a>
          </div>
        </div>
      </motion.nav>

      <div style={{ height: '56px' }} />
    </>
  );
};

export default Navigation;
