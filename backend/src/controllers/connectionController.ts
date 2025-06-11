import { Response } from "express";
import User from "../models/userSchema";
import { CustomRequest } from "../types";
import asyncHanlder from 'express-async-handler'


export const sendConnectionRequest = asyncHanlder(async (req: CustomRequest, res: Response) => {
  const { targetUserId } = req.body;  
  const senderId = req.user?._id;

  if (!senderId || !targetUserId) {
    res.status(400).json({ message: "senderId and targetUserId required" });
    return 
  }

  if (senderId === targetUserId) {
    res.status(400).json({ message: "Cannot send request to yourself" });
    return 
  }

  const [targetUser, senderUser] = await Promise.all([
    User.findById(targetUserId),
    User.findById(senderId),
  ]);

  if (!targetUser || !senderUser) {
    res.status(404).json({ message: "User(s) not found" });
    return 
  }
  const alreadyRequested = await User.findOne({
    _id: targetUserId,
    connectionRequests: { $in: [senderId] },
  });
  const alreadyConnected = await User.findOne({
    _id: targetUserId,
    connections: { $in: [senderId] },
  });

  if (alreadyRequested) {
    res.status(400).json({ message: "Request already sent" });
    return 
  }
  if (alreadyConnected) {
    res.status(400).json({ message: "Already connected" });
    return 
  }

  await User.updateOne(
    { _id: targetUserId },
    { $addToSet: { connectionRequests: senderId } }
  );

  res.status(200).json({ message: "Request sent successfully" });
});

export const getConnectionRequestedUsers = asyncHanlder(async (req: CustomRequest, res: Response) => {
  const userId = req.user?._id;
  
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return 
  }

  const user = await User.findById(userId);
  
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return 
  }

  const requesters = await Promise.all(
    user.connectionRequests.map(async (requestUserId) => {
      const details = await User.findById(requestUserId).select('username avatar');
      return details;
    })
  );

  const validRequesters = requesters.filter((requester) => requester !== null);
  res.status(200).json({ requesters: validRequesters });
});


export const acceptConnectionRequest = asyncHanlder(async (req: CustomRequest, res: Response) => {
  const { senderId } = req.body; 
  const receiverId = req.user?._id; 

  if (!receiverId || !senderId) {
    res.status(400).json({ message: "senderId and receiverId are required" });
    return;
  }

  if (receiverId === senderId) {
    res.status(400).json({ message: "Cannot accept request from yourself" });
    return;
  }

  const [senderUser, receiverUser] = await Promise.all([
    User.findById(senderId),
    User.findById(receiverId),
  ]);

  if (!senderUser || !receiverUser) {
    res.status(404).json({ message: "User(s) not found" });
    return;
  }

  const hasRequest = receiverUser.connectionRequests.includes(senderId);
  if (!hasRequest) {
    res.status(400).json({ message: "No connection request from this user" });
    return;
  }

  await Promise.all([
    User.updateOne(
      { _id: receiverId },
      {
        $pull: { connectionRequests: senderId },
        $addToSet: { connections: senderId },
      }
    ),
    User.updateOne(
      { _id: senderId },
      {
        $addToSet: { connections: receiverId },
      }
    ),
  ]);

  res.status(200).json({ message: "Connection request accepted" });
});
