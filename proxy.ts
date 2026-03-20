import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ratelimiter } from "@/lib/middlewares/rate-limiter";

const isAuthRoute = (pathname: string): boolean => {
    return pathname.startsWith("/auth");
};

const shouldSkipRedirect = (pathname: string): boolean => {
    return (
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next/static") ||
        pathname.startsWith("/_next/image") ||
        pathname === "/favicon.ico" ||
        pathname.startsWith("/assets") ||
        pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/i) !== null
    );
};

export const proxy = async (request: NextRequest) => {
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

    // Skip redirect logic for API routes, assets, and images
    if (shouldSkipRedirect(request.nextUrl.pathname)) {
        return NextResponse.next();
    }

    // Check if user is on auth routes and has valid access token
    const accessToken = request.cookies.get("accessToken")?.value;

    if (isAuthRoute(request.nextUrl.pathname) && accessToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!isAuthRoute(request.nextUrl.pathname) && !accessToken) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (request.nextUrl.pathname === "/" && accessToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
};

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
