"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

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
    const [rememberMe, setRememberMe] = useState(false);

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-900">
                    Email Address
                </Label>
                <Input
                    {...register("email")}
                    type="email"
                    id="email"
                    placeholder="name@company.com"
                    className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-900">
                    Password
                </Label>
                <div className="relative">
                    <Input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="••••••••"
                        className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                    </Button>
                </div>
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 border-slate-300 rounded cursor-pointer"
                    />
                    <span className="text-sm text-slate-700">Remember Me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-sm font-medium text-slate-900 hover:underline">
                    Forgot Password?
                </Link>
            </div>

            {errors.root && (
                <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{errors.root.message}</AlertDescription>
                </Alert>
            )}

            {/* Sign In Button */}
            <Button
                type="submit"
                className="w-full h-10 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
                disabled={isSubmitting || login.isPending}
            >
                {isSubmitting || login.isPending ? "Signing In..." : "Sign In"}
            </Button>
        </form>
    );
};
