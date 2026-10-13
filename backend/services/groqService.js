const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const GROQ_MODEL = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

async function generateWithGroq(prompt) {

    const completion =
        await groq.chat.completions.create({
            model: GROQ_MODEL,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.2,
            max_tokens: 1024
        });

    let response =
        completion.choices[0].message.content;

    response = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return response;
}

module.exports = generateWithGroq;