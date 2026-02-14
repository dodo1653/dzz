import { useState, useEffect } from 'react';

// Custom hook for Twitter tracker functionality
export const useTwitterTracker = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // Fetch tracked tweets
  const fetchTweets = async (limit = 50, skip = 0, keyword = '', username = '') => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `/api/twitter/tweets?limit=${limit}&skip=${skip}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      if (username) url += `&username=${encodeURIComponent(username)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setTweets(data.tweets);
      } else {
        setError(data.error || 'Failed to fetch tweets');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tweets by specific username
  const fetchTweetsByUsername = async (username, limit = 50, skip = 0) => {
    if (window.__twitterUseFallback && window.__fetchTweetsByUsername) return window.__fetchTweetsByUsername(username);
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/twitter/tweets/${username}?limit=${limit}&skip=${skip}`);
      const data = await response.json();
      
      if (data.success) {
        setTweets(data.tweets);
      } else {
        setError(data.error || 'Failed to fetch tweets');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search tweets by keyword
  const searchTweets = async (keyword, limit = 50, skip = 0) => {
    if (window.__twitterUseFallback && window.__searchTweets) return window.__searchTweets(keyword);
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/twitter/tweets/search/${keyword}?limit=${limit}&skip=${skip}`);
      const data = await response.json();
      
      if (data.success) {
        setTweets(data.tweets);
      } else {
        setError(data.error || 'Failed to search tweets');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tracked accounts
  const fetchTrackedAccounts = async () => {
    try {
      const response = await fetch('/api/twitter/accounts/details');
      const data = await response.json();
      
      if (data.success) {
        setAccounts(data.accounts);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch tracker stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/twitter/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Add an account to track
  const addAccountToTrack = async (username) => {
    try {
      const response = await fetch('/api/twitter/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      
      if (data.success) {
        // Refresh the tracked accounts list
        await fetchTrackedAccounts();
        return data;
      } else {
        setError(data.error);
        return data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Remove an account from tracking
  const removeAccountFromTracking = async (accountId) => {
    try {
      const response = await fetch(`/api/twitter/accounts/${accountId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        // Refresh the tracked accounts list
        await fetchTrackedAccounts();
        return data;
      } else {
        setError(data.error);
        return data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Refresh data
  const refresh = async () => {
    await fetchStats();
    await fetchTrackedAccounts();
  };

  // Load initial data and auto-detect fallback
  useEffect(() => {
    const init = async () => {
      try {
        const health = await fetch('/api/health').then(r => r.json()).catch(() => ({ twitter_tracker: false, twitter_fallback: true }));
        const useFallback = !health.twitter_tracker && health.twitter_fallback;

        // Monkey-patch helpers to fallback when needed
        if (useFallback) {
          // wrap existing functions
          const origSetTweets = setTweets;
          const fetchTweetsByUsernameFallback = async (username) => {
            const d = await fetch(`/api/twitter/fallback/${encodeURIComponent(username.replace(/^@/, ''))}`).then(r => r.json());
            if (d?.tweets) origSetTweets(d.tweets);
          };
          const searchTweetsFallback = async (keyword) => {
            const d = await fetch(`/api/twitter/fallback/search/q?q=${encodeURIComponent(keyword)}`).then(r => r.json());
            if (d?.tweets) origSetTweets(d.tweets);
          };
          // override methods on returned object by storing on window for now
          window.__twitterUseFallback = true;
          window.__fetchTweetsByUsername = fetchTweetsByUsernameFallback;
          window.__searchTweets = searchTweetsFallback;
        }
      } catch {}
      fetchStats();
      fetchTrackedAccounts();
    };
    init();
  }, []);

  return {
    tweets,
    loading,
    error,
    accounts,
    stats,
    fetchTweets,
    fetchTweetsByUsername,
    searchTweets,
    fetchTrackedAccounts,
    fetchStats,
    addAccountToTrack,
    removeAccountFromTracking,
    refresh
  };
};