import express from "express";
import { createConversation, deleteConversation, getConversation, getUserConversations } from "../controllers/chatController.js";

const router = express.Router();

router.post("/conversations", createConversation);
router.get("/conversations/:conversationId", getConversation);
router.get("/conversations", getUserConversations);
router.delete("/conversations/:conversationId", deleteConversation);

export default router;