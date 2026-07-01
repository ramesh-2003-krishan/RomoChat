import express from "express";
import { createProfile, editProfile, getProfile, getProfileById, searchProfiles, updateOnlineStatus } from "../controllers/userController.js";
import { extractUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/internal/profile", createProfile);
router.get("/profile", extractUser, getProfile);
router.get("/profile/:userId", getProfileById);
router.get("/search", extractUser, searchProfiles);
router.patch("/profile", editProfile);
router.patch("/profile/online-status", updateOnlineStatus);

export default router;