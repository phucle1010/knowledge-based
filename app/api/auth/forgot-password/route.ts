import { NextRequest, NextResponse } from "next/server";

import { validateForgotPassword } from "@/lib/validators/auth";

import { AuthService } from "@/services/auth.service";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const validation = validateForgotPassword(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Validation failed", details: validation.error.issues }, { status: 400 });
        }

        const { email } = validation.data;

        await AuthService.forgotPassword(email);

        // Always return success for security (don't reveal if email exists)
        return NextResponse.json({
            message: "If an account with that email exists, a password reset link has been sent.",
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Forgot password failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
