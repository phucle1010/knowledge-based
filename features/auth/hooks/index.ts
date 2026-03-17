import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authServices } from "@/features/auth/services";
import { AUTH_QUERY_KEYS } from "@/features/auth/constants";
import { UserManager } from "@/features/auth/utils/user";
import { TokenManager } from "@/features/auth/utils/token";

import { LoginRequest, RegisterRequest, User } from "@/features/auth/types";

export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegisterRequest) => authServices.register(data),
        onSuccess: (response) => {
            const { user } = response.data as unknown as { user: User };

            queryClient.setQueryData([AUTH_QUERY_KEYS.USER], user);
        },
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginRequest) => authServices.login(data),
        onSuccess: (response) => {
            const { user } = response.data;

            queryClient.setQueryData([AUTH_QUERY_KEYS.USER], user);
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authServices.logout(),
        onSuccess: () => {
            TokenManager.clearTokens();
            queryClient.clear();
        },
    });
};

export const useRefreshToken = () => {
    return useMutation({
        mutationFn: () => authServices.refreshToken(),
        onSuccess: () => {
            // Tokens are automatically refreshed via httpOnly cookies
            // No need to manually update client-side storage
        },
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (email: string) => authServices.forgotPassword(email),
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (data: { token: string; password: string }) => authServices.resetPassword(data),
    });
};

export const useProfile = () => {
    return useQuery({
        queryKey: [AUTH_QUERY_KEYS.PROFILE],
        queryFn: async () => {
            const response = await authServices.getProfile();
            return response.data.profile;
        },
        enabled: UserManager.isAuthenticated(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useUser = () => {
    return useQuery({
        queryKey: [AUTH_QUERY_KEYS.USER],
        queryFn: () => UserManager.getUser(),
        initialData: UserManager.getUser(),
        staleTime: Infinity,
    });
};

export const useAuthStatus = () => {
    const { data: user } = useUser();
    const isAuthenticated = UserManager.isAuthenticated();

    return {
        isAuthenticated,
        user,
        isLoading: false, // Could be enhanced with loading states
    };
};
