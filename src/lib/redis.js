const IORedis = require("ioredis");

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is missing");
}

const redisConnection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redisConnection.on("error", (error) => {
  console.error("Redis error:", error.message);
});

module.exports = { redisConnection };
