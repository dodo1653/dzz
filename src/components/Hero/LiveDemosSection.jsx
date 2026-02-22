import { useRef, useState, useEffect, memo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../../hooks/useReducedMotion';

const mockTweets = [
  { user: 'cented', name: 'cented', text: 'Just deployed $DOGE2 on pump.fun', time: '2s', signal: true },
  { user: 'saylor', name: 'Michael Saylor', text: 'Bitcoin is the future. $BTC', time: '45s', signal: false },
  { user: 'cobie', name: 'Cobie', text: 'This one looks promising $WIF2', time: '2m', signal: true },
];

const TypewriterText = memo(function TypewriterText({ text, speed = 20 }) {
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
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

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
            height: '0.85em',
            background: 'rgba(255, 255, 255, 0.5)',
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

const BrowserWindow = memo(function BrowserWindow({ title, url, children, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });
  const reducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ flex: 1, minWidth: '320px' }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        background: 'rgba(10, 10, 18, 0.95)',
        borderRadius: '12px',
        border: isHovered 
          ? '1px solid rgba(100, 140, 180, 0.25)' 
          : '1px solid rgba(255, 255, 255, 0.04)',
        boxShadow: isHovered 
          ? '0 0 0 1px rgba(100, 140, 180, 0.1), 0 28px 56px -20px rgba(0, 0, 0, 0.65), 0 0 40px rgba(100, 140, 180, 0.08)'
          : '0 16px 40px -16px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(100, 140, 180, 0.04) 0%, transparent 50%, rgba(140, 100, 180, 0.03) 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <div style={{
          padding: '12px 16px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'relative',
          zIndex: 2,
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <motion.div 
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }}
            />
            <motion.div 
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              transition={{ delay: 0.02 }}
              style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}
            />
            <motion.div 
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              transition={{ delay: 0.04 }}
              style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28ca41' }}
            />
          </div>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            background: isHovered ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.04)',
            borderRadius: '6px',
            marginLeft: '8px',
            transition: 'background 0.3s ease',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6rem',
              color: isHovered ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.35)',
              transition: 'color 0.3s ease',
            }}>
              {url}
            </span>
          </div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.8)' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5rem', color: 'rgba(74, 222, 128, 0.7)' }}>
              LIVE
            </span>
          </motion.div>
        </div>
        <div style={{ padding: '16px', height: '220px', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </div>
    </motion.div>
  );
});

