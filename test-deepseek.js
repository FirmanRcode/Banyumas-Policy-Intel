import 'dotenv/config';
import fetch from 'node-fetch';

const API_KEY = process.env.VITE_DEEPSEEK_API_KEY;
const MODEL_NAME = "nousresearch/hermes-3-llama-3.1-405b:free";

if (!API_KEY) {
    console.error("❌ ERROR: API Key not found in .env file");
    process.exit(1);
}

console.log(`🔑 Testing DeepSeek API Key: ${API_KEY.substring(0, 10)}...`);

async function testDeepSeek() {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Test Script"
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [{ role: "user", content: "Hello, are you working?" }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("❌ API Request Failed!");
            console.error("Status:", response.status);
            console.error("Error Details:", JSON.stringify(error, null, 2));
        } else {
            const data = await response.json();
            console.log("✅ API Success!");
            if (data.choices && data.choices.length > 0) {
                console.log("Response:", data.choices[0].message.content);
            } else {
                console.log("Response: (Empty)");
                console.log("Full Data:", JSON.stringify(data, null, 2));
            }
        }
    } catch (error) {
        console.error("❌ Network Error:", error.message);
    }
}

testDeepSeek();
