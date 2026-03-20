import type { Metadata } from "next";

import { APP_FULL_NAME } from "@/lib/constants/app";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

export const metadata: Metadata = {
    title: `Portal | ${APP_FULL_NAME}`,
    description: "Portal area for managing interviews, questions, and user sessions.",
};

export default function PortalLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1">
                <AppHeader />

                <div className="min-h-screen w-full bg-slate-50 py-12 px-6">{children}</div>
            </main>
        </SidebarProvider>
    );
}
