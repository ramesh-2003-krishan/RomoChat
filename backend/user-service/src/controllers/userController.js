import UserProfile from "../models/UserProfile.js";

export const getProfile = async (req, res) => {
    try {

        const profile =
            await UserProfile.findOne({
                authUserId: req.user.userId
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