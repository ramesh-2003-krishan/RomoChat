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