const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_CONNECTIONSTRING);


redisClient.on("connect", () => {
    console.log("✅ Connected to Redis Cloud");
});

redisClient.on("error", (err) => {
    console.error("❌ Error connecting to Redis Cloud", err);
});

module.exports = redisClient;
