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
      };

      const client = await mongoose.connect(ENV.MONGODB_URI, connectionOptions);

      this.instance = client;
      console.info("MongoDB connected successfully");

      return this.instance;
    } catch (error) {
      const message = `Failed to connect MongoDB: ${error instanceof Error ? error.message : JSON.stringify(error)}`;
      console.error(message);
      throw new Error(message);
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
