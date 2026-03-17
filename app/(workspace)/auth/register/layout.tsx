import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register - Knowledge-Based Interview AI",
    description: "Create a new account to start using AI-powered interview preparation tools with vector search and secure authentication.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return <div className="w-full min-h-screen">{children}</div>;
}
