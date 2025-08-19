import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/userModel.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

interface IAuthRequest extends Request {
  user?: {
    id: string;
  };
}

interface ISignupRequestBody {
  fullName?: string;
  email?: string;
  password?: string;
}

interface ILoginRequestBody {
  email?: string;
  password?: string;
}

export const signup = async (
  req: Request<{}, {}, ISignupRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Invalid email format" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
      return;
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: IUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id as string, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error: any) {
    console.log("Error in signup controller", error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (
  req: Request<{}, {}, ILoginRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = (await User.findOne({ email }).select(
      "+password"
    )) as IUser & { _id: string };
    const isPasswordCorrect = user
      ? await bcrypt.compare(password, user.password!)
      : false;

    if (!user || !isPasswordCorrect) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    generateTokenAndSetCookie(user._id, res);
    console.log("User logged in:", user.email);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    console.log("Error in login controller", errorMessage);
    res.status(500).json({ error: errorMessage });
  }
};

export const getMe = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req?.user?.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error: any) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: error.message });
  }
};