const TweetItem = memo(function TweetItem({ tweet, isNew }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '10px 12px',
        background: isNew ? 'rgba(74, 222, 128, 0.05)' : 'rgba(255, 255, 255, 0.02)',
        border: isNew ? '1px solid rgba(74, 222, 128, 0.15)' : '1px solid rgba(255, 255, 255, 0.04)',
        borderRadius: '10px',
        marginBottom: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(100,100,140,0.4), rgba(80,80,120,0.3))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)' }}>
            {tweet.user[0].toUpperCase()}
          </span>
        </div>
        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)' }}>
          {tweet.name}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.3)' }}>
          @{tweet.user}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: 'rgba(255, 255, 255, 0.25)', marginLeft: 'auto' }}>
          {tweet.time}
        </span>
      </div>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.55)', margin: 0, lineHeight: 1.4 }}>
        {tweet.text}
      </p>
      {tweet.signal && (
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.8)' }}
          />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: 'rgba(74, 222, 128, 0.7)' }}>
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
  
  const userQuestion = "explain cented's trading patterns";
  
  useEffect(() => {
    const runSequence = async () => {
      setPhase('idle');
      setUserText('');
      setShowAiResponse(false);
      setIsTyping(false);
      
      await new Promise(r => setTimeout(r, 600));
      setPhase('typing');
      
      for (let i = 0; i < userQuestion.length; i++) {
        await new Promise(r => setTimeout(r, 35 + Math.random() * 35));
        setUserText(userQuestion.slice(0, i + 1));
      }
      
      await new Promise(r => setTimeout(r, 400));
      setPhase('sent');
      await new Promise(r => setTimeout(r, 200));
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1200));
      setIsTyping(false);
      setShowAiResponse(true);
      setPhase('complete');
    };
    
    runSequence();
  }, []);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          alignSelf: 'flex-end',
          maxWidth: '80%',
          padding: '10px 14px',
          borderRadius: '12px 12px 4px 12px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.65)', margin: 0, lineHeight: 1.5 }}>
          {userText}
          {phase === 'typing' && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.4, repeat: Infinity }}
              style={{ display: 'inline-block', width: '2px', height: '0.85em', background: 'rgba(255, 255, 255, 0.5)', marginLeft: '1px' }}
            />
          )}
        </p>
      </motion.div>
      
      {isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            alignSelf: 'flex-start',
            display: 'flex',
            gap: '4px',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '8px',
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -2, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.12 }}
              style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.4)' }}
            />
          ))}
        </motion.div>
      )}
      
      {showAiResponse && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            alignSelf: 'flex-start',
            maxWidth: '88%',
            padding: '10px 14px',
            borderRadius: '12px 12px 12px 4px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0, lineHeight: 1.5 }}>
            <TypewriterText text={aiResponseText} speed={16} />
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
          await new Promise(r => setTimeout(r, 500));
        } else if (item.type === 'check') {
          setChecks(prev => [
            ...prev.filter(c => !c.scanning),
            { text: item.text, success: item.success, complete: true }
          ]);
          await new Promise(r => setTimeout(r, 400));
        } else if (item.type === 'result') {
          setShowResult(true);
        }
      }
    };
    
    runScan();
  }, []);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', height: '100%' }}>
      <AnimatePresence mode="popLayout">
        {checks.map((check, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              background: check.complete 
                ? (check.success ? 'rgba(74, 222, 128, 0.05)' : 'rgba(255, 180, 100, 0.05)')
                : 'rgba(255, 255, 255, 0.02)',
              borderRadius: '8px',
            }}
          >
            {check.scanning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ width: '10px', height: '10px', border: '1.5px solid rgba(255,255,255,0.15)', borderTopColor: 'rgba(255,255,255,0.5)', borderRadius: '50%' }}
              />
            ) : (
              <span style={{ color: check.success ? 'rgba(74, 222, 128, 0.75)' : 'rgba(255, 180, 100, 0.75)', fontSize: '0.6rem' }}>
                {check.success ? '✓' : '⚠'}
              </span>
            )}
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              {check.text}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {showResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            marginTop: 'auto',
            padding: '14px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1.6rem', fontWeight: 500, color: 'rgba(255, 180, 100, 0.85)' }}>78</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5rem', color: 'rgba(255, 255, 255, 0.35)', letterSpacing: '0.12em' }}>RISK SCORE</div>
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
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.3)',
            letterSpacing: '0.28em',
            marginBottom: '1rem',
          }}
        >
          LIVE DEMOS
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: 'clamp(1.6rem, 4vw, 2rem)',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.85)',
            letterSpacing: '-0.02em',
          }}
        >
          See it in <span style={{ color: 'rgba(160, 200, 255, 0.9)' }}>action</span>.
        </motion.h2>
      </motion.div>
      
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '1.25rem',
      }}>
        <BrowserWindow title="Twitter Tracker" url="dzz.io/tracker" index={0}>
          <AnimatePresence mode="popLayout">
            {tweets.map((tweet, i) => (
              <TweetItem key={tweet.id || i} tweet={tweet} isNew={i === 0 && tweet.id} />
            ))}
          </AnimatePresence>
        </BrowserWindow>
        <BrowserWindow title="Context Engine" url="dzz.io/engine" index={1}>
          <AIChatDemo />
        </BrowserWindow>
        <BrowserWindow title="Risk Scanner" url="dzz.io/scanner" index={2}>
          <RiskScannerDemo />
        </BrowserWindow>
      </div>
    </section>
  );
});

export default LiveDemosSection;
