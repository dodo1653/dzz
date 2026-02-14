import React, { useState, useEffect, useRef } from "react";
import Lenis from '@studio-freight/lenis';
import Layout from "./components/Layout.jsx";
import WalletCard from "./components/WalletCard.jsx";
import TypingText from "./components/TypingText.jsx";
import OracleChat from "./components/OracleChat.jsx";
import Navigation from "./components/Navigation.jsx";
import TwitterTracker from "./components/TwitterTracker.jsx";
import ContactPage from "./components/ContactPage.jsx";
import EnhancedTwitterTracker from "./components/EnhancedTwitterTracker.jsx";
import PumpFunMonitor from "./components/PumpFunMonitor.jsx";
import TokenDeployment from "./components/TokenDeployment.jsx";
import AIRiskScanner from "./components/AIRiskScanner.jsx";
import PortfolioAnalytics from "./components/PortfolioAnalytics.jsx";
import SOLPaymentSystem from "./components/SOLPaymentSystem.jsx";
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ConnectionProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { clusterApiUrl } from '@solana/web3.js';
import { motion, AnimatePresence } from 'framer-motion';
import { VeranceAnimate, ParallaxBackground, VeranceFeatureCard, LiquidNavigationDots } from './components/VeranceStyleEnhancement.jsx';
import PremiumBackground from './components/PremiumBackground.jsx';
import TiltCard from './components/TiltCard.jsx';
import ScrollIndicator from './components/ScrollIndicator.jsx';
import MagneticButton from './components/MagneticButton.jsx';
import LiquidGlassNav from './components/LiquidGlassNav.jsx';
import FeaturesShowcase from './components/FeaturesShowcase.jsx';
import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css';

