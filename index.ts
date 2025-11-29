import express from "express";
import dotenv from "dotenv";
import { createClient } from "redis";
import cors from "cors";
import connectDb from "./src/config/db.js";
import { connectRabbitMQ } from "./src/config/rabbitmq.js";
import userRoutes from "./src/routes/user.js";
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
app.set("trust proxy", 1); // ✅ required for Render/Vercel/Netlify

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://unenjoying-addorsed-mica.ngrok-free.dev",
      "https://real-time-chat-iqnw.vercel.app",
    ],
    credentials: true,
  })
);

app.use("/api/v1", userRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
