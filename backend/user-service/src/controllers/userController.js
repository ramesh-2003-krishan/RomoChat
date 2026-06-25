import UserProfile from "../models/UserProfile.js";

export const getProfile = async (req, res) => {

    try {

        const userId =
            req.headers["x-user-id"];

        const profile =
            await UserProfile.findOne({
                authUserId: userId
            });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        res.status(200).json({
            success: true,
            profile
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

export const createProfile = async (req, res) => {
    try {

        const {
            authUserId,
            username,
            email
        } = req.body;

        const existingProfile =
            await UserProfile.findOne({
                authUserId
            });

        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: "Profile already exists"
            });
        }

        const profile =
            await UserProfile.create({
                authUserId,
                username,
                email
            });

        res.status(201).json({
            success: true,
            profile
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};
