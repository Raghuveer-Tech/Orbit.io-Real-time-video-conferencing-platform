import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)

        console.log(`\n MongoDB connected successfully! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MONGODB connection FAILED: ", error);
        
        process.exit(1);
    }
};