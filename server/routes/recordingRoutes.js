import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { createRecording, getAllRecordings, getRecordingById, processing } from '../controllers/recordingController.js';

const recordingRouter = express.Router();

recordingRouter.post('/new', protectRoute, createRecording);
recordingRouter.get('/processing', protectRoute, processing);
recordingRouter.get('/all', protectRoute, getAllRecordings);
recordingRouter.get('/:id', protectRoute, getRecordingById);


export default recordingRouter;