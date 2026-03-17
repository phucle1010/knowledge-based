import { Suspense } from "react";
import Link from "next/link";

import { LoginForm } from "@/features/auth/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
                        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/register" className="text-primary hover:underline">
                                Create one here
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Suspense>
    );
}
