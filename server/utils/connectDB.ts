import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("MongoDB URI is not defined");
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error connection to mongoDB: ${error.message}`);
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

export default connectDB;
