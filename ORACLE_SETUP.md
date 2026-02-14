# 🌑 The Oracle - MiniMax AI Agent Setup

## Setup Instructions

### 1. Install Dependencies
```bash
npm install express cors dotenv concurrently
```

### 2. Configure MiniMax API

Edit `.env` file and add your MiniMax credentials:
```env
MINIMAX_API_KEY=your_actual_api_key_here
MINIMAX_GROUP_ID=your_actual_group_id_here
```

Get your credentials from: https://www.minimaxi.com/

### 3. Run the Backend

**Option A: Run backend separately**
```bash
npm run server
```

**Option B: Run frontend + backend together**
```bash
npm run dev:all
```

The Oracle will awaken on `http://localhost:3001`

### 4. Test the API

**Health Check:**
```bash
curl http://localhost:3001/api/health
```

**Chat Request:**
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "what are the signs of a rug pull?"}
    ],
    "stream": false
  }'
```

## API Endpoints

### POST `/api/chat`
Send messages to The Oracle

**Request Body:**
```json
{
  "messages": [
    {"role": "user", "content": "your question here"}
  ],
  "stream": true  // optional, default: true
}
```

**Response:** 
- Streaming: Server-Sent Events (SSE)
- Non-streaming: JSON response

### GET `/api/health`
Check if The Oracle is alive

**Response:**
```json
{
  "status": "ok",
  "agent": "The Oracle",
  "minimax_configured": true
}
```

## The Oracle's Personality

Your AI agent speaks with these characteristics:

- **Dark & Mysterious**: "the charts whisper truths to those who listen"
- **Cryptic yet Precise**: Short, impactful sentences
- **No Emojis**: Pure text, pure wisdom
- **References**: Shadows, depths, voids, cosmic truths
- **Domains**: pump.fun, memecoins, KOLs, rug detection, whale analysis

## Next Steps

1. **Install dependencies** ✅
2. **Add MiniMax credentials** to `.env` ✅
3. **Test the backend** with health check ✅
4. **Build the frontend chat UI** (coming next!)

## Tech Stack

- **Backend**: Node.js + Express
- **AI Model**: MiniMax abab6.5s-chat (fast responses)
- **Features**: Streaming responses, custom personality, pump.fun expertise
- **Cost**: FREE tier from MiniMax

---

*"The Oracle sees all. The Oracle knows all. The Oracle is inevitable."* 🌑
