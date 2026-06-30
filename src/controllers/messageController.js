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

        // Notify realtime-service asynchronously
        const realtimeServiceUrl = process.env.REALTIME_SERVICE_URL || "http://localhost:5004";
        fetch(`${realtimeServiceUrl}/internal/message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message
            })
        }).catch(err => {
            console.error("Failed to notify realtime service:", err.message);
        });

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


export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const senderId = req.headers["x-user-id"];

        if (!conversationId) {
            return res.status(400).json({
                success: false,
                message: "conversationId is required"
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

        const messages = 
            await Message.find({ conversationId })
                .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


export const editMessage = async (req, res) => {
    try {
        const senderId = req.headers["x-user-id"];
        const { messageId } = req.params;
        const { content } = req.body;

        if (!messageId || !content) {
            return res.status(400).json({
                success: false,
                message: "messageId and content are required"
            });
        }

        const message = 
            await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        if (message.senderId.toString() !== senderId) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own messages"
            });
        }

        message.content = content;
        message.isEdited = true;
        message.editedAt = new Date();

        await message.save();

        res.status(200).json({
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


export const deleteMessage = async (req, res) => {
    try {
        const senderId = req.headers["x-user-id"];
        const { messageId } = req.params;

        if (!messageId) {
            return res.status(400).json({
                success: false,
                message: "messageId is required"
            });
        }

        const message = 
            await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        if (message.senderId.toString() !== senderId) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own messages"
            });
        }

        const conversationId = message.conversationId;

        await Message.findByIdAndDelete(messageId);

       
        const lastMessage = 
            await Message.findOne({ conversationId })
                .sort({ createdAt: -1 });

        if (lastMessage) {
            const conversation = 
                await Conversation.findById(conversationId);
            conversation.lastMessage = lastMessage.content;
            conversation.lastMessageAt = lastMessage.createdAt;
            await conversation.save();
        }

        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};