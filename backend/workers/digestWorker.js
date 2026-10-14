require("dotenv").config();

const connectDB =
require("../config/db");

const { Worker } =
require("bullmq");

const redisConnection =
require("../config/redis");

const User =
require("../models/User");

const createDigest =
require("../services/digestService");

(async()=>{

    await connectDB();

    new Worker(

        "daily-digest",

        async(job)=>{

            const user =
                await User.findById(
                    job.data.userId
                );

            if(!user){
                return;
            }

            await createDigest(
                user
            );

            console.log(
                `Digest generated for ${user.email}`
            );

        },

        {
            connection:
                redisConnection
        }

    );

})();