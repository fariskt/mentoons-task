import { Request } from "express";
import mongoose from "mongoose";

export interface LoginData {
    email: string,
    password:string
}

export interface RegisterUserData {
    firstname:string;
    lastname:string;
    email:string;
    password:string
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  avatar:string;
  about:string;
  createdAt: Date;
  connectionRequests: string[]
}


export interface CustomRequest extends Request {
  user?: {
    _id: string
  };
}