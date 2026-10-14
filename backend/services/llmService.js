const generateWithGroq = require('./groqService');
const summarizeWithGemini = require('./geminiService');

async function generateLLMResponse(prompt
){
    try{
        console.log("USING GROQ");
        return await generateWithGroq(prompt);
    }
    catch(err){
        console.log("Groq failed. Using Gemini as backup");
        return await summarizeWithGemini(prompt);
    }
}

module.exports=generateLLMResponse;
