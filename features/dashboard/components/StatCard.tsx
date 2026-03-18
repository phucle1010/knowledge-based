import { Loader2 } from "lucide-react";

import { Card } from "@/components/ui/card";

type StatCardProps = {
    icon: React.ReactNode;
    title: string;
    value: number;
    loading: boolean;
};

export const StatCard = ({ icon, title, value, loading }: StatCardProps) => {
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
};
