import { Request, Response } from "express";
import Chat from "../models/chatSchema";
import asyncHandler from "express-async-handler";
import { CustomRequest } from "../types";

export const saveMessage = async (data: {
  senderId: string;
  receiverId: string;
  text: string;
}) => {
  const { senderId, receiverId, text } = data;
  const newMessage = new Chat({ senderId, receiverId, text });
  await newMessage.save();
};

export const getUserChat = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { otherUserId } = req.params;
    const  userId = req.user?._id;

    const messages = await Chat.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    if (!messages.length) {
      res.status(404).json({ error: "No messages found between users" });
      return;
    }

    res.json({ messages });
  }
);
