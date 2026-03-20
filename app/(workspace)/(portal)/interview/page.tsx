import { Suspense } from "react";

import { GlobalLoading } from "@/components/shared/GlobalLoading";

export default function DashboardPage() {
    return (
        <Suspense fallback={<GlobalLoading />}>
            <div>Welcome to Nexia Interview</div>
        </Suspense>
    );
}
