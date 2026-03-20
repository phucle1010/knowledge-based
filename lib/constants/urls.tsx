import { AudioLines, Home } from "lucide-react";

export type Navbar = {
    url: string;
    label: string;
    icon: React.ReactNode;
};

export const NAVBARS: Navbar[] = [
    { url: "/dashboard", label: "Dashboard", icon: <Home size={16} /> },
    { url: "/interview", label: "Interview", icon: <AudioLines size={16} /> },
] as const;
