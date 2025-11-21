/**
 * Shared TypeScript types and interfaces for InvoSync
 */

// ==================== CLIENT TYPES ====================

export interface Client {
    id?: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    gstin?: string; // GST Identification Number (optional)
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateClientDTO {
    name: string;
    email: string;
    phone: string;
    address: string;
    gstin?: string;
}

export interface UpdateClientDTO {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    gstin?: string;
}

// Type aliases for convenience
export type ClientType = Client;


// ==================== INVOICE TYPES ====================

export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number; // quantity * unitPrice
    hsnCode?: string; // Harmonized System of Nomenclature code
    taxRate: number; // GST rate in percentage (e.g., 18 for 18%)
}

export interface GSTBreakdown {
    cgst: number; // Central GST
    sgst: number; // State GST
    igst: number; // Integrated GST
    total: number; // Total GST amount
}

export interface Payment {
    id: string;
    invoiceId: string;
    amount: number;
    date: Date;
    mode: 'UPI' | 'Bank Transfer' | 'Cash' | 'Card' | 'Online' | 'Razorpay (Simulated)';
    reference?: string;
    status: 'completed' | 'pending';
}

export interface Invoice {
    id?: string;
    invoiceNumber: string;
    clientId: string;
    clientName?: string; // Denormalized for quick access
    items: InvoiceItem[];
    subtotal: number; // Sum of all item amounts before tax
    gstBreakdown: GSTBreakdown;
    total: number; // Subtotal + GST
    status: InvoiceStatus;
    issueDate: Date;
    dueDate: Date;
    notes?: string;
    payments?: Payment[];
    balanceDue?: number;
    paymentLink?: string;
    paymentLinkId?: string; // Razorpay payment link ID
    createdAt?: Date;
    updatedAt?: Date;
}

export enum InvoiceStatus {
    DRAFT = 'draft',
    SENT = 'sent',
    PAID = 'paid',
    PARTIALLY_PAID = 'partially_paid',
    OVERDUE = 'overdue',
    CANCELLED = 'cancelled'
}

export interface CreateInvoiceDTO {
    clientId: string;
    items: InvoiceItem[];
    issueDate: Date;
    dueDate: Date;
    notes?: string;
    status?: InvoiceStatus;
}

export interface UpdateInvoiceDTO {
    clientId?: string;
    items?: InvoiceItem[];
    issueDate?: Date;
    dueDate?: Date;
    notes?: string;
    status?: InvoiceStatus;
}

// Type aliases for convenience
export type InvoiceItemType = InvoiceItem;
export type InvoiceType = Invoice;


// ==================== BACKUP TYPES ====================

export interface BackupData {
    clients: Client[];
    invoices: Invoice[];
    exportedAt: Date;
    version: string;
}

export interface BackupMetadata {
    filename: string;
    timestamp: Date;
    recordCount: {
        clients: number;
        invoices: number;
    };
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp: Date;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    timestamp: Date;
}

// ==================== ERROR TYPES ====================

export enum ErrorCode {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR'
}

export interface ErrorDetails {
    code: ErrorCode;
    message: string;
    field?: string;
    details?: any;
}