export default function App() {
  const [mounted, setMounted] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [animatedSections, setAnimatedSections] = useState(new Set());
  const lenisRef = useRef(null);

  // Use your Helius RPC URL
  const endpoint = `https://mainnet.helius-rpc.com/?api-key=${import.meta.env.VITE_HELIUS_KEY}`;

  useEffect(() => {
    // ensure page is at absolute top on full reload / mount
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For other browsers
    setMounted(true);

    // Trigger welcome animations on page load
    // Small delay to ensure DOM is ready
    const welcomeTimer = setTimeout(() => {
      document.body.classList.add('welcome-loaded');
    }, 50);

    // Clean up any problematic localStorage entries that might cause JSON parsing errors
    const problematicKeys = ['walletName']; // Common keys used by wallet adapters
    for (const key of problematicKeys) {
      try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
          // Try to parse the value to see if it's valid JSON
          JSON.parse(storedValue);
        }
      } catch (e) {
        // If parsing fails, remove the problematic entry
        console.warn(`Removing problematic localStorage entry for key: ${key}`);
        localStorage.removeItem(key);
      }
    }

    return () => {
      clearTimeout(welcomeTimer);
    };
  }, []);

  const location = useLocation();

  // Initialize Lenis smooth scroll with 120Hz bouncy feel optimized for performance
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8, // Faster for more responsive feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth natural easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: true, // Enable on touch devices too
      touchMultiplier: 1.2, // Optimized touch response
      wheelMultiplier: 0.6, // More responsive wheel
      infinite: false,
      lerp: 0.08, // Balanced for responsiveness and smoothness
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelEventsTarget: undefined,
      autoResize: true
    });

    lenisRef.current = lenis;

    // Store lenis instance globally so it can be accessed elsewhere
    window.__lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // jump to top immediately when Lenis initializes (prevents retained scroll)
    try { lenis.scrollTo(0, { duration: 0 }); } catch (e) {}

    // Track scroll progress with optimized performance
    const handleScroll = ({ scroll }) => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scroll / scrollHeight, 1);
      setScrollProgress(progress);
    };

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.destroy();
      delete window.__lenis;
    };
  }, []); // Keep empty dependency array to initialize only once

  // Handle route changes to reset scroll position and re-trigger welcome animations
  useEffect(() => {
    // Reset scroll to top when changing routes
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 0.1, immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    // Remove and re-add welcome-loaded class to re-trigger animations on route change
    document.body.classList.remove('welcome-loaded');
    
    // Force a re-render of the content to ensure it loads properly
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));

      // Also trigger a reflow to ensure content is properly rendered
      document.body.offsetHeight;

      // Re-trigger welcome animations
      document.body.classList.add('welcome-loaded');

      // Make sure all fade-scroll elements are visible after navigation
      const fadeElements = document.querySelectorAll('.fade-scroll');
      fadeElements.forEach(el => {
        el.classList.add('fade-scroll--visible');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });

      // Trigger reflow to ensure elements are rendered
      document.body.offsetHeight;
    }, 100);
  }, [location.pathname]);

  // Use a static background (remove scroll-driven brightening)
  const backgroundColor = 'var(--bg-1)';

  // Enhanced scroll-triggered animations with Verance-style motion
  useEffect(() => {
    let observer;

    const observerOptions = {
      threshold: 0.2, // Trigger when 20% of element is visible
      rootMargin: '0px 0px -100px 0px' // Trigger slightly before element reaches viewport center
    };

    const handleIntersections = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const sectionId = element.id;

          // Skip if already animated
          if (animatedSections.has(sectionId)) return;

          // Add to animated sections
          setAnimatedSections(prev => new Set([...prev, sectionId]));

          // For home section, ensure it's visible immediately
          if (sectionId === 'home') {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            return;
          }

          // Apply smooth animation with Verance-style easing
          element.style.transition = 'opacity 0.8s cubic-bezier(0.2, 0.0, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.0, 0.2, 1)';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';

          // For feature cards, add the animated class
          if (element.classList.contains('feature-card')) {
            element.classList.add('feature-animated');
          }

          // Disconnect observer for this element to prevent re-triggering
          observer.unobserve(element);
        }
      });
    };

    observer = new IntersectionObserver(handleIntersections, observerOptions);

    const observeElements = () => {
      setTimeout(() => {
        if (observer) {
          // Unobserve all previously observed elements
          const observedElements = Array.from(observer.entries()).map(entry => entry.target);
          observedElements.forEach(el => observer.unobserve(el));
        }

        // Observe all fade-scroll elements that haven't been animated yet
        const elements = document.querySelectorAll('.fade-scroll');
        elements.forEach(el => {
          const id = el.id;
          if (id && !animatedSections.has(id)) {
            observer.observe(el);
          }
        });

        // Also observe feature cards specifically
        const featureCards = document.querySelectorAll('.feature-card:not(.feature-animated)');
        featureCards.forEach(card => {
          observer.observe(card);
        });
      }, 100);
    };

    observeElements();
    setTimeout(observeElements, 300);

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [location.pathname, animatedSections]);

  // Ensure smooth reset to top on refresh without flickering
  useEffect(() => {
    // Prevent any scroll position restoration that might cause flickering
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Reset to top immediately on mount
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Additional reset for Lenis if it exists
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 0.1, immediate: true });
    }
  }, []);

  // Define wallets for Solana wallet adapter
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter()
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <PremiumBackground />
          <ScrollIndicator />
          <Navigation />
          <Layout>
            <div
              className={`page-transition ${mounted ? 'mounted' : ''}`}
              style={{
                position: 'relative',
                minHeight: '100vh',
                backgroundColor,
                color: 'white',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingTop: '108px' // Adjusted for nav (70px) + ticker (38px)
              }}
            >
              <main style={{ position: 'relative', zIndex: 100, width: '100%' }}>
                <Routes>
                  <Route path="/" element={
                    <div key="homepage">
                      {/* Hero Section */}
                      <section
                        id="home"
                        className="fade-scroll hero-section"
                      >
                        <div className="hero-content-wrapper">

                          {/* Header */}
                          <header className="hero-header">
                            <h1
                              className="font-extrabold tracking-tight fade-scroll hero-title"
                            >
                              AI Degen Radar
                            </h1>
                            <div className="hero-typing-text-container">
                              <TypingText text="AI-powered pump.fun tracking. Never miss a launch." speed={35} delay={300} />
                            </div>
                          </header>

                          {/* Wallet Card */}
                          <div className="hero-wallet-card-container">
                            <TiltCard intensity={6}>
                              <WalletCard />
                            </TiltCard>
                          </div>

                          {/* Tagline */}
                          <p className="hero-tagline">
                            The only tool you need in the trenches
                          </p>
                        </div>
                      </section>

                      {/* Features Showcase Section */}
                      <FeaturesShowcase />

                      {/* Pricing Section */}
                                            <section
                                              id="pricing"
                                              className="fade-scroll pricing-section"
                                            >
                        <div className="fade-scroll pricing-header">
                          <h2 className="pricing-title">
                            Simple Pricing
                          </h2>
                          <div className="pricing-description">
                            <TypingText text="Pay with SOL. Cancel anytime." speed={35} delay={400} />
                          </div>
                        </div>

                        <TiltCard intensity={8} className="fade-scroll pricing-card-container">
                        <div className="pricing-card">
                        {/* Popular badge */}
                        <div className="pricing-badge-container">
                          <div className="pricing-badge">
                            MOST POPULAR
                          </div>
                        </div>

                        <h3 className="pricing-card-title">
                          Pro Access
                        </h3>

                        <div className="pricing-card-price-container">
                          <div className="pricing-card-price">
                            0.1 <span className="pricing-card-price-unit">SOL</span>
                          </div>
                          <span className="pricing-card-period">
                            /mo
                          </span>
                        </div>

                        <ul className="pricing-card-features">
                          {[
                            'AI-powered KOL tracking',
                            'AI risk scanner & rug detection',
                            'Neural network alpha predictions',
                            'Real-time pump.fun feed',
                            'Personal AI chat agent',
                            'Discord alpha community',
                            'Priority AI model access'
                          ].map((item, idx) => (
                            <li key={idx} className="pricing-card-feature-item">
                              <span className="pricing-card-feature-checkmark">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>

                        <button className="pricing-card-button">
                          Coming Soon
                        </button>

                        <p className="pricing-card-beta-message">
                          Beta launching soon. Join Discord for early access.
                        </p>
                      </div>
                      </TiltCard>
                    </section>

                    {/* Footer */}
                    <footer className="fade-scroll app-footer">
                      <p className="app-footer-tagline">
                        Built for degens, by degens
                      </p>
                      <p className="app-footer-copyright">
                        © 2025 AI Degen Radar. All rights reserved.
                      </p>
                    </footer>
                  </div>
                } />
                <Route path="/twitter-tracker" element={
                  <div className="fade-scroll">
                    <TwitterTracker />
                  </div>
                } />
                <Route path="/enhanced-twitter-tracker" element={
                  <div className="fade-scroll">
                    <EnhancedTwitterTracker />
                  </div>
                } />
                <Route path="/pump-monitor" element={
                  <div className="fade-scroll">
                    <PumpFunMonitor />
                  </div>
                } />
                <Route path="/token-deployment" element={
                  <div className="fade-scroll">
                    <TokenDeployment />
                  </div>
                } />
                <Route path="/ai-risk-scanner" element={
                  <div className="fade-scroll">
                    <AIRiskScanner />
                  </div>
                } />
                <Route path="/portfolio-analytics" element={
                  <div className="fade-scroll">
                    <PortfolioAnalytics />
                  </div>
                } />
                <Route path="/subscribe" element={
                  <div className="fade-scroll">
                    <SOLPaymentSystem />
                  </div>
                } />
                <Route path="/contact" element={
                  <div className="fade-scroll">
                    <ContactPage />
                  </div>
                } />
              </Routes>

              <OracleChat />
            </main>

            {/* Liquid Glass Navigation - Only visible on homepage */}
            {location.pathname === '/' && <LiquidGlassNav />}
          </div>
        </Layout>
      </WalletModalProvider>
    </SolanaWalletProvider>
  </ConnectionProvider>
  );
}