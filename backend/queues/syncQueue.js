const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");

const syncQueue = new Queue("gmail-sync",{
    connection: redisConnection
});

syncQueue.on("error", () => {});

module.exports= syncQueue;