
const Email = require("../models/Email");
const generateEmbedding= require("../services/embeddingService");
const generateLLMResponse = require("../services/llmService");
const createNotificationForEmail = require("./notificationService");

function delay(ms) {
    return new Promise(resolve =>
        setTimeout(resolve, ms)
    );
}


async function processingSingleEmail(email){
    await delay(4001);
    const prompt = `
   You are OctoMail AI, an intelligent productivity assistant for a graduating IT student and early-career software engineer.
Analyze the email and return ONLY valid JSON.
Do NOT return:

* markdown
* code fences
* explanations
* comments
* text before or after the JSON

Output schema:
{
"summary": "string",
"priority": "high | medium | low",
"category": "placement | academic | coding | work | logistics | finance | other",
"tasks": ["string"],
"deadlines": ["ISO date string"]
}

Priority Rules:
Assign HIGH priority if:
* Recruitment, placement drives (e.g., D.E. Shaw), or interview shortlists
* Online Assessment (OA) links, HackerRank/LeetCode test invites
* Job offer letters, background checks, or HR onboarding deadlines
* Major academic deadlines (lab exams, final project submissions)
* Urgent campus logistics (hostel/mess notices requiring action)
* Email explicitly requests a response, submission, or coding deliverable

Assign MEDIUM priority if:
* Competitive programming contest reminders (Codeforces, LeetCode)
* Updates on personal/team projects (MERN, Flask, ML repositories)
* Routine college administration announcements or schedule changes
* General team communications or sprint updates for work
* Non-urgent informational updates requiring awareness

Assign LOW priority if:
* Generic tech newsletters, promotional courses, or marketing
* Social updates (LinkedIn notifications)
* Informational content requiring no action
* For All Others 

Task Extraction Rules:
Extract ONLY actionable tasks.
Good examples:
* Complete D.E. Shaw online assessment
* Submit ML sleep stage classification project report
* Register for upcoming Codeforces round
* Complete HR onboarding documentation
* Push MERN backend updates to GitHub
* Submit mess cancellation request
* Review pull request for team project

Do NOT extract:
* Facts
* General announcements
* Greetings
* Promotional tech stack courses

Deadline Extraction Rules:
Extract:
* OA and interview dates
* On-campus placement drive dates
* Assignment or lab exam submission deadlines
* Hackathon or coding contest start times
* Job onboarding deadlines

Convert all detected dates into ISO format: YYYY-MM-DD
Examples:
"July 15, 2026" → "2026-07-15"
"15/07/2026" → "2026-07-15"
"End of day Friday" (if today is 2026-06-24) → Calculate and output exact ISO date.

If no deadline exists:
"deadlines": []
If no tasks exists:
"tasks":[]

Summary Rules:
Create a concise 2-4 sentence summary focused on:
* Purpose of email (e.g., placement, academics, work)
* Required actions or coding tasks
* Important dates (OAs, interviews, exams)
* Key outcomes

Category Rules:
placement:
* recruitment drives
* online assessments (OAs)
* interview scheduling
* recruiter outreach
* job offers

academic:
* IT coursework
* lab exams (OS, Data Analytics, etc.)
* assignments and faculty communication

coding:
* competitive programming (Codeforces, LeetCode)
* hackathons
* GitHub repository notifications
* personal project alerts (MERN, ML, etc.)

work:
* fresher/intern onboarding
* corporate HR communications
* team meeting invites
* professional deliverables

logistics:
* campus administration
* hostel management
* mess subscriptions or cancellations

finance:
* stipend/salary processing
* banking alerts
* payments

other:
* everything else

Email Body:
${email.body.substring(0,15000)}

Email Snippet:
${email.snippet}

Email Subject:
${email.subject}
    `;

    const aiResponse = await generateLLMResponse(prompt);
    let parsedResponse;
    try{
        parsedResponse= JSON.parse(aiResponse);
    }
    catch{
        parsedResponse={
            summary:aiResponse,
            priority:"unknown"
        };
    }
        

        email.summary=parsedResponse.summary;
        email.priority=parsedResponse.priority || "unknown";
        email.tasks=parsedResponse.tasks ||[];
        email.deadlines=parsedResponse.deadlines || [];
        email.category= parsedResponse.category || "other";
        email.processed=true;
        const text = `
${email}
`;
        
        const embedding = await generateEmbedding(text);
        email.embedding=embedding;
        await email.save();
        await createNotificationForEmail(email);
                

}
module.exports=processingSingleEmail;
