import express from "express";
import { createProfile, getProfile } from "../controllers/userController.js";
import { extractUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/internal/profile", createProfile);
router.get("/profile", extractUser, getProfile);

export default router;