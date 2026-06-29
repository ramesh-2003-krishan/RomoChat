import Conversation from "../models/Conversation.js";

export const createConversation = async (req, res) => {
    try {

        const senderId = req.headers["x-user-id"];
        const { receiverId } = req.body;

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "receiverId is required"
            });
        }

        if (senderId === receiverId) {
            return res.status(400).json({
                success: false,
                message: "You cannot create a conversation with yourself"
            });
        }

        const existingConversation =
            await Conversation.findOne({
                participants: {
                    $all: [senderId, receiverId]
                }
            });

        if (existingConversation) {
            return res.status(200).json({
                success: true,
                conversation: existingConversation
            });
        }

        const conversation =
            await Conversation.create({
                participants: [
                    senderId,
                    receiverId
                ]
            });

        res.status(201).json({
            success: true,
            conversation
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


export const getConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const senderId = req.headers["x-user-id"];

        if (!conversationId) {
            return res.status(400).json({
                success: false,
                message: "conversationId is required"
            });
        }

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

       
        if (!conversation.participants.includes(senderId)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        res.status(200).json({
            success: true,
            conversation
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


export const getUserConversations = async (req, res) => {
    try {
        const senderId = req.headers["x-user-id"];

        const conversations = await Conversation.find({
            participants: senderId
        }).sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            conversations
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};