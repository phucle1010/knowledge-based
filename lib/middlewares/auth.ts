import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";

export interface AuthenticatedRequest extends NextRequest {
    user?: {
        id: string;
        email: string;
        name: string;
    };
}

/**
 * API route context type for Next.js
 */
interface ApiRouteContext {
    params: Promise<Record<string, string | string[]>>;
    searchParams?: URLSearchParams;
    [key: string]: unknown;
}

/**
 * Middleware to authenticate JWT tokens
 */
export async function authenticateToken(request: NextRequest): Promise<{
    user: { id: string; email: string; name: string } | null;
    response: NextResponse | null;
}> {
    try {
        const authHeader = request.headers.get("authorization");
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
}

/**
 * Higher-order function to protect API routes
 */
export function withAuth(handler: (request: AuthenticatedRequest, context?: ApiRouteContext) => Promise<NextResponse>) {
    return async (request: NextRequest, context?: ApiRouteContext): Promise<NextResponse> => {
        const { user, response } = await authenticateToken(request);

        if (response) {
            return response;
        }

        // Add user to request
        (request as AuthenticatedRequest).user = user!;

        return handler(request as AuthenticatedRequest, context);
    };
}
