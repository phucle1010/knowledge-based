import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ratelimiter } from "@/lib/middlewares/rate-limiter";

export async function proxy(request: NextRequest) {
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
    matcher: "/api/:path*",
};
