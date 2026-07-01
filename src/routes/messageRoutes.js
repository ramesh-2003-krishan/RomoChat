import express from "express";
import { deleteMessage, editMessage, getMessages, sendMessage, markMessagesAsRead } from "../controllers/messageController.js";

const router = express.Router();

router.post("/messages", sendMessage);
router.get("/messages/:conversationId", getMessages);
router.patch("/messages/read/:conversationId", markMessagesAsRead);
router.patch("/messages/:messageId", editMessage);
router.delete("/messages/:messageId", deleteMessage);

export default router;