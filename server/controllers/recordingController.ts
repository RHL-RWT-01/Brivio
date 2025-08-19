import { Request, Response } from "express";
import multer from "multer";
import * as fsp from "fs/promises";
import { ObjectId } from "mongoose";
import { IRecording, Recording } from "../models/recordingModel.js";
import { getAudioDuration } from "../utils/getDuration.js";
import { addJob } from "../utils/redisQueue.js";

interface IAuthRequest extends Request {
  user?: {
    _id: ObjectId;
  };
  file?: Express.Multer.File;
  query: {
    page?: string;
    limit?: string;
  };
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export const createRecording = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req?.user?._id;

    const alreadyProcessing = await Recording.findOne({
      user: userId,
      status: "processing",
    });
    if (alreadyProcessing) {
      res.status(409).json({
        error: "A recording is already being processed. Please wait.",
      });
      return;
    }

    await new Promise<void>((resolve, reject) => {
      upload.single("recording")(req, res, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    const duration: number = await getAudioDuration(req.file.path);
    console.log("Audio duration is:", duration);
    const MAX_DURATION_SECONDS = 60 * 10;
    if (duration > MAX_DURATION_SECONDS) {
      await fsp.unlink(req.file.path);
      res
        .status(400)
        .json({ error: "Audio duration must not exceed 10 minutes." });
      return;
    }

    const newRecording: IRecording = new Recording({
      user: userId,
      filePath: req.file.path,
      status: "uploaded",
      duration: duration,
    });
    await newRecording.save();

    console.log("New recording created:", newRecording._id);
    await addJob({ recordingId: (newRecording._id as ObjectId).toString() });
    console.log(
      "Job added to processing queue for recording:",
      newRecording._id
    );
    res.status(202).json({
      message: "Recording uploaded successfully and is being processed.",
      recordingId: newRecording._id,
    });
  } catch (error: any) {
    console.error("Error in createRecording controller:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getRecordingById = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { id: recordingId } = req.params;
    const recording = await Recording.findOne({
      _id: recordingId,
      user: req.user._id,
    });

    if (!recording) {
      res
        .status(404)
        .json({ error: "Recording not found or is still processing." });
      return;
    }

    res.status(200).json(recording);
  } catch (error: any) {
    console.error("Error fetching single recording:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllRecordings = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req?.user?._id;
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);

    // await new Promise((resolve) =>
    //   setTimeout(() => {
    //     resolve;
    //   }, 3000)
    // );

    const recordings = await Recording.find({
      user: userId,
      status: "completed",
    })
      .select("status title duration createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ recordings });
  } catch (error: any) {
    console.error("Error fetching recordings:", error);
    res.status(500).json({ error: error.message });
  }
};

export const processing = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req?.user?._id;
    const recording = await Recording.find({
      user: userId,
      status: "processing",
    });
    if (recording && recording.length > 0) {
      res.status(200).json({
        error:
          "Your last recording is processing, You have to wait to upload new recording",
        recording: recording,
      });
      return;
    }
    res
      .status(200)
      .json({ message: "No recording is currently being processed." });
  } catch (error: any) {
    console.error("Error fetching processing recordings:", error);
    res.status(500).json({ error: error.message });
  }
};
