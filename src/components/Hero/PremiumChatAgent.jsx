import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from '../../hooks/useReducedMotion';

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
            background: 'rgba(255, 255, 255, 0.4)',
            marginLeft: '2px',
            verticalAlign: 'text-bottom',
          }}
        />
      )}
    </span>
  );
});

const PremiumChatAgent = memo(function PremiumChatAgent({
  initialMessages = [],
  onMessage,
}) {
  const [messages, setMessages] = useState(initialMessages.length > 0 ? initialMessages : [
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
  const messagesEndRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

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

    if (onMessage) onMessage(userMessage);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages.slice(1).map(m => ({ role: m.role, content: m.content })), { role: 'user', content: userMessage.content }],
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response || data.message || 'I processed your request.',
        timestamp: Date.now(),
        isTyping: true,
      };

      setMessages(prev => [...prev, aiMessage]);
      setTypingMessageId(aiMessage.id);
      
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === aiMessage.id ? { ...m, isTyping: false } : m));
        setTypingMessageId(null);
      }, 1500);

    } catch (err) {
      setError('Failed to send message.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: isMobile ? '340px' : '440px',
      background: 'linear-gradient(165deg, rgba(12, 12, 20, 0.85), rgba(6, 6, 14, 0.9))',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      backdropFilter: 'blur(20px)',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -15px rgba(0, 0, 0, 0.5)',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)',
      }} />

      <div style={{
        padding: '0.9rem 1.1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        background: 'rgba(0, 0, 0, 0.15)',
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'rgba(130, 255, 180, 0.5)',
        }} />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.5)',
        }}>
          dzz
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.55rem',
          color: 'rgba(255, 255, 255, 0.2)',
          marginLeft: 'auto',
          letterSpacing: '0.06em',
        }}>
          AI
        </span>
      </div>

      <div style={{
        padding: '0.9rem 1.1rem',
        height: '180px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
      }}>
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '0.55rem 0.85rem',
                borderRadius: message.role === 'user' ? '10px 10px 3px 10px' : '10px 10px 10px 3px',
                background: message.role === 'user' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.01)',
                border: '1px solid rgba(255, 255, 255, 0.03)',
              }}
            >
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.72rem',
                color: 'rgba(255, 255, 255, 0.5)',
                margin: 0,
                lineHeight: 1.6,
              }}>
                {message.isTyping && message.id === typingMessageId ? (
                  <TypewriterText text={message.content} speed={20} />
                ) : (
                  message.content
                )}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              alignSelf: 'flex-start',
              display: 'flex',
              gap: '3px',
              padding: '0.4rem 0.6rem',
              background: 'rgba(255, 255, 255, 0.01)',
              borderRadius: '6px',
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 0.5, 0.2], y: [0, -2, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.3)' }}
              />
            ))}
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{
        padding: '0.9rem 1.1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.02)',
        background: 'rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit(e))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="ask about any token..."
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.015)',
              border: `1px solid ${isFocused ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)'}`,
              borderRadius: '8px',
              padding: '0.6rem 0.9rem',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.72rem',
              color: 'rgba(255, 255, 255, 0.6)',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            style={{
              padding: '0.6rem 1rem',
              background: input.trim() && !isTyping ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.01)',
              border: '1px solid rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              fontWeight: 400,
              color: input.trim() && !isTyping ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)',
              cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
            }}
          >
            send
          </button>
        </div>
        
        {error && (
          <p style={{
            marginTop: '0.5rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            color: 'rgba(255, 100, 100, 0.6)',
          }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
});

export default PremiumChatAgent;
