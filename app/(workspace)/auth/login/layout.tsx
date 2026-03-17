import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login - Knowledge-Based Interview AI",
    description: "Sign in to your account to access AI-powered interview preparation tools with vector search and secure authentication.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <div className="w-full h-full">{children}</div>;
}
