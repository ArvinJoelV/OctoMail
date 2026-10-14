const { Queue } =
require("bullmq");

const redisConnection =
require("../config/redis");

const digestQueue =
new Queue(
    "daily-digest",
    {
        connection:
            redisConnection
    }
);

digestQueue.on("error", () => {});

module.exports =
digestQueue;