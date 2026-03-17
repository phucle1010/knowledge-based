import { apiClient } from "@/lib/configs/axios";

import type { AuthResponse, LoginRequest, RegisterRequest, User, UserProfile } from "@/features/auth/types";

import { AUTH_ENDPOINTS } from "@/features/auth/constants";

export const authServices = {
    login: async (data: LoginRequest) => {
        return apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, data);
    },

    register: async (data: RegisterRequest) => {
        return apiClient.post<User>(AUTH_ENDPOINTS.REGISTER, data);
    },

    logout: async () => {
        return apiClient.post<{ message: string }>(AUTH_ENDPOINTS.LOGOUT);
    },

    refreshToken: async () => {
        return apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
    },

    forgotPassword: async (email: string) => {
        return apiClient.post<{ message: string }>(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    },

    resetPassword: async (data: { token: string; password: string }) => {
        return apiClient.post<{ message: string }>(AUTH_ENDPOINTS.RESET_PASSWORD, data);
    },

    getProfile: async () => {
        return apiClient.get<{ profile: UserProfile }>(AUTH_ENDPOINTS.PROFILE);
    },
};
