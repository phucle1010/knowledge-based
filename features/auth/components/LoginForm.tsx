"use client";

/**
 * Login Form Component
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { useLogin } from "@/features/auth/hooks";
import { loginSchema, LoginRequest as LoginFormData } from "@/features/auth/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { ErrorResponse } from "@/types/http.type";

interface LoginFormProps {
    onSuccess?: () => void;
    redirectTo?: string;
}

export const LoginForm = ({ onSuccess, redirectTo = "/dashboard" }: LoginFormProps) => {
    const router = useRouter();
    const login = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login.mutateAsync(data);
            onSuccess?.();
            router.push(redirectTo);
        } catch (error: unknown) {
            const message = (error as ErrorResponse)?.response?.data?.message || "Login failed";
            setError("root", { message });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input {...register("email")} type="email" id="email" placeholder="Enter your email" />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Enter your password"
                        className="pr-10"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </Button>
                </div>
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            {errors.root && (
                <Alert variant="destructive">
                    <AlertDescription>{errors.root.message}</AlertDescription>
                </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting || login.isPending}>
                {isSubmitting || login.isPending ? "Signing in..." : "Sign in"}
            </Button>
        </form>
    );
};
