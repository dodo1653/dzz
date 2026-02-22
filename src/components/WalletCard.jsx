import React, { useEffect, useMemo, useState, useRef, memo } from "react";
import { createPortal } from "react-dom";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
  const [hoverBorder, setHoverBorder] = useState(false);
  const cardRef = useRef(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 15 });

  const walletMeta = useMemo(() => {
    const phantom = wallets.find(w => w.adapter.name === 'Phantom');
    const solflare = wallets.find(w => w.adapter.name === 'Solflare');
    const isReady = (w) => w && (w.readyState === WalletReadyState.Installed || w.readyState === WalletReadyState.Loadable);
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

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoverBorder(false);
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
    return () => { mounted = false; clearInterval(id); };
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
    return () => { cancelled = true; };
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
          transition={{ duration: 0.3 }}
          onClick={() => setShowWalletModal(false)}
          className="wallet-modal-overlay"
          style={{
            zIndex: 2147483647,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            paddingLeft: '5%',
            paddingTop: '12vh',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -60, y: -20, scale: 0.92, filter: 'blur(12px)' }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -40, y: -10, scale: 0.94, filter: 'blur(8px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '390px',
              background: 'linear-gradient(170deg, rgba(14, 14, 22, 0.98) 0%, rgba(10, 10, 16, 0.99) 45%, rgba(6, 6, 14, 0.98) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '32px',
              overflow: 'hidden',
              boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.015) inset, 0 100px 200px -50px rgba(0, 0, 0, 0.95)',
              position: 'relative',
            }}
          >
            <div style={{ padding: '36px 32px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '36px' }}>
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '7px 14px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '10px',
                    marginBottom: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.025)',
                  }}>
                    <motion.div
                      animate={{ opacity: [0.4, 0.9, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.85)', boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)' }}
                    />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.52rem', color: 'rgba(255, 255, 255, 0.35)', letterSpacing: '0.2em', fontWeight: 500 }}>
                      SECURE CONNECTION
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1.5rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.95)', letterSpacing: '-0.025em', marginBottom: '8px' }}>
                    Connect wallet
                  </h2>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.32)', letterSpacing: '0.02em' }}>
                    Select your preferred wallet to continue
                  </p>
                </div>
                <motion.button
                  onClick={() => setShowWalletModal(false)}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.015)',
                    border: '1px solid rgba(255, 255, 255, 0.03)',
                    borderRadius: '14px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </motion.button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {walletOptions.map((w) => (
                  <motion.button
                    key={w.name}
                    onClick={() => w.available ? connectToWallet(w.key) : redirectToWalletExtension(w.key)}
                    disabled={connecting}
                    whileHover={{ scale: 1.012, backgroundColor: 'rgba(255, 255, 255, 0.03)', y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '18px',
                      padding: '18px 20px',
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: '1px solid rgba(255, 255, 255, 0.03)',
                      borderRadius: '22px',
                      cursor: connecting ? 'wait' : 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '1px solid rgba(255, 255, 255, 0.025)',
                    }}>
                      {w.icon ? (
                        <img src={w.icon} alt={w.name} style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1.2rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.25)' }}>
                          {w.name[0]}
                        </span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1.05rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '-0.015em', marginBottom: '4px' }}>
                        {w.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: w.available ? 'rgba(74, 222, 128, 0.75)' : 'rgba(255, 255, 255, 0.15)',
                          boxShadow: w.available ? '0 0 8px rgba(74, 222, 128, 0.4)' : 'none',
                        }} />
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: w.available ? 'rgba(74, 222, 128, 0.75)' : 'rgba(255, 255, 255, 0.28)', letterSpacing: '0.05em' }}>
                          {w.available ? 'Available' : 'Get extension'}
                        </span>
                      </div>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" strokeLinecap="round">
                      <path d="M9 6l6 6-6 6"/>
                    </svg>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {connecting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '14px',
                      padding: '18px',
                      marginTop: '18px',
                      background: 'rgba(255, 255, 255, 0.012)',
                      borderRadius: '18px',
                      border: '1px solid rgba(255, 255, 255, 0.02)',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                      style={{ width: '18px', height: '18px', border: '2px solid rgba(255, 255, 255, 0.06)', borderTopColor: 'rgba(255, 255, 255, 0.55)', borderRadius: '50%' }}
                    />
                    <span style={{ fontFamily: "'Archivo', sans-serif", color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.88rem' }}>
                      Establishing connection...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {connectError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      padding: '16px 18px',
                      marginTop: '18px',
                      background: 'rgba(239, 68, 68, 0.05)',
                      borderRadius: '16px',
                      border: '1px solid rgba(239, 68, 68, 0.1)',
                      overflow: 'hidden',
                    }}
                  >
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: 'rgba(255, 140, 140, 0.88)' }}>
                      {connectError}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.5rem',
                color: 'rgba(255, 255, 255, 0.18)',
                letterSpacing: '0.05em',
                marginTop: '32px',
                textAlign: 'center',
              }}>
                By connecting, you agree to our terms of service
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHoverBorder(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          position: 'relative',
          width: '100%',
          minHeight: '260px',
          background: 'linear-gradient(165deg, rgba(12, 12, 20, 0.94) 0%, rgba(8, 8, 16, 0.97) 50%, rgba(6, 6, 14, 0.95) 100%)',
          borderRadius: '22px',
          border: hoverBorder ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.045)',
          boxShadow: hoverBorder 
            ? '0 0 40px rgba(255, 255, 255, 0.03), 0 60px 120px -40px rgba(0, 0, 0, 0.75)'
            : '0 60px 120px -40px rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(50px)',
          WebkitBackdropFilter: 'blur(50px)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          transformStyle: 'preserve-3d',
          transformPerspective: 1200,
        }}
      >
        <motion.div
          animate={{ opacity: [0.015, 0.05, 0.015] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 28% 15%, rgba(100, 100, 160, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
            borderRadius: '22px',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <motion.div
              animate={connected ? { boxShadow: ['0 0 8px rgba(74, 222, 128, 0.35)', '0 0 18px rgba(74, 222, 128, 0.55)', '0 0 8px rgba(74, 222, 128, 0.35)'] } : {}}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: connected ? 'rgba(74, 222, 128, 0.9)' : 'rgba(255, 255, 255, 0.2)',
              }}
            />
            <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.72rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.4)', letterSpacing: '0.08em' }}>
              {connected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
          
          {!connected ? (
            <motion.button
              onClick={() => setShowWalletModal(true)}
              disabled={connecting}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#0a0a0f',
                border: 'none',
                borderRadius: '14px',
                padding: '12px 26px',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontFamily: "'Archivo', sans-serif",
                letterSpacing: '0.02em',
                boxShadow: '0 8px 30px -8px rgba(255, 255, 255, 0.25)',
              }}
            >
              {connecting ? 'Connecting...' : 'Connect'}
            </motion.button>
          ) : (
            <motion.button
              onClick={disconnectFromWallet}
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '14px',
                padding: '10px 20px',
                fontWeight: 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: "'Archivo', sans-serif",
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
            gap: '20px',
            opacity: isDisconnecting ? 0 : 1,
            transition: 'opacity 0.3s ease',
            position: 'relative',
          }}>
            <motion.div
              animate={{ boxShadow: ['0 0 0px rgba(255, 255, 255, 0)', '0 0 25px rgba(255, 255, 255, 0.025)', '0 0 0px rgba(255, 255, 255, 0)'] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <motion.div
                animate={{ y: [0, -2, 0, -2, 0], rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.08)' }}
              />
            </motion.div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.28)', letterSpacing: '0.02em' }}>
              Connect wallet to continue
            </span>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative' }}>
            <motion.div
              whileHover={{ scale: 1.008, borderColor: 'rgba(255, 255, 255, 0.05)' }}
              transition={{ duration: 0.25 }}
              style={{
                padding: '28px',
                background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.012) 0%, rgba(255, 255, 255, 0.005) 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.028)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
              }}
            >
              <motion.div
                animate={{ x: ['-100%', '350%'], opacity: [0, 0.04, 0.04, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '30%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.04), transparent)',
                  pointerEvents: 'none',
                }}
              />
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(74, 222, 128, 0.05) 100%)',
                      border: '1px solid rgba(74, 222, 128, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(74, 222, 128, 0.7)" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </motion.div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.48rem', color: 'rgba(255, 255, 255, 0.3)', letterSpacing: '0.3em', fontWeight: 500 }}>
                    PORTFOLIO VALUE
                  </span>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', background: 'rgba(74, 222, 128, 0.04)', border: '1px solid rgba(74, 222, 128, 0.1)', borderRadius: '20px' }}
                >
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.85)', boxShadow: '0 0 8px rgba(74, 222, 128, 0.5)' }}
                  />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.48rem', color: 'rgba(74, 222, 128, 0.75)', letterSpacing: '0.15em', fontWeight: 500 }}>
                    LIVE
                  </span>
                </motion.div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ width: '20px', height: '20px', border: '2px solid rgba(255, 255, 255, 0.05)', borderTopColor: 'rgba(255, 255, 255, 0.4)', borderRadius: '50%' }}
                    />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.35)' }}>syncing...</span>
                  </div>
                ) : (
                  <>
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ display: 'flex', alignItems: 'baseline' }}>
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        style={{ fontFamily: "'Archivo', sans-serif", fontSize: '2.4rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.92)', letterSpacing: '-0.04em' }}
                      >
                        {balance?.split('.')[0] || '0'}
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.4rem', fontWeight: 400, color: 'rgba(255, 255, 255, 0.35)', letterSpacing: '-0.02em' }}
                      >
                        .{balance?.split('.')[1] || '0000'}
                      </motion.span>
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1rem', fontWeight: 400, color: 'rgba(255, 255, 255, 0.28)', letterSpacing: '-0.01em', marginBottom: '4px' }}
                    >
                      SOL
                    </motion.span>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.005, borderColor: 'rgba(255, 255, 255, 0.04)' }}
              transition={{ duration: 0.25 }}
              style={{
                padding: '18px 22px',
                background: 'rgba(255, 255, 255, 0.006)',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.018)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.025) 0%, rgba(255, 255, 255, 0.01) 100%)', border: '1px solid rgba(255, 255, 255, 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </motion.div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.45rem', color: 'rgba(255, 255, 255, 0.25)', letterSpacing: '0.25em', marginBottom: '6px' }}>
                  WALLET ADDRESS
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', fontWeight: 400, color: 'rgba(255, 255, 255, 0.38)', display: 'block', wordBreak: 'break-all', lineHeight: 1.5, letterSpacing: '0.01em' }}>
                  {publicKey?.toBase58()}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.12, backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (publicKey) {
                    navigator.clipboard.writeText(publicKey.toBase58());
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                style={{
                  background: copied ? 'rgba(74, 222, 128, 0.05)' : 'rgba(255, 255, 255, 0.015)',
                  border: copied ? '1px solid rgba(74, 222, 128, 0.12)' : '1px solid rgba(255, 255, 255, 0.025)',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <motion.div initial={false} animate={{ scale: copied ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.3 }}>
                  {copied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(74, 222, 128, 0.75)" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.5">
                      <rect x="9" y="9" width="13" height="13" rx="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                  )}
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {typeof document !== 'undefined' && createPortal(modalContent, document.body)}

      <style>{`
        .wallet-modal-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
        }
      `}</style>
    </>
  );
});

export default WalletCard;
