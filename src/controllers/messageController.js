import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
    try {

        const senderId = req.headers["x-user-id"];

        const { conversationId, content } = req.body;

        if (!conversationId || !content) {
            return res.status(400).json({
                success: false,
                message: "conversationId and content are required"
            });
        }

        const conversation =
            await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        if (!conversation.participants.includes(senderId)) {
            return res.status(403).json({
                success: false,
                message: "You are not a participant of this conversation"
            });
        }

        const message =
            await Message.create({
                conversationId,
                senderId,
                content
            });

        conversation.lastMessage = content;
        conversation.lastMessageAt = new Date();

        await conversation.save();

        res.status(201).json({
            success: true,
            message
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};