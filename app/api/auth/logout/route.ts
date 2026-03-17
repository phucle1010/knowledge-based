import { NextRequest, NextResponse } from "next/server";

import { AuthService } from "@/services/auth.service";

export const POST = async (request: NextRequest) => {
    try {
        // Get refresh token from cookie
        const refreshToken = request.cookies.get("refreshToken")?.value;

        if (refreshToken) {
            await AuthService.logout(refreshToken);
        }

        // Create response
        const response = NextResponse.json({
            message: "Logout successful",
        });

        // Clear cookies
        response.cookies.set("accessToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
            path: "/",
        });

        response.cookies.set("refreshToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
            path: "/",
        });

        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Logout failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
