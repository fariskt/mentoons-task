import express from 'express';
import { getAllUsers, loginUser, registerUser, getLoginUser,getUserById, blockUser} from '../controllers/userController';
import { verifyToken } from '../middleware/verifyToken';

const userRouter = express.Router()

userRouter.post("/register", registerUser) 
userRouter.post("/login", loginUser) 
userRouter.get("/allusers",verifyToken,  getAllUsers)
userRouter.get("/me",verifyToken,  getLoginUser)
userRouter.get("/:userId",  getUserById)
userRouter.patch("/block/:targetUserId",verifyToken, blockUser)


export default userRouter