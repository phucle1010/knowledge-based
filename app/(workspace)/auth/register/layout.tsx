import type { Metadata } from "next";
import { APP_FULL_NAME } from "@/lib/constants/app";

export const metadata: Metadata = {
    title: `Register - ${APP_FULL_NAME}`,
    description: "Create a new account to start using AI-powered interview preparation tools with vector search and secure authentication.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return <div className="w-full h-full">{children}</div>;
}
