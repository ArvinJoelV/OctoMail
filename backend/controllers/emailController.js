const fetchEmails =require("../services/gmailService");
const {getHeader,extractBody}=require("../utils/emailParser");
const cleanEmailTexts=require("../utils/cleanEmail");
const Email=require("../models/Email");
const decodeRawEmail =require("../utils/decodeRawEmail");
const parseRawEmail = require("../utils/parseRawEmail");
const parseEmail = require("../services/emailParserService");
const refreshAccessToken = require("../services/tokenService");

async function getEmails(req,res){

    try{
        
        const accessToken= await refreshAccessToken( req.user.refreshToken);
        const emails = await fetchEmails(accessToken);
        const parsedEmails=await Promise.all(
        
        emails.map(async email => {
            const parsedEmail= await parseEmail(email,req.user.googleId);
            
            const existingEmail = await Email.findOne({
                gmailId: parsedEmail.gmailId
            });

            if (!existingEmail){
                await Email.create(parsedEmail);
            }
            return parsedEmail;

        }
    )
    
        );
        res.json(parsedEmails);


     
    }
    catch(err){
        console.error("Fetch emails error:", err.response?.data || err.message);
        if (err.response?.data?.error === "invalid_grant" || err.message?.includes("invalid_grant")) {
            return res.status(401).json({
                error: "Google session has expired. Please sign out and sign in with Google again."
            });
        }
        res.status(500).json({
            error: "Failed to fetch emails: " + (err.message || "Unknown error")
        });
    }
}

async function getStoredEmails(req,res){
    try{
        const emails= await Email.find({
            userId: req.user.googleId
        }).sort({receivedAt:-1});
        res.json(emails);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: `Failed to retrieve email from MongoDB `});
    }
}

async function getEmailById(req,res){
    const email= await Email.findOne({
        _id:req.params.id
    });
    res.json(email);

}

async function getEmailsByCategory(req,res
){

    const emails = await Email.find({
        userId: req.user.googleId,
        category: req.params.category.toLowerCase()
    });

    console.log(emails);
    res.json(emails);
}

async function processSingleEmailById(req, res) {
    try {
        const processingSingleEmail = require("../services/emailProcessingService");
        const email = await Email.findOne({
            _id: req.params.id
        });
        if (!email) {
            return res.status(404).json({ error: "Email not found" });
        }
        await processingSingleEmail(email);
        const updatedEmail = await Email.findById(req.params.id);
        res.json({ message: "Email processed successfully", email: updatedEmail });
    } catch (err) {
        console.error("Single email processing error:", err);
        res.status(500).json({ error: "Processing failed: " + err.message });
    }
}

module.exports={getEmails,getStoredEmails,getEmailsByCategory, getEmailById, processSingleEmailById};
