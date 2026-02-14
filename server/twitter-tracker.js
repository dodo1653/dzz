import express from 'express';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

// In-memory storage for tracked tweets (in production, use a database)
let trackedTweets = [];
const trackedAccounts = new Set(); // Store unique account IDs to track
let twitterClient = null;

// Initialize Twitter client if credentials are available
if (process.env.TWITTER_BEARER_TOKEN) {
  twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
} else {
  console.warn('Twitter API credentials not found. Twitter tracker will not function.');
}

// Function to start tracking Twitter accounts with maximum speed
export const startTwitterTracker = async () => {
  if (!twitterClient) {
    console.error('Cannot start Twitter tracker: No API credentials provided');
    return;
  }

  try {
    // High-value crypto/KOL accounts to track (replace with actual J7Tracker accounts)
    const highValueAccounts = [
      'gavintech',      // Gavin (Solana co-founder)
      'aeyakovenko',    // Anatoly (Solana CEO)
      'jacksonk',       // Jackson (Solana Foundation)
      'sbf_fan',        // SBF (FTX former CEO - still followed)
      'cz_binance',     // CZ (Binance)
      'elonmusk',       // Elon Musk (major influence on crypto)
      'saylor',         // Michael Saylor (Bitcoin advocate)
      'VitalikButerin', // Vitalik (Ethereum)
      'brianamendiola', // Crypto influencer
      'cryptokaleo',    // Crypto influencer
      '0xSisyphus',     // Solana dev
      'kevinsekniqi',   // Solana dev
      'stephendecastro', // Solana ecosystem
      'SolanaFrog',     // Solana community
      'solana',         // Official Solana
      'bonfida',        // Solana DEX
      'raydiumprotocol', // Raydium
      'marinadeFinance', // Marinade
      'orca_so',        // Orca
      'tensorianNFT',   // Tensor
      'pumpdotfun',     // Official pump.fun
      'raydium',        // Raydium
      'coinbase',       // Coinbase
      'binance',        // Binance
      'FTX_Official',   // FTX (historical reference)
      'AlamedaResearch', // Alameda (historical reference)
      'M_Buterin',      // Vitalik's other account
      'CryptoHayes',    // Solana trader
      'CryptoKaleo',    // Crypto analyst
      'alpha5012',      // Solana trader
      'TheMoonCarl',    // Crypto trader
      'CryptoMichNL',   // Crypto trader
      'CryptoBQT',      // Solana trader
      '0xKenny_',       // Solana trader
      'gavinsongmd',    // Solana trader
      'cryptodude1234', // Crypto trader
    ];

    // Resolve user IDs for these accounts efficiently
    const batchSize = 100; // Twitter API allows up to 100 users per request

    for (let i = 0; i < highValueAccounts.length; i += batchSize) {
      const batch = highValueAccounts.slice(i, i + batchSize);

      try {
        const users = await twitterClient.v2.usersBy({
          usernames: batch,
          'user.fields': ['id', 'name', 'username', 'verified', 'public_metrics', 'profile_image_url']
        });

        if (users.data) {
          users.data.forEach(user => {
            trackedAccounts.add(user.id);
            console.log(`Added ${user.username} (ID: ${user.id}) to tracking list - ${user.name}`);
          });
        }
      } catch (error) {
        console.error(`Error fetching batch ${i / batchSize + 1}:`, error.message);
      }
    }

    console.log(`Started tracking ${trackedAccounts.size} high-value Twitter accounts`);

    // Start aggressive tracking of these accounts
    startAggressiveTracking();

  } catch (error) {
    console.error('Error initializing Twitter tracker:', error);
  }
};

