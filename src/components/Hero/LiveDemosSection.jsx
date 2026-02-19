import { useRef, useState, useEffect, memo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../../hooks/useReducedMotion';

const mockTweets = [
  { 
    user: 'cented', 
    name: 'cented',
    text: 'Just deployed $DOGE2 on pump.fun', 
    time: '2s', 
    signal: true,
  },
  { 
    user: 'saylor', 
    name: 'Michael Saylor',
    text: 'Bitcoin is the future. $BTC', 
    time: '45s', 
    signal: false,
  },
  { 
    user: 'cobie', 
    name: 'Cobie',
    text: 'This one looks promising $WIF2', 
    time: '2m', 
    signal: true,
  },
];

const TypewriterText = memo(function TypewriterText({ text, speed = 25, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    let index = 0;
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        onComplete?.();
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <span>
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ 
            display: 'inline-block',
            width: '2px',
            height: '0.9em',
            background: 'rgba(255, 255, 255, 0.6)',
            marginLeft: '1px',
            verticalAlign: 'text-bottom',
          }}
        />
      )}
    </span>
  );
});

const aiResponseText = "Cented shows a sniper pattern: 73% win rate on new pairs, avg 4.2min holds, exits at 2-3x. Prefers sub-5% dev allocation tokens with high KOL correlation. Recently shifted from SOL to TRUMP meta plays.";

const riskAnalysisSequence = [
  { type: 'scan', text: 'Analyzing contract...' },
  { type: 'check', text: 'Liquidity locked', success: true },
  { type: 'check', text: 'Mint authority renounced', success: true },
  { type: 'check', text: 'Top holders: 2 whales (>5%)', success: false },
  { type: 'check', text: 'No bundle detected', success: true },
  { type: 'result', score: 78, warnings: 1 },
];

const InteractiveDemo = memo(function InteractiveDemo({
  title,
  subtitle,
  icon,
  children,
  index,
}) {
  const ref = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const isInView = useInView(ref, { amount: 0.3, once: false });
  const reducedMotion = useReducedMotion();

  const icons = {
    twitter: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    shield: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"/>
        <path d="M9 12l2 2 4-4" strokeWidth="2"/>
      </svg>
    ),
    brain: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
    ),
  };

  const handleMouseMove = (e) => {
    if (!ref.current || reducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) / 25;
    const rotateY = (e.clientX - centerX) / 25;
    setRotation({ x: -rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={reducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        flex: 1,
        minWidth: '300px',
        background: isHovered 
          ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
          : 'rgba(255, 255, 255, 0.02)',
        border: isHovered 
          ? '1px solid rgba(255,255,255,0.1)' 
          : '1px solid rgba(255, 255, 255, 0.04)',
        borderRadius: '20px',
        overflow: 'hidden',
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.15s ease-out, background 0.3s ease, border-color 0.3s ease',
        boxShadow: isHovered 
          ? '0 25px 50px -15px rgba(0,0,0,0.5)'
          : 'none',
      }}
    >
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255, 255, 255, 0.6)',
        }}>
          {icons[icon]}
        </div>
        <div>
          <h4 style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: '0.95rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
          }}>
            {title}
          </h4>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            color: 'rgba(255, 255, 255, 0.4)',
          }}>
            {subtitle}
          </span>
        </div>
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
        }}>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'rgba(74, 222, 128, 0.8)',
              boxShadow: '0 0 8px rgba(74, 222, 128, 0.5)',
            }}
          />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            color: 'rgba(74, 222, 128, 0.7)',
          }}>
            LIVE
          </span>
        </div>
      </div>
      <div style={{ 
        padding: '1rem 1.5rem', 
        height: '200px',
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </motion.div>
  );
});

