import { apiClient } from "@/lib/configs/axios";

import { DASHBOARD_ENDPOINTS } from "@/features/dashboard/constants";

export const dashboardServices = {
    getStatictics: async () => {
        return apiClient.get(DASHBOARD_ENDPOINTS.STATISTICS);
    },
};
