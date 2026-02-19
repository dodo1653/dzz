import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../hooks/useReducedMotion';

const Footer = memo(function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;
    setStatus('loading');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const links = [
    { name: 'Terminal', href: '/' },
    { name: 'Context Engine', href: '/context-engine' },
    { name: 'Twitter', href: '/twitter-tracker' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.04)',
      background: 'rgba(2, 3, 10, 0.8)',
      padding: isMobile ? '2rem 1rem' : '3rem 2rem',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr',
        gap: isMobile ? '2rem' : '3rem',
        alignItems: 'start',
      }}>
        {/* Brand & Newsletter */}
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.85)',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }}>
            dzz
          </div>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.35)',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
            maxWidth: '320px',
          }}>
            AI-powered pump.fun tracking. Get notified about new features and launches.
          </p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', maxWidth: '320px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={status === 'loading'}
              style={{
                flex: 1,
                padding: '0.7rem 1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.8)',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading' || !email.trim()}
              style={{
                padding: '0.7rem 1rem',
                background: status === 'success' 
                  ? 'rgba(74, 222, 128, 0.15)' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                fontWeight: 500,
                color: status === 'success' 
                  ? 'rgba(74, 222, 128, 0.8)' 
                  : 'rgba(255, 255, 255, 0.6)',
                cursor: status === 'loading' ? 'wait' : 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {status === 'loading' ? '...' : status === 'success' ? '✓' : 'JOIN'}
            </button>
          </form>
          
          <AnimatePresence>
            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.65rem',
                  color: 'rgba(74, 222, 128, 0.7)',
                  marginTop: '0.5rem',
                }}
              >
                You'll be notified about new features
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div>
          <h4 style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.1em',
            marginBottom: '1rem',
          }}>
            NAVIGATION
          </h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.45)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)'}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Social */}
        <div>
          <h4 style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.1em',
            marginBottom: '1rem',
          }}>
            CONNECT
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <a
              href="https://discord.gg/GhNUXjnfd7"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                color: 'rgba(88, 101, 242, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(88, 101, 242, 1)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(88, 101, 242, 0.7)'}
            >
              Discord
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.45)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)'}
            >
              Twitter
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: '1100px',
        margin: '2rem auto 0',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.65rem',
          color: 'rgba(255, 255, 255, 0.25)',
        }}>
          © {new Date().getFullYear()} dzz. All rights reserved.
        </p>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.6rem',
          color: 'rgba(255, 255, 255, 0.2)',
        }}>
          Built for degens, by degens.
        </p>
      </div>
    </footer>
  );
});

export default Footer;
