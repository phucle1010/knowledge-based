import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { UserModel } from "@/lib/schemas/auth";
import { ENV } from "@/lib/constants/env";
import { logger } from "@/lib/utils/logger";

import { MongoService } from "@/services/mongo.service";

import { User, AuthTokens, AuthResponse } from "@/features/auth/types";

export class AuthService {
    /**
     * Hash password using bcrypt
     */
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }

    /**
     * Verify password
     */
    static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    /**
     * Generate JWT tokens
     */
    static generateTokens(userId: string): AuthTokens {
        const accessToken = jwt.sign({ sub: userId, type: "access" }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_ACCESS_EXPIRATION } as jwt.SignOptions);

        const refreshToken = jwt.sign({ sub: userId, type: "refresh" }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_REFRESH_EXPIRATION } as jwt.SignOptions);

        return { accessToken, refreshToken };
    }

    /**
     * Generate reset password token
     */
    static generateResetPasswordToken(): string {
        return crypto.randomBytes(32).toString("hex");
    }

    /**
     * Generate email verification token
     */
    static generateEmailVerificationToken(): string {
        return crypto.randomBytes(32).toString("hex");
    }

    /**
     * Verify JWT token
     */
    static verifyToken(token: string): { sub: string; type: string } | null {
        try {
            const decoded = jwt.verify(token, ENV.JWT_SECRET) as { sub: string; type: string };
            return decoded;
        } catch (error) {
            return null;
        }
    }

    /**
     * Register new user
     */
    static async register(email: string, name: string, password: string): Promise<User> {
        await MongoService.connect();

        // Check if user already exists
        logger.debug("Checking if user exists", { email });
        const existingUser = await UserModel.findOne({ email, deletedAt: null });
        if (existingUser) {
            logger.warn("Registration failed: User already exists", { email });
            throw new Error("User already exists with this email");
        }

        // Hash password
        const hashedPassword = await this.hashPassword(password);

        // Generate email verification token
        const emailVerificationToken = this.generateEmailVerificationToken();
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user
        logger.debug("Creating new user", { email, name });
        const user = await UserModel.create({
            email,
            name,
            password: hashedPassword,
            emailVerificationToken,
            emailVerificationExpires,
        });

        const userId = user._id.toString();
        logger.info("User registered successfully", { userId, email, name });

        return {
            id: userId,
            ...user.toJSON(),
        };
    }

    /**
     * Login user
     */
    static async login(email: string, password: string): Promise<AuthResponse> {
        await MongoService.connect();

        // Find user
        logger.debug("Finding user for login", { email });
        const user = await UserModel.findOne({ email, deletedAt: null });
        if (!user) {
            logger.warn("Login failed: User not found", { email });
            throw new Error("Invalid email or password");
        }

        // Verify password
        const isPasswordValid = await this.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            logger.warn("Login failed: Invalid password", { userId: user._id.toString() });
            throw new Error("Invalid email or password");
        }

        // Generate tokens
        const tokens = this.generateTokens(user._id.toString());

        // Save refresh token
        user.refreshTokens.push(tokens.refreshToken);
        logger.debug("Saving refresh token", { userId: user._id.toString() });
        await user.save();

        const userId = user._id.toString();
        logger.info("User logged in successfully", { userId, email });

        return {
            user: {
                id: userId,
                email: user.email,
                name: user.name,
                isEmailVerified: user.isEmailVerified,
            },
            tokens,
        };
    }

    /**
     * Refresh access token
     */
    static async refreshToken(refreshToken: string): Promise<AuthTokens> {
        await MongoService.connect();

        // Verify refresh token
        const decoded = this.verifyToken(refreshToken);
        if (!decoded || decoded.type !== "refresh") {
            throw new Error("Invalid refresh token");
        }

        // Find user and check if refresh token exists
        const user = await UserModel.findOne({
            _id: decoded.sub,
            refreshTokens: refreshToken,
            deletedAt: null,
        });

        if (!user) {
            throw new Error("Invalid refresh token");
        }

        // Generate new tokens
        const tokens = this.generateTokens(user._id.toString());

        // Replace old refresh token with new one
        const tokenIndex = user.refreshTokens.indexOf(refreshToken);
        user.refreshTokens[tokenIndex] = tokens.refreshToken;
        await user.save();

        return tokens;
    }

    /**
     * Logout user (remove refresh token)
     */
    static async logout(refreshToken: string): Promise<void> {
        await MongoService.connect();

        const decoded = this.verifyToken(refreshToken);
        if (!decoded || decoded.type !== "refresh") {
            return; // Invalid token, nothing to do
        }

        await UserModel.updateOne({ _id: decoded.sub }, { $pull: { refreshTokens: refreshToken } });
    }

    /**
     * Forgot password - generate reset token
     */
    static async forgotPassword(email: string): Promise<void> {
        await MongoService.connect();

        const user = await UserModel.findOne({ email, deletedAt: null });
        if (!user) {
            // Don't reveal if email exists or not for security
            return;
        }

        // Generate reset token
        const resetToken = this.generateResetPasswordToken();
        const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save reset token
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetExpires;
        await user.save();

        // TODO: Send email with reset token
        console.log(`Password reset token for ${email}: ${resetToken}`);
    }

    /**
     * Reset password using token
     */
    static async resetPassword(token: string, newPassword: string): Promise<void> {
        await MongoService.connect();

        const user = await UserModel.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: new Date() },
            deletedAt: null,
        });

        if (!user) {
            throw new Error("Invalid or expired reset token");
        }

        // Hash new password
        const hashedPassword = await this.hashPassword(newPassword);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
    }

    /**
     * Get user profile
     */
    static async getProfile(userId: string): Promise<User> {
        await MongoService.connect();

        const user = await UserModel.findOne({ _id: userId, deletedAt: null });
        if (!user) {
            throw new Error("User not found");
        }

        return {
            id: user._id.toString(),
            ...user.toJSON(),
        };
    }

    /**
     * Verify email
     */
    static async verifyEmail(token: string): Promise<void> {
        await MongoService.connect();

        const user = await UserModel.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() },
            deletedAt: null,
        });

        if (!user) {
            throw new Error("Invalid or expired verification token");
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
    }
}
