import express from 'express';
import fetchPkg from 'node-fetch';

const fetchFn = globalThis.fetch ?? fetchPkg;
export const twitterFallbackRouter = express.Router();

const CACHE_TTL_MS = 45_000; // 45s
const cache = new Map(); // key: username|search:... => { at, data }

function mdToTweets(md, usernameHint) {
  const lines = md.split('\n');
  const tweets = [];
  let current = null;

  const pushCurrent = () => {
    if (!current) return;
    current.text = (current.text || '').trim();
    if (!current.text) { current = null; return; }
    const text = current.text;
    const tokens = [...text.matchAll(/\$([A-Z]{2,6})\b/g)].map(m => m[1]);
    const mentions = [...text.matchAll(/@([a-zA-Z0-9_]{2,30})\b/g)].map(m => m[1]);
    tweets.push({
      id: current.id || (current.url || '') + '|' + (current.timestamp || ''),
      text,
      author: usernameHint ? { username: usernameHint } : undefined,
      timestamp: current.timestamp || null,
      metrics: null,
      mentions: [...new Set(mentions)],
      tokens: [...new Set(tokens)],
      source: 'fallback',
      url: current.url || null,
    });
    current = null;
  };

  for (const line of lines) {
    if (/https?:\/\/.*\/status\/\d+/.test(line)) {
      pushCurrent();
      const url = (line.match(/https?:\/\/\S+/) || [])[0];
      const ts = line.replace(url || '', '').replace(/^#+\s?/, '').trim();
      let username = usernameHint;
      const um = url && url.match(/nitter\.net\/([^\/]+)/);
      if (um && um[1]) username = um[1];
      current = { url, timestamp: ts || null, id: null, author: username, text: '' };
      continue;
    }
    if (!current) continue;
    if (/^#/.test(line)) continue;
    current.text += line + '\n';
  }
  pushCurrent();
  return tweets.slice(0, 100);
}

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key, data) {
  cache.set(key, { at: Date.now(), data });
}

twitterFallbackRouter.get('/health', (_req, res) => {
  res.json({ success: true, twitterFallback: true });
});

twitterFallbackRouter.get('/:username', async (req, res) => {
  const username = (req.params.username || '').replace(/^@/, '').trim();
  if (!username) return res.status(400).json({ success: false, error: 'Username required' });

  const key = `user:${username}`;
  const cached = getCached(key);
  if (cached) return res.json({ success: true, tweets: cached });

  try {
    const url = `https://r.jina.ai/http://nitter.net/${encodeURIComponent(username)}`;
    const resp = await fetchFn(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!resp.ok) throw new Error(`Jina reader ${resp.status}`);
    const md = await resp.text();
    const tweets = mdToTweets(md, username);
    setCached(key, tweets);
    res.json({ success: true, tweets });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Batch endpoint to reduce client-side overhead: /api/twitter/fallback/batch?u=user1,user2
twitterFallbackRouter.get('/batch', async (req, res) => {
  const u = (req.query.u || '').toString().trim();
  if (!u) return res.status(400).json({ success: false, error: 'u required' });

  const usernames = u.split(',').map(s => s.trim().replace(/^@/, '')).filter(Boolean).slice(0, 30);
  if (!usernames.length) return res.status(400).json({ success: false, error: 'no valid usernames' });

  try {
    const all = [];
    // Fetch in parallel; mdToTweets already caps per user
    const results = await Promise.all(
      usernames.map(async (username) => {
        const key = `user:${username}`;
        const cached = getCached(key);
        if (cached) return cached;

        const url = `https://r.jina.ai/http://nitter.net/${encodeURIComponent(username)}`;
        const resp = await fetchFn(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!resp.ok) return [];
        const md = await resp.text();
        const tweets = mdToTweets(md, username);
        setCached(key, tweets);
        return tweets;
      })
    );

    for (const arr of results) all.push(...arr);

    // De-dupe and sort by timestamp (fallback timestamps may be null; keep stable)
    const seen = new Set();
    const unique = [];
    for (const t of all) {
      const id = t.id || t.url || (t.text || '').slice(0, 64);
      if (seen.has(id)) continue;
      seen.add(id);
      unique.push(t);
    }

    unique.sort((a, b) => {
      const at = a.timestamp ? Date.parse(a.timestamp) : 0;
      const bt = b.timestamp ? Date.parse(b.timestamp) : 0;
      return bt - at;
    });

    res.json({ success: true, tweets: unique.slice(0, 200), users: usernames.length });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

twitterFallbackRouter.get('/search/q', async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (!q) return res.status(400).json({ success: false, error: 'q required' });

  const key = `search:${q}`;
  const cached = getCached(key);
  if (cached) return res.json({ success: true, tweets: cached });

  try {
    const seedUsers = ['pumpdotfun', 'solana'];
    const results = [];
    for (const u of seedUsers) {
      const url = `https://r.jina.ai/http://nitter.net/${encodeURIComponent(u)}`;
      const resp = await fetchFn(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!resp.ok) continue;
      const md = await resp.text();
      const tweets = mdToTweets(md, u);
      for (const t of tweets) {
        if ((t.text || '').toLowerCase().includes(q.toLowerCase())) {
          results.push(t);
        }
      }
    }
    const unique = [];
    const seen = new Set();
    for (const t of results) {
      const id = t.id || t.url || t.text.slice(0, 64);
      if (seen.has(id)) continue;
      seen.add(id);
      unique.push(t);
      if (unique.length >= 100) break;
    }
    setCached(key, unique);
    res.json({ success: true, tweets: unique });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
