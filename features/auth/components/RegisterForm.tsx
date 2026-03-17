"use client";

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

export const RegisterForm = ({ onSuccess, redirectTo = "/dashboard" }: RegisterFormProps) => {
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input {...registerField("name")} type="text" id="name" placeholder="Enter your full name" />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input {...registerField("email")} type="email" id="email" placeholder="Enter your email" />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        {...registerField("password")}
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

            <Button type="submit" className="w-full" disabled={isSubmitting || register.isPending}>
                {isSubmitting || register.isPending ? "Creating account..." : "Create account"}
            </Button>
        </form>
    );
};
