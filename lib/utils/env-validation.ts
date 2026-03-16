import { logger } from "./logger";

export const validateEnvironment = () => {
    const requiredVars = ["NEXT_PUBLIC_MONGODB_URI", "NEXT_PUBLIC_JWT_SECRET", "NEXT_PUBLIC_GROQ_API_KEY", "NEXT_PUBLIC_MILVUS_ADDRESS"];

    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
        logger.error("Missing required environment variables:");
        missingVars.forEach((varName) => {
            logger.error(`   - ${varName}`);
        });
        logger.error("\nPlease check your .env file and ensure all required variables are set.");
        logger.error("Refer to .env.example for the complete list of required variables.");
    }

    // Validate MongoDB URI format
    const mongoUri = process.env.NEXT_PUBLIC_MONGODB_URI!;
    if (!mongoUri?.startsWith("mongodb://") && !mongoUri?.startsWith("mongodb+srv://")) {
        logger.error("Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://");
    }

    // Validate JWT secret length
    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET!;
    if (jwtSecret?.length < 32) {
        logger.warn("Warning: JWT secret is quite short. Consider using a longer, more secure secret (at least 32 characters).");
    }

    logger.info("Environment variables validated successfully");
};
