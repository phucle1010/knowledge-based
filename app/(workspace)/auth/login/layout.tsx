import type { Metadata } from "next";
import { APP_FULL_NAME } from "@/lib/constants/app";

export const metadata: Metadata = {
    title: `Login - ${APP_FULL_NAME}`,
    description: "Sign in to your account to access AI-powered interview preparation tools with vector search and secure authentication.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <div className="w-full h-full">{children}</div>;
}
