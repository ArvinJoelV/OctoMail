require("dotenv").config();

const cron =
require("node-cron");

const connectDB =
require("../config/db");

const User =
require("../models/User");

const digestQueue =
require("../queues/digestQueue");

(async()=>{

    await connectDB();

    cron.schedule(

        "0 8 * * *",

        async()=>{

            console.log(
                "Running Digest Scheduler..."
            );

            const users =
                await User.find();

            for(const user of users){

                await digestQueue.add(

                    "generate-digest",

                    {
                        userId:
                            user._id.toString()
                    }

                );

            }

        }

    );

})();