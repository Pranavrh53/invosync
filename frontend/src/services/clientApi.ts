import api from './api';

export const clientApi = {
    getCount: async (): Promise<{ count: number }> => {
        const response = await api.get('/clients/stats/count');
        return response.data.data;
    },

    getAll: async (params?: any) => {
        const response = await api.get('/clients', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/clients/${id}`);
        return response.data.data;
    },

    create: async (data: any) => {
        const response = await api.post('/clients', data);
        return response.data.data;
    },

    update: async (id: string, data: any) => {
        const response = await api.put(`/clients/${id}`, data);
        return response.data.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/clients/${id}`);
        return response.data;
    },

    search: async (query: string) => {
        const response = await api.get(`/clients/search?q=${query}`);
        return response.data.data;
    }
};
