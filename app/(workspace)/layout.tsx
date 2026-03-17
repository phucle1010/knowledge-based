import type { Metadata } from "next";

import { APP_FULL_NAME } from "@/lib/constants/app";

export const metadata: Metadata = {
    title: `Workspace | ${APP_FULL_NAME}`,
    description: "Workspace area for managing interviews, questions, and user sessions.",
};

export default function WorkspaceLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className="min-h-screen">{children}</div>;
}
