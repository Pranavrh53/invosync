import * as crypto from 'crypto';
import { db, COLLECTIONS, serverTimestamp } from '../../utils/firebase';
import { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO, InvoiceStatus, Payment } from '../../types';
import { InvoiceModel } from './model';
import { ClientService } from '../clients/service';
import { ErrorFactory } from '../../utils/errorHandler';
import Razorpay from 'razorpay';

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

    /**
     * Check for overdue invoices and apply penalties
     */
    async checkOverdueInvoices(): Promise<{ updated: number, notifications: number }> {
        const result = await this.getAllInvoices(1, 1000); // Get all (up to 1000)
        const invoices = result.invoices;
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        let updatedCount = 0;
        let notificationCount = 0;

        for (const invoice of invoices) {
            if (invoice.status === InvoiceStatus.PAID || invoice.status === InvoiceStatus.CANCELLED) continue;

            const dueDate = new Date(invoice.dueDate);
            const dueDateZero = new Date(dueDate);
            dueDateZero.setHours(0, 0, 0, 0);
            const nowZero = new Date(now);
            nowZero.setHours(0, 0, 0, 0);

            // Check for Overdue
            if (dueDateZero < nowZero && invoice.status !== InvoiceStatus.OVERDUE) {
                // Mark as overdue
                const updateData: any = { status: InvoiceStatus.OVERDUE };

                // Add penalty if not present
                const hasPenalty = invoice.items.some(item => item.description === 'Late Fee');
                if (!hasPenalty) {
                    const penaltyItem = {
                        description: 'Late Fee',
                        quantity: 1,
                        unitPrice: 50, // Fixed penalty
                        taxRate: 0,
                        amount: 50
                    };
                    const newItems = [...invoice.items, penaltyItem];

                    updateData.items = newItems;
                }

                await this.updateInvoice(invoice.id!, updateData);
                updatedCount++;
            }

            // Check for Notification (Due Tomorrow)
            if (dueDateZero.getTime() === tomorrow.getTime()) {
                console.log(`[NOTIFICATION] Sending reminder for Invoice ${invoice.invoiceNumber} to client ${invoice.clientName || 'Unknown'}`);
                notificationCount++;
            }
        }

        return { updated: updatedCount, notifications: notificationCount };
    }

    /**
     * Add a payment to an invoice
     */
    async addPayment(invoiceId: string, payment: Omit<Payment, 'id' | 'invoiceId' | 'status'>): Promise<Invoice> {
        const docRef = this.collection.doc(invoiceId);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw ErrorFactory.notFound('Invoice', invoiceId);
        }

        const invoice = InvoiceModel.fromFirestore(doc.id, doc.data());

        const newPayment: Payment = {
            id: Math.random().toString(36).substr(2, 9),
            invoiceId,
            ...payment,
            status: 'completed'
        };

        const currentPayments = invoice.payments || [];
        const updatedPayments = [...currentPayments, newPayment];

        const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
        const balanceDue = invoice.total - totalPaid;

        let newStatus = invoice.status;
        if (balanceDue <= 0) {
            newStatus = InvoiceStatus.PAID;
        } else if (totalPaid > 0) {
            newStatus = InvoiceStatus.PARTIALLY_PAID;
        }

        await docRef.update({
            payments: updatedPayments,
            balanceDue,
            status: newStatus,
            updatedAt: serverTimestamp()
        });

        const updatedDoc = await docRef.get();
        return InvoiceModel.fromFirestore(updatedDoc.id, updatedDoc.data());
    }

    /**
     * Generate Razorpay Payment Link (Test/Sandbox Mode)
     */
    async generatePaymentLink(invoiceId: string): Promise<string> {
        const invoice = await this.getInvoiceById(invoiceId);

        // Fetch client details for better payment link
        let clientEmail = "client@example.com";
        let clientPhone = "9999999999";

        try {
            const client = await this.clientService.getClientById(invoice.clientId);
            if (client.email) clientEmail = client.email;
            if (client.phone) clientPhone = client.phone.replace(/[^0-9]/g, '').slice(-10); // Extract 10 digits
        } catch (error) {
            console.warn("Could not fetch client details for payment link");
        }

        // Check for Razorpay keys in environment
        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (key_id && key_secret) {
            try {
                // Initialize Razorpay instance (works in test mode with test keys)
                const instance = new Razorpay({
                    key_id,
                    key_secret
                });

                // Create payment link with proper test mode configuration
                const link = await instance.paymentLink.create({
                    amount: Math.round((invoice.balanceDue || invoice.total) * 100), // Amount in paise
                    currency: "INR",
                    accept_partial: true,
                    first_min_partial_amount: 100,
                    description: `Payment for Invoice ${invoice.invoiceNumber}`,
                    customer: {
                        name: invoice.clientName || "Client",
                        email: clientEmail,
                        contact: clientPhone
                    },
                    notify: {
                        sms: false, // Disable SMS in test mode
                        email: false // Disable email in test mode
                    },
                    reminder_enable: false, // Disable reminders in test mode
                    notes: {
                        invoice_id: invoiceId,
                        invoice_number: invoice.invoiceNumber,
                        mode: 'test'
                    },
                    callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/invoices/${invoiceId}`,
                    callback_method: 'get'
                });

                // Store the payment link in the invoice
                await this.collection.doc(invoiceId).update({
                    paymentLink: link.short_url,
                    paymentLinkId: link.id,
                    updatedAt: serverTimestamp()
                });

                console.log(`✅ Razorpay payment link generated: ${link.short_url}`);
                return link.short_url;
            } catch (error: any) {
                console.error("❌ Razorpay Error:", error.error || error.message || error);
                // Fall through to mock link on error
            }
        } else {
            console.warn("⚠️ Razorpay keys not found. Using mock payment link.");
        }

        // Mock Link - Points to local payment simulation page
        const mockLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pay/${invoiceId}`;
        await this.collection.doc(invoiceId).update({
            paymentLink: mockLink,
            updatedAt: serverTimestamp()
        });
        return mockLink;
    }

    /**
     * Simulate a successful payment (for testing)
     */
    async simulatePayment(invoiceId: string): Promise<Invoice> {
        const invoice = await this.getInvoiceById(invoiceId);
        if (invoice.status === InvoiceStatus.PAID) return invoice;

        const amountToPay = invoice.balanceDue ?? invoice.total;

        return this.addPayment(invoiceId, {
            amount: amountToPay,
            date: new Date(),
            mode: 'Razorpay (Simulated)'
        });
    }
}
