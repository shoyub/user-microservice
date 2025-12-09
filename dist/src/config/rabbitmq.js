import amql from "amqplib";
let channel = null;
export const connectRabbitMQ = async () => {
    try {
        const connection = await amql.connect({
            protocol: "amqp",
            hostname: process.env.Rabbitmq_Host,
            port: 5672,
            username: process.env.Rabbitmq_Username,
            password: process.env.Rabbitmq_Password,
        });
        channel = await connection.createChannel();
        console.log("✅ connected to rabbitmq");
    }
    catch (error) {
        console.log("❌ Failed to connect to rabbitmq:", error);
    }
};
export const publishToQueue = async (queueName, message) => {
    if (!channel) {
        console.log("❌ Rabbitmq channel is not initialized");
        return;
    }
    try {
        await channel.assertQueue(queueName, { durable: true });
        const success = channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log("📤 Published to queue:", {
            queue: queueName,
            success,
            payload: message,
        });
    }
    catch (error) {
        console.log("❌ Failed to publish message to queue:", queueName, error);
    }
};
