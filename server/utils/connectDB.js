import mongoose from "mongoose";

const connectDB = async () => {
	try {
        if (!process.env.MONGO_URI) {
			console.error("MongoDB URI is not defined");
			process.exit(1);
		}
		// console.log("Connecting to MongoDB...",process.env.MONGO_URI);
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error connection to mongoDB: ${error.message}`);
		process.exit(1);
	}
};

export default connectDB;

