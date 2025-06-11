import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

interface CustomRequest extends Request {
  user?: { _id: string }; 
}

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return 
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
    if (typeof decoded === "string" || !decoded._id) {
        res.status(401).json({ message: "Invalid token payload" });
      return 
    }
    req.user = { _id: decoded._id };
    next();
  } catch (err) {
    res.status(401).json({ message: `Invalid or expired token: ${err}` });
    return 
  }
};