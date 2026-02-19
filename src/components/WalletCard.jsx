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
    const premiumModal = import.meta.env.VITE_ENABLE_PREMIUM_WALLET_MODAL === 'true';

    const phantomAvailable = walletMeta.phantomAvailable;
    const solflareAvailable = walletMeta.solflareAvailable;

    const WalletOption = ({
      id,
      title,
      subtitle,
      available,
      icon,
      onClick,
    }) => (
      <button
        onClick={onClick}
        disabled={connecting}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '14px 14px',
          borderRadius: '14px',
          border: available ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(255,255,255,0.06)',
          background: available ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)',
          color: 'rgba(255,255,255,0.92)',
          cursor: connecting ? 'wait' : 'pointer',
          transition: 'transform .18s ease, background .18s ease, border-color .18s ease',
          textAlign: 'left',
        }}
        onMouseEnter={(e) => {
          if (connecting) return;
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.045)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.background = available ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)';
          e.currentTarget.style.borderColor = available ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)';
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon ? (
            <img src={icon} alt={`${title} icon`} style={{ width: 28, height: 28, objectFit: 'contain' }} />
          ) : (
            <span style={{ fontWeight: 700 }}>{title[0]}</span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Sora', 'Inter', sans-serif",
              fontWeight: 650,
              fontSize: 14.5,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: "'Sora', 'Inter', sans-serif",
              fontSize: 12.5,
              color: 'rgba(255,255,255,0.55)',
              marginTop: 4,
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
            width: 8,
            height: 8,
            borderRadius: 999,
            background: available ? 'rgba(0,255,136,0.9)' : 'rgba(255,255,255,0.18)',
            boxShadow: available ? '0 0 18px rgba(0,255,136,0.35)' : 'none',
          }}
        />
      </button>
    );

    if (premiumModal) {
      return (
        <AnimatePresence>
          {showWalletModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px',
                background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(18px)'
              }}
              onClick={() => setShowWalletModal(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                style={{
                  width: '100%', maxWidth: 440, borderRadius: 20, padding: 18,
                  background: 'linear-gradient(180deg, rgba(12,12,18,0.92), rgba(8,8,14,0.88))',
                  border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 80px rgba(0,0,0,0.65)', position: 'relative', overflow: 'hidden'
                }}
              >
                <div aria-hidden="true" style={{ position: 'absolute', inset: -2, background:
                  'radial-gradient(800px 260px at 20% -10%, rgba(123,92,246,0.28), transparent 60%), radial-gradient(600px 220px at 90% 10%, rgba(0,240,255,0.18), transparent 55%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  fontFamily: "'Archivo','Inter',sans-serif",
                  fontWeight: 650,
                  fontSize: 18,
                  letterSpacing: '-0.02em',
                  color: 'rgba(255,255,255,0.93)',
                }}>
                  Connect
                </div>
                <div style={{
                  marginTop: 4,
                  fontFamily: "'Sora','Inter',sans-serif",
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.55)',
                }}>
                  Choose a wallet. One click.
                </div>
              </div>
              <button
                onClick={() => setShowWalletModal(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <WalletOption
                id="phantom"
                title="Phantom"
                available={phantomAvailable}
                icon={walletMeta.phantom?.adapter?.icon}
                subtitle={phantomAvailable ? 'Installed' : 'Install Phantom'}
                onClick={() => (phantomAvailable ? connectToWallet('phantom') : redirectToWalletExtension('phantom'))}
              />
              <WalletOption
                id="solflare"
                title="Solflare"
                available={solflareAvailable}
                icon={walletMeta.solflare?.adapter?.icon}
                subtitle={solflareAvailable ? 'Installed' : 'Install Solflare'}
                onClick={() => (solflareAvailable ? connectToWallet('solflare') : redirectToWalletExtension('solflare'))}
              />

              {(connectError || (!phantomAvailable && !solflareAvailable)) && (
                <div
                  style={{
                    marginTop: 8,
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'rgba(255,71,87,0.08)',
                    border: '1px solid rgba(255,71,87,0.18)',
                    color: 'rgba(255,255,255,0.82)',
                    fontFamily: "'Sora','Inter',sans-serif",
                    fontSize: 12.8,
                    lineHeight: 1.4,
                  }}
                >
                  {connectError || 'No supported wallet detected in this browser.'}
                </div>
              )}

              {connecting && (
                <div
                  style={{
                    marginTop: 6,
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: "'Sora','Inter',sans-serif",
                    fontSize: 12.8,
                  }}
                >
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    border: '2px solid rgba(255,255,255,0.20)',
                    borderTopColor: 'rgba(255,255,255,0.85)',
                    animation: 'spin 700ms linear infinite',
                  }} />
                  Connecting…
                </div>
              )}
            </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      );
    }

    // Fallback to original non-motion modal if premium is disabled
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '18px',
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(18px)',
          animation: 'fadeIn 180ms ease-out',
        }}
        onClick={() => setShowWalletModal(false)}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes cardIn {
            from { opacity: 0; transform: translateY(16px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>

        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 420,
            borderRadius: 18,
            padding: 18,
            background: 'linear-gradient(180deg, rgba(12,12,18,0.92), rgba(8,8,14,0.88))',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.65)',
            animation: 'cardIn 220ms cubic-bezier(.2,.9,.2,1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: -2,
              background:
                'radial-gradient(800px 260px at 20% -10%, rgba(123,92,246,0.28), transparent 60%), radial-gradient(600px 220px at 90% 10%, rgba(0,240,255,0.18), transparent 55%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  fontFamily: "'Archivo','Inter',sans-serif",
                  fontWeight: 650,
                  fontSize: 18,
                  letterSpacing: '-0.02em',
                  color: 'rgba(255,255,255,0.93)',
                }}>
                  Connect
                </div>
                <div style={{
                  marginTop: 4,
                  fontFamily: "'Sora','Inter',sans-serif",
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.55)',
                }}>
                  Choose a wallet. One click.
                </div>
              </div>
              <button
                onClick={() => setShowWalletModal(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <WalletOption
                id="phantom"
                title="Phantom"
                available={phantomAvailable}
                icon={walletMeta.phantom?.adapter?.icon}
                subtitle={phantomAvailable ? 'Installed' : 'Install Phantom'}
                onClick={() => (phantomAvailable ? connectToWallet('phantom') : redirectToWalletExtension('phantom'))}
              />
              <WalletOption
                id="solflare"
                title="Solflare"
                available={solflareAvailable}
                icon={walletMeta.solflare?.adapter?.icon}
                subtitle={solflareAvailable ? 'Installed' : 'Install Solflare'}
                onClick={() => (solflareAvailable ? connectToWallet('solflare') : redirectToWalletExtension('solflare'))}
              />

              {(connectError || (!phantomAvailable && !solflareAvailable)) && (
                <div
                  style={{
                    marginTop: 8,
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'rgba(255,71,87,0.08)',
                    border: '1px solid rgba(255,71,87,0.18)',
                    color: 'rgba(255,255,255,0.82)',
                    fontFamily: "'Sora','Inter',sans-serif",
                    fontSize: 12.8,
                    lineHeight: 1.4,
                  }}
                >
                  {connectError || 'No supported wallet detected in this browser.'}
                </div>
              )}

              {connecting && (
                <div
                  style={{
                    marginTop: 6,
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: "'Sora','Inter',sans-serif",
                    fontSize: 12.8,
                  }}
                >
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    border: '2px solid rgba(255,255,255,0.20)',
                    borderTopColor: 'rgba(255,255,255,0.85)',
                    animation: 'spin 700ms linear infinite',
                  }} />
                  Connecting…
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(123, 92, 246, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(123, 92, 246, 0.4)';
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
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 71, 87, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(255, 71, 87, 0.4)';
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
              padding: '24px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div className="balance-label" style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.7)',
                }}>
                  SOL Balance
                </div>
                <div className="balance-value">
                  {loading ? (
                    <span style={{
                      opacity: 0.85,
                      animation: 'pulse 1.2s ease-in-out infinite',
                      fontFamily: "'Space Grotesk', 'Sora', sans-serif",
                      fontWeight: 800,
                      fontSize: '20px',
                      color: '#A9F5F9',
                      textShadow: '0 0 12px rgba(169, 245, 249, 0.7)'
                    }}>
                      Loading...
                    </span>
                  ) : (balance != null ? (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontFamily: "'Space Grotesk', 'Sora', sans-serif",
                      fontWeight: 700,
                      fontSize: '18px',
                      color: '#E3DFFF',
                      textShadow: '0 0 12px rgba(227, 223, 255, 0.5)'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 397.7 311.7" style={{ display: 'inline-block' }}>
                        <defs>
                          <linearGradient id="solGradient" x1="360.8791" y1="351.4553" x2="141.213" y2="-69.2936" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#00FFA3"/>
                            <stop offset="1" stopColor="#DC1FFF"/>
                          </linearGradient>
                        </defs>
                        <path fill="url(#solGradient)" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
                        <path fill="url(#solGradient)" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
                        <path fill="url(#solGradient)" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
                      </svg>
                      <span style={{
                        color: 'white',
                        textShadow: '0 0 20px rgba(255, 255, 255, 0.9)'
                      }}>
                        {balance}
                      </span>
                    </span>
                  ) : "—")}
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(10, 10, 20, 0.8))',
                borderRadius: '12px',
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
                fontSize: '13px',
                fontWeight: 400,
                letterSpacing: '0.1em',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 3px rgba(0, 240, 255, 0.15), 0 0 25px rgba(0, 240, 255, 0.08), 0 0 50px rgba(0, 240, 255, 0.03)',
              }}>
                {/* Terminal scanline effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.6), transparent)',
                  animation: 'terminalScanline 3s ease-in-out infinite',
                  zIndex: 1,
                }} />
                <span style={{
                  color: '#00f0ff',
                  textShadow: '0 0 8px rgba(0, 240, 255, 0.9), 0 0 16px rgba(0, 240, 255, 0.5), 0 0 24px rgba(0, 240, 255, 0.2)',
                  flex: 1,
                  fontFamily: 'inherit',
                  background: 'linear-gradient(90deg, #00f0ff 0%, #7dd3fc 50%, #00f0ff 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  wordBreak: 'break-all',
                  lineHeight: '1.6',
                  animation: 'terminalGlow 3s ease-in-out infinite, terminalShimmer 4s ease-in-out infinite',
                  position: 'relative',
                  zIndex: 2,
                  fontVariantLigatures: 'none',
                  fontFeatureSettings: '"liga" 0, "calt" 0',
                }}>
                  {publicKey ? publicKey.toBase58() : "—"}
                </span>
                <style>{`
                  @keyframes terminalScanline {
                    0% { transform: translateY(0); opacity: 0.3; }
                    50% { opacity: 1; }
                    100% { transform: translateY(100%); opacity: 0.3; }
                  }
                  @keyframes terminalShimmer {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                  }
                `}</style>
                <button
                  onClick={() => {
                    if (publicKey) {
                      navigator.clipboard.writeText(publicKey.toBase58()).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      });
                    }
                  }}
                  title="Copy address to clipboard"
                  style={{
                    background: copied ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: copied ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: copied ? '#00ff88' : 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '32px',
                    minHeight: '32px',
                  }}
                  onMouseEnter={(e) => {
                    if (!copied) {
                      e.target.style.background = 'rgba(0, 240, 255, 0.15)';
                      e.target.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                      e.target.style.color = '#00f0ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!copied) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                    }
                  }}
                  className="copy-btn"
                >
                  {copied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              </div>
              <style>{`
                @keyframes terminalGlow {
                  0%, 100% {
                    filter: brightness(1) drop-shadow(0 0 8px rgba(0, 240, 255, 0.6));
                  }
                  50% {
                    filter: brightness(1.2) drop-shadow(0 0 12px rgba(0, 240, 255, 0.9));
                  }
                }
              `}</style>
            </div>
           </div>
         )}
       </div>

       {/* Wallet selection modal */}
       {renderWalletModal()}
     </div>
   );
 });

export default WalletCard;