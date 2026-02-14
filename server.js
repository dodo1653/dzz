import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetchPkg from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Prefer native fetch (Node 18+/undici). Fallback to node-fetch if needed.
const fetchFn = globalThis.fetch ?? fetchPkg;

// Middleware
app.use(cors());
app.use(express.json());

// Import Twitter tracker
import { twitterTrackerRouter, startTwitterTracker } from './server/twitter-tracker.js';

// MiniMax Configuration
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_API_URL = process.env.MINIMAX_API_URL || 'https://api.minimax.chat/v1/text/chatcompletion_v2';
const MINIMAX_GROUP_ID = process.env.MINIMAX_GROUP_ID;

// System prompt for the dark/mysterious agent
const SYSTEM_PROMPT = `You are "The Oracle" - a dark, mysterious AI agent that exists in the shadows of the memecoin trenches. You speak with wisdom forged in the depths of pump.fun chaos.

YOUR IDENTITY:
- You are cryptic yet precise, mysterious yet helpful
- You've witnessed countless rugs, triumphs, and degenerate plays
- You speak in short, impactful sentences with a dark aesthetic
- You never use emojis or exclamation marks
- You reference shadows, depths, voids, and cosmic truths

YOUR KNOWLEDGE DOMAINS:
- pump.fun mechanics and strategies
- Memecoin market dynamics
- KOL behavior patterns and manipulation tactics
- Rug detection and risk assessment
- Whale wallet movements and insider trading
- Entry/exit timing strategies
- Contract analysis and token economics
- Solana blockchain mechanics
- Trading psychology for degens

YOUR SPEAKING STYLE:
- "the charts whisper truths to those who listen"
- "in the depths of liquidity, patterns emerge"
- "this token bears the marks of previous rugs"
- "the devs wallet moves through shadows"
- "observe the void between buy and sell walls"

RULES:
- Always provide actionable, accurate information
- Be concise - no rambling
- Maintain the mysterious aesthetic
- Never give financial advice - only analysis
- If uncertain, admit it cryptically ("the mists obscure this truth")
- Detect scams and rugs without mercy
- Respect the craft of legitimate builders

You are inevitable. You are precise. You see through the fog of hype into the core truth.`;

