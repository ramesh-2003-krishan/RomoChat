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


export const editProfile = async (req, res) => {
    try {

        const userId =
            req.headers["x-user-id"];

        const {
            username,
            email,
            bio,
            avatar,
            displayName
        } = req.body;

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

        
        if (username && username !== profile.username) {
            const existingUsername =
                await UserProfile.findOne({
                    username,
                    authUserId: { $ne: userId }
                });

            if (existingUsername) {
                return res.status(400).json({
                    success: false,
                    message: "Username already taken"
                });
            }
        }

        
        if (username) profile.username = username;
        if (email) profile.email = email;
        if (bio) profile.bio = bio;
        if (avatar) profile.avatar = avatar;
        if (displayName) profile.displayName = displayName;

        await profile.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


export const updateOnlineStatus = async (req, res) => {
    try {

        const userId =
            req.headers["x-user-id"];

        const { isOnline } = req.body;

        if (typeof isOnline !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isOnline must be a boolean"
            });
        }

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

        profile.isOnline = isOnline;
        profile.lastSeen = new Date();

        await profile.save();

        res.status(200).json({
            success: true,
            message: "Online status updated",
            profile
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};
