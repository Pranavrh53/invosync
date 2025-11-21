import api from './api';

export interface InvoiceStats {
    total: number;
    byStatus: {
        draft: number;
        sent: number;
        paid: number;
        overdue: number;
        cancelled: number;
    };
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
}

export const invoiceApi = {
    getStats: async (): Promise<InvoiceStats> => {
        const response = await api.get('/invoices/stats/summary');
        return response.data.data;
    },

    getAll: async (params?: any) => {
        const response = await api.get('/invoices', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/invoices/${id}`);
        return response.data.data;
    },

    getByToken: async (token: string) => {
        const response = await api.get(`/invoices/public/${token}`);
        return response.data.data;
    },

    create: async (data: any) => {
        const response = await api.post('/invoices', data);
        return response.data.data;
    },

    update: async (id: string, data: any) => {
        const response = await api.put(`/invoices/${id}`, data);
        return response.data.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/invoices/${id}`);
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await api.patch(`/invoices/${id}/status`, { status });
        return response.data.data;
    },
};
