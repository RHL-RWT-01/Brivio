import mongoose from "mongoose";

const recordingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        filePath: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: false,
        },
        status: {
            type: String,
            enum: ["uploaded", "processing", "completed", "failed"],
            default: "uploaded",
        },
        originalTranscript: {
            type: String,
            required: false,
        },
        title: {
            type: String,
            required: false,
        },
        aiSummary: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Recording = mongoose.model("Recording", recordingSchema);

export default Recording;