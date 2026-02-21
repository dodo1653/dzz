import React, { useEffect, useMemo, useState, memo } from "react";
import { createPortal } from "react-dom";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { motion, AnimatePresence } from 'framer-motion';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";

import '@solana/wallet-adapter-react-ui/styles.css';

const WalletCard = memo(function WalletCard() {
  const { connection } = useConnection();
  const {
    publicKey,
    connected,
    connecting,
    connect,
    disconnect,
    select,
    wallets,
    wallet,
  } = useWallet();

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connectError, setConnectError] = useState('');
  const [pendingWalletName, setPendingWalletName] = useState(null);

  const walletMeta = useMemo(() => {
    const phantom = wallets.find(w => w.adapter.name === 'Phantom');
    const solflare = wallets.find(w => w.adapter.name === 'Solflare');

    const isReady = (w) =>
      w && (w.readyState === WalletReadyState.Installed || w.readyState === WalletReadyState.Loadable);

    return {
      phantom,
      solflare,
      phantomAvailable: isReady(phantom),
      solflareAvailable: isReady(solflare),
    };
  }, [wallets]);

  const normalizeConnectError = (err) => {
    const msg = String(err?.message || err || 'Unknown error');
    if (/walletnotready/i.test(msg) || /not ready/i.test(msg)) return 'Wallet not detected in this browser.';
    if (/user rejected/i.test(msg) || /rejected/i.test(msg)) return 'Connection cancelled.';
    if (/timeout/i.test(msg)) return 'Connection timed out. Try again.';
    return msg;
  };

  const connectToWallet = (walletType) => {
    setConnectError('');
    const adapterName = walletType === 'phantom' ? 'Phantom' : 'Solflare';
    const available = walletType === 'phantom' ? walletMeta.phantomAvailable : walletMeta.solflareAvailable;

    if (!available) {
      redirectToWalletExtension(walletType);
      return;
    }

    setPendingWalletName(adapterName);
    select(adapterName);
  };

  const redirectToWalletExtension = (walletType) => {
    const urls = {
      phantom: 'https://phantom.app/download',
      solflare: 'https://solflare.com/download',
    };
    window.open(urls[walletType] || urls.phantom, '_blank');
    setShowWalletModal(false);
  };

  const disconnectFromWallet = async () => {
    try {
      setIsDisconnecting(true);
      await disconnect();
    } catch (err) {
      console.error("Wallet disconnection error:", err);
    } finally {
      setTimeout(() => {
        setBalance(null);
        setIsDisconnecting(false);
      }, 300);
    }
  };

  useEffect(() => {
    let mounted = true;

    if (!publicKey || !connected) {
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      try {
        setLoading(true);
        const lamports = await connection.getBalance(publicKey);
        if (!mounted) return;
        setBalance((lamports / LAMPORTS_PER_SOL).toFixed(4));
      } catch (err) {
        console.error("Failed fetching balance:", err);
        if (mounted) setBalance(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBalance();
    const id = setInterval(fetchBalance, 15000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [publicKey, connected, connection]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!pendingWalletName) return;
      if (wallet?.adapter?.name !== pendingWalletName) return;
      if (connected || connecting) return;

      try {
        await connect();
        if (cancelled) return;
        setShowWalletModal(false);
        setPendingWalletName(null);
        setConnectError('');
      } catch (e) {
        if (cancelled) return;
        setConnectError(normalizeConnectError(e));
        setPendingWalletName(null);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [pendingWalletName, wallet?.adapter?.name, connected, connecting, connect]);

  const walletOptions = [
    { name: 'Phantom', key: 'phantom', available: walletMeta.phantomAvailable, icon: walletMeta.phantom?.adapter?.icon },
    { name: 'Solflare', key: 'solflare', available: walletMeta.solflareAvailable, icon: walletMeta.solflare?.adapter?.icon },
  ];

  const modalContent = (
    <AnimatePresence>
      {showWalletModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setShowWalletModal(false)}
          className="wallet-modal-overlay"
          style={{
            zIndex: 2147483647,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '3%',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <motion.div
            initial={{ x: '-100%', opacity: 0, rotateY: -15 }}
            animate={{ x: 0, opacity: 1, rotateY: 0 }}
            exit={{ x: '-100%', opacity: 0, rotateY: -15 }}
            transition={{ 
              type: 'spring', 
              stiffness: 220, 
              damping: 24,
              mass: 1
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '340px',
              background: 'rgba(10, 10, 16, 0.98)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 50px 100px -30px rgba(0, 0, 0, 0.9)',
              transformOrigin: 'left center',
            }}
          >
            <div style={{ padding: '28px 26px' }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '28px',
              }}>
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '6px',
                    marginBottom: '10px',
                  }}>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.5)',
                    }} />
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.5rem',
                      color: 'rgba(255, 255, 255, 0.4)',
                      letterSpacing: '0.15em',
                    }}>
                      SECURE
                    </span>
                  </div>
                  <h2 style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.92)',
                    letterSpacing: '-0.015em',
                    marginBottom: '4px',
                  }}>
                    Connect wallet
                  </h2>
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem',
                    color: 'rgba(255, 255, 255, 0.3)',
                    letterSpacing: '0.02em',
                  }}>
                    Select to continue
                  </p>
                </div>
                <motion.button
                  onClick={() => setShowWalletModal(false)}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '9px',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: '1rem',
                  }}
                >
                  ×
                </motion.button>
              </div>

              {/* Wallet options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {walletOptions.map((w, idx) => (
                  <motion.button
                    key={w.name}
                    onClick={() => w.available ? connectToWallet(w.key) : redirectToWalletExtension(w.key)}
                    disabled={connecting}
                    whileHover={{ 
                      scale: 1.01,
                      backgroundColor: 'rgba(255, 255, 255, 0.035)',
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -30, rotateX: -10 }}
                    animate={{ opacity: 1, x: 0, rotateX: 0 }}
                    transition={{ 
                      delay: 0.15 + idx * 0.1,
                      type: 'spring',
                      stiffness: 240,
                      damping: 20
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 16px',
                      background: 'rgba(255, 255, 255, 0.015)',
                      border: '1px solid rgba(255, 255, 255, 0.03)',
                      borderRadius: '14px',
                      cursor: connecting ? 'wait' : 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.025)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {w.icon ? (
                        <img src={w.icon} alt={w.name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.35)' }}>
                          {w.name[0]}
                        </span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontFamily: "'Archivo', sans-serif", 
                        fontSize: '0.9rem', 
                        fontWeight: 500, 
                        color: 'rgba(255, 255, 255, 0.85)',
                        letterSpacing: '-0.01em',
                      }}>
                        {w.name}
                      </div>
                      <div style={{ 
                        fontFamily: "'JetBrains Mono', monospace", 
                        fontSize: '0.58rem', 
                        color: w.available ? 'rgba(74, 222, 128, 0.7)' : 'rgba(255, 255, 255, 0.22)', 
                        marginTop: '2px',
                        letterSpacing: '0.03em',
                      }}>
                        {w.available ? 'Available' : 'Get extension'}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ x: 2 }}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="rgba(255, 255, 255, 0.12)" 
                        strokeWidth="2"
                      >
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </motion.div>
                  </motion.button>
                ))}
              </div>

              {connecting && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '10px', 
                    padding: '14px', 
                    marginTop: '14px',
                    background: 'rgba(255, 255, 255, 0.015)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.025)',
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: '14px',
                      height: '14px',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderTopColor: 'rgba(255, 255, 255, 0.6)',
                      borderRadius: '50%',
                    }}
                  />
                  <span style={{ 
                    fontFamily: "'Archivo', sans-serif", 
                    color: 'rgba(255, 255, 255, 0.55)', 
                    fontSize: '0.8rem',
                    letterSpacing: '-0.01em',
                  }}>
                    Connecting...
                  </span>
                </motion.div>
              )}

              {connectError && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ 
                    marginTop: '14px', 
                    padding: '12px 14px', 
                    background: 'rgba(239, 68, 68, 0.05)', 
                    borderRadius: '10px',
                    border: '1px solid rgba(239, 68, 68, 0.1)',
                  }}
                >
                  <span style={{ 
                    fontFamily: "'JetBrains Mono', monospace", 
                    fontSize: '0.62rem', 
                    color: 'rgba(255, 150, 150, 0.85)',
                    letterSpacing: '0.02em',
                  }}>
                    {connectError}
                  </span>
                </motion.div>
              )}

              <div style={{
                marginTop: '24px',
                textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.52rem',
                  color: 'rgba(255, 255, 255, 0.18)',
                  letterSpacing: '0.03em',
                }}>
                  By connecting, you agree to our terms
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '260px',
        background: 'linear-gradient(145deg, rgba(12, 12, 18, 0.95), rgba(8, 8, 14, 0.98))',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(20px)',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: connected ? 'rgba(74, 222, 128, 0.9)' : 'rgba(255, 255, 255, 0.3)',
              boxShadow: connected ? '0 0 12px rgba(74, 222, 128, 0.5)' : 'none',
            }} />
            <span style={{
              fontFamily: "'Archivo', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.04em',
            }}>
              {connected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
          
          {!connected ? (
            <motion.button
              onClick={() => setShowWalletModal(true)}
              disabled={connecting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#0a0a0f',
                border: 'none',
                borderRadius: '10px',
                padding: '11px 22px',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '0.02em',
              }}
            >
              {connecting ? 'Connecting...' : 'Connect'}
            </motion.button>
          ) : (
            <motion.button
              onClick={disconnectFromWallet}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '10px 18px',
                fontWeight: 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '0.02em',
              }}
            >
              {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
            </motion.button>
          )}
        </div>

        {!connected ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            opacity: isDisconnecting ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.35)',
              letterSpacing: '0.02em',
            }}>
              Connect wallet to continue
            </span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
          >
            {/* Balance Section */}
            <motion.div
              whileHover={{ scale: 1.01, borderColor: 'rgba(255, 255, 255, 0.08)' }}
              transition={{ duration: 0.2 }}
              style={{
                padding: '22px',
                background: 'rgba(255, 255, 255, 0.015)',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
              }}
            >
              {/* Shimmer effect on hover */}
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                whileHover={{ x: '200%', opacity: [0, 0.1, 0] }}
                transition={{ duration: 0.8 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '50%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
                  pointerEvents: 'none',
                }}
              />
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.55rem',
                color: 'rgba(255, 255, 255, 0.3)',
                letterSpacing: '0.2em',
                marginBottom: '14px',
              }}>
                PORTFOLIO
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                {loading ? (
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.35)',
                  }}>syncing...</span>
                ) : (
                  <>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontSize: '1.8rem',
                        fontWeight: 500,
                        color: 'rgba(255, 255, 255, 0.9)',
                        letterSpacing: '-0.025em',
                        display: 'inline-block',
                      }}
                    >
                      {balance || '0.0000'}
                    </motion.span>
                    <span style={{
                      fontFamily: "'Archivo', sans-serif",
                      fontSize: '0.85rem',
                      fontWeight: 400,
                      color: 'rgba(255, 255, 255, 0.4)',
                      letterSpacing: '-0.01em',
                    }}>
                      SOL
                    </span>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 15 }}
                      style={{
                        marginLeft: 'auto',
                        padding: '4px 10px',
                        background: 'rgba(74, 222, 128, 0.06)',
                        border: '1px solid rgba(74, 222, 128, 0.12)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <div style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: 'rgba(74, 222, 128, 0.8)',
                      }} />
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.5rem',
                        color: 'rgba(74, 222, 128, 0.7)',
                        letterSpacing: '0.08em',
                      }}>
                        LIVE
                      </span>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Address Section */}
            <motion.div
              whileHover={{ 
                scale: 1.005,
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
              }}
              transition={{ duration: 0.2 }}
              style={{
                padding: '14px 16px',
                background: 'rgba(255, 255, 255, 0.01)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'default',
              }}
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.05 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </motion.div>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.62rem',
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.4)',
                flex: 1,
                wordBreak: 'break-all',
                lineHeight: 1.5,
                letterSpacing: '0.02em',
              }}>
                {publicKey?.toBase58()}
              </span>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (publicKey) {
                    navigator.clipboard.writeText(publicKey.toBase58());
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                style={{
                  background: copied ? 'rgba(74, 222, 128, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  border: copied ? '1px solid rgba(74, 222, 128, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '7px',
                  padding: '7px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <motion.div
                  initial={false}
                  animate={{ scale: copied ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {copied ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(74, 222, 128, 0.8)" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                  )}
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {typeof document !== 'undefined' && createPortal(modalContent, document.body)}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .wallet-modal-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          transform: none !important;
          perspective: none !important;
          backface-visibility: visible !important;
          -webkit-backface-visibility: visible !important;
        }
      `}</style>
    </>
  );
});

export default WalletCard;
