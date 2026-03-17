import { NextRequest, NextResponse } from "next/server";

import { validateRefreshToken } from "@/lib/validators/auth";

import { AuthService } from "@/services/auth.service";

export const POST = async (request: NextRequest) => {
    try {
        // Get refresh token from cookie instead of body
        const refreshToken = request.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json({ error: "Refresh token required" }, { status: 400 });
        }

        const tokens = await AuthService.refreshToken(refreshToken);

        // Create response
        const response = NextResponse.json({
            message: "Token refreshed successfully",
        });

        // Set new httpOnly cookies
        response.cookies.set("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60, // 1 hour
            path: "/",
        });

        response.cookies.set("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        });

        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Token refresh failed";
        return NextResponse.json({ error: message }, { status: 401 });
    }
};
