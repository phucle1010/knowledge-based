export const AUTH_ENDPOINTS = {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    PROFILE: "/auth/profile",
} as const;

export const AUTH_STORAGE_KEYS = {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
    USER: "user",
} as const;

export const AUTH_QUERY_KEYS = {
    USER: "user",
    PROFILE: "profile",
} as const;

export const AUTH_VALIDATION_RULES = {
    EMAIL: {
        REQUIRED: "Email is required",
        INVALID: "Please enter a valid email address",
    },
    PASSWORD: {
        REQUIRED: "Password is required",
        MIN_LENGTH: "Password must be at least 8 characters",
        STRENGTH: "Password must contain uppercase, lowercase, and number",
    },
    NAME: {
        REQUIRED: "Name is required",
        MIN_LENGTH: "Name must be at least 2 characters",
        MAX_LENGTH: "Name must be less than 50 characters",
    },
} as const;
