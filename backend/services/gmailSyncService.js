
const parseEmail = require("../services/emailParserService");
const emailQueue = require("../queues/emailQueue");
const refreshAccessToken = require("./tokenService");
const fetchEmails = require("./gmailService");
const Email = require("../models/Email");
const fetchHistoryEmails = require("./gmailHistoryService");
const fetchEmailById = require("./fetchEmailById");

async function syncUser(user){

        const accessToken= await refreshAccessToken(user.refreshToken);
        let emails=[]
        if (!user.lastHistoryId){
            emails = await fetchEmails(accessToken);
            if (emails.length>0){
                
                user.lastHistoryId=emails[0].historyId;
            }
        }
        else{
            const history = await fetchHistoryEmails(
                accessToken,user.lastHistoryId
            );
            const messageIds=[]

            for (const record of history){
                if(!record.messagesAdded){
                    continue;
                }
                for (const item of record.messagesAdded){
                    messageIds.push(item.message.id);
                }
            }
            emails=await Promise.all(messageIds.map(id=>fetchEmailById(accessToken,id)));
            if (emails.length >0){
                user.lastHistoryId=emails[0].historyId;
            }
        }
        
        let newEmails=0;
        for (const email of emails){
            const parsedEmail= await parseEmail(email,user.googleId);
            const existingEmail = await Email.findOne({
                gmailId: parsedEmail.gmailId
            });

            if (existingEmail){
                continue;
            }
            const savedEmail = await Email.create(parsedEmail);
            
            try {
                await emailQueue.add('process-email',
                    {
                        emailId:savedEmail._id.toString()
                    },{
                        attempts:3,
                        backoff:{
                            type:"exponential",
                            delay:5000
                        },
                        removeOnComplete:100,
                        removeOnFail:50
                    }
                );
            } catch (qErr) {
                console.warn("Queue offline during sync, will process email later:", qErr.message);
            }
            newEmails++;

        
        }
    user.lastSyncedAt= new Date();
    await user.save();
    return {newEmails};
    

    
}

module.exports= syncUser;


