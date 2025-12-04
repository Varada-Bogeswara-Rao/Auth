import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI;

        // 1. Safety Check: Ensure the URI actually exists
        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined in the environment variables");
        }

        console.log("mongo_uri: ", mongoURI);

        const conn = await mongoose.connect(mongoURI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // 2. Type Guard: safely extract the error message
        const errorMessage = error instanceof Error ? error.message : "Unknown Error";

        console.log("Error connection to MongoDB: ", errorMessage);
        process.exit(1); // 1 is failure, 0 status code is success
    }
};