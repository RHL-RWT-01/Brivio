import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { createRecording, getAllRecordings, getRecordingById } from '../controllers/recordingController.js';

const recordingRouter = express.Router();

recordingRouter.post('/', protectRoute, createRecording);
recordingRouter.get('/all', protectRoute, getAllRecordings);
recordingRouter.get('/:id', protectRoute, getRecordingById);


export default recordingRouter;