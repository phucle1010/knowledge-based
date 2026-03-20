import { Suspense } from "react";

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
            <div>Welcome to Nexia Interview</div>
        </Suspense>
    );
}
