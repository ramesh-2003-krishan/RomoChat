export const extractUser = (req, res, next) => {
    const userId = req.headers["x-user-id"];
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Missing user identity"
        });
    }
    req.user = { userId };
    next();
};
