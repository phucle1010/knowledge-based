export const validateEnvironment = () => {
    const requiredVars = ["NEXT_PUBLIC_MONGODB_URI", "NEXT_PUBLIC_JWT_SECRET", "NEXT_PUBLIC_GROQ_API_KEY", "NEXT_PUBLIC_MILVUS_ADDRESS"];

    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error("Missing required environment variables:");
        missingVars.forEach((varName) => {
            console.error(`   - ${varName}`);
        });
        console.error("\nPlease check your .env file and ensure all required variables are set.");
        console.error("Refer to .env.example for the complete list of required variables.");
    }

    // Validate MongoDB URI format
    const mongoUri = process.env.NEXT_PUBLIC_MONGODB_URI!;
    if (!mongoUri?.startsWith("mongodb://") && !mongoUri?.startsWith("mongodb+srv://")) {
        console.error("Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://");
    }

    // Validate JWT secret length
    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET!;
    if (jwtSecret?.length < 32) {
        console.warn("Warning: JWT secret is quite short. Consider using a longer, more secure secret (at least 32 characters).");
    }

    console.log("Environment variables validated successfully");
};
