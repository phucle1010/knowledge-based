"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth/hooks";

type UserProfileProps = {
    userName?: string;
};

export const UserProfile: React.FC<UserProfileProps> = ({ userName }) => {
    const router = useRouter();
    const { mutateAsync: mutateLogout, isPending } = useLogout();

    const handleLogout = async () => {
        await mutateLogout();
        router.push("/auth/login");
    };

    if (!userName) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 rounded-md border border-transparent bg-white px-2 py-1 hover:bg-slate-50"
                >
                    <User size={16} />
                    <span className="text-sm font-medium text-slate-700">{userName}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
