import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';

const WalletModal = ({ isOpen, onClose }) => {
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const { connect, wallets, select } = useWallet();

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset'; // Reset scroll when closing
    };
  }, [isOpen, onClose]);

  const handleWalletConnect = async (walletName) => {
    setConnectionError('');
    setConnecting(true);

    try {
      // Find the wallet adapter
      const walletAdapter = wallets.find(wallet => wallet.name === walletName);
      if (walletAdapter) {
        // Select and connect to the wallet
        select(walletAdapter.name);
        setTimeout(async () => {
          try {
            await connect();
            onClose(); // Close modal after successful connection
          } catch (error) {
            console.error('Connection failed:', error);
            setConnectionError(error.message || 'Failed to connect wallet');
            setConnecting(false);
          }
        }, 500);
      } else {
        throw new Error('Wallet adapter not found');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setConnectionError(error.message || 'Failed to connect wallet');
      setConnecting(false);
    }
  };

  const walletOptions = [
    {
      name: 'Phantom',
      icon: 'P',
      description: 'Most popular Solana wallet'
    },
    {
      name: 'Solflare',
      icon: 'S',
      description: 'Web-based Solana wallet'
    },
    {
      name: 'Backpack',
      icon: 'B',
      description: 'Gaming-focused wallet'
    },
    {
      name: 'Trust',
      icon: 'T',
      description: 'Mobile crypto wallet'
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              background: 'linear-gradient(135deg, rgba(10, 5, 30, 0.95), rgba(5, 2, 20, 0.95))',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(123, 92, 246, 0.2)',
              borderRadius: '24px',
              padding: '2.5rem',
              maxWidth: '420px',
              width: '100%',
              position: 'relative',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(123,92,246,0.1), 0 0 60px rgba(123,92,246,0.05)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated background elements */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '24px',
              background: `
                radial-gradient(circle at 20% 30%, rgba(123, 92, 246, 0.1), transparent 60%),
                radial-gradient(circle at 80% 70%, rgba(0, 212, 255, 0.1), transparent 60%)
              `,
              pointerEvents: 'none',
              zIndex: 0,
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#f0f4ff',
                  fontFamily: "'Space Grotesk', 'Sora', sans-serif",
                  background: 'linear-gradient(135deg, #e0d8ff, #b0f0ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Connect Wallet
                </h2>
                <button
                  onClick={onClose}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    width: '36px',
                    height: '36px',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.target.style.color = '#9b7cf6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.color = 'rgba(255,255,255,0.7)';
                  }}
                >
                  ×
                </button>
              </div>

              {/* Wallet Options */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
                {walletOptions.map((wallet) => (
                  <motion.div
                    key={wallet.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(15, 8, 35, 0.6), rgba(8, 4, 25, 0.8))',
                      border: '1px solid rgba(123, 92, 246, 0.1)',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onClick={() => handleWalletConnect(wallet.name)}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #7b5cf6, #00d4ff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        color: 'white',
                        fontWeight: 'bold',
                      }}>
                        {wallet.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          color: '#f0f4ff',
                          fontFamily: "'Space Grotesk', 'Sora', sans-serif",
                        }}>
                          {wallet.name}
                        </div>
                        <div style={{
                          fontSize: '0.9rem',
                          color: 'rgba(255,255,255,0.6)',
                          fontFamily: "'Sora', 'Inter', sans-serif",
                        }}>
                          {wallet.description}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Connection Error Message */}
              {connectionError && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: 'rgba(255, 71, 87, 0.1)',
                  border: '1px solid rgba(255, 71, 87, 0.2)',
                  borderRadius: '10px',
                  color: '#ff4757',
                  fontSize: '0.9rem',
                  fontFamily: "'Sora', 'Inter', sans-serif",
                }}>
                  {connectionError}
                </div>
              )}

              {/* Connect Button - Hidden since we connect directly from wallet options */}
              <div style={{ height: '1rem' }} /> {/* Spacer for consistent layout */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletModal;