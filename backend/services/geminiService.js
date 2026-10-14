const {GoogleGenerativeAI} = require("@google/generative-ai")
const genAI= new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model:"gemini-3.1-flash-lite"
});

async function summarizeWithGemini(prompt){


    const result =await model.generateContent(prompt);
    let response = result.response.text();

    response = response.replace(/```json/g, "").replace(/```/g, "").trim();

    return response;
}

module.exports = summarizeWithGemini;
