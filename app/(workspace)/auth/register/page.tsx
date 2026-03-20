import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

import { APP_NAME } from "@/lib/constants/app";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlobalLoading } from "@/components/shared/GlobalLoading";

import { RegisterForm } from "@/features/auth/components";

export default function RegisterPage() {
    return (
        <Suspense fallback={<GlobalLoading />}>
            <div className="w-full h-full flex items-center justify-center">
                <Card className="w-full max-w-md border-0 shadow-lg">
                    <CardHeader className="space-y-2 pb-8">
                        <div className="lg:hidden flex items-center gap-2 mb-4">
                            <Image src="/logo/nexia.png" alt="Nexia Logo" width={32} height={32} className="object-contain" />

                            <div className="flex flex-col gap-1">
                                <span className="text-lg font-bold tracking-tighter leading-none">{APP_NAME}</span>
                                <span className="text-sm font-medium tracking-[0.2em] text-blue-800 leading-none">INTERVIEW AI</span>
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold text-slate-900">Let’s Get You Started!</CardTitle>
                        <CardDescription className="text-base text-slate-600">
                            Just a few details to unlock your personalized AI interview coach.
                        </CardDescription>
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
