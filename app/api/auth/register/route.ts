import { NextRequest, NextResponse } from "next/server";

import { validateRegister } from "@/lib/validators/auth";

import { AuthService } from "@/services/auth.service";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const validation = validateRegister(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Validation failed", details: validation.error.issues }, { status: 400 });
        }

        const { email, name, password } = validation.data;

        const user = await AuthService.register(email, name, password);

        const { password: _, ...userResponse } = user;

        return NextResponse.json(
            {
                message: "User registered successfully",
                user: userResponse,
            },
            { status: 201 }
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "Registration failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
};
