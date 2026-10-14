const User = require("../models/User");
const syncQueue = require("../queues/syncQueue");

async function runScheduler(){
    console.log("Running the Sync Scheduler for gmails");
    const users= await User.find({
        refreshToken:{
            $exists:true,
            $ne:null
        }
        
    });
    for (const user of users){
        await syncQueue.add("sync-user",{
            userId: user._id.toString()
        },{
            attempts:3,
            backoff:{
                type:"exponential",
                delay:5000
            },
            removeOnComplete:100,
            removeOnFail:50
        });

    }
    console.log(`Queued ${users.length} sync jobs`);
}


module.exports=runScheduler;
