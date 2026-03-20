import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { ENV } from "@/lib/constants/env";
import { logger } from "@/lib/utils/logger";

import { TokenManager } from "@/features/auth/utils";

export const apiClient: AxiosInstance = axios.create({
    baseURL: ENV.SERVER_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add access token to headers if available
        const token = TokenManager.getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If token is expired and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token via server endpoint (server will read from httpOnly cookies)
                const response = await axios.post(`${ENV.SERVER_URL}/auth/refresh-token`);

                // If refresh successful, retry original request
                // Server will set new httpOnly cookies automatically
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear client-side data and redirect to login
                TokenManager.clearTokens();
                // Note: In a real app, you might want to redirect to login page here
                // For now, we'll just reject the error
            }
        }

        return Promise.reject(error);
    }
);
