import Image from "next/image";

import { APP_NAME, APP_FULL_NAME } from "@/lib/constants/app";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    // return (
    //     <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
    //         <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-800 text-white p-12">
    //             <div>
    //                 <div className="flex items-center gap-2 mb-16">
    //                     <Image src="/logo/nexia.png" alt="Nexia Logo" width={40} height={40} className="object-contain" />
    //                     <div className="text-sm font-semibold">
    //                         <div>{APP_NAME.toUpperCase()}</div>
    //                         <div>INTERVIEW AI</div>
    //                     </div>
    //                 </div>
    //                 <div className="space-y-4">
    //                     <h1 className="text-4xl font-bold leading-tight">
    //                         Nexia <br /> Your AI Interview Coach
    //                     </h1>
    //                     <p className="text-lg text-slate-300 leading-relaxed">
    //                         Get real-time feedback and smart answers to help you ace your next job interview with confidence.
    //                     </p>
    //                 </div>
    //             </div>
    //             <div className="text-sm text-slate-400">© 2026 {APP_FULL_NAME}. All rights reserved.</div>
    //         </div>

    //         <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-12 bg-white">{children}</div>
    //     </div>
    // );

    return (
        <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FAFAFA]">
            <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#0F172A] p-16">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-[100px]" />
                    <div className="absolute top-[20%] right-[10%] h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[80px]" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-24 opacity-90 hover:opacity-100 transition-opacity cursor-default">
                        <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl">
                            <Image src="/logo/nexia.png" alt="Nexia Logo" width={32} height={32} className="object-contain" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-lg font-bold tracking-tighter text-white">{APP_NAME}</span>
                            <span className="text-[10px] font-medium tracking-[0.2em] text-blue-400 uppercase">Interview AI</span>
                        </div>
                    </div>

                    <div className="max-w-md space-y-6">
                        <h1 className="text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
                            Elevate your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">career path.</span>
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed font-light">
                            Nexia is your AI companion to master every interview with real-time feedback.
                        </p>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            Trusted by 2,000+ candidates
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs font-medium text-slate-500 tracking-wide uppercase">
                    © 2026 {APP_FULL_NAME} • Built for the future
                </div>
            </div>

            <div className="relative flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-white">
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    // style={{ backgroundImage: `radial-gradient(#000 0.5px, transparent 0.5px)`, size: "20px 20px" }}
                />

                <div className="w-full max-w-sm relative z-10">{children}</div>
            </div>
        </div>
    );
}
