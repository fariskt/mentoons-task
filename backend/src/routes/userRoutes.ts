import express from 'express';
import { getAllUsers, loginUser, registerUser, getLoginUser,getUserById} from '../controllers/userController';
import { verifyToken } from '../middleware/verifyToken';

const userRouter = express.Router()

userRouter.post("/register", registerUser) 
userRouter.post("/login", loginUser) 
userRouter.get("/allusers",verifyToken,  getAllUsers)
userRouter.get("/me",verifyToken,  getLoginUser)
userRouter.get("/:userId",  getUserById)


export default userRouter