import React, { useEffect, useState, memo } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { AnimatePresence, motion } from 'framer-motion';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import CustomWalletModal from './CustomWalletModal';
import './WalletCard.css';

const WalletCard = memo(function WalletCard() {
  const { connection } = useConnection();
  const {
    publicKey,
    connected,
    connecting,
    connect,
    disconnect,
    wallet,
  } = useWallet();

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch balance when connected
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
        setBalance((lamports / LAMPORTS_PER_SOL).toFixed(3));
      } catch (err) {
        console.error("Failed fetching balance:", err);
        if (mounted) setBalance(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBalance();

    // Set up polling for balance updates
    const id = setInterval(fetchBalance, 10000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [publicKey, connected, connection]);

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

  return (
    <div className="wallet-card">
      <div className="card-top">
        <div className="brand-left">
          <div className="brand-dot" />
          <div className="brand-text">AI Degen Radar</div>
        </div>
        <div className="wallet-controls">
          {!connected ? (
            <button
              className="connect-btn"
              onClick={() => setIsWalletModalOpen(true)}
              disabled={connecting}
            >
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <button
              className="connect-btn disconnect-btn-style"
              onClick={disconnectFromWallet}
              style={{
                background: 'linear-gradient(135deg, #ff4757, #ff6b7a)',
              }}
            >
              {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
            </button>
          )}
        </div>
      </div>

      <div className="card-body">
        {!connected ? (
          <div className="unauthorized-content">
            <div className="info-muted">Connect a wallet to view SOL balance and live signals.</div>
            {/* Aesthetic preview elements */}
            <div className="aesthetic-preview">
              <div className="shimmer-bar bar-1" />
              <div className="shimmer-bar bar-2" />
              <div className="shimmer-bar bar-3" />
              <div className="pulse-icon-container">
                <div className="pulse-ring-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="authorized-content">
            <div className="balance-row-container">
              <div className="balance-label">SOL Balance</div>
              <div className="balance-value-container">
                {loading && !balance ? (
                  <span className="loading-pulse">Loading...</span>
                ) : (
                  <span className="balance-display">
                    <svg width="20" height="20" viewBox="0 0 397.7 311.7" className="sol-icon-svg">
                      <path fill="currentColor" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
                    </svg>
                    {balance || '0.000'}
                  </span>
                )}
              </div>
            </div>

            <div className="address-display-terminal">
              <span className="address-text-mono">
                {publicKey.toBase58().slice(0, 10)}...{publicKey.toBase58().slice(-10)}
              </span>
              <button
                className="copy-button-terminal"
                onClick={() => {
                  navigator.clipboard.writeText(publicKey.toBase58());
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? 'COPIED' : 'COPY'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Decorative background grid effect */}
      <div className="card-bg-grid" />

      {/* Wallet Modal */}
      <CustomWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />

      <style jsx>{`
        .wallet-card {
          position: relative;
          overflow: hidden;
        }

        .aesthetic-preview {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          align-items: center;
        }

        .shimmer-bar {
          height: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 5px;
          position: relative;
          overflow: hidden;
        }

        .bar-1 { width: 80%; }
        .bar-2 { width: 60%; }
        .bar-3 { width: 70%; }

        .shimmer-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          100% { left: 100%; }
        }

        .pulse-icon-container {
          margin-top: 1rem;
          display: flex;
          justify-content: center;
        }

        .pulse-ring-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(123, 92, 246, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(123, 92, 246, 0.5);
          position: relative;
        }

        .pulse-ring-icon::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid rgba(123, 92, 246, 0.2);
          animation: pulse-out 2s infinite;
        }

        @keyframes pulse-out {
          100% { transform: scale(1.8); opacity: 0; }
        }

        .authorized-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .balance-row-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 1.5rem;
          background: rgba(123, 92, 246, 0.08);
          border: 1px solid rgba(123, 92, 246, 0.15);
          border-radius: 16px;
        }

        .balance-label {
          font-family: 'Sora', sans-serif;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .balance-display {
          font-family: 'Archivo', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .sol-icon-svg {
          color: #00ffa3;
          filter: drop-shadow(0 0 8px rgba(0, 255, 163, 0.4));
        }

        .address-display-terminal {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.2rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .address-text-mono {
          font-family: 'Space Grotesk', monospace;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.02em;
        }

        .copy-button-terminal {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: rgba(255, 255, 255, 0.7);
          padding: 0.3rem 0.8rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .copy-button-terminal:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .card-bg-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(123, 92, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(123, 92, 246, 0.03) 1px, transparent 1px);
          background-size: 30px 30px;
          z-index: -1;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
});

export default WalletCard;
