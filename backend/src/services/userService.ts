import { Response } from "express";
import { comparePassword, hashPassword } from "../utils/passwordHash";
import { generateToken } from "../utils/generateToken";
import { LoginData, RegisterUserData } from "../types";
import User from "../models/userSchema";

export const loginUserService = async (data: LoginData, res: Response) => {
  const user = await User.findOne({ email: data.email }).select("password");
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const validateUser = await comparePassword(data.password, user.password);

  if (!validateUser) {
    res.status(401).json({ message: "Incorrect password" });
    return;
  }
  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    message: "User logged in",
    token,
    user: {
      id: user._id.toString(),
      name: user.username,
      email: user.email,
    },
  };
};

export const registerUserService = async (
  data: RegisterUserData,
  res: Response
) => {
  const { firstname, lastname, email, password } = data;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }
  const hashedPassword = await hashPassword(password);
  const newUser = new User({
    username: firstname + " " + lastname,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  return {
    message: "User registration successful",
  };
};
