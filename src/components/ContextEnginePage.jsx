import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../hooks/useReducedMotion';

const TypewriterText = memo(function TypewriterText({ text, speed = 20, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setDisplayedText(text);
      setIsComplete(true);
      onComplete?.();
      return;
    }

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
  }, [text, speed, reducedMotion, onComplete]);

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
            height: '1em',
            background: 'rgba(255, 255, 255, 0.6)',
            marginLeft: '2px',
            verticalAlign: 'text-bottom',
          }}
        />
      )}
    </span>
  );
});

const ContextEnginePage = memo(function ContextEnginePage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'I am dzz. Ask me about any token, wallet, or on-chain activity.',
      timestamp: Date.now(),
      isTyping: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState(null);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleMouseMove = (e) => {
    if (!containerRef.current || reducedMotion || isMobile) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) / 30;
    const rotateY = (e.clientX - centerX) / 30;
    setRotation({ x: -rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage.content }],
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || data.response || data.message || 'I apologize, but I could not process that request.',
        timestamp: Date.now(),
        isTyping: true,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setTypingMessageId(assistantMessage.id);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
    });
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const messageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { 
      opacity: 0, 
      y: -8,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '6rem 1rem 2rem' : '8rem 2rem 2rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem',
          color: 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.2em',
          marginBottom: '0.75rem',
        }}>
          CONVERSATIONAL INTELLIGENCE
        </p>
        <h1 style={{
          fontFamily: "'Archivo', sans-serif",
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.9)',
          letterSpacing: '-0.02em',
        }}>
          Context Engine
        </h1>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.4)',
          marginTop: '0.5rem',
        }}>
          Ask anything. Get intelligence.
        </p>
      </motion.div>

      <motion.div
        ref={containerRef}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100%',
          maxWidth: '600px',
          background: 'rgba(8, 8, 14, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '22px',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          overflow: 'hidden',
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.15s ease-out',
          boxShadow: `
            0 0 0 1px rgba(255, 255, 255, 0.02) inset,
            0 40px 100px -20px rgba(0, 0, 0, 0.7),
            0 0 80px -40px rgba(123, 92, 246, 0.15)
          `,
        }}
      >
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.5)',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
            }} />
            <div>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.6)',
                letterSpacing: '0.02em',
                display: 'block',
              }}>
                dzz
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                color: 'rgba(255, 255, 255, 0.35)',
                letterSpacing: '0.02em',
                display: 'block',
                marginTop: '0.15rem',
              }}>
                Context Engine
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <motion.span
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem',
                color: 'rgba(74, 222, 128, 0.7)',
                letterSpacing: '0.05em',
              }}
            >
              ONLINE
            </motion.span>
          </div>
        </div>

        <div
          className="chat-messages-scroll"
          style={{
            height: isMobile ? '340px' : '400px',
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            scrollBehavior: 'smooth',
          }}
        >
          <style>{`
            .chat-messages-scroll::-webkit-scrollbar {
              width: 4px;
            }
            .chat-messages-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .chat-messages-scroll::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 4px;
            }
            .chat-messages-scroll::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.2);
            }
          `}</style>
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                  width: '100%',
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '0.9rem 1.15rem',
                  borderRadius: message.role === 'user' 
                    ? '14px 14px 4px 14px' 
                    : '14px 14px 14px 4px',
                  background: message.role === 'user'
                    ? 'rgba(255, 255, 255, 0.04)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  position: 'relative',
                }}>
                  {message.role === 'assistant' && (
                    <div style={{
                      position: 'absolute',
                      left: '-0.5rem',
                      top: '0.75rem',
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.4)',
                    }} />
                  )}
                  <p style={{
                    margin: 0,
                    fontFamily: message.role === 'assistant' 
                      ? "'JetBrains Mono', monospace" 
                      : "'Sora', 'Space Grotesk', sans-serif",
                    fontSize: message.role === 'assistant' ? '0.88rem' : '0.95rem',
                    fontWeight: 400,
                    color: message.role === 'assistant' 
                      ? 'rgba(255, 255, 255, 0.85)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.6,
                    letterSpacing: '-0.01em',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {message.role === 'assistant' && message.isTyping && message.id === typingMessageId ? (
                      <TypewriterText 
                        text={message.content} 
                        speed={15}
                        onComplete={() => {
                          setMessages(prev => prev.map(m => 
                            m.id === message.id ? { ...m, isTyping: false } : m
                          ));
                          setTypingMessageId(null);
                        }}
                      />
                    ) : (
                      message.content
                    )}
                  </p>
                  <span style={{
                    display: 'block',
                    marginTop: '0.5rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.6rem',
                    color: 'rgba(255, 255, 255, 0.2)',
                    letterSpacing: '0.02em',
                  }}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.6rem 0.9rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                alignSelf: 'flex-start',
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -2, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
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
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.03)',
            display: 'flex',
            gap: '0.75rem',
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask about any token or wallet..."
              disabled={isTyping}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isFocused ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)'}`,
                borderRadius: '12px',
                padding: '0.85rem 1.15rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.85)',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              style={{
                padding: '0.85rem 1.35rem',
                background: isTyping || !input.trim()
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                fontWeight: 500,
                color: isTyping || !input.trim()
                  ? 'rgba(255, 255, 255, 0.3)'
                  : 'rgba(255, 255, 255, 0.7)',
                cursor: isTyping || !input.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.02em',
              }}
            >
              SEND
            </button>
          </div>
        </form>
        {error && (
          <div style={{
            padding: '0.75rem 1.5rem',
            background: 'rgba(255, 71, 87, 0.08)',
            borderTop: '1px solid rgba(255, 71, 87, 0.15)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
});

export default ContextEnginePage;