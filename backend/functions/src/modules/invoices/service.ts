import * as crypto from 'crypto';
import { db, COLLECTIONS, serverTimestamp } from '../../utils/firebase';
import { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO, InvoiceStatus } from '../../types';
import { InvoiceModel } from './model';
import { ClientService } from '../clients/service';
import { ErrorFactory } from '../../utils/errorHandler';

/**
 * Invoice service - Business logic layer for invoice operations
 */

export class InvoiceService {
    private collection = db.collection(COLLECTIONS.INVOICES);
    private clientService = new ClientService();

    /**
     * Create a new invoice
     */
    async createInvoice(data: CreateInvoiceDTO, isInterState: boolean = false): Promise<Invoice> {
        // Validate input
        InvoiceModel.validateCreate(data);

        // Verify client exists
        const client = await this.clientService.getClientById(data.clientId);

        // Process items and calculate amounts
        const processedItems = InvoiceModel.processItems(data.items);
        const subtotal = InvoiceModel.calculateSubtotal(processedItems);
        const gstBreakdown = InvoiceModel.calculateGST(processedItems, isInterState);
        const total = InvoiceModel.calculateTotal(subtotal, gstBreakdown.total);

        // Generate invoice number
        const invoiceNumber = InvoiceModel.generateInvoiceNumber();

        // Generate share token
        const shareToken = crypto.randomBytes(16).toString('hex');

        // Prepare invoice data
        const invoiceData = {
            invoiceNumber,
            clientId: data.clientId,
            clientName: client.name,
            items: processedItems,
            subtotal,
            gstBreakdown,
            total,
            status: data.status || InvoiceStatus.DRAFT,
            issueDate: new Date(data.issueDate),
            dueDate: new Date(data.dueDate),
            notes: data.notes || '',
            shareToken,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        // Save to Firestore
        const docRef = await this.collection.add(invoiceData);
        const doc = await docRef.get();

        return InvoiceModel.fromFirestore(doc.id, doc.data());
    }

    /**
     * Get invoice by share token
     */
    async getInvoiceByShareToken(token: string): Promise<Invoice> {
        const snapshot = await this.collection
            .where('shareToken', '==', token)
            .limit(1)
            .get();

        if (snapshot.empty) {
            throw ErrorFactory.notFound('Invoice', 'token');
        }

        const doc = snapshot.docs[0];
        return InvoiceModel.fromFirestore(doc.id, doc.data());
    }

    /**
     * Get invoice by ID
     */
    async getInvoiceById(id: string): Promise<Invoice> {
        const doc = await this.collection.doc(id).get();

        if (!doc.exists) {
            throw ErrorFactory.notFound('Invoice', id);
        }

        return InvoiceModel.fromFirestore(doc.id, doc.data());
    }

    /**
     * Get all invoices with optional pagination and filtering
     */
    async getAllInvoices(
        page: number = 1,
        limit: number = 10,
        status?: InvoiceStatus,
        clientId?: string
    ): Promise<{ invoices: Invoice[], total: number }> {
        const offset = (page - 1) * limit;
        let query: any = this.collection;

        // Apply filters
        if (status) {
            query = query.where('status', '==', status);
        }

        if (clientId) {
            query = query.where('clientId', '==', clientId);
        }

        // Get all matching documents first
        const snapshot = await query.get();
        const total = snapshot.size;

        // Convert to array and sort in memory to avoid index requirements
        let allDocs = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            data: doc.data()
        }));

        // Sort by createdAt in descending order (newest first)
        allDocs.sort((a: any, b: any) => {
            const aTime = a.data.createdAt?.toMillis?.() || 0;
            const bTime = b.data.createdAt?.toMillis?.() || 0;
            return bTime - aTime;
        });

        // Apply pagination
        const paginatedDocs = allDocs.slice(offset, offset + limit);

        // Convert to Invoice objects
        const invoices = paginatedDocs.map((doc: any) =>
            InvoiceModel.fromFirestore(doc.id, doc.data)
        );

        return { invoices, total };
    }

    /**
     * Update invoice by ID
     */
    async updateInvoice(id: string, data: UpdateInvoiceDTO, isInterState: boolean = false): Promise<Invoice> {
        // Validate input
        InvoiceModel.validateUpdate(data);

        // Check if invoice exists
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw ErrorFactory.notFound('Invoice', id);
        }

        const currentData = doc.data();
        const updateData: any = {};

        // Ensure shareToken exists
        if (!currentData?.shareToken) {
            updateData.shareToken = crypto.randomBytes(16).toString('hex');
        }

        // If client is being updated, verify it exists
        if (data.clientId) {
            const client = await this.clientService.getClientById(data.clientId);
            updateData.clientId = data.clientId;
            updateData.clientName = client.name;
        }

        // If items are being updated, recalculate amounts
        if (data.items) {
            const processedItems = InvoiceModel.processItems(data.items);
            const subtotal = InvoiceModel.calculateSubtotal(processedItems);
            const gstBreakdown = InvoiceModel.calculateGST(processedItems, isInterState);
            const total = InvoiceModel.calculateTotal(subtotal, gstBreakdown.total);

            updateData.items = processedItems;
            updateData.subtotal = subtotal;
            updateData.gstBreakdown = gstBreakdown;
            updateData.total = total;
        }

        // Update other fields
        if (data.status) updateData.status = data.status;
        if (data.issueDate) updateData.issueDate = new Date(data.issueDate);
        if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
        if (data.notes !== undefined) updateData.notes = data.notes;

        updateData.updatedAt = serverTimestamp();

        await docRef.update(updateData);
        const updatedDoc = await docRef.get();

        return InvoiceModel.fromFirestore(updatedDoc.id, updatedDoc.data());
    }

    /**
     * Delete invoice by ID
     */
    async deleteInvoice(id: string): Promise<void> {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw ErrorFactory.notFound('Invoice', id);
        }

        await docRef.delete();
    }

    /**
     * Update invoice status
     */
    async updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw ErrorFactory.notFound('Invoice', id);
        }

        await docRef.update({
            status,
            updatedAt: serverTimestamp()
        });

        const updatedDoc = await docRef.get();
        return InvoiceModel.fromFirestore(updatedDoc.id, updatedDoc.data());
    }

    /**
     * Get invoices by client ID
     */
    async getInvoicesByClient(clientId: string): Promise<Invoice[]> {
        const snapshot = await this.collection
            .where('clientId', '==', clientId)
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map((doc: any) =>
            InvoiceModel.fromFirestore(doc.id, doc.data())
        );
    }

    /**
     * Get invoice statistics
     */
    async getInvoiceStats(): Promise<any> {
        const snapshot = await this.collection.get();
        const invoices = snapshot.docs.map((doc: any) => InvoiceModel.fromFirestore(doc.id, doc.data()));

        const stats = {
            total: invoices.length,
            byStatus: {
                draft: 0,
                sent: 0,
                paid: 0,
                overdue: 0,
                cancelled: 0
            },
            totalAmount: 0,
            paidAmount: 0,
            pendingAmount: 0
        };

        invoices.forEach((invoice: Invoice) => {
            const statusKey = invoice.status as keyof typeof stats.byStatus;
            stats.byStatus[statusKey]++;
            stats.totalAmount += invoice.total;

            if (invoice.status === InvoiceStatus.PAID) {
                stats.paidAmount += invoice.total;
            } else if (invoice.status !== InvoiceStatus.CANCELLED) {
                stats.pendingAmount += invoice.total;
            }
        });

        // Round amounts
        stats.totalAmount = Math.round(stats.totalAmount * 100) / 100;
        stats.paidAmount = Math.round(stats.paidAmount * 100) / 100;
        stats.pendingAmount = Math.round(stats.pendingAmount * 100) / 100;

        return stats;
    }

    /**
     * Get revenue by month for the last 12 months
     */
    async getRevenueByMonth(): Promise<Array<{ month: string; revenue: number }>> {
        const snapshot = await this.collection.get();
        const invoices = snapshot.docs.map((doc: any) => InvoiceModel.fromFirestore(doc.id, doc.data()));

        // Get current date and calculate 12 months ago
        const now = new Date();
        const monthsData: { [key: string]: number } = {};

        // Initialize last 12 months with 0 revenue
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthsData[monthKey] = 0;
        }

        // Aggregate revenue by month (only for paid invoices)
        invoices.forEach((invoice: Invoice) => {
            if (invoice.status === InvoiceStatus.PAID && invoice.issueDate) {
                const issueDate = new Date(invoice.issueDate);
                const monthKey = `${issueDate.getFullYear()}-${String(issueDate.getMonth() + 1).padStart(2, '0')}`;

                if (monthsData.hasOwnProperty(monthKey)) {
                    monthsData[monthKey] += invoice.total;
                }
            }
        });

        // Convert to array format expected by frontend
        const result = Object.entries(monthsData).map(([month, revenue]) => ({
            month,
            revenue: Math.round(revenue * 100) / 100
        }));

        return result;
    }
}