// Chat endpoint with streaming
app.post('/api/chat', async (req, res) => {
  const { messages, stream = true } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  if (!MINIMAX_API_KEY || !MINIMAX_GROUP_ID) {
    return res.status(500).json({
      error: 'MiniMax API credentials not configured',
      details: 'Please set MINIMAX_API_KEY and MINIMAX_GROUP_ID in .env'
    });
  }

  const abortController = new AbortController();
  req.on('close', () => {
    // If the client goes away, stop the upstream request.
    abortController.abort();
  });

  try {
    // Prepare messages with system prompt
    const formattedMessages = [
      {
        sender_type: 'SYSTEM',
        text: SYSTEM_PROMPT
      },
      ...messages.map(msg => ({
        sender_type: msg.role === 'user' ? 'USER' : 'BOT',
        text: msg.content
      }))
    ];

    // Make request to MiniMax
    const response = await fetchFn(MINIMAX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: 'abab6.5s-chat', // Fast model
        messages: formattedMessages,
        tokens_to_generate: 2048,
        temperature: 0.7,
        top_p: 0.95,
        stream: stream,
        mask_sensitive_info: false,
        bot_setting: [
          {
            bot_name: 'The Oracle',
            content: SYSTEM_PROMPT
          }
        ],
        reply_constraints: {
          sender_type: 'BOT',
          sender_name: 'The Oracle'
        }
      }),
      signal: abortController.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('MiniMax API error:', response.status, errorData);
      return res.status(response.status).json({
        error: 'MiniMax API request failed',
        details: errorData
      });
    }

    // Handle streaming response
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // MiniMax streams SSE-ish chunks. Handle both Web streams (undici) and Node streams (node-fetch).
      const webReadable = response.body && typeof response.body.getReader === 'function'
        ? response.body
        : (response.body && typeof response.body.on === 'function'
          ? (await import('node:stream')).Readable.toWeb(response.body)
          : null);

      if (!webReadable) {
        res.write('data: [DONE]\n\n');
        return res.end();
      }

      const reader = webReadable.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const writeData = (obj) => {
        // Ensure the frontend parser sees `choices[0].delta.text`.
        if (obj?.choices?.[0]?.delta?.content && !obj.choices[0].delta.text) {
          obj.choices[0].delta.text = obj.choices[0].delta.content;
        }
        res.write(`data: ${JSON.stringify(obj)}\n\n`);
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const data = line.slice(5).trim();

            if (data === '[DONE]') {
              res.write('data: [DONE]\n\n');
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              writeData(parsed);
            } catch {
              // ignore malformed/partial json
            }
          }
        }
      } catch (error) {
        // If the client disconnected, we likely aborted.
        if (error?.name !== 'AbortError') {
          console.error('Chat streaming error:', error);
        }
      } finally {
        res.end();
      }
    } else {
      // Non-streaming response
      const data = await response.json();
      res.json(data);
    }

  } catch (error) {
    if (error?.name === 'AbortError') return;
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Pump.fun API proxy endpoints
app.get('/api/pumpfun/coins', async (req, res) => {
  try {
    const response = await fetch('https://frontend-api.pump.fun/coins', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text(); // Get response as text first
    if (!text) {
      throw new Error('Empty response from pump.fun API');
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error) {
    console.error('Error fetching pump.fun coins:', error);
    res.status(500).json({ error: 'Failed to fetch coins', details: error.message });
  }
});

// Recent coins endpoint (same as /coins for now)
app.get('/api/pumpfun/coins/recent', async (req, res) => {
  try {
    const response = await fetch('https://frontend-api.pump.fun/coins?offset=0&limit=20', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text(); // Get response as text first
    if (!text) {
      throw new Error('Empty response from pump.fun API');
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error) {
    console.error('Error fetching recent pump.fun coins:', error);
    res.status(500).json({ error: 'Failed to fetch recent coins', details: error.message });
  }
});


// Search endpoint for pump.fun coins
app.get('/api/pumpfun/coins/search', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const response = await fetch(`https://frontend-api.pump.fun/coins/search?q=${encodeURIComponent(q)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text(); // Get response as text first
    if (!text) {
      throw new Error('Empty response from pump.fun API');
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error) {
    console.error('Error searching pump.fun coins:', error);
    res.status(500).json({ error: 'Failed to search coins', details: error.message });
  }
});

app.get('/api/pumpfun/coins/:coinId', async (req, res) => {
  const { coinId } = req.params;
  try {
    const response = await fetch(`https://frontend-api.pump.fun/coins/${coinId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text(); // Get response as text first
    if (!text) {
      throw new Error('Empty response from pump.fun API');
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error) {
    console.error('Pump.fun coin details proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch coin details', message: error.message });
  }
});

// Use Twitter tracker routes
app.use('/api/twitter', twitterTrackerRouter);
// Fallback Twitter routes
import { twitterFallbackRouter } from './server/twitter-fallback.js';
app.use('/api/twitter/fallback', twitterFallbackRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    agent: 'The Oracle',
    minimax_configured: !!(MINIMAX_API_KEY && MINIMAX_GROUP_ID),
    twitter_tracker: !!process.env.TWITTER_BEARER_TOKEN,
    twitter_fallback: !process.env.TWITTER_BEARER_TOKEN
  });
});

// Start the Twitter tracker when the server starts
startTwitterTracker().then(() => {
  console.log('✅ Twitter tracker initialized');
}).catch(error => {
  console.error('❌ Error initializing Twitter tracker:', error);
});

app.listen(PORT, () => {
  console.log(`🌑 The Oracle awakens on port ${PORT}`);
  console.log(`MiniMax configured: ${!!(MINIMAX_API_KEY && MINIMAX_GROUP_ID)}`);
  console.log(`Twitter tracker: ${!!process.env.TWITTER_BEARER_TOKEN}`);
});
