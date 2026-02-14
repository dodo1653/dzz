import React from "react";
import { AnimatePresence, motion } from 'framer-motion';

const PremiumTwitterModal = ({ 
  show, 
  onClose, 
  title,
  children,
  footer = null,
  width = "460px"
}) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'fixed', 
          inset: 0, 
          zIndex: 9999, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(2, 3, 10, 0.85), rgba(10, 12, 20, 0.95))',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
        onClick={onClose}
      >
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 12px rgba(123, 92, 246, 0.3); }
            50% { box-shadow: 0 0 20px rgba(123, 92, 246, 0.6); }
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 30,
            duration: 0.4 
          }}
          style={{
            width: '100%', 
            maxWidth: width, 
            borderRadius: 24, 
            padding: 0,
            background: 'linear-gradient(160deg, rgba(20, 25, 45, 0.95), rgba(15, 20, 40, 0.98))',
            border: '1px solid rgba(123, 92, 246, 0.3)',
            boxShadow: `
              0 0 80px rgba(123, 92, 246, 0.3),
              0 0 120px rgba(0, 212, 255, 0.2),
              inset 0 0 100px rgba(123, 92, 246, 0.05),
              0 20px 60px rgba(0, 0, 0, 0.4)
            `,
            position: 'relative', 
            overflow: 'hidden',
            animation: 'float 6s ease-in-out infinite',
          }}
        >
          {/* Decorative top gradient bar */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(123, 92, 246, 0.6), rgba(0, 212, 255, 0.6), transparent)',
              animation: 'pulse-glow 3s ease-in-out infinite',
            }}
          />
          
          {/* Inner glow effect */}
          <div 
            style={{
              position: 'absolute',
              inset: 1,
              borderRadius: 23,
              background: 'linear-gradient(160deg, rgba(30, 35, 65, 0.3), rgba(25, 30, 50, 0.2))',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
          
          <div style={{ position: 'relative', zIndex: 2, padding: '32px', paddingBottom: footer ? '24px' : '32px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}>
              <div>
                <motion.h2 
                  style={{
                    fontFamily: "'Archivo','Inter',sans-serif",
                    fontWeight: 700,
                    fontSize: '24px',
                    letterSpacing: '-0.02em',
                    color: 'rgba(255,255,255,0.98)',
                    margin: 0,
                    background: 'linear-gradient(135deg, rgba(220,215,255,0.95) 0%, rgba(180,200,255,0.85) 50%, rgba(160,220,255,0.9) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 20px rgba(200,215,255,0.3), 0 0 40px rgba(123,92,246,0.2)',
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {title}
                </motion.h2>
              </div>
              <motion.button
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: 'rgba(255, 92, 92, 0.15)',
                  borderColor: 'rgba(255, 92, 92, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
                ×
              </motion.button>
            </div>

            <motion.div 
              style={{ 
                marginTop: '8px', 
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>
            
            {footer && (
              <div style={{ 
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                {footer}
              </div>
            )}
            
            {/* Decorative bottom accent */}
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.4), rgba(123, 92, 246, 0.4), transparent)',
                animation: 'pulse-glow 4s ease-in-out infinite',
                animationDelay: '0.5s',
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PremiumTwitterModal;