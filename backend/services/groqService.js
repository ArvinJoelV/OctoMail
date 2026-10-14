const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function generateWithGroq(prompt) {

    const completion =
        await groq.chat.completions.create({
            model: process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.2
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