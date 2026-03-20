import Image from "next/image";

import { APP_NAME, APP_FULL_NAME } from "@/lib/constants/app";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-800 text-white p-12">
                <div>
                    <div className="flex items-center gap-2 mb-16">
                        <Image src="/logo/nexia.png" alt="Nexia Logo" width={40} height={40} className="object-contain" />
                        <div className="text-sm font-semibold">
                            <div>{APP_NAME.toUpperCase()}</div>
                            <div>INTERVIEW AI</div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold leading-tight">
                            Nexia <br /> Your AI Interview Coach
                            {/* <br />
                            INTERVIEWING WITH
                            <br />
                            AI-POWERED INSIGHTS */}
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            Get real-time feedback and smart answers to help you ace your next job interview with confidence.
                        </p>
                    </div>
                </div>
                <div className="text-sm text-slate-400">© 2026 {APP_FULL_NAME}. All rights reserved.</div>
            </div>

            <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-12 bg-white">{children}</div>
        </div>
    );
}
