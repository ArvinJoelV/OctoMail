require("dotenv").config();
const cron = require("node-cron");
const connectDB = require("../config/db");
const runScheduler = require("./startScheduler");

(async ()=>{
    await connectDB();
    console.log("Cron Scheduler started");
    cron.schedule ("*/15 * * * *",async()=>{
        try{
            await runScheduler();
        }
        catch(err){
            console.log(err);
        }
    });

})();