import { NextRequest, NextResponse } from "next/server";

import { handleDatabaseError } from "@/lib/utils/database-error-handler";
import { logger } from "@/lib/utils/logger";

import { AuthService } from "@/services/auth.service";

export interface AuthenticatedRequest extends NextRequest {
    user?: {
        id: string;
        email: string;
        name: string;
    };
}

interface ApiRouteContext {
    params: Promise<Record<string, string | string[]>>;
    searchParams?: URLSearchParams;
    [key: string]: unknown;
}

export const authenticateToken = async (
    request: NextRequest
): Promise<{
    user: { id: string; email: string; name: string } | null;
    response: NextResponse | null;
}> => {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return {
                user: null,
                response: NextResponse.json({ error: "Access token required" }, { status: 401 }),
            };
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix
        const decoded = AuthService.verifyToken(token);

        if (!decoded || decoded.type !== "access") {
            return {
                user: null,
                response: NextResponse.json({ error: "Invalid access token" }, { status: 401 }),
            };
        }

        // Get user details
        const user = await AuthService.getProfile(decoded.sub);
        if (!user) {
            return {
                user: null,
                response: NextResponse.json({ error: "User not found" }, { status: 401 }),
            };
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            response: null,
        };
    } catch (error) {
        return {
            user: null,
            response: NextResponse.json({ error: "Authentication failed" }, { status: 401 }),
        };
    }
};

export const withAuth = (handler: (request: AuthenticatedRequest, context?: ApiRouteContext) => Promise<NextResponse>) => {
    return async (request: NextRequest, context?: ApiRouteContext): Promise<NextResponse> => {
        const { user, response } = await authenticateToken(request);

        if (response) {
            return response;
        }

        // Add user to request
        (request as AuthenticatedRequest).user = user!;

        return handler(request as AuthenticatedRequest, context);
    };
};
