import { NextRequest, NextResponse } from "next/server";

import { validateRefreshToken } from "@/lib/validators/auth";

import { AuthService } from "@/services/auth.service";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const validation = validateRefreshToken(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Validation failed", details: validation.error.issues }, { status: 400 });
        }

        const { refreshToken } = validation.data;

        await AuthService.logout(refreshToken);

        return NextResponse.json({
            message: "Logout successful",
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Logout failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
