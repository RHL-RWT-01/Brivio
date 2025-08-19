import connectDB from "./utils/connectDB.js";
import { processAudioJob } from "./utils/audioProcessor.js";
import { getJob } from "./utils/redisQueue.js";
import { connectRedis } from "./utils/redisQueue.js";
interface IAudioProcessingJob {
  recordingId: string;
}

const runWorker = async (): Promise<void> => {
  await connectRedis();
  console.log("Redis worker started, waiting for jobs...");
  await connectDB();
  console.log("Database connected for Redis worker.");
  while (true) {
    try {
      const job: IAudioProcessingJob | null = await getJob();
      if (job && job.recordingId) {
        console.log(`Processing new audio job from Redis: ${job.recordingId}`);
        await processAudioJob(job.recordingId);
        console.log(`Finished processing job: ${job.recordingId}`);
      }
    } catch (error) {
      
      console.error("Error in Redis worker loop:", error);
    }
  }
};

runWorker().catch((error) => {
  console.error("Error occurred in Redis worker:", error);
});
