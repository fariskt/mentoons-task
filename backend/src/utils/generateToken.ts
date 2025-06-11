import Jwt from 'jsonwebtoken';

export const generateToken = (userId: string | unknown): string => {
  if (!process.env.TOKEN_SECRET) {
    throw new Error("token secret is not defined in the env");
  }
  return Jwt.sign({ _id: userId}, process.env.TOKEN_SECRET, {
    expiresIn: "7d",
  });
};