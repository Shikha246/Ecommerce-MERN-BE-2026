import express from "express";
import { handleChatMessage } from "../controllers/chatController.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = express.Router();

router.post("/chat/message", optionalAuth, handleChatMessage);

export default router;