import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: API Key not found in .env file");
  process.exit(1);
}

console.log(`🔑 Testing Gemini API Key: ${API_KEY.substring(0, 10)}...`);

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = "Hello, are you working?";
    console.log(`📤 Sending prompt: "${prompt}"`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ API Success!");
    console.log("Response:", text);
  } catch (error) {
    console.error("❌ API Request Failed!");
    console.error("Error Details:", error);
  }
}

testGemini();
