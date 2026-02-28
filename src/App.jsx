import React, { useState, useEffect, useRef } from "react";
import Lenis from '@studio-freight/lenis';
import Layout from "./components/Layout.jsx";
import WalletCard from "./components/WalletCard.jsx";
import TiltCard from "./components/TiltCard.jsx";
import HeroSection from "./components/Hero/HeroSection.jsx";
import LiveDemosSection from "./components/Hero/LiveDemosSection.jsx";
import Navigation from "./components/Navigation.jsx";
import CryptoTicker from "./components/CryptoTicker.jsx";
import TwitterTracker from "./components/TwitterTracker.jsx";
import ContactPage from "./components/ContactPage.jsx";
import ContextEnginePage from "./components/ContextEnginePage.jsx";
import { ScrollNavigationDots, PremiumFeatureSection } from "./components/ScrollNavigation.jsx";
import Footer from "./components/Footer.jsx";
import PricingSection from "./components/PricingSection.jsx";
import { Routes, Route, useLocation } from 'react-router-dom';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import '@solana/wallet-adapter-react-ui/styles.css';
import { motion } from 'framer-motion';

export default function App() {
  const [mounted, setMounted] = useState(false);
  const lenisRef = useRef(null);
  const location = useLocation();

  const endpoint = "https://mainnet.helius-rpc.com/?api-key=a01e8e12-31d7-4f8d-af9d-3cbe6bac3f11";

  const features = [
    {
      title: 'Twitter Tracker',
      description: 'Smart AI tracks unlimited influencers in real-time. Get instant alerts when they mention pump.fun coins.',
      gradient: 'linear-gradient(135deg, #9b7cf6 0%, #b794f6 100%)',
      accent: 'rgba(155,124,246,0.15)',
      icon: 'radar',
    },
    {
      title: 'AI Risk Scanner',
      description: 'Machine learning detects rugs and scams instantly. AI-powered risk scores analyze every pump.fun launch.',
      gradient: 'linear-gradient(135deg, #00d4ff 0%, #4de8ff 100%)',
      accent: 'rgba(0,212,255,0.15)',
      icon: 'shield',
    },
    {
      title: 'AI Alpha Feed',
      description: 'Neural networks filter pump.fun launches in real-time. AI predicts which coins will trend.',
      gradient: 'linear-gradient(135deg, #7dd3fc 0%, #a5e4ff 100%)',
      accent: 'rgba(125,211,255,0.15)',
      icon: 'pulse',
    },
    {
      title: 'Token Deployment',
      description: 'Launch your own token in 30 seconds. Auto-generate metadata and create liquidity pools.',
      gradient: 'linear-gradient(135deg, #9b7cf6 0%, #b794f6 100%)',
      accent: 'rgba(155,124,246,0.15)',
      icon: 'rocket',
    },
    {
      title: 'AI Chat Agent',
      description: 'Talk to your personal AI agent trained on pump.fun data. Ask anything about trenching.',
      gradient: 'linear-gradient(135deg, #00d4ff 0%, #4de8ff 100%)',
      accent: 'rgba(0,212,255,0.15)',
      icon: 'brain',
    },
    {
      title: 'Portfolio Analytics',
      description: 'Track your PNL, win rate, and trade history. Export detailed reports anytime.',
      gradient: 'linear-gradient(135deg, #7dd3fc 0%, #a5e4ff 100%)',
      accent: 'rgba(125,211,255,0.15)',
      icon: 'chart',
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    setMounted(true);

    const problematicKeys = ['walletName'];
    for (const key of problematicKeys) {
      try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
          JSON.parse(storedValue);
        }
      } catch (e) {
        console.warn(`Removing problematic localStorage entry for key: ${key}`);
        localStorage.removeItem(key);
      }
    }
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 1.2,
      wheelMultiplier: 0.6,
      infinite: false,
      lerp: 0.08,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelEventsTarget: undefined,
      autoResize: true
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    try { lenis.scrollTo(0, { duration: 0 }); } catch (e) { }

    const handleScroll = ({ scroll }) => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scroll / scrollHeight, 1);
    };

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    let observer;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const handleIntersections = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-scroll--visible');
        }
      });
    };

    observer = new IntersectionObserver(handleIntersections, observerOptions);

    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll('.fade-scroll');
      elements.forEach((el) => {
        el.classList.remove('fade-scroll--visible');
        observer.observe(el);
      });
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [mounted, location.pathname]);

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter()
  ];

  const scrollSections = [
    { id: 'hero', label: 'Home' },
    { id: 'demos', label: 'Live Demos' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <Navigation />
          <CryptoTicker />
          <Layout>
            <div
              style={{
                position: 'relative',
                minHeight: '100vh',
                backgroundColor: 'var(--bg-1)',
                color: 'white',
                overflowY: 'auto',
                overflowX: 'hidden',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'scale(1)' : 'scale(0.98)',
                transition: mounted ? 'none' : 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                paddingTop: '6rem',
              }}
            >
              <main style={{ position: 'relative', zIndex: 100, width: '100%' }}>
                <Routes>
                  <Route path="/" element={
                    <div className="animate-fadeInSlow">
                      <ScrollNavigationDots sections={scrollSections} />
                      
                      <div id="demos">
                        <LiveDemosSection />
                      </div>

                      <div id="hero">
                        <HeroSection
                          title="dzz"
                        >
                          <WalletCard />
                        </HeroSection>
                      </div>

                      <PremiumFeatureSection features={features} />

                      <PricingSection />
                    </div>
                  } />
                  <Route path="/twitter-tracker" element={
                    <div className="animate-fadeInSlow">
                      <TwitterTracker />
                    </div>
                  } />
                  <Route path="/context-engine" element={
                    <div className="animate-fadeInSlow">
                      <ContextEnginePage />
                    </div>
                  } />
                  <Route path="/contact" element={
                    <div className="animate-fadeInSlow">
                      <ContactPage />
                    </div>
                  } />
                </Routes>
                <Footer />
              </main>
            </div>
          </Layout>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
