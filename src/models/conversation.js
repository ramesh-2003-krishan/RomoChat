import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: String,
                required: true
            }
        ],

        lastMessage: {
            type: String,
            default: ""
        },
        lastMessageSender: {
         type: String,
        default: ""
        },

           isGroup: {
           type: Boolean,
           default: false
        },

        groupName: {
         type: String,
          default: ""
        },

        lastMessageAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Conversation",
    conversationSchema
);