import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({
        service: "Realtime Service",
        status: "Running"
    });
});

app.post("/internal/message", (req, res) => {
    try {
        const { message } = req.body;
        if (!message || !message.conversationId) {
            return res.status(400).json({
                success: false,
                message: "Invalid message body or conversationId"
            });
        }

        const io = app.get("io");
        if (io) {
            io.to(message.conversationId.toString()).emit("new_message", message);
            console.log(`Broadcasted new message in room: ${message.conversationId}`);
        } else {
            console.warn("Socket.io instance not found on app; message not broadcasted.");
        }

        res.status(200).json({
            success: true,
            message: "Message broadcasted successfully"
        });
    } catch (error) {
        console.error("Error broadcasting message:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default app;