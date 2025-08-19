"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recording = void 0;
var mongoose_1 = require("mongoose");
var recordingSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
var Recording = mongoose_1.default.model("Recording", recordingSchema);
exports.Recording = Recording;