// Aggressive tracking function that polls accounts frequently for maximum speed
const startAggressiveTracking = async () => {
  if (!twitterClient) return;

  console.log('Starting aggressive Twitter tracking...');

  // Track accounts in batches to stay within API limits
  const accountIds = Array.from(trackedAccounts);
  const batchSize = 100; // Max allowed by Twitter API

  // Function to poll accounts in batches
  const pollAccounts = async () => {
    for (let i = 0; i < accountIds.length; i += batchSize) {
      const batch = accountIds.slice(i, i + batchSize);

      try {
        // Get recent tweets from this batch of accounts
        for (const accountId of batch) {
          try {
            const userTweets = await twitterClient.v2.userTimeline(accountId, {
              max_results: 10, // Get recent tweets
              'tweet.fields': ['created_at', 'public_metrics', 'context_annotations'],
              'expansions': ['author_id'],
              'user.fields': ['id', 'name', 'username', 'verified', 'profile_image_url']
            });

            if (userTweets.data?.data) {
              userTweets.data.data.forEach(tweet => {
                // Check if we already have this tweet to avoid duplicates
                const existingTweet = trackedTweets.find(t => t.id === tweet.id);
                if (!existingTweet) {
                  const author = userTweets.includes?.users?.find(u => u.id === tweet.author_id);

                  const processedTweet = {
                    id: tweet.id,
                    text: tweet.text,
                    author: author,
                    timestamp: new Date(tweet.created_at).toISOString(),
                    metrics: tweet.public_metrics,
                    mentions: extractMentions(tweet.text),
                    tokens: extractTokens(tweet.text),
                    source: 'twitter',
                    url: `https://twitter.com/${author?.username}/status/${tweet.id}`
                  };

                  // Add to tracked tweets (with limit to prevent memory issues)
                  trackedTweets.unshift(processedTweet);
                  if (trackedTweets.length > 1000) {
                    trackedTweets = trackedTweets.slice(0, 1000); // Keep only most recent
                  }

                  console.log(`New tweet from @${author?.username}: ${tweet.text.substring(0, 60)}...`);
                }
              });
            }
          } catch (error) {
            // Silently continue if we can't fetch tweets from a specific account
            // (e.g., due to privacy settings or rate limits)
            continue;
          }
        }
      } catch (error) {
        console.error('Error polling batch:', error.message);
      }
    }
  };

  // Run initial poll
  await pollAccounts();

  // Poll every 30 seconds for maximum speed (adjust as needed to stay within rate limits)
  setInterval(async () => {
    try {
      await pollAccounts();
    } catch (error) {
      console.error('Error in polling interval:', error);
    }
  }, 30000); // Every 30 seconds for fast tracking
};

// Helper function to extract mentions from tweet text
const extractMentions = (text) => {
  const mentionRegex = /@(\w+)/g;
  const matches = [...text.matchAll(mentionRegex)];
  return [...new Set(matches.map(match => match[1]))]; // Unique mentions
};

// Helper function to extract potential token symbols from tweet text
const extractTokens = (text) => {
  const tokenRegex = /\$([A-Z]{2,6})\b/g;
  const matches = [...text.matchAll(tokenRegex)];
  return [...new Set(matches.map(match => match[1]))]; // Unique tokens
};

// Alternative function to track specific accounts with maximum speed
export const trackSpecificUserTweets = async (userId) => {
  if (!twitterClient) return;

  try {
    console.log(`Tracking user tweets for ID: ${userId}`);

    const userTweets = await twitterClient.v2.userTimeline(userId, {
      max_results: 20, // Get more tweets
      'tweet.fields': ['created_at', 'public_metrics'],
      'expansions': ['author_id'],
      'user.fields': ['id', 'name', 'username', 'verified', 'profile_image_url']
    });

    if (userTweets.data?.data) {
      userTweets.data.data.forEach(tweet => {
        const author = userTweets.includes?.users?.find(u => u.id === tweet.author_id);
        const processedTweet = {
          id: tweet.id,
          text: tweet.text,
          author: author,
          timestamp: new Date(tweet.created_at).toISOString(),
          metrics: tweet.public_metrics,
          mentions: extractMentions(tweet.text),
          tokens: extractTokens(tweet.text),
          source: 'twitter',
          url: `https://twitter.com/${author?.username}/status/${tweet.id}`
        };

        // Check for duplicates before adding
        const existingTweet = trackedTweets.find(t => t.id === tweet.id);
        if (!existingTweet) {
          trackedTweets.unshift(processedTweet);
          if (trackedTweets.length > 1000) {
            trackedTweets = trackedTweets.slice(0, 1000);
          }
        }
      });
    }
  } catch (error) {
    console.error(`Error tracking user ${userId}:`, error);
  }
};

// API endpoints for the Twitter tracker
export const twitterTrackerRouter = express.Router();

