import express from "express";
import { deleteMessage, editMessage, getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post("/messages", sendMessage);
router.get("/messages/:conversationId", getMessages);
router.patch("/messages/:messageId", editMessage);
router.delete("/messages/:messageId", deleteMessage);

export default router;