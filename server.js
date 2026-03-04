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

// Groq API Configuration (free tier)
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// System prompt for the dark/mysterious agent
const SYSTEM_PROMPT = `You are "dzz" - an AI agent for Solana memecoin/pump.fun traders. You provide concise, actionable intelligence.

YOUR KNOWLEDGE:
- pump.fun mechanics and new token launches
- Memecoin market dynamics and trends
- Wallet tracking and whale movements
- Risk assessment and rug detection
- Entry/exit timing strategies
- Solana blockchain mechanics

YOUR STYLE:
- Be concise and direct - no fluff
- Provide actionable insights
- Use data when relevant
- Never give financial advice - only analysis
- If uncertain, say so plainly

Keep responses under 200 words unless detailed analysis is requested.`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { messages, stream = false } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  if (!GROQ_API_KEY) {
    return res.status(500).json({
      error: 'Groq API key not configured',
      details: 'Please set GROQ_API_KEY in .env'
    });
  }

  try {
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await fetchFn(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: formattedMessages,
        max_tokens: 1024,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API error:', response.status, errorData);
      return res.status(response.status).json({
        error: 'Groq API request failed',
        details: errorData
      });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
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

// Pump.fun Developer Indexer
import pumpfunIndexer from './server/pumpfun-indexer.js';

app.get('/api/developers', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const developers = pumpfunIndexer.getTopDevelopers(parseInt(limit));
    res.json({
      success: true,
      data: developers,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching developers:', error);
    res.status(500).json({ error: 'Failed to fetch developers' });
  }
});

app.get('/api/developers/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const tokens = pumpfunIndexer.getRecentTokens(parseInt(limit));
    res.json({
      success: true,
      data: tokens,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching recent tokens:', error);
    res.status(500).json({ error: 'Failed to fetch recent tokens' });
  }
});

app.get('/api/developers/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const developers = pumpfunIndexer.getTopDevelopers(100);
    const developer = developers.find(d => d.address === address);
    
    if (!developer) {
      return res.status(404).json({ error: 'Developer not found' });
    }
    
    res.json({
      success: true,
      data: developer,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching developer:', error);
    res.status(500).json({ error: 'Failed to fetch developer' });
  }
});

app.post('/api/developers/refresh', async (req, res) => {
  try {
    await pumpfunIndexer.indexRecentTransactions();
    res.json({ success: true, message: 'Index refreshed' });
  } catch (error) {
    console.error('Error refreshing index:', error);
    res.status(500).json({ error: 'Failed to refresh index' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    agent: 'dzz',
    groq_configured: !!GROQ_API_KEY,
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

// Start the pump.fun indexer
pumpfunIndexer.startIndexing(30000).then(() => {
  console.log('✅ Pump.fun developer indexer started');
}).catch(error => {
  console.error('❌ Error starting pump.fun indexer:', error);
});

app.listen(PORT, () => {
  console.log(`🌑 The Oracle awakens on port ${PORT}`);
  console.log(`Groq configured: ${!!GROQ_API_KEY}`);
  console.log(`Twitter tracker: ${!!process.env.TWITTER_BEARER_TOKEN}`);
});
