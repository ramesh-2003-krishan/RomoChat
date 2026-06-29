import express from "express";
import { createConversation, getConversation, getUserConversations } from "../controllers/chatController.js";

const router = express.Router();

router.post("/conversations", createConversation);
router.get("/conversations/:conversationId", getConversation);
router.get("/conversations", getUserConversations);

export default router;