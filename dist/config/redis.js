import { createClient } from "redis";
const redisClient = createClient({
    url: process.env.REDIS_URL,
});
redisClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});
redisClient
    .connect()
    .then(() => console.log("✅ Redis connected"))
    .catch(console.error);
export default redisClient;
