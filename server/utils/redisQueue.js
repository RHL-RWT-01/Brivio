import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', err => console.log('Redis Client Error', err));

(async () => {
    await client.connect();
    console.log('Redis client connected.');
})();

const queueName = 'audio-processing-jobs';

export const addJob = async (jobData) => {
    try {
        await client.lPush(queueName, JSON.stringify(jobData));
    } catch (error) {
        console.error('Failed to add job to Redis queue:', error);
    }
};

export const getJob = async () => {
    try {
        const result = await client.blPop(queueName, 0);
        if (result) {
            return JSON.parse(result.element);
        }
        return null;
    } catch (error) {
        console.error('Failed to get job from Redis queue:', error);
        return null;
    }
};