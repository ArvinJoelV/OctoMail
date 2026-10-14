const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateEmbedding(text) {
    const response = await genAI.models.embedContent({
        model: "gemini-embedding-001", 
        contents: [{ text: text }],
        // Optional: Specify dimensions if needed (e.g., 768 or 1536)
        // config: { outputDimensionality: 768 } 
    });

    return response.embeddings[0].values;
}

module.exports = generateEmbedding; 