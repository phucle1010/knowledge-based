import { forgotPasswordSchema, loginSchema, refreshTokenSchema, registerSchema, resetPasswordSchema } from "@/types/auth.type";

export const validateRegister = (data: unknown) => {
    return registerSchema.safeParse(data);
};

export const validateLogin = (data: unknown) => {
    return loginSchema.safeParse(data);
};

export const validateRefreshToken = (data: unknown) => {
    return refreshTokenSchema.safeParse(data);
};

export const validateForgotPassword = (data: unknown) => {
    return forgotPasswordSchema.safeParse(data);
};

export const validateResetPassword = (data: unknown) => {
    return resetPasswordSchema.safeParse(data);
};
