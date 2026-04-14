import 'dotenv/config';
import fetch from 'node-fetch';

const API_KEY = process.env.VITE_OPENAI_API_KEY;

if (!API_KEY) {
    console.error("❌ ERROR: API Key not found in .env file");
    process.exit(1);
}

console.log(`🔑 Testing API Key: ${API_KEY.substring(0, 10)}...`);

async function testOpenAI() {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [{ role: "user", content: "Hello, are you working?" }],
                max_tokens: 10
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
            console.log("Response:", data.choices[0].message.content);
        }
    } catch (error) {
        console.error("❌ Network Error:", error.message);
    }
}

testOpenAI();
