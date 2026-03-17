import { useQuery } from "@tanstack/react-query";

import { dashboardServices } from "@/features/dashboard/services";

export type DashboardStats = {
    sessionCount: number;
    messageCount: number;
    resultCount: number;
};

export const useDashboardStats = () => {
    return useQuery<DashboardStats>({
        queryKey: ["dashboard", "stats"],
        queryFn: async () => {
            const response = await dashboardServices.getStatictics();

            return response.data;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};
