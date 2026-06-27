import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
    {
        authUserId: {
            type: String,
            required: true,
            unique: true
        },

        username: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        avatar: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            default: ""
        },

        isOnline: {
            type: Boolean,
            default: false
        },

        lastSeen: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "UserProfile",
    userProfileSchema
);