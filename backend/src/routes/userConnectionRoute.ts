import express from 'express';
import {  getConnectionRequestedUsers, acceptConnectionRequest, sendConnectionRequest} from '../controllers/connectionController';
import { verifyToken } from '../middleware/verifyToken';

const userConnectionRoutes = express.Router()

userConnectionRoutes.get("/connection/requests",verifyToken,  getConnectionRequestedUsers)
userConnectionRoutes.post("/send-connection/request",verifyToken, sendConnectionRequest)
userConnectionRoutes.post("/connection/approve",verifyToken, acceptConnectionRequest)

export default userConnectionRoutes