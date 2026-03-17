import { NextRequest, NextResponse } from "next/server";

import { validateLogin } from "@/lib/validators/auth";

import { AuthService } from "@/services/auth.service";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const validation = validateLogin(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Validation failed", details: validation.error.issues }, { status: 400 });
        }

        const { email, password } = validation.data;

        const authResponse = await AuthService.login(email, password);

        // Create response with user data (without tokens)
        const response = NextResponse.json({
            message: "Login successful",
            user: authResponse.user,
            tokens: authResponse.tokens,
        });

        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        return NextResponse.json({ error: message }, { status: 401 });
    }
};
