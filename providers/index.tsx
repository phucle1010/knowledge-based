"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { useState, useEffect } from "react";

import { store } from "@/lib/store";
import { useAppDispatch } from "@/lib/store/hooks";
import { setUser, setLoading, clearUser } from "@/lib/store/slices/userSlice";
import { authServices } from "@/features/auth/services";
import { TokenManager } from "@/features/auth/utils/token";
import { ErrorResponse } from "@/types/http.type";

interface AuthProviderProps {
    children: React.ReactNode;
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const initializeAuth = async () => {
            dispatch(setLoading(true));

            try {
                // Check if we have access token
                if (TokenManager.getAccessToken()) {
                    // Try to get user profile
                    const response = await authServices.getProfile();
                    const user = response.data.profile;
                    dispatch(setUser(user));
                } else {
                    dispatch(clearUser());
                }
            } catch (error) {
                console.error("Failed to initialize auth:", error);
                dispatch(clearUser());
            } finally {
                dispatch(setLoading(false));
            }
        };

        initializeAuth();
    }, [dispatch]);

    return <>{children}</>;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        retry: (failureCount, error: unknown) => {
                            // Don't retry on 4xx errors
                            const status = (error as ErrorResponse)?.response?.status;
                            if (status !== undefined && status >= 400 && status < 500) {
                                return false;
                            }
                            return failureCount < 3;
                        },
                    },
                    mutations: {
                        retry: false,
                    },
                },
            })
    );

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <AuthInitializer>{children}</AuthInitializer>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </Provider>
    );
}
