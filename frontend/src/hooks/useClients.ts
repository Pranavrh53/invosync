import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "../services/clientApi";
import toast from "react-hot-toast";

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    gstin?: string;
    createdAt?: string;
}

interface ClientQueryOptions {
    page?: number;
    limit?: number;
    search?: string;
}

export function useClients({ page = 1, limit = 10, search }: ClientQueryOptions = {}) {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["clients", { page, limit, search }],
        queryFn: () => clientApi.getAll({ page, limit, search }),
        placeholderData: (previousData) => previousData,
    });

    const createClient = useMutation({
        mutationFn: clientApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
            queryClient.invalidateQueries({ queryKey: ["clientCount"] });
            toast.success("Client added successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to add client");
        },
    });

    const updateClient = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
            clientApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
            toast.success("Client updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update client");
        },
    });

    const deleteClient = useMutation({
        mutationFn: clientApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
            queryClient.invalidateQueries({ queryKey: ["clientCount"] });
            toast.success("Client deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete client");
        },
    });

    return {
        clients: data?.data || [],
        pagination: data?.pagination,
        isLoading,
        error,
        createClient,
        updateClient,
        deleteClient,
    };
}
