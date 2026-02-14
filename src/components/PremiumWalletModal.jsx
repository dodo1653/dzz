import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { WalletReadyState } from "@solana/wallet-adapter-base";

const PremiumWalletModal = ({ 
  show, 
  onClose, 
  wallets, 
  onSelectWallet, 
  connecting, 
  connectError,
  normalizeConnectError
}) => {
  const [pendingWalletName, setPendingWalletName] = useState(null);

  const walletMeta = {
    phantom: wallets.find(w => w.adapter.name === 'Phantom'),
    solflare: wallets.find(w => w.adapter.name === 'Solflare'),
    phantomAvailable: wallets.some(w => 
      w.adapter.name === 'Phantom' && 
      (w.readyState === WalletReadyState.Installed || w.readyState === WalletReadyState.Loadable)
    ),
    solflareAvailable: wallets.some(w => 
      w.adapter.name === 'Solflare' && 
      (w.readyState === WalletReadyState.Installed || w.readyState === WalletReadyState.Loadable)
    ),
  };

  const connectToWallet = async (walletType) => {
    const adapterName = walletType === 'phantom' ? 'Phantom' : 'Solflare';
    const available = walletType === 'phantom' ? walletMeta.phantomAvailable : walletMeta.solflareAvailable;

    if (!available) {
      redirectToWalletExtension(walletType);
      return;
    }

    setPendingWalletName(adapterName);
    onSelectWallet(adapterName);
  };

  const redirectToWalletExtension = (walletType) => {
    let extensionUrl = '';

    switch (walletType) {
      case 'phantom':
        extensionUrl = 'https://phantom.app/download';
        break;
      case 'solflare':
        extensionUrl = 'https://solflare.com/download';
        break;
      default:
        extensionUrl = 'https://phantom.app/download';
    }

    window.open(extensionUrl, '_blank');
    onClose();
  };

  const WalletOption = ({
    id,
    title,
    subtitle,
    available,
    icon,
    onClick,
  }) => (
    <motion.button
      whileHover={{ 
        y: -2, 
        scale: 1.02,
        backgroundColor: available ? 'rgba(123, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.045)',
        borderColor: available ? 'rgba(123, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.16)'
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={connecting}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 20px',
        borderRadius: '16px',
        border: available ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(255,255,255,0.06)',
        background: available ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)',
        color: 'rgba(255,255,255,0.92)',
        cursor: connecting ? 'wait' : 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background effect */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(123, 92, 246, 0.05), transparent)',
          transform: 'translateX(-100%)',
          animation: 'shimmer 2s infinite',
        }}
      />
      
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(123, 92, 246, 0.15), rgba(0, 240, 255, 0.15))',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {icon ? (
          <img 
            src={icon} 
            alt={`${title} icon`} 
            style={{ 
              width: 32, 
              height: 32, 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 8px rgba(123, 92, 246, 0.3))'
            }} 
          />
        ) : (
          <span style={{ 
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '16px'
          }}>
            {title[0]}
          </span>
        )}
        
        {/* Glowing ring effect */}
        <div 
          style={{
            position: 'absolute',
            inset: -1,
            borderRadius: 15,
            background: available 
              ? 'linear-gradient(135deg, rgba(123, 92, 246, 0.3), rgba(0, 240, 255, 0.3))' 
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            filter: 'blur(2px)',
            zIndex: -1,
          }}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontFamily: "'Archivo', 'Sora', 'Inter', sans-serif",
            fontWeight: 600,
            fontSize: '16px',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            color: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "'Sora', 'Inter', sans-serif",
            fontSize: '13px',
            color: available ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.45)',
            marginTop: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: available ? 'rgba(0, 255, 136, 0.9)' : 'rgba(255, 255, 255, 0.18)',
          boxShadow: available ? '0 0 12px rgba(0, 255, 136, 0.4)' : 'none',
          position: 'relative',
          zIndex: 1,
        }}
      />
    </motion.button>
  );

  return (
    <AnimatePresence>
      {show && (
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
              maxWidth: 460, 
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
            
            <div style={{ position: 'relative', zIndex: 2, padding: '32px', paddingBottom: '24px' }}>
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
                    Connect Wallet
                  </motion.h2>
                  <motion.p 
                    style={{
                      marginTop: '4px',
                      fontFamily: "'Sora','Inter',sans-serif",
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.65)',
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    Select your preferred wallet to continue
                  </motion.p>
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
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px' 
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <WalletOption
                  id="phantom"
                  title="Phantom"
                  available={walletMeta.phantomAvailable}
                  icon={walletMeta.phantom?.adapter?.icon}
                  subtitle={walletMeta.phantomAvailable ? 'Installed' : 'Install Phantom'}
                  onClick={() => (walletMeta.phantomAvailable ? connectToWallet('phantom') : redirectToWalletExtension('phantom'))}
                />
                <WalletOption
                  id="solflare"
                  title="Solflare"
                  available={walletMeta.solflareAvailable}
                  icon={walletMeta.solflare?.adapter?.icon}
                  subtitle={walletMeta.solflareAvailable ? 'Installed' : 'Install Solflare'}
                  onClick={() => (walletMeta.solflareAvailable ? connectToWallet('solflare') : redirectToWalletExtension('solflare'))}
                />

                {(connectError || (!walletMeta.phantomAvailable && !walletMeta.solflareAvailable)) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: '12px',
                      padding: '14px 16px',
                      borderRadius: 14,
                      background: 'rgba(255,71,87,0.08)',
                      border: '1px solid rgba(255,71,87,0.18)',
                      color: 'rgba(255,255,255,0.82)',
                      fontFamily: "'Sora','Inter',sans-serif",
                      fontSize: '13px',
                      lineHeight: 1.5,
                    }}
                  >
                    {connectError || 'No supported wallet detected in this browser.'}
                  </motion.div>
                )}

                {connecting && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: '12px',
                      padding: '14px 16px',
                      borderRadius: 14,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(123, 92, 246, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: 'rgba(255,255,255,0.8)',
                      fontFamily: "'Sora','Inter',sans-serif",
                      fontSize: '13px',
                    }}
                  >
                    <div style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.20)',
                      borderTopColor: 'rgba(123, 92, 246, 0.8)',
                      animation: 'spin 700ms linear infinite',
                    }} />
                    Connecting to wallet...
                  </motion.div>
                )}
              </motion.div>
              
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
      )}
    </AnimatePresence>
  );
};

export default PremiumWalletModal;