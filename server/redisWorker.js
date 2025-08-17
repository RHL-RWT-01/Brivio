import { processAudioJob } from "./utils/audioProcessor.js";
import connectDB from "./utils/connectDB.js";
import { getJob } from "./utils/redisQueue.js";

const runWorker = async () => {
    console.log('Redis worker started, waiting for jobs...');
    await connectDB();
    while (true) {
        try {
            const job = await getJob();
            if (job && job.recordingId) {
                console.log(`Processing new audio job from Redis: ${job.recordingId}`);
                await processAudioJob(job.recordingId);
                console.log(`Finished processing job: ${job.recordingId}`);
            }
        } catch (error) {
            console.error('Error in Redis worker loop:', error);
        }
    }
};

runWorker().catch(console.error);