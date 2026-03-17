import { NextResponse, NextRequest } from "next/server";

import { withAuth, AuthenticatedRequest } from "@/lib/middlewares/auth";
import { handleDatabaseError } from "@/lib/utils/database-error-handler";

import { AuthService } from "@/services/auth.service";

const handler = async (request: AuthenticatedRequest) => {
    try {
        const userId = request.user!.id;
        const user = await AuthService.getProfile(userId);

        // Return user profile without sensitive information
        const { password, emailVerificationToken, passwordResetToken, ...profile } = user;

        return NextResponse.json({
            success: true,
            profile,
        });
    } catch (error) {
        return handleDatabaseError(error);
    }
};

export const GET = withAuth(handler);
