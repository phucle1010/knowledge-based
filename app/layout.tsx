import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";

import { validateEnvironment } from "@/lib/utils/env-validation";
import { cn } from "@/lib/utils/style";

import { AuthProvider } from "@/providers";

import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

validateEnvironment();

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Knowledge-Based Interview AI",
    description: "AI-powered interview assistant with vector search, session tracking, and secure authentication.",
    openGraph: {
        title: "Knowledge-Based Interview AI",
        description: "AI-assisted technical interview preparation with smart scoring, feedback, and secure user accounts.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Knowledge-Based Interview AI",
        description: "AI interview assistant powered by vector search and secure authentication.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={cn("font-sans", geist.variable)}>
            <body className={`${inter.variable} antialiased`}>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
