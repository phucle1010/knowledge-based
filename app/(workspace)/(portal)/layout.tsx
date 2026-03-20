import type { Metadata } from "next";

import { APP_FULL_NAME } from "@/lib/constants/app";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

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
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}
