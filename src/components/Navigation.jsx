import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import CustomWalletModal from './CustomWalletModal';
import './Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { connected, disconnect, publicKey } = useWallet();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Twitter Tracker', path: '/twitter-tracker' },
    { name: 'Pump Monitor', path: '/pump-monitor' },
    { name: 'Token Deploy', path: '/token-deployment' },
    { name: 'Risk Scanner', path: '/ai-risk-scanner' },
    { name: 'Contact', path: '/contact' },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle navigation and scrolling
  const handleNavClick = (e, link) => {
    e.preventDefault();

    if (link.hash) {
      // If it's a hash link, navigate to the path and then scroll
      if (location.pathname !== link.path) {
        // Navigate to the page first
        navigate(link.path);

        // Wait for page to load and then scroll to element
        setTimeout(() => {
          const element = document.getElementById(link.hash);
          if (element) {
            const offsetTop = element.offsetTop - 100; // Subtract nav height for precision
            if (window.__lenis) {
              window.__lenis.scrollTo(offsetTop, {
                duration: 2.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
              });
            } else {
              window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
          }
        }, 150);
      } else {
        // Already on the correct page, just scroll
        const element = document.getElementById(link.hash);
        if (element) {
          const offsetTop = element.offsetTop - 100; // Subtract nav height for precision
          if (window.__lenis) {
            window.__lenis.scrollTo(offsetTop, {
              duration: 2.5,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          } else {
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }
        }
      }
    } else {
      // Regular navigation without hash
      navigate(link.path);

      // On regular navigation, ensure scroll is reset to top
      setTimeout(() => {
        if (window.__lenis) {
          window.__lenis.scrollTo(0, { duration: 1.5, immediate: true });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    }

    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="main-nav">
        <div className="nav-content-wrapper">

          {/* Desktop Navigation */}
          <div className="nav-desktop">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={(e) => handleNavClick(e, link)}
                className="nav-link-button"
              >
                {link.name}
                {/* Animated underline effect */}
                <div className="nav-link-underline" />
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div
            className="nav-mobile-button"
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="nav-mobile-button-style"
              aria-label="Toggle menu"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`nav-mobile-menu ${isMenuOpen ? 'is-open' : ''}`}
        >
          <div className="nav-mobile-menu-content">
            {navLinks.map((link, index) => (
              <button
                key={link.name}
                onClick={(e) => handleNavClick(e, link)}
                className="nav-mobile-menu-link"
                style={{
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? 'translateX(0)' : 'translateX(-10px)',
                  transitionDelay: `${index * 0.05}s`,
                }}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Crypto ticker panel */}
      <div className="crypto-ticker-panel">
        <div className="crypto-ticker-content">
          <div className="crypto-ticker-marquee">
            {[
              { name: 'SOL', price: '$142.38', change: '+2.4%', positive: true },
              { name: 'ETH', price: '$2,567.21', change: '+1.2%', positive: true },
              { name: 'BTC', price: '$68,432.15', change: '-0.3%', positive: false },
              { name: 'DOGE', price: '$0.1245', change: '+5.7%', positive: true },
              { name: 'SHIB', price: '$0.00000982', change: '+3.1%', positive: true },
              { name: 'BNB', price: '$587.42', change: '+0.8%', positive: true },
              { name: 'ADA', price: '$0.4831', change: '-1.2%', positive: false },
              { name: 'SOL', price: '$142.38', change: '+2.4%', positive: true },
              { name: 'ETH', price: '$2,567.21', change: '+1.2%', positive: true },
              { name: 'BTC', price: '$68,432.15', change: '-0.3%', positive: false },
              { name: 'SOL', price: '$142.38', change: '+2.4%', positive: true }, // Duplicate to ensure continuity
              { name: 'ETH', price: '$2,567.21', change: '+1.2%', positive: true }, // Duplicate to ensure continuity
              { name: 'BTC', price: '$68,432.15', change: '-0.3%', positive: false }, // Duplicate to ensure continuity
            ].map((crypto, index) => (
              <div
                key={index}
                className="crypto-ticker-item"
              >
                <span className="crypto-name">{crypto.name}</span>
                <span className="crypto-price">{crypto.price}</span>
                <span className={crypto.positive ? 'crypto-change-positive' : 'crypto-change-negative'}>{crypto.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wallet Connection Button */}
      <div className="wallet-connection-container">
        {connected ? (
          <div className="wallet-info">
            <div className="wallet-address">
              {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
            </div>
            <button
              onClick={disconnect}
              className="disconnect-button"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="connect-wallet-button"
          >
            Connect Wallet
          </button>
        )}
      </div>


      <CustomWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
};

export default Navigation;