const TweetItem = memo(function TweetItem({ tweet, isNew }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        padding: '0.6rem 0.8rem',
        background: isNew ? 'rgba(74, 222, 128, 0.08)' : 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${isNew ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.04)'}`,
        borderRadius: '10px',
        marginBottom: '0.4rem',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.3rem',
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(123,92,246,0.3), rgba(0,212,255,0.3))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.5rem',
          color: 'rgba(255,255,255,0.7)',
        }}>
          @{tweet.user[0].toUpperCase()}
        </div>
        <span style={{
          fontFamily: "'Archivo', sans-serif",
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.85)',
        }}>
          {tweet.name}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.6rem',
          color: 'rgba(255, 255, 255, 0.3)',
        }}>
          @{tweet.user}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.55rem',
          color: 'rgba(255, 255, 255, 0.25)',
          marginLeft: 'auto',
        }}>
          {tweet.time}
        </span>
      </div>
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.7rem',
        color: 'rgba(255, 255, 255, 0.6)',
        margin: 0,
        lineHeight: 1.4,
      }}>
        {tweet.text}
      </p>
      {tweet.signal && (
        <div style={{
          marginTop: '0.3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: 'rgba(74, 222, 128, 0.8)',
            }}
          />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            color: 'rgba(74, 222, 128, 0.7)',
          }}>
            SIGNAL DETECTED
          </span>
        </div>
      )}
    </motion.div>
  );
});

const AIChatDemo = memo(function AIChatDemo() {
  const [phase, setPhase] = useState('idle');
  const [userText, setUserText] = useState('');
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);
  
  const userQuestion = "explain to me cented's exact trading patterns";
  
  useEffect(() => {
    const runSequence = async () => {
      setPhase('idle');
      setUserText('');
      setShowAiResponse(false);
      setIsTyping(false);
      
      await new Promise(r => setTimeout(r, 800));
      
      setPhase('typing');
      
      for (let i = 0; i < userQuestion.length; i++) {
        await new Promise(r => setTimeout(r, 40 + Math.random() * 40));
        setUserText(userQuestion.slice(0, i + 1));
      }
      
      await new Promise(r => setTimeout(r, 500));
      setPhase('sent');
      
      await new Promise(r => setTimeout(r, 300));
      setIsTyping(true);
      
      await new Promise(r => setTimeout(r, 1500));
      setIsTyping(false);
      setShowAiResponse(true);
      
      setPhase('complete');
    };
    
    runSequence();
  }, []);
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.6rem',
        height: '100%',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          alignSelf: 'flex-end',
          maxWidth: '85%',
          padding: '0.55rem 0.8rem',
          borderRadius: '10px 10px 4px 10px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative',
        }}
      >
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.65rem',
          color: 'rgba(255, 255, 255, 0.7)',
          margin: 0,
          lineHeight: 1.5,
        }}>
          {userText}
          {phase === 'typing' && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.4, repeat: Infinity }}
              style={{ 
                display: 'inline-block',
                width: '2px',
                height: '0.9em',
                background: 'rgba(255, 255, 255, 0.6)',
                marginLeft: '1px',
              }}
            />
          )}
        </p>
        
        {phase === 'typing' && (
          <motion.div
            initial={false}
            animate={{ 
              x: [0, 1, -1, 0],
              y: [0, -1, 1, 0],
            }}
            transition={{ duration: 0.3, repeat: Infinity }}
            style={{
              position: 'absolute',
              right: '-8px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          >
            <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
              <path 
                d="M0 0v12l3-3h6l3 3V0" 
                fill="rgba(255,255,255,0.8)"
              />
            </svg>
          </motion.div>
        )}
      </motion.div>
      
      {isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            alignSelf: 'flex-start',
            display: 'flex',
            gap: '3px',
            padding: '0.4rem 0.6rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -2, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.5)',
              }}
            />
          ))}
        </motion.div>
      )}
      
      {showAiResponse && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            alignSelf: 'flex-start',
            maxWidth: '90%',
            padding: '0.55rem 0.8rem',
            borderRadius: '10px 10px 10px 4px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0,
            lineHeight: 1.5,
          }}>
            <TypewriterText text={aiResponseText} speed={18} />
          </p>
        </motion.div>
      )}
    </div>
  );
});

