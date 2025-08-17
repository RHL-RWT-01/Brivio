import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

import authRouter from './routes/authRoutes.js';
import connectDB from './utils/connectDB.js';
import recordingRouter from './routes/recordingRoutes.js';
import validateURL from './middlewares/validateURL.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(validateURL);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRouter);
app.use('/api/recordings', recordingRouter);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
