import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ratelimiter } from "@/lib/middlewares/rate-limiter";
import { validateEnvironment } from "@/lib/utils/env-validation";

export async function proxy(request: NextRequest) {
    try {
        validateEnvironment();
    } catch (error) {
        return NextResponse.json(
            {
                error: "Environment configuration error",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }

    if (request.nextUrl.pathname.startsWith("/api")) {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";

        const { success, limit, reset, remaining } = await ratelimiter.limit(ip);

        if (!success) {
            return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
                status: 429,
                headers: {
                    "Content-Type": "application/json",
                    "X-RateLimit-Limit": limit.toString(),
                    "X-RateLimit-Remaining": remaining.toString(),
                    "X-RateLimit-Reset": reset.toString(),
                },
            });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api/:path*|_next/static|_next/image|favicon.ico).*)",
    ],
};
