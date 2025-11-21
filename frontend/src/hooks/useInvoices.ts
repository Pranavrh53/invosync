import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceApi } from "../services/invoiceApi";
import toast from "react-hot-toast";

export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    hsnCode?: string;
    taxRate: number;
}

export interface GSTBreakdown {
    cgst: number;
    sgst: number;
    igst: number;
    totalGST: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    clientId: string;
    clientName?: string;
    items: InvoiceItem[];
    subtotal: number;
    gstBreakdown: GSTBreakdown;
    total: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    issueDate: string;
    dueDate: string;
    notes?: string;
    shareToken?: string;
    createdAt?: string;
}

export function useInvoices(params?: any) {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["invoices", params],
        queryFn: () => invoiceApi.getAll(params),
        placeholderData: (previousData) => previousData,
    });

    const createInvoice = useMutation({
        mutationFn: invoiceApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["invoiceStats"] });
            toast.success("Invoice created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create invoice");
        },
    });

    const updateInvoice = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            invoiceApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["invoice", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["invoiceStats"] });
            toast.success("Invoice updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update invoice");
        },
    });

    const deleteInvoice = useMutation({
        mutationFn: invoiceApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["invoiceStats"] });
            toast.success("Invoice deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete invoice");
        },
    });

    return {
        invoices: data?.data || [],
        pagination: data?.pagination,
        isLoading,
        error,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        updateInvoiceStatus: useMutation({
            mutationFn: ({ id, status }: { id: string; status: string }) =>
                invoiceApi.updateStatus(id, status),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["invoices"] });
                queryClient.invalidateQueries({ queryKey: ["invoiceStats"] });
                toast.success("Invoice status updated");
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || "Failed to update status");
            },
        }),
    };
}

export function useInvoice(id: string) {
    return useQuery({
        queryKey: ["invoice", id],
        queryFn: () => invoiceApi.getById(id),
        enabled: !!id,
    });
}
