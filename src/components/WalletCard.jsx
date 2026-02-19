import React, { useEffect, useMemo, useState, memo } from "react";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";

// Import CSS for the wallet adapter UI
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletCard = memo(function WalletCard() {
  const navigate = useNavigate();
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

  // Kick off selection; actual connect happens in an effect once wallet selection is applied.
  const connectToWallet = async (walletType) => {
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

  // Function to redirect to wallet extension
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
        extensionUrl = 'https://phantom.app/download'; // default to phantom
    }

    // Open extension page in a new tab
    window.open(extensionUrl, '_blank');
    setShowWalletModal(false);
  };

  // Function to disconnect from current wallet
  const disconnectFromWallet = async () => {
    try {
      setIsDisconnecting(true);
      await disconnect();
    } catch (err) {
      console.error("Wallet disconnection error:", err);
    } finally {
      // Clear UI state after a short delay to allow for animation
      setTimeout(() => {
        setBalance(null);
        setIsDisconnecting(false);
      }, 300);
    }
  };

  // Function to open wallet selection modal
  const openWalletModal = () => {
    setConnectError('');
    setShowWalletModal(true);
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
        setBalance((lamports / LAMPORTS_PER_SOL).toFixed(6));
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


  // Function to trigger wallet connection
  const handleConnect = async () => {
    openWalletModal();
  };

  // Render wallet selection modal
  const renderWalletModal = () => {
    if (!showWalletModal) return null;

    const phantomAvailable = walletMeta.phantomAvailable;
    const solflareAvailable = walletMeta.solflareAvailable;

    const SolanaLogo = () => (
      <svg width="32" height="32" viewBox="0 0 397.7 311.7" style={{ display: 'block', opacity: 0.5 }}>
        <defs>
          <linearGradient id="solGradientModal" x1="360.8791" y1="351.4553" x2="141.213" y2="-69.2936" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#00FFA3"/>
            <stop offset="1" stopColor="#DC1FFF"/>
          </linearGradient>
        </defs>
        <path fill="url(#solGradientModal)" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
        <path fill="url(#solGradientModal)" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
        <path fill="url(#solGradientModal)" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
      </svg>
    );

    return (
      <AnimatePresence>
        {showWalletModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              background: 'rgba(8, 8, 14, 0.95)',
              backdropFilter: 'blur(30px)',
            }}
            onClick={() => setShowWalletModal(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                width: '100%',
                maxWidth: '340px',
                background: 'linear-gradient(180deg, rgba(18, 18, 28, 0.98), rgba(12, 12, 20, 0.99))',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.7)',
              }}
            >
              <div style={{ padding: '1.75rem' }}>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '2rem',
                }}>
                  <SolanaLogo />
                  <h2 style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.5)',
                    margin: '1rem 0 0',
                    letterSpacing: '0.05em',
                    textTransform: 'lowercase',
                  }}>
                    connect wallet
                  </h2>
                </div>

                {/* Wallet Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { name: 'Phantom', available: phantomAvailable, icon: walletMeta.phantom?.adapter?.icon },
                    { name: 'Solflare', available: solflareAvailable, icon: walletMeta.solflare?.adapter?.icon },
                  ].map((w) => (
                    <motion.button
                      key={w.name}
                      onClick={() => w.available ? connectToWallet(w.name.toLowerCase()) : redirectToWalletExtension(w.name.toLowerCase())}
                      disabled={connecting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}>
                        {w.icon ? (
                          <img src={w.icon} alt={w.name} style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                        ) : (
                          <span style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            color: 'rgba(255, 255, 255, 0.3)',
                          }}>
                            {w.name[0]}
                          </span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          color: 'rgba(255, 255, 255, 0.5)',
                          textTransform: 'lowercase',
                        }}>
                          {w.name}
                        </div>
                        <div style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.6rem',
                          color: 'rgba(255, 255, 255, 0.25)',
                          marginTop: '0.1rem',
                        }}>
                          {w.available ? 'installed' : 'install'}
                        </div>
                      </div>
                      <div style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: w.available ? 'rgba(130, 255, 180, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                      }} />
                    </motion.button>
                  ))}
                </div>

                {/* Error State */}
                {(connectError || (!phantomAvailable && !solflareAvailable)) && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(255, 80, 80, 0.03)',
                      border: '1px solid rgba(255, 80, 80, 0.08)',
                      borderRadius: '8px',
                    }}
                  >
                    <p style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.6rem',
                      color: 'rgba(255, 255, 255, 0.35)',
                      margin: 0,
                    }}>
                      {connectError || 'no wallet detected'}
                    </p>
                  </motion.div>
                )}

                {/* Connecting State */}
                {connecting && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                    }}
                  >
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: '1.5px solid rgba(255, 255, 255, 0.1)',
                      borderTopColor: 'rgba(255, 255, 255, 0.4)',
                      animation: 'spin 0.7s linear infinite',
                    }} />
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.65rem',
                      color: 'rgba(255, 255, 255, 0.35)',
                    }}>
                      connecting...
                    </span>
                  </motion.div>
                )}

                {/* Close button */}
                <motion.button
                  onClick={() => setShowWalletModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '24px',
                    height: '24px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.25)',
                    fontSize: '0.9rem',
                  }}
                >
                  ×
                </motion.button>
              </div>

              <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
              `}</style>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Connect once the selected wallet is actually applied.
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

        setTimeout(() => {
          navigate('/twitter-tracker', { replace: false });
        }, 350);
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
  }, [pendingWalletName, wallet?.adapter?.name, connected, connecting, connect, navigate]);

  return (
    <div className="wallet-card">
      <div className="card-top">
        <div className="brand-left">
          <div className="brand-dot" />
          <div className="brand-text">AI Degen Radar</div>
        </div>
        <div className="wallet-controls">
          {/* Show either connect button or a single action button */}
          {!connected ? (
            <button
              className="connect-btn"
              onClick={handleConnect}
              disabled={connecting}
              style={{
                background: 'linear-gradient(135deg, #7b5cf6, #00d4ff)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(123, 92, 246, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {connecting ? (
                'Connecting...'
              ) : (
                'Connect Wallet'
              )}
            </button>
          ) : (
            <button
              className="connect-btn"
              onClick={async () => {
                await disconnectFromWallet();
              }}
              style={{
                background: 'linear-gradient(135deg, #ff4757, #ff6b7a)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(255, 71, 87, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
            </button>
          )}
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.3); opacity: 0.7; }
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>

      <div className="card-body">
        {/* connected state relies solely on adapter */}
        {(!connected) ? (
          <div style={{
            opacity: isDisconnecting ? 0 : 1,
            transform: isDisconnecting ? 'translateY(10px)' : 'translateY(0)',
            transition: isDisconnecting ? 'all 0.3s ease' : 'opacity 0.3s ease, transform 0.3s ease'
          }}>
            <div className="info-muted">Connect a wallet to view SOL balance and live signals.</div>
            {/* Aesthetic preview visualization */}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px',
            }}>
              {/* Animated shimmer bars */}
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '12px', opacity: 0.3
              }}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: '12px',
                      background: 'linear-gradient(90deg, rgba(123,92,246,0.15) 0%, rgba(0,240,255,0.25) 50%, rgba(123,92,246,0.15) 100%)',
                      backgroundSize: '200% 100%', borderRadius: '6px',
                      animation: `shimmer-${i} 2.5s ease-in-out infinite`, animationDelay: `${i * 0.3}s`,
                      width: `${100 - i * 15}%`
                    }}
                  />
                ))}
              </div>
              {/* Pulsing icon */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '8px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(123,92,246,0.2), rgba(0,240,255,0.2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'pulse-ring 2s ease-in-out infinite', boxShadow: '0 0 0 0 rgba(123,92,246,0.4)'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(123,92,246,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
              </div>
            </div>
            <style>{`
              @keyframes shimmer-1 {0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
              @keyframes shimmer-2 {0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
              @keyframes shimmer-3 {0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
              @keyframes pulse-ring {0%{box-shadow:0 0 0 0 rgba(123,92,246,0.4);}50%{box-shadow:0 0 0 15px rgba(123,92,246,0);}100%{box-shadow:0 0 0 0 rgba(123,92,246,0);}}
            `}</style>
          </div>
        ) : (
          <div style={{
            animation: 'slideInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
            animationFillMode: 'forwards',
            opacity: isDisconnecting ? 0 : 1,
            transform: isDisconnecting ? 'translateY(10px)' : 'translateY(0)',
            transition: isDisconnecting ? 'all 0.3s ease' : 'none'
          }} className="wallet-connected-content">
            <style>{`
              @keyframes fadeIn {from{opacity:0;}to{opacity:1;}}
              @keyframes slideInUp {0%{opacity:0;transform:translateY(20px);}100%{opacity:1;transform:translateY(0);}}
              @keyframes balancePop {0%{opacity:0;transform:scale(0.9);}50%{transform:scale(1.05);}100%{opacity:1;transform:scale(1);}}
              @keyframes slideInButton {0%{opacity:0;transform:translateY(10px);}100%{opacity:1;transform:translateY(0);}}
              @keyframes walletOut {0%{opacity: 1;transform: translateY(0) scale(1);}100%{opacity:0;transform:translateY(55px) scale(0.92);}}
              @keyframes pulse {0%, 100%{opacity:0.85;transform: scale(1);}50%{opacity:1;transform: scale(1.03);}}
              @keyframes float {0%, 100%{transform: translateY(0px);} 50%{transform: translateY(-3px);}}
              @keyframes glow {0%, 100%{box-shadow: 0 0 8px rgba(123, 92, 246, 0.3);} 50%{box-shadow: 0 0 20px rgba(123, 92, 246, 0.6);}}
            `}</style>
            <div style={{
              padding: '20px',
              background: 'rgba(255,255,255,0.015)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>
              {/* SOL Balance - Aesthetic Display */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.3)',
                  letterSpacing: '0.08em',
                  textTransform: 'lowercase',
                }}>
                  balance
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {loading ? (
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.3)',
                      animation: 'pulse 1.2s ease-in-out infinite',
                    }}>
                      loading...
                    </span>
                  ) : balance != null ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 397.7 311.7" style={{ opacity: 0.4 }}>
                        <defs>
                          <linearGradient id="solGradientBalance" x1="360.8791" y1="351.4553" x2="141.213" y2="-69.2936" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#00FFA3"/>
                            <stop offset="1" stopColor="#DC1FFF"/>
                          </linearGradient>
                        </defs>
                        <path fill="url(#solGradientBalance)" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
                        <path fill="url(#solGradientBalance)" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
                        <path fill="url(#solGradientBalance)" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
                      </svg>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        color: 'rgba(255, 255, 255, 0.6)',
                        letterSpacing: '-0.02em',
                      }}>
                        {balance}
                      </span>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.7rem',
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.3)',
                        letterSpacing: '0.02em',
                      }}>
                        SOL
                      </span>
                    </div>
                  ) : (
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.3)',
                    }}>—</span>
                  )}
                </div>
              </div>
              
              {/* Address - Aesthetic Display */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.03)',
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.02em',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {publicKey ? `${publicKey.toBase58().slice(0, 8)}...${publicKey.toBase58().slice(-8)}` : '—'}
                </span>
                <button
                  onClick={() => {
                    if (publicKey) {
                      navigator.clipboard.writeText(publicKey.toBase58()).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      });
                    }
                  }}
                  title="Copy address"
                  style={{
                    background: copied ? 'rgba(130, 255, 180, 0.08)' : 'transparent',
                    border: '1px solid ' + (copied ? 'rgba(130, 255, 180, 0.2)' : 'rgba(255, 255, 255, 0.06)'),
                    color: copied ? 'rgba(130, 255, 180, 0.7)' : 'rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {copied ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
           </div>
         )}
       </div>

       {renderWalletModal()}
     </div>
   );
 });

export default WalletCard;