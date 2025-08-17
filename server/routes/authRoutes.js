import express from 'express';
import { getMe, login, signup } from '../controllers/authController.js';
import { protectRoute } from '../middlewares/protectRoute.js';
const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/signup', signup);
authRouter.get('/me', protectRoute, getMe);

export default authRouter;