const Email = require("../models/Email");
const generateEmbedding = require("../services/embeddingService");
const generateLLMResponse = require("../services/llmService");
const ChatMessage = require("../models/ChatMessage");

async function optimizeQueryForVectorSearch(question) {
    const today = new Date();
    const currentDateStr = today.toISOString().split('T')[0];

    const prompt = `
    You are an AI query optimizer for an email vector database.
    Today's date is ${currentDateStr}.
    
    Your job is to rewrite the user's natural language question into a keyword-rich search string that will strongly match the semantic embeddings of our processed emails.
    
    Our emails are processed with these exact keywords:
    - Categories: placement, academic, coding, work, logistics, finance, other
    - Priorities: high, medium, low
    - Other metadata: tasks, deadlines, summary
    
    RULES:
    1. Resolve relative dates: Convert "this week", "tomorrow", "upcoming", etc., into exact ISO dates (YYYY-MM-DD) or date ranges based on today (${currentDateStr}).
    2. Inject metadata keywords: If the user asks for "interviews", include "placement high priority". If they ask for "assignments", include "academic tasks".
    3. Keep the core subject: Retain specific names, companies, or topics mentioned by the user.
    4. Output ONLY the optimized search string. No explanations, no quotes, no markdown.
    
    Example Input: "What are my tasks assigned for this week?"
    Example Output: high priority tasks deadlines between ${currentDateStr} and [calculated date 7 days from now]

    User Question: "${question}"
    `;

    try {
        const optimizedString = await generateLLMResponse(prompt);
        return optimizedString.trim();
    } catch (error) {
        console.error("Query optimization failed, falling back to original query:", error);
        return question; 
    }
}

async function askCopilot(req,res){
    try{
        const {question , emailId }= req.body;
        if (!question){
            return res.status(400).json({
                error:"Question required"
            });

        }
        
        const history = await ChatMessage.find({
            userId:req.user.googleId
        }).sort({createdAt: -1}).limit(10);

        const convohistory = history.reverse().map(msg => `${msg.role }: ${msg.content}`).join("\n");
        let emailsForContext=[];
        if (emailId){
            const email= await Email.findOne({
                _id:emailId,
                userId:req.user.googleId}
            );
            if (!email){
                return res.status(404).json({error:"Email not found"});
            }
            
            emailsForContext=[email];

        }
        else{
            const optimizedQuery = await optimizeQueryForVectorSearch(question);
            console.log("Original Query:", question);
            console.log("Optimized Query:", optimizedQuery);
        const questionEmbedding = await generateEmbedding(optimizedQuery);
        let results = await Email.aggregate([
            {
                $vectorSearch:{
                    index:"vector_index",
                        path:"embedding",
                        queryVector:questionEmbedding,
                        numCandidates:100,
                        limit:20,
                        filter:{
                            userId:req.user.googleId
                        }
                        
                }
            },
            {
                $project: {
                    sender: 1,
                    subject: 1,
                    summary: 1,
                    tasks: 1,
                    deadlines: 1,
                    priority: 1,
                    body:1,
                    category:1,
                    score: {
                        $meta: "vectorSearchScore"
                    }
                }
            }
        ]) ;

        emailsForContext=
        results.filter(
            email => email.score > 0.5
        );
        if (emailsForContext.length === 0){
            return res.json({answer:"I couldn't find relevant email to answer your query. ",emailsUsed:0,sources:[]});
        }
    }
        const context = emailsForContext.map(email=>
            `Subject: ${email.subject}           
            Summary: ${email.summary}
            Sender: ${email.sender}
            Priority: ${email.priority}
            Received: ${email.receivedAt ? new Date(email.receivedAt).toISOString().split('T')[0] : 'Unknown'}
            Tasks: ${email.tasks.join(", ") || "None"}
            Deadlines: ${email.deadlines?.join(", ") || "None"}
            Relevance Match: ${email.score ? (email.score * 100).toFixed(0) + '%' : 'Exact Match'}

            `).join("\n \n");
        
        const prompt = `
        You are OctoMail Copilot, an intelligent and highly accurate email assistant.
        Your goal is to help the user quickly understand and act on their inbox.

        STRICT BOUNDARIES:
        - Answer ONLY using the provided "Email Context". 
        - If the information to answer the user's question is not present in the context, explicitly state: "I cannot find this information in the provided emails."
        - NEVER invent, guess, or hallucinate tasks, deadlines, or dates.

        CONFIDENCE & RELEVANCE RULES:
        - Each email in the context has a "Relevance Match" score.
        - If you use information from an email with a Relevance Match below 75%, clearly communicate a "Low Confidence" warning to the user (e.g., "Note: I found something related, but it may not be exactly what you're looking for.").
        - If the scores are high (>80%) or marked "Exact Match", answer confidently.
        - Do not output the raw percentage numbers to the user; translate them into conversational confidence (e.g., "Highly relevant", "Potentially related").

        PRIORITIZATION RULES:
        1. Lead with actionable tasks and impending deadlines.
        2. Give highest visibility to placements, interviews, academics, work, and finance.
        3. Deprioritize or ignore newsletters, marketing, and social updates unless explicitly asked.
        4. If multiple tasks exist, rank them by urgency and group them logically.

        FORMATTING & STYLE:
        - Be concise, direct, and highly readable.
        - Always use bullet points when summarizing multiple emails, tasks, or deadlines.
        - Cite your sources: Always mention the specific sender or email subject when outlining a task or deadline so the user can verify it.

        Conversation History: 
        ${convohistory}

        Email Context:
        ${context}

        User Question:
        ${question}
        `;
        const answer= await generateLLMResponse(prompt);
        await ChatMessage.create({
            userId:req.user.googleId,
            role:"user",
            content:question
        });
        await ChatMessage.create({
            userId:req.user.googleId,
            role:"assistant",
            content:answer
        });

        res.json({
            answer,
            emailsUsed: emailsForContext.length,
            sources: emailsForContext.map(
                email => ({
                    sender: email.sender,
                    subject: email.subject
                })
            )
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
                error:"Copilot Not working "
            });


    }

}
async function clearChat(
    req,res
){
    try{
    await ChatMessage.deleteMany({
        userId: req.user.googleId
    });
    res.json({message: "Chat is cleared"});
}
catch(error){
    console.log(error);
    res.status(500).json({error:"Failed to clear chat"});
}
}
module.exports = {askCopilot ,clearChat };
