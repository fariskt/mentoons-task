import { Request, Response } from "express";
import asyncHanlder from "express-async-handler";
import { loginUserService, registerUserService } from "../services/userService";
import {
  loginSchema,
  registerSchema,
  validate,
} from "../utils/validateRequest";
import User from "../models/userSchema";
import { CustomRequest } from "../types";

export const registerUser = asyncHanlder(
  async (req: Request, res: Response) => {
    const { isValid, messages } = validate(registerSchema, req.body);
    if (!isValid) {
      res.status(400).json({ errors: messages });
      return;
    }
    const loginData = await registerUserService(req.body, res);
    res.status(200).json({ message: "Login success", data: loginData });
  }
);

export const loginUser = asyncHanlder(async (req: Request, res: Response) => {
  const loginData = await loginUserService(req.body, res);
  const { isValid, messages } = validate(loginSchema, req.body);
  if (!isValid) {
    res.status(400).json({ errors: messages });
    return;
  }
  res.status(200).json({ message: "Login success", data: loginData });
});

export const getAllUsers = asyncHanlder(async (req: CustomRequest, res: Response) => {
    const userId = req.user?._id;
  const allusers = await User.find({_id : {$ne: userId}}).sort({ createdAt: -1 });
  if (!allusers || allusers.length < 0) {
    res.status(404).json({ message: "No users found" });
  }
  res
    .status(200)
    .json({ message: "All users fetched successfully", data: allusers });
});


export const getLoginUser = asyncHanlder(async (req:CustomRequest, res:Response)=> {
    const userID = req.user?._id;
    if(!userID){
      res.status(401).json({message: "Unauthorized"})
      return
    }
    const user = await User.findById(userID).select("-password")
    res.status(200).json({message: "User data fetched success", user})
})


export const getUserById = asyncHanlder(async (req:CustomRequest, res:Response)=> {
    const userID = req.params.userId;
    if(!userID){
      res.status(401).json({message: "Please provide a userId"})
      return
    }
    const user = await User.findById(userID).select("-password")
    res.status(200).json({message: "User data fetched success", user})
})

