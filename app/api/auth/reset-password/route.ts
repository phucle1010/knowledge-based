import { NextRequest, NextResponse } from "next/server";

import { validateResetPassword } from "@/lib/validators/auth";

import { AuthService } from "@/services/auth.service";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const validation = validateResetPassword(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Validation failed", details: validation.error.issues }, { status: 400 });
        }

        const { token, password } = validation.data;

        await AuthService.resetPassword(token, password);

        return NextResponse.json({
            message: "Password reset successful",
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Password reset failed";
        return NextResponse.json({ error: message }, { status: 400 });
    }
};
