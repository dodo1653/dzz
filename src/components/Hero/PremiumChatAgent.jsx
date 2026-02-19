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
            background: 'rgba(255, 255, 255, 0.6)',
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
  className = '',
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

    if (onMessage) {
      onMessage(userMessage);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages.slice(1).map(m => ({
            role: m.role,
            content: m.content,
          })), { role: 'user', content: userMessage.content }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

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
        setMessages(prev => 
          prev.map(m => m.id === aiMessage.id ? { ...m, isTyping: false } : m)
        );
        setTypingMessageId(null);
      }, 1500);

    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        maxWidth: '720px',
        background: 'rgba(8, 8, 14, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        borderRadius: '18px',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        overflow: 'hidden',
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.15s ease-out',
        boxShadow: `
          0 0 0 1px rgba(255, 255, 255, 0.02) inset,
          0 20px 50px -15px rgba(0, 0, 0, 0.5),
          0 0 60px -30px rgba(123, 92, 246, 0.1)
        `,
      }}
    >
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'rgba(74, 222, 128, 0.8)',
          boxShadow: '0 0 8px rgba(74, 222, 128, 0.5)',
        }} />
        <span style={{
          fontFamily: "'Archivo', sans-serif",
          fontSize: '0.85rem',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.8)',
        }}>
          dzz
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.65rem',
          color: 'rgba(255, 255, 255, 0.3)',
          marginLeft: 'auto',
        }}>
          AI-POWERED ASSISTANT
        </span>
      </div>

      <div style={{
        padding: '1rem 1.25rem',
        height: '200px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '0.6rem 0.9rem',
                borderRadius: message.role === 'user' 
                  ? '12px 12px 4px 12px' 
                  : '12px 12px 12px 4px',
                background: message.role === 'user' 
                  ? 'rgba(255, 255, 255, 0.06)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${message.role === 'user' 
                  ? 'rgba(255, 255, 255, 0.06)' 
                  : 'rgba(255, 255, 255, 0.03)'}`,
              }}
            >
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.75)',
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
              gap: '4px',
              padding: '0.5rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.03)',
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -2, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.5)',
                }}
              />
            ))}
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{
        padding: '1rem 1.25rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.03)',
      }}>
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
        }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask about any token or wallet..."
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${isFocused ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)'}`,
              borderRadius: '10px',
              padding: '0.65rem 1rem',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.8)',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            style={{
              padding: '0.65rem 1.25rem',
              background: input.trim() && !isTyping
                ? 'linear-gradient(135deg, rgba(123, 92, 246, 0.8), rgba(0, 212, 255, 0.8))'
                : 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '10px',
              fontFamily: "'Archivo', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 500,
              color: input.trim() && !isTyping ? 'white' : 'rgba(255, 255, 255, 0.3)',
              cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}
          >
            Send
          </button>
        </div>
        
        {error && (
          <p style={{
            marginTop: '0.5rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: 'rgba(255, 107, 107, 0.8)',
          }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
});

export default PremiumChatAgent;