const RiskScannerDemo = memo(function RiskScannerDemo() {
  const [checks, setChecks] = useState([]);
  const [showResult, setShowResult] = useState(false);
  
  useEffect(() => {
    const runScan = async () => {
      setChecks([]);
      setShowResult(false);
      
      for (let i = 0; i < riskAnalysisSequence.length; i++) {
        const item = riskAnalysisSequence[i];
        
        if (item.type === 'scan') {
          setChecks([{ text: item.text, scanning: true }]);
          await new Promise(r => setTimeout(r, 600));
        } else if (item.type === 'check') {
          setChecks(prev => [
            ...prev.filter(c => !c.scanning),
            { text: item.text, success: item.success, complete: true }
          ]);
          await new Promise(r => setTimeout(r, 500));
        } else if (item.type === 'result') {
          setShowResult(true);
        }
      }
    };
    
    runScan();
  }, []);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', height: '100%' }}>
      <AnimatePresence mode="popLayout">
        {checks.map((check, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.5rem',
              background: check.complete 
                ? (check.success ? 'rgba(74, 222, 128, 0.06)' : 'rgba(255, 193, 7, 0.06)')
                : 'rgba(255, 255, 255, 0.02)',
              borderRadius: '6px',
            }}
          >
            {check.scanning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: '10px',
                  height: '10px',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  borderTopColor: 'rgba(255,255,255,0.6)',
                  borderRadius: '50%',
                }}
              />
            ) : (
              <span style={{
                color: check.success ? 'rgba(74, 222, 128, 0.8)' : 'rgba(255, 193, 7, 0.8)',
                fontSize: '0.6rem',
              }}>
                {check.success ? '✓' : '⚠'}
              </span>
            )}
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6rem',
              color: 'rgba(255, 255, 255, 0.5)',
            }}>
              {check.text}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {showResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            marginTop: 'auto',
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <div style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'rgba(255, 193, 7, 0.9)',
          }}>78</div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.1em',
          }}>RISK SCORE</div>
        </motion.div>
      )}
    </div>
  );
});

const LiveDemosSection = memo(function LiveDemosSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: false });
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [tweets, setTweets] = useState(mockTweets);

  useEffect(() => {
    if (reducedMotion) return;
    
    const tweetInterval = setInterval(() => {
      const randomTweet = mockTweets[Math.floor(Math.random() * mockTweets.length)];
      setTweets(prev => [{ ...randomTweet, id: Date.now() }, ...prev.slice(0, 2)]);
    }, 4000);
    return () => clearInterval(tweetInterval);
  }, [reducedMotion]);

  return (
    <section
      id="demos"
      ref={ref}
      style={{
        padding: isMobile ? '4rem 1.5rem' : '5rem 2rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
        }}
      >
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.2em',
          marginBottom: '1rem',
        }}>
          LIVE DATA FEEDS
        </p>
        <h2 style={{
          fontFamily: "'Archivo', sans-serif",
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.9)',
          letterSpacing: '-0.02em',
        }}>
          See it in action.
        </h2>
      </motion.div>
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '1.5rem',
      }}>
        <InteractiveDemo
          title="Twitter Tracker"
          subtitle="Real-time KOL signals"
          icon="twitter"
          index={0}
        >
          <AnimatePresence mode="popLayout">
            {tweets.map((tweet, i) => (
              <TweetItem key={tweet.id || i} tweet={tweet} isNew={i === 0 && tweet.id} />
            ))}
          </AnimatePresence>
        </InteractiveDemo>
        <InteractiveDemo
          title="Context Engine"
          subtitle="AI-powered analysis"
          icon="brain"
          index={1}
        >
          <AIChatDemo />
        </InteractiveDemo>
        <InteractiveDemo
          title="Risk Scanner"
          subtitle="Contract analysis"
          icon="shield"
          index={2}
        >
          <RiskScannerDemo />
        </InteractiveDemo>
      </div>
    </section>
  );
});

export default LiveDemosSection;