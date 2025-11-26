import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import { createClient } from "redis";
import userRoutes from "./routes/user.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import cors from "cors";
dotenv.config();
connectDb();
connectRabbitMQ();
export const redisClient = createClient({
    url: process.env.REDIS_URL,
});
redisClient
    .connect()
    .then(() => console.log("connected to redis"))
    .catch(console.error);
const app = express();
app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://unenjoying-addorsed-mica.ngrok-free.dev",
        "https://real-time-chat-iqnw.vercel.app",
    ],
    credentials: true,
}));
app.use("/api/v1", userRoutes);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
