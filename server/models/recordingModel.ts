import mongoose, { Schema, Document, Model, Types } from "mongoose";
import IUser from "./userModel.js"

export interface IRecording extends Document {
  user: Types.ObjectId | mongoose.PopulatedDoc<typeof IUser>;
  filePath: string;
  duration?: number;
  status: "uploaded" | "processing" | "completed" | "failed";
  originalTranscript?: string;
  title?: string;
  aiSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const recordingSchema: Schema<IRecording> = new Schema<IRecording>(
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

const Recording: Model<IRecording> = mongoose.model<IRecording>("Recording", recordingSchema);

export { Recording };
