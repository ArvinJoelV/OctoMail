const Email = require("../models/Email");
const processingSingleEmail= require("../services/emailProcessingService");
const emailQueue = require("../queues/emailQueue");
const ProcessingBatch = require("../models/ProcessingBatch");

async function processEmails (req,res){
    try{
        const emails = await Email.find({
            processed: false,
            userId: req.user.googleId
        });

        if (emails.length === 0) {
            return res.json({
                message: "No un-processed emails found",
                emailsQueued: 0
            });
        }

        const batch = await ProcessingBatch.create({
            userId: req.user.googleId,
            totalEmails: emails.length
        });

        let queuedWithRedis = false;
        try {
            for (let email of emails){
                await emailQueue.add("process-email",{
                    emailId: email._id.toString(),
                    batchId: batch._id.toString()
                },{
                    attempts: 3,
                    backoff: {
                        type: "exponential",
                        delay: 5000
                    },
                    removeOnComplete: 100,
                    removeOnFail: 50
                });
            }
            queuedWithRedis = true;
        } catch (queueErr) {
            console.warn("Redis queue unavailable, processing directly in background:", queueErr.message);
            // Process directly in background without failing HTTP request
            (async () => {
                for (let email of emails) {
                    try {
                        console.log(`Processing email directly: ${email._id}`);
                        await processingSingleEmail(email);
                        await ProcessingBatch.findByIdAndUpdate(batch._id, {
                            $inc: { completedEmail: 1 }
                        });
                        console.log(`Completed email: ${email._id}`);
                    } catch (e) {
                        console.error(`Failed to process email ${email._id}:`, e.message);
                        await ProcessingBatch.findByIdAndUpdate(batch._id, {
                            $inc: { failedEmail: 1 }
                        });
                    }
                }
            })();
        }

        res.json({
            message: queuedWithRedis 
                ? "Emails Queued successfully for background processing" 
                : "Emails started processing in background (direct mode)",
            emailsQueued: emails.length
        });

    }
    catch(err){
        console.error("Process emails error:", err);
        res.status(500).json({error: "AI processing queueing failed: " + err.message});
    }
}

async function findProcessStatus(req,res){
    try{
        const batch = await ProcessingBatch.findOne({
            userId:req.user.googleId
        }).sort({createdAt:-1});
        res.json(batch);
        console.log(batch);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to show the Processing Status"});

    }
}

module.exports = {findProcessStatus,
    processEmails
};


