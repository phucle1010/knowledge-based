import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Workspace | Knowledge-Based Interview AI",
    description: "Workspace area for managing interviews, questions, and user sessions.",
};

export default function WorkspaceLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className="min-h-screen">{children}</div>;
}
