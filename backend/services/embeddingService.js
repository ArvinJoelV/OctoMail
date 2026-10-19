const { GoogleGenAI } = require("@google/genai");

let genAI = null;

function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    if (!genAI) {
        genAI = new GoogleGenAI({ apiKey });
    }

    return genAI;
}

async function generateEmbedding(text) {
    if (!text || typeof text !== "string" || text.trim().length === 0) {
        return null;
    }

    const response = await getGenAI().models.embedContent({
        model: "gemini-embedding-001",
        contents: [{ text }],
    });

    if (!response?.embeddings?.[0]?.values) {
        throw new Error("Embedding generation returned no values");
    }

    return response.embeddings[0].values;
}

module.exports = generateEmbedding; 