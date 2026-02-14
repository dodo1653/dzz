import fetch from "node-fetch";

const API_KEY = process.env.OPUS_API_KEY;
const BASE_URL = process.env.OPUS_BASE_URL;

async function runOpus() {
  const response = await fetch(`${BASE_URL}/v1/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-opus-4.5",
      max_tokens: 512,
      messages: [
        { role: "user", content: "Hello Claude Opus 4.5, from Node!" }
      ]
    })
  });

  const data = await response.json();
  console.log(data);
}

runOpus();