import { z } from "zod";

export const registerSchema = z.object({
    email: z.email("Invalid email format").toLowerCase().trim(),
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters").trim(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must be less than 128 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
});

export const loginSchema = z.object({
    email: z.email("Invalid email format").toLowerCase().trim(),
    password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
});

export const forgotPasswordSchema = z.object({
    email: z.email("Invalid email format").toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must be less than 128 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export type RegisterRequest = z.infer<typeof registerSchema>;

export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>;

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;

export type User = {
    id: string;
    email: string;
    name: string;
    password: string;
    isEmailVerified: boolean;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: Date | null;
    passwordResetToken?: string | null;
    passwordResetExpires?: Date | null;
    refreshTokens: string[];
    createdAt: Date;
    updatedAt: Date;
};

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};

export type AuthResponse = {
    user: {
        id: string;
        email: string;
        name: string;
        isEmailVerified: boolean;
    };
    tokens: AuthTokens;
};

export type UserProfile = {
    id: string;
    email: string;
    name: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
};
