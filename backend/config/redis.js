const IORedis = require("ioredis");

const redisConnection = new IORedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
    lazyConnect: true,
    retryStrategy(times) {
        if (times > 3) {
            return null; // Stop reconnecting if Redis is not running
        }
        return 2000;
    }
});

redisConnection.on("error", (err) => {
    // Suppress unhandled ECONNREFUSED loops if Redis server is offline
});

module.exports = redisConnection;
