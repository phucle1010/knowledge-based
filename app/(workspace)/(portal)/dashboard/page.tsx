import { Suspense } from "react";

import { Dashboard } from "@/features/dashboard/components";

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
            <Dashboard />
        </Suspense>
    );
}
