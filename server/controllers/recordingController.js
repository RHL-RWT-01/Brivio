import fs from "fs/promises";
import multer from "multer";
import { processAudioJob } from "../utils/audioProcessor.js";
import Recording from "../models/recordingModel.js";
import { getAudioDuration } from "../utils/getDuration.js";
import { error } from "console";
import { addJob } from "../utils/redisQueue.js";

// Your existing Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

export const createRecording = async (req, res) => {
    try {
        const alreadyProcessing = await Recording.findOne({ user: req.user._id, status: "processing" });
        if (alreadyProcessing) {
            return res.status(409).json({ error: "A recording is already being processed. Please wait." });
        }

        await new Promise((resolve, reject) => {
            upload.single('recording')(req, res, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const duration = await getAudioDuration(req.file.path);
        const MAX_DURATION_SECONDS = 60 * 10;
        if (duration > MAX_DURATION_SECONDS) {
            await fsp.unlink(req.file.path);
            return res.status(400).json({ error: "Audio duration must not exceed 10 minutes." });
        }

        const newRecording = new Recording({
            user: req.user._id,
            filePath: req.file.path,
            status: "uploaded",
            duration: duration,
        });
        await newRecording.save();

        await addJob({ recordingId: newRecording._id });

        res.status(202).json({
            message: "Recording uploaded successfully and is being processed.",
            recordingId: newRecording._id,
        });

    } catch (error) {
        console.error("Error in createRecording controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getRecordingById = async (req, res) => {
    try {
        const recordingId = req.params.id;
        const recording = await Recording.findOne({ _id: recordingId, user: req.user._id });

        if (!recording) {
            return res.status(404).json({ error: "Recording not found or is still processing." });
        }

        res.status(200).json(recording);
    } catch (error) {
        console.error("Error fetching single recording:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllRecordings = async (req, res) => {
    try {
        console.log("Fetching all recordings for user:", req.user._id);
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const recordings = await Recording.find({ user: userId, status: "completed" })
            .select("status title duration createdAt")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({ recordings });
        console.log("Fetched recordings:", recordings);
    } catch (error) {
        console.error("Error fetching recordings:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const processing = async (req, res) => {
    try {
        const userId = req.user._id;
        const recording = await Recording.find({ user: userId, status: "processing" })
        if (recording && recording.length > 0) {
            return res.status(200).json({ error: "Your last recording is processing, You have to wait to upload new recording", recording: recording });
        }

        res.status(200).json({ message: "No recording is currently being processed." });
    } catch (error) {
        console.error("Error fetching processing recordings:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
