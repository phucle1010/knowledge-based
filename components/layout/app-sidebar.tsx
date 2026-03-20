import Image from "next/image";
import Link from "next/link";

import { APP_NAME } from "@/lib/constants/app";
import { NAVBARS } from "@/lib/constants/urls";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";

export const AppSidebar = () => {
    return (
        <Sidebar>
            <SidebarHeader className="flex flex-row items-center gap-2">
                <Image src="/logo/nexia.png" alt="Nexia Logo" width={40} height={40} className="object-contain" />
                <div className="text-sm font-semibold">
                    <div>{APP_NAME.toUpperCase()}</div>
                    <div>INTERVIEW AI</div>
                </div>
            </SidebarHeader>
            <SidebarContent className="flex flex-col gap-2 mt-4">
                {NAVBARS.map((navbar) => (
                    <Link key={navbar.url} href={navbar.url} className="flex items-center gap-2 p-2">
                        {navbar.icon}
                        {navbar.label}
                    </Link>
                ))}
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
};
