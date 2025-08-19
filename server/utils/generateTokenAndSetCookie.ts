import { Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const generateTokenAndSetCookie = (
  id: string | Types.ObjectId,
  res: Response
): void => {
  const isProduction = process.env.NODE_ENV === "production";

  const jwtSecret: string = process.env.JWT_SECRET || "";

  const token = jwt.sign({ userId: id }, jwtSecret, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 5 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
};
