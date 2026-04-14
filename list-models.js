import 'dotenv/config';
import fetch from 'node-fetch';

const API_KEY = process.env.VITE_DEEPSEEK_API_KEY;

async function listModels() {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/models", {
            headers: {
                "Authorization": `Bearer ${API_KEY}`
            }
        });

        if (!response.ok) {
            console.error("Failed to list models", response.status);
            return;
        }

        const data = await response.json();
        const models = data.data;
        
        console.log("Found", models.length, "models.");
        
        const deepseekFree = models.filter(m => 
            (m.id.toLowerCase().includes("deepseek") || m.id.toLowerCase().includes("qwen")) && 
            m.id.toLowerCase().includes("free")
        );

        console.log("--- DeepSeek/Qwen Free Models ---");
        deepseekFree.forEach(m => console.log(m.id));

    } catch (error) {
        console.error("Error:", error.message);
    }
}

listModels();
