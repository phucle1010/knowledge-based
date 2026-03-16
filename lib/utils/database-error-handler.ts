import { NextRequest, NextResponse } from "next/server";

/**
 * API route context type for Next.js
 */
interface ApiRouteContext {
    params?: Record<string, string | string[]>;
    searchParams?: URLSearchParams;
    [key: string]: unknown;
}

/**
 * Handle database connection errors with appropriate HTTP responses
 */
export const handleDatabaseError = (error: unknown): NextResponse => {
    const errorMessage = error instanceof Error ? error.message : "Database operation failed";

    // Check for specific MongoDB timeout/connection errors
    if (
        errorMessage.includes("Failed to connect MongoDB") ||
        errorMessage.includes("serverSelectionTimeoutMS") ||
        errorMessage.includes("ECONNREFUSED") ||
        errorMessage.includes("ETIMEDOUT")
    ) {
        return NextResponse.json(
            {
                error: "Database connection timeout. Please try again later.",
                details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
            },
            { status: 503 }
        ); // Service Unavailable
    }

    // Check for duplicate key errors (unique constraint violations)
    if (errorMessage.includes("E11000") || errorMessage.includes("duplicate key")) {
        return NextResponse.json(
            {
                error: "Resource already exists",
                details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
            },
            { status: 409 }
        ); // Conflict
    }

    // Generic database error
    return NextResponse.json(
        {
            error: "Database operation failed",
            details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        },
        { status: 500 }
    );
};

/**
 * Higher-order function to wrap API handlers with database error handling
 */
export function withDatabaseHandler(handler: (request: NextRequest, context?: ApiRouteContext) => Promise<NextResponse>) {
    return async (request: NextRequest, context?: ApiRouteContext): Promise<NextResponse> => {
        try {
            return await handler(request, context);
        } catch (error) {
            return handleDatabaseError(error);
        }
    };
}
