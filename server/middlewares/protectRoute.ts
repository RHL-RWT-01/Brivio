import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/userModel.js";

interface IProtectRequest extends Request {
  user?: IUser;
  cookies: { [key: string]: any };
}

export const protectRoute = async (
  req: IProtectRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ error: "Unauthorized: No Token Provided" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload & {
      userId: string;
    };

    if (!decoded || !decoded.userId) {
      res.status(401).json({ error: "Unauthorized: Invalid Token" });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    req.user = user;
    // console.log("Authenticated user:", user);
    next();
  } catch (err) {
    console.log("Error in protectRoute middleware", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
