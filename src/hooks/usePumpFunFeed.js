import { useState, useEffect } from "react";

export const usePumpFunFeed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPumpFunFeed = async () => {
    setLoading(true);
    try {
      // Use the proxy endpoint configured in vite.config.js to avoid CORS issues
      const response = await fetch('/api/pumpfun/coins/recent');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        console.error('Raw response:', text.substring(0, 200) + '...'); // Log first 200 chars of response
        throw new Error('Invalid JSON response from server');
      }

      // Transform the data for our application
      const transformedFeeds = Array.isArray(data) ? data.slice(0, 20).map(coin => ({
        id: coin.id || coin.address || Math.random().toString(36).substr(2, 9),
        name: coin.name || 'Unknown',
        symbol: coin.symbol || 'N/A',
        description: coin.description || coin.name || 'No description available',
        image_url: coin.image || coin.image_url || '/placeholder-image.png',
        market_cap: coin.usd_market_cap || coin.market_cap || 0,
        creator: coin.creator || 'Unknown',
        created_timestamp: coin.created_timestamp || coin.created_at || Date.now(),
        header_uri: coin.header_uri || null
      })) : [];

      setFeeds(transformedFeeds);
    } catch (error) {
      console.error('Failed to fetch Pump.fun feed:', error);
      setFeeds([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const searchCoins = async (query) => {
    if (!query.trim()) return [];

    try {
      const response = await fetch(`/api/pumpfun/coins/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse JSON response for search:', parseError);
        console.error('Raw response:', text.substring(0, 200) + '...'); // Log first 200 chars of response
        throw new Error('Invalid JSON response from server');
      }

      // Ensure the result is an array with proper structure
      return Array.isArray(data) ? data.map(coin => ({
        id: coin.id || coin.address || Math.random().toString(36).substr(2, 9),
        name: coin.name || 'Unknown',
        symbol: coin.symbol || 'N/A',
        image_url: coin.image || coin.image_url || '/placeholder-image.png',
        market_cap: coin.usd_market_cap || coin.market_cap || 0
      })) : [];
    } catch (error) {
      console.error('Failed to search coins:', error);
      return [];
    }
  };

  const getCoinDetails = async (coinId) => {
    try {
      const response = await fetch(`/api/pumpfun/coins/${coinId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse JSON response for coin details:', parseError);
        console.error('Raw response:', text.substring(0, 200) + '...'); // Log first 200 chars of response
        throw new Error('Invalid JSON response from server');
      }

      return {
        id: data.id || data.address || Math.random().toString(36).substr(2, 9),
        name: data.name || 'Unknown',
        symbol: data.symbol || 'N/A',
        description: data.description || data.name || 'No description available',
        image_url: data.image || data.image_url || '/placeholder-image.png',
        market_cap: data.usd_market_cap || data.market_cap || 0,
        creator: data.creator || 'Unknown',
        created_timestamp: data.created_timestamp || data.created_at || Date.now(),
        header_uri: data.header_uri || null
      };
    } catch (error) {
      console.error('Failed to fetch coin details:', error);
      return null;
    }
  };

  // Auto-fetch feeds on component mount
  useEffect(() => {
    fetchPumpFunFeed();
  }, []);

  return {
    feeds,
    loading,
    fetchPumpFunFeed,
    searchCoins,
    getCoinDetails
  };
};
