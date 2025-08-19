import express, {
  Express,
  Request,
  Response,
  NextFunction,
} from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

import authRouter from "./routes/authRoutes.js";
import connectDB from "./utils/connectDB.js";
import recordingRouter from "./routes/recordingRoutes.js";
import { connectRedis } from "./utils/redisQueue.js";


const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRouter);
app.use("/api/recordings", recordingRouter);

app.use((req, res, next) => {
  res.status(404).send("Sorry, the page you requested was not found.");
});


app.listen(PORT, async () => {
  try {
    await connectDB();
    await connectRedis();

    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); 
  }
});
