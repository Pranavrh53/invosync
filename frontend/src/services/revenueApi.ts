import api from './api';

export interface RevenueDataPoint {
    month: string;
    revenue: number;
}

export const revenueApi = {
    getMonthlyRevenue: async (): Promise<RevenueDataPoint[]> => {
        const response = await api.get('/invoices/stats/revenue-by-month');
        return response.data.data;
    },
};
