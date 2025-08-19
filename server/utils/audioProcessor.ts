import * as fsp from "fs/promises";
import * as fs from "fs";
import {
  createClient,
  DeepgramClient,
  SyncPrerecordedResponse,
} from "@deepgram/sdk";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
import { IRecording, Recording } from "../models/recordingModel.js";

interface ISummaryResponse {
  title: string;
  summary: string;
}

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
if (!deepgramApiKey) {
  throw new Error("DEEPGRAM_API_KEY environment variable is not set.");
}
const deepgram: DeepgramClient = createClient(deepgramApiKey);

const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  throw new Error("OPENAI_API_KEY environment variable is not set.");
}
const openai: OpenAI = new OpenAI({
  apiKey: openaiApiKey,
});

const getTranscription = async (filePath: string): Promise<string> => {
  try {
    const audioSource = fs.createReadStream(filePath);
    const options = { model: "nova-2" };
    const { result, error } = (await deepgram.listen.prerecorded.transcribeFile(
      audioSource,
      options
    )) as { result: SyncPrerecordedResponse; error: any };

    if (error) {
      console.error("Error during Deepgram transcription:", error);
      throw new Error("Transcription failed.");
    }

    const transcript =
      result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
    if (!transcript) {
      throw new Error("Deepgram returned no transcript.");
    }

    return transcript;
  } catch (err) {
    console.error("Error in getTranscription:", err);
    throw err;
  }
};

const getAiSummary = async (transcript: string): Promise<ISummaryResponse> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates a concise summary and a creative, relevant title for an audio transcript. The response must be a JSON object with 'title' and 'summary' keys.",
        },
        {
          role: "user",
          content: `Here is the audio transcript: "${transcript}"`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const jsonContent = completion.choices[0]?.message?.content;
    if (!jsonContent) {
      throw new Error("OpenAI returned no content.");
    }

    const jsonResponse: ISummaryResponse = JSON.parse(jsonContent);
    return {
      title: jsonResponse.title,
      summary: jsonResponse.summary,
    };
  } catch (err) {
    console.error("Error during OpenAI summarization:", err);
    throw new Error("Summarization failed.");
  }
};

export const processAudioJob = async (recordingId: string): Promise<void> => {
  let recording: IRecording | null = null;
  try {
    recording = await Recording.findById(recordingId);
    console.log("Found recording:", recording);
    if (!recording) {
      console.log(`Recording with ID ${recordingId} not found. Skipping job.`);
      return;
    }

    if (recording.status === "processing") {
      console.log(
        `Recording ${recordingId} is already being processed. Skipping job.`
      );
      return;
    }
    console.log(
      `Recording ${recordingId} is not being processed. Starting job.`
    );

    recording.status = "processing";
    await recording.save();
    console.log(`Started processing job for recording: ${recordingId}`);

    const transcript = await getTranscription(recording.filePath);
    console.log(`Transcription complete for recording: ${recordingId}`);

    const { title, summary } = await getAiSummary(transcript);
    console.log(`AI summary complete for recording: ${recordingId}`);

    recording.originalTranscript = transcript;
    recording.title = title;
    recording.aiSummary = summary;
    recording.status = "completed";

    await recording.save();
    console.log(`Recording ${recordingId} processed successfully.`);

    await fsp.unlink(recording.filePath);
    console.log(
      `Successfully processed and cleaned up recording: ${recordingId}`
    );
  } catch (error: any) {
    console.error(`Failed to process recording ${recordingId}:`, error.message);
    if (recording) {
      recording.status = "failed";
      await recording.save();
    }
    throw new Error(`Failed to process recording ${recordingId}: ${error.message}`);
  }
};
