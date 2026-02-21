import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../hooks/useReducedMotion';

const ContactPage = memo(function ContactPage() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const DiscordIcon = ({ size = 24 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#5865F2"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );

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
          marginBottom: '3rem',
        }}
      >
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem',
          color: 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.2em',
          marginBottom: '1rem',
        }}>
          COMMUNITY
        </p>
        <h1 style={{
          fontFamily: "'Archivo', sans-serif",
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.9)',
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
        }}>
          Join Our Community
        </h1>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.45)',
          maxWidth: '480px',
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Connect with fellow traders and get real-time updates.
        </p>
      </motion.div>

      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
        animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          width: '100%',
          maxWidth: '600px',
          borderRadius: '28px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          background: 'rgba(8, 8, 14, 0.6)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          boxShadow: `
            0 0 0 1px rgba(255, 255, 255, 0.02) inset,
            0 60px 120px -30px rgba(0, 0, 0, 0.7),
            0 0 100px -40px rgba(123, 92, 246, 0.12)
          `,
          margin: '0 auto',
        }}
      >
        <div style={{
          padding: '3.5rem 3rem',
          textAlign: 'center',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 1.25rem',
            borderRadius: '16px',
            background: 'rgba(88, 101, 242, 0.1)',
            border: '1px solid rgba(88, 101, 242, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
          }}>
            <DiscordIcon size={28} />
          </div>
          <h2 style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.85)',
            marginBottom: '0.5rem',
          }}>
            Join Our Discord Server
          </h2>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.4)',
            marginBottom: '1.5rem',
          }}>
            Connect with the community
          </p>
          <a
            href="https://discord.gg/Y3uh3hN2"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.85rem 1.5rem',
              background: 'rgba(88, 101, 242, 0.1)',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '0.8rem',
              fontWeight: 500,
              fontFamily: "'JetBrains Mono', monospace",
              textDecoration: 'none',
              borderRadius: '12px',
              border: '1px solid rgba(88, 101, 242, 0.2)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(88, 101, 242, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(88, 101, 242, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(88, 101, 242, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(88, 101, 242, 0.2)';
            }}
          >
            <DiscordIcon size={16} />
            Join Discord
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '1rem',
          marginTop: '2.5rem',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        {[
          { label: 'SUPPORT', value: 'support@dzz.ai' },
          { label: 'BUSINESS', value: 'business@dzz.ai' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: '1.5rem',
              background: 'rgba(8, 8, 14, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '18px',
            }}
          >
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.35)',
              letterSpacing: '0.1em',
              marginBottom: '0.5rem',
            }}>
              {item.label}
            </div>
            <div style={{ 
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.55)',
            }}>
              {item.value}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
});

export default ContactPage;
