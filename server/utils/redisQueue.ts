import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";
dotenv.config();

interface IAudioProcessingJob {
  recordingId: string;
}

const client: RedisClientType = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("error", (err: Error) => console.log("Redis Client Error", err));

export async function connectRedis(): Promise<void> {
  // return new Promise(async (resolve, reject) => {
  try {
    await client.connect();
    console.log("Redis client connected.");
    // resolve();
  } catch (error: any) {
    console.error(`Failed to connect to Redis: ${error.message}`);
    throw new Error(error);
  }
  // });
}

const queueName = "audio-processing-jobs";

export const addJob = async (jobData: IAudioProcessingJob): Promise<void> => {
  try {
    console.log(`Adding job to Redis queue: ${JSON.stringify(jobData)}`);

    if (!jobData || !jobData.recordingId) {
      throw new Error("Invalid job data provided");
    }

    await client.lPush(queueName, JSON.stringify(jobData)); // [(lPush + lpop)->FIFO       (lPush + lPop)->LIFO ] pooling
    console.log(`Job added to Redis queue: ${JSON.stringify(jobData)}`);
  } catch (error: any) {
    console.error("Failed to add job to Redis queue:", error);
    throw new Error("Failed to add job to Redis queue: " + error.message);
  }
};

export const getJob = async (): Promise<IAudioProcessingJob> => {
  try {
    const result = await client.blPop(queueName, 0); //waits until there’s an item in list, then removes and returns it.
    if (result) {
      return JSON.parse(result.element) as IAudioProcessingJob;
    }
    throw new Error("No job found in Redis queue");
  } catch (error: any) {
    console.error("Failed to get job from Redis queue:", error);
    throw new Error("Failed to get job from Redis queue: " + error.message);
  }
};
