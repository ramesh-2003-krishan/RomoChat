import express from "express";
import { createConversation } from "../controllers/chatController.js";

const router = express.Router();

router.post("/conversations", createConversation);

export default router;