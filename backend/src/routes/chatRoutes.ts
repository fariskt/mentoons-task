import express from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { getUserChat } from '../controllers/chatControllet';

const chatRoutes = express.Router()

chatRoutes.get("/:otherUserId", verifyToken, getUserChat)

export default chatRoutes