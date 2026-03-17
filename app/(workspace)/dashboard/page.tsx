"use client";

import { Loader2, MessageSquare, Package, User } from "lucide-react";

import { useAppSelector } from "@/lib/store/hooks";

import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
    const { data, isLoading, isError } = useDashboardStats();
    const user = useAppSelector((state) => state.userReducer.user);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-medium">Redirecting to login…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="mx-auto w-full max-w-6xl">
                <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900">Welcome back{user?.name ? `, ${user.name}` : ""}.</h1>
                        <p className="mt-1 text-sm text-slate-600">Here is a quick summary of your usage and recent activity.</p>
                    </div>
                    <div className="mt-4 flex gap-3 sm:mt-0">
                        <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm shadow-slate-200 hover:bg-slate-50">
                            <User className="h-4 w-4" />
                            Profile
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm shadow-slate-200 hover:bg-slate-50">
                            <MessageSquare className="h-4 w-4" />
                            Messages
                        </button>
                    </div>
                </header>

                <section className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
                    <StatCard
                        icon={<Package className="h-5 w-5 text-slate-600" />}
                        title="Interview Sessions"
                        value={data?.sessionCount ?? 0}
                        loading={isLoading}
                    />
                    <StatCard
                        icon={<MessageSquare className="h-5 w-5 text-slate-600" />}
                        title="Messages"
                        value={data?.messageCount ?? 0}
                        loading={isLoading}
                    />
                    <StatCard
                        icon={<Loader2 className="h-5 w-5 text-slate-600" />}
                        title="Results Generated"
                        value={data?.resultCount ?? 0}
                        loading={isLoading}
                    />
                </section>

                {isError && (
                    <div className="mt-10 rounded-lg bg-red-50 p-6 text-sm text-red-700">
                        Failed to load dashboard statistics. Please try again later.
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, loading }: { icon: React.ReactNode; title: string; value: number; loading: boolean }) {
    return (
        <Card className="flex items-center justify-between gap-4 border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                    {loading ? (
                        <span className="inline-flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" /> Loading
                        </span>
                    ) : (
                        value
                    )}
                </p>
            </div>
            <div className="rounded-full bg-slate-100 p-3">{icon}</div>
        </Card>
    );
}
