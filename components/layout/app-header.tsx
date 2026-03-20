"use client";

import { useAppSelector } from "@/lib/store/hooks";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserProfile } from "@/features/auth/components/UserProfile";

export const AppHeader = () => {
    const user = useAppSelector((state) => state.userReducer.user);

    return (
        <header className="h-10 bg-white flex items-center justify-between">
            <SidebarTrigger />
            <UserProfile userName={user?.name} />
        </header>
    );
};