// Get all tracked tweets (sorted by newest first)
twitterTrackerRouter.get('/tweets', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const skip = parseInt(req.query.skip) || 0;
  const keyword = req.query.keyword || '';
  const username = req.query.username || '';

  let filteredTweets = [...trackedTweets];

  // Apply keyword filter
  if (keyword) {
    filteredTweets = filteredTweets.filter(tweet =>
      tweet.text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Apply username filter
  if (username) {
    filteredTweets = filteredTweets.filter(tweet =>
      tweet.author?.username?.toLowerCase() === username.toLowerCase()
    );
  }

  const paginatedTweets = filteredTweets.slice(skip, skip + limit);
  res.json({
    success: true,
    count: paginatedTweets.length,
    total: filteredTweets.length,
    tweets: paginatedTweets,
    hasMore: skip + limit < filteredTweets.length
  });
});

// Get tweets by specific account (with pagination)
twitterTrackerRouter.get('/tweets/:username', (req, res) => {
  const { username } = req.params;
  const limit = parseInt(req.query.limit) || 50;
  const skip = parseInt(req.query.skip) || 0;

  const filteredTweets = trackedTweets.filter(tweet =>
    tweet.author?.username?.toLowerCase() === username.toLowerCase()
  );

  const paginatedTweets = filteredTweets.slice(skip, skip + limit);

  res.json({
    success: true,
    count: paginatedTweets.length,
    total: filteredTweets.length,
    username,
    tweets: paginatedTweets,
    hasMore: skip + limit < filteredTweets.length
  });
});

// Search tweets by keyword
twitterTrackerRouter.get('/tweets/search/:keyword', (req, res) => {
  const { keyword } = req.params;
  const limit = parseInt(req.query.limit) || 50;
  const skip = parseInt(req.query.skip) || 0;

  const filteredTweets = trackedTweets.filter(tweet =>
    tweet.text.toLowerCase().includes(keyword.toLowerCase())
  );

  const paginatedTweets = filteredTweets.slice(skip, skip + limit);

  res.json({
    success: true,
    count: paginatedTweets.length,
    total: filteredTweets.length,
    keyword,
    tweets: paginatedTweets,
    hasMore: skip + limit < filteredTweets.length
  });
});

// Add an account to track
twitterTrackerRouter.post('/accounts', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({
      success: false,
      error: 'Username is required'
    });
  }

  try {
    const user = await twitterClient.v2.userByUsername(username, {
      'user.fields': ['id', 'name', 'username', 'verified', 'profile_image_url']
    });

    if (user.data) {
      trackedAccounts.add(user.data.id);
      res.json({
        success: true,
        message: `Added ${username} to tracking list`,
        user: {
          id: user.data.id,
          username: user.data.username,
          name: user.data.name,
          verified: user.data.verified
        }
      });

      // Immediately fetch this user's tweets
      await trackSpecificUserTweets(user.data.id);
    } else {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
  } catch (error) {
    console.error('Error adding account:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get tracked accounts
twitterTrackerRouter.get('/accounts', (req, res) => {
  res.json({
    success: true,
    count: trackedAccounts.size,
    accounts: Array.from(trackedAccounts)
  });
});

// Get tracked accounts with details
twitterTrackerRouter.get('/accounts/details', async (req, res) => {
  if (!twitterClient) {
    return res.status(500).json({
      success: false,
      error: 'Twitter API not configured'
    });
  }

  try {
    const accountIds = Array.from(trackedAccounts);
    const details = [];

    // Fetch details in batches
    const batchSize = 100;
    for (let i = 0; i < accountIds.length; i += batchSize) {
      const batch = accountIds.slice(i, i + batchSize);
      try {
        const users = await twitterClient.v2.users(batch, {
          'user.fields': ['id', 'name', 'username', 'verified', 'public_metrics', 'description', 'profile_image_url']
        });

        if (users.data) {
          details.push(...users.data);
        }
      } catch (error) {
        console.error(`Error fetching batch ${i / batchSize + 1}:`, error.message);
      }
    }

    res.json({
      success: true,
      count: details.length,
      accounts: details
    });
  } catch (error) {
    console.error('Error fetching account details:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Remove an account from tracking
twitterTrackerRouter.delete('/accounts/:accountId', (req, res) => {
  const { accountId } = req.params;
  const wasDeleted = trackedAccounts.delete(accountId);

  res.json({
    success: true,
    message: wasDeleted ? `Removed ${accountId} from tracking` : 'Account was not being tracked',
    wasDeleted
  });
});

// Get stats about the tracker
twitterTrackerRouter.get('/stats', (req, res) => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const tweetsLastHour = trackedTweets.filter(tweet =>
    new Date(tweet.timestamp) > oneHourAgo
  ).length;

  const tweetsToday = trackedTweets.filter(tweet =>
    new Date(tweet.timestamp) > today
  ).length;

  res.json({
    success: true,
    stats: {
      totalTrackedTweets: trackedTweets.length,
      trackedAccounts: trackedAccounts.size,
      tweetsLastHour,
      tweetsToday,
      lastUpdated: trackedTweets[0]?.timestamp || null
    }
  });
});

// Health check
twitterTrackerRouter.get('/health', (req, res) => {
  res.json({
    success: true,
    twitterClient: !!twitterClient,
    trackedAccounts: trackedAccounts.size,
    trackedTweets: trackedTweets.length,
    lastTweet: trackedTweets[0]?.timestamp || null
  });
});

// Export tracked data for external access
export const getTrackedTweets = () => trackedTweets;
export const getTrackedAccounts = () => trackedAccounts;