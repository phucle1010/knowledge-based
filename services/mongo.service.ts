import mongoose, { ConnectionStates } from "mongoose";

import { ENV } from "@/lib/constants/env";

export class MongoService {
    private static instance: typeof mongoose | null = null;

    static async connect(): Promise<typeof mongoose> {
        if (this.instance) {
            return this.instance;
        }

        if (mongoose.connection.readyState === ConnectionStates.connected) {
            this.instance = mongoose;
            return this.instance;
        }

        try {
            console.info("Connecting to MongoDB...");

            const connectionOptions = {
                bufferCommands: false,
                serverSelectionTimeoutMS: 20000, // Timeout after 20s
                socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
                maxPoolSize: 10, // Maintain up to 10 socket connections
                family: 4, // Use IPv4, skip trying IPv6
            };

            const client = await mongoose.connect(ENV.MONGODB_URI, connectionOptions);

            this.instance = client;
            console.info("MongoDB connected successfully");

            return this.instance;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);

            // Provide more specific error messages
            let userFriendlyMessage = "Failed to connect to database";

            if (errorMessage.includes("ETIMEOUT") || errorMessage.includes("querySrv")) {
                userFriendlyMessage = "Database connection timeout. Please check your internet connection and MongoDB URI.";
            } else if (errorMessage.includes("ECONNREFUSED")) {
                userFriendlyMessage = "Database connection refused. Please check if MongoDB is running and accessible.";
            } else if (errorMessage.includes("authentication failed")) {
                userFriendlyMessage = "Database authentication failed. Please check your MongoDB credentials.";
            } else if (errorMessage.includes("ENOTFOUND")) {
                userFriendlyMessage = "Database host not found. Please check your MongoDB URI.";
            }

            console.error(`MongoDB Connection Error: ${errorMessage}`);
            throw new Error(userFriendlyMessage);
        }
    }

    static async disconnect(): Promise<void> {
        if (this.instance) {
            await mongoose.disconnect();
            this.instance = null;
            console.info("Disconnected from MongoDB");
        }
    }
}
