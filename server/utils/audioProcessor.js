import fsp from "fs/promises";
import fs from "fs";
import { createClient } from "@deepgram/sdk";
import OpenAI from "openai";
import Recording from "../models/recordingModel.js";
import dotenv from "dotenv";
dotenv.config();
// Initialize Deepgram and OpenAI clients
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


const getTranscription = async (filePath) => {
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
        fs.createReadStream(filePath),
        {
            model: "nova-2",
        }
    );

    if (error) {
        console.error("Error during Deepgram transcription:", error);
        throw new Error("Transcription failed.");
    }

    return result.results.channels[0].alternatives[0].transcript;
};

const getAiSummary = async (transcript) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that generates a concise summary and a creative, relevant title for an audio transcript. The response must be a JSON object with 'title' and 'summary' keys.",
                },
                {
                    role: "user",
                    content: `Here is the audio transcript: "${transcript}"`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const jsonResponse = JSON.parse(completion.choices[0].message.content);
        return {
            title: jsonResponse.title,
            summary: jsonResponse.summary,
        };
    } catch (err) {
        console.error("Error during OpenAI summarization:", err);
        throw new Error("Summarization failed.");
    }
};


export const processAudioJob = async (recordingId) => {
    let recording;
    try {
        recording = await Recording.findById(recordingId);
        if (!recording) return;

        recording.status = "processing";
        await recording.save();

        const transcript = await getTranscription(recording.filePath);

        const { title, summary } = await getAiSummary(transcript);

        recording.originalTranscript = transcript;
        recording.title = title;
        recording.aiSummary = summary;
        recording.status = "completed";

        await recording.save();

        await fsp.unlink(recording.filePath);
        console.log(`Successfully processed and cleaned up recording: ${recordingId}`);

    } catch (error) {
        console.error(`Failed to process recording ${recordingId}:`, error.message);
        if (recording) {
            recording.status = "failed";
            await recording.save();
        }
    }
};