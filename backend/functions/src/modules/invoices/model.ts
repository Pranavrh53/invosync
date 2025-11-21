import { Invoice, InvoiceItem, GSTBreakdown, CreateInvoiceDTO, UpdateInvoiceDTO } from '../../types';
import { ErrorFactory } from '../../utils/errorHandler';

/**
 * Invoice data model with validation and GST calculation logic
 */

export class InvoiceModel {
    /**
     * Validate invoice data for creation
     */
    static validateCreate(data: CreateInvoiceDTO): void {
        const errors: string[] = [];

        if (!data.clientId || data.clientId.trim().length === 0) {
            errors.push('Client ID is required');
        }

        if (!data.items || data.items.length === 0) {
            errors.push('At least one invoice item is required');
        } else {
            data.items.forEach((item, index) => {
                const itemErrors = this.validateInvoiceItem(item);
                if (itemErrors.length > 0) {
                    errors.push(`Item ${index + 1}: ${itemErrors.join(', ')}`);
                }
            });
        }

        if (!data.issueDate) {
            errors.push('Issue date is required');
        }

        if (!data.dueDate) {
            errors.push('Due date is required');
        }

        if (data.issueDate && data.dueDate && new Date(data.dueDate) < new Date(data.issueDate)) {
            errors.push('Due date must be after issue date');
        }

        if (errors.length > 0) {
            throw ErrorFactory.validationError(
                'Invoice validation failed',
                undefined,
                { errors }
            );
        }
    }

    /**
     * Validate invoice data for update
     */
    static validateUpdate(data: UpdateInvoiceDTO): void {
        const errors: string[] = [];

        if (data.items && data.items.length > 0) {
            data.items.forEach((item, index) => {
                const itemErrors = this.validateInvoiceItem(item);
                if (itemErrors.length > 0) {
                    errors.push(`Item ${index + 1}: ${itemErrors.join(', ')}`);
                }
            });
        }

        if (data.issueDate && data.dueDate && new Date(data.dueDate) < new Date(data.issueDate)) {
            errors.push('Due date must be after issue date');
        }

        if (errors.length > 0) {
            throw ErrorFactory.validationError(
                'Invoice validation failed',
                undefined,
                { errors }
            );
        }
    }

    /**
     * Validate individual invoice item
     */
    private static validateInvoiceItem(item: InvoiceItem): string[] {
        const errors: string[] = [];
        const allowedGSTRates = [5, 12, 18, 28]; // Allowed GST rates in India

        if (!item.description || item.description.trim().length === 0) {
            errors.push('Description is required');
        }

        if (!item.quantity || item.quantity <= 0) {
            errors.push('Quantity must be greater than 0');
        }

        if (!item.unitPrice || item.unitPrice < 0) {
            errors.push('Unit price must be non-negative');
        }

        if (item.taxRate === undefined) {
            errors.push('Tax rate is required');
        } else if (!allowedGSTRates.includes(item.taxRate)) {
            errors.push(`Tax rate must be one of: ${allowedGSTRates.join('%, ')}%`);
        }

        return errors;
    }

    /**
     * Calculate GST breakdown for invoice items
     * GST in India: CGST + SGST = Total GST (for intra-state) or IGST (for inter-state)
     * For simplicity, we'll use CGST + SGST model (each is half of total GST rate)
     */
    static calculateGST(items: InvoiceItem[], isInterState: boolean = false): GSTBreakdown {
        let totalGST = 0;
        let cgst = 0;
        let sgst = 0;
        let igst = 0;

        items.forEach(item => {
            const itemAmount = item.quantity * item.unitPrice;
            const itemGST = (itemAmount * item.taxRate) / 100;
            totalGST += itemGST;

            if (isInterState) {
                igst += itemGST;
            } else {
                cgst += itemGST / 2;
                sgst += itemGST / 2;
            }
        });

        return {
            cgst: Math.round(cgst * 100) / 100,
            sgst: Math.round(sgst * 100) / 100,
            igst: Math.round(igst * 100) / 100,
            total: Math.round(totalGST * 100) / 100
        };
    }

    /**
     * Calculate subtotal from invoice items
     */
    static calculateSubtotal(items: InvoiceItem[]): number {
        const subtotal = items.reduce((sum, item) => {
            return sum + (item.quantity * item.unitPrice);
        }, 0);

        return Math.round(subtotal * 100) / 100;
    }

    /**
     * Calculate total amount (subtotal + GST)
     */
    static calculateTotal(subtotal: number, gstTotal: number): number {
        return Math.round((subtotal + gstTotal) * 100) / 100;
    }

    /**
     * Process invoice items to ensure amounts are calculated
     */
    static processItems(items: InvoiceItem[]): InvoiceItem[] {
        return items.map(item => ({
            ...item,
            amount: Math.round(item.quantity * item.unitPrice * 100) / 100
        }));
    }

    /**
     * Generate invoice number
     * Format: INV-YYYYMM-XXXX
     */
    static generateInvoiceNumber(): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

        return `INV-${year}${month}-${random}`;
    }

    /**
     * Helper to safely convert Firestore timestamps/strings to Date
     */
    private static toDate(val: any): Date | undefined {
        if (!val) return undefined;
        if (val instanceof Date) return val;
        if (typeof val.toDate === 'function') return val.toDate(); // Firestore Timestamp
        if (typeof val === 'string') return new Date(val);
        return undefined;
    }

    /**
     * Convert Firestore document to Invoice object
     */
    static fromFirestore(id: string, data: any): Invoice {
        return {
            id,
            invoiceNumber: data.invoiceNumber,
            clientId: data.clientId,
            clientName: data.clientName,
            items: data.items,
            subtotal: data.subtotal,
            gstBreakdown: data.gstBreakdown,
            total: data.total,
            status: data.status,
            issueDate: this.toDate(data.issueDate) || new Date(),
            dueDate: this.toDate(data.dueDate) || new Date(),
            notes: data.notes,
            shareToken: data.shareToken,
            createdAt: this.toDate(data.createdAt),
            updatedAt: this.toDate(data.updatedAt)
        };
    }

    /**
     * Convert Invoice object to Firestore document data
     */
    static toFirestore(invoice: Partial<Invoice>): any {
        const data: any = {};

        if (invoice.invoiceNumber) data.invoiceNumber = invoice.invoiceNumber;
        if (invoice.clientId) data.clientId = invoice.clientId;
        if (invoice.clientName) data.clientName = invoice.clientName;
        if (invoice.items) data.items = invoice.items;
        if (invoice.subtotal !== undefined) data.subtotal = invoice.subtotal;
        if (invoice.gstBreakdown) data.gstBreakdown = invoice.gstBreakdown;
        if (invoice.total !== undefined) data.total = invoice.total;
        if (invoice.status) data.status = invoice.status;
        if (invoice.issueDate) data.issueDate = invoice.issueDate;
        if (invoice.dueDate) data.dueDate = invoice.dueDate;
        if (invoice.notes !== undefined) data.notes = invoice.notes;
        if (invoice.shareToken) data.shareToken = invoice.shareToken;

        return data;
    }
}
