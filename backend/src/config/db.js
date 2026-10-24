import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error(
            "MONGODB_URI is missing from the backend .env file"
        );
    }

    try {
        const connection = await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            `MongoDB connected: ${connection.connection.host}`
        );

        return connection;
    } catch (error) {
        console.error(
            "MongoDB connection failed:",
            error.message
        );

        throw error;
    }
};

export default connectDB;