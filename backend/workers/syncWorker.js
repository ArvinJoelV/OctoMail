require("dotenv").config();
const {Worker} = require("bullmq");
const connectDB = require("../config/db");
const syncUser = require("../services/gmailSyncService");
const redisConnection = require("../config/redis");
const User = require("../models/User");


(async()=>{
    await connectDB();
    const worker = new Worker(
        "gmail-sync",
        async(job)=>{
            const user= await User.findById(
                job.data.userId
            );
            if (!user){
                throw new Error("User not found");
            }

            const result = await syncUser(user);
            console.log(`Synced ${result.newEmails} new emails for ${user.email}`)
        },{
            connection: redisConnection,
            concurrency:1
        }
    )
    worker.on("completed",(job)=>{
        console.log(`Sync Job ${job.id} completed`);
    });
    worker.on("failed",(job,err)=>{
        console.log(`Sync Job ${job.id} failed`);
        console.log(err.message);
    });
    console.log('Sync Worker Started');
})();