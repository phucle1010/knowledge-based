"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { useRegister } from "@/features/auth/hooks";
import { registerSchema, RegisterRequest as RegisterFormData } from "@/features/auth/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { ErrorResponse } from "@/types/http.type";

interface RegisterFormProps {
    onSuccess?: () => void;
    redirectTo?: string;
}

export const RegisterForm = ({ onSuccess, redirectTo = "/" }: RegisterFormProps) => {
    const router = useRouter();
    const register = useRegister();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register: registerField,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await register.mutateAsync(data);
            onSuccess?.();
            router.push(redirectTo);
        } catch (error: unknown) {
            const message = (error as ErrorResponse)?.response?.data?.message || "Registration failed";
            setError("root", { message });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-900">
                    Full Name
                </Label>
                <Input
                    {...registerField("name")}
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-900">
                    Email Address
                </Label>
                <Input
                    {...registerField("email")}
                    type="email"
                    id="email"
                    placeholder="name@company.com"
                    className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-900">
                    Password
                </Label>
                <div className="relative">
                    <Input
                        {...registerField("password")}
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

            {/* Error Alert */}
            {errors.root && (
                <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{errors.root.message}</AlertDescription>
                </Alert>
            )}

            {/* Create Account Button */}
            <Button
                type="submit"
                className="w-full h-10 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
                disabled={isSubmitting || register.isPending}
            >
                {isSubmitting || register.isPending ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </Button>
        </form>
    );
};
