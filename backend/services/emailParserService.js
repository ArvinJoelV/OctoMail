
const {getHeader,extractBody}=require("../utils/emailParser");
const cleanEmailTexts=require("../utils/cleanEmail");
const Email=require("../models/Email");
const decodeRawEmail =require("../utils/decodeRawEmail");
const parseRawEmail = require("../utils/parseRawEmail");


async function parseEmail(email,userId){
    const parsed = await parseRawEmail(decodeRawEmail(email.raw));
                const parsedEmail={
                    userId,
                    gmailId: email.id,
                    threadId: email.threadId,
                    snippet: email.snippet,
                    //subject: getHeader(email.payload.headers,"Subject"),
                   // sender:getHeader(email.payload.headers,"From"),
                   // body: cleanEmailTexts(extractBody(email.payload)),
                   subject: parsed.subject,
                   sender: parsed.sender,
                   body: cleanEmailTexts(parsed.body || parsed.html || ""),
                    receivedAt: parsed.receivedAt
            
                
                };
    return parsedEmail;
}

module.exports= parseEmail;