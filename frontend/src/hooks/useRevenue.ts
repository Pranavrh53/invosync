import { useQuery } from "@tanstack/react-query";
import { revenueApi } from "../services/revenueApi";

export function useRevenue() {
    const {
        data: revenueData = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["revenue"],
        queryFn: revenueApi.getMonthlyRevenue,
    });

    return {
        revenueData,
        isLoading,
        error,
    };
}
