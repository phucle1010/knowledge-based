import { Suspense } from "react";

import { GlobalLoading } from "@/components/shared/GlobalLoading";

import { Dashboard } from "@/features/dashboard/components";

export default function DashboardPage() {
    return (
        <Suspense fallback={<GlobalLoading />}>
            <Dashboard />
        </Suspense>
    );
}
