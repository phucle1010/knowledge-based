import { Suspense } from "react";
import Link from "next/link";

import { RegisterForm } from "@/features/auth/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
            <div className="w-full h-full flex items-center justify-center">
                <Card className="w-full max-w-md border-0 shadow-lg">
                    <CardHeader className="space-y-2 pb-8">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">AI</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-900">
                                <div>KNOWLEDGE-BASED</div>
                                <div>INTERVIEW AI</div>
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold text-slate-900">Create Your Account</CardTitle>
                        <CardDescription className="text-base text-slate-600">Enter your information to get started on the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <RegisterForm />
                        <div className="pt-4 space-y-4">
                            <div className="text-center text-sm text-slate-600">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="font-semibold text-slate-900 hover:underline">
                                    Sign in here
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Suspense>
    );
}
