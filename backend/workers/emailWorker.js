require("dotenv").config();
const { Worker }= require("bullmq");
const redisConnection= require("../config/redis");
const Email = require("../models/Email");
const processingSingleEmail= require("../services/emailProcessingService");
const connectDB = require("../config/db");
const ProcessingBatch = require("../models/ProcessingBatch");

(async()=>{
    await connectDB();
    console.log("Email Worker started");

const worker= new Worker("email-processing",
    async (job) =>{
        console.log(`processing email ${job.data.emailId}`);
        const email= await Email.findById(job.data.emailId);
        if (!email){
            console.log("Email not found");
            return;
        }  
        await processingSingleEmail(email);
        console.log(`completed email ${email._id}`);

    },
    {
        connection: redisConnection,
        concurrency:1
    }
);
worker.on("completed", async (job)=>{
    console.log(`Job ${job.id} completed`);
    await ProcessingBatch.findByIdAndUpdate(job.data.batchId,{
        $inc: {completedEmail:1}
    });
});

worker.on("failed",async (job,err)=>{
    console.log(`Job ${job.id} failed`);
    console.log(`Attempt ${job.attemptsMade}`);
    console.log(err.message);
    await ProcessingBatch.findByIdAndUpdate(job.data.batchId,{
        $inc: {failedEmail:1}
    });
    
});

})();

