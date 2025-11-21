import { Request, Response } from 'express';
import { InvoiceService } from './service';
import { CreateInvoiceDTO, UpdateInvoiceDTO, InvoiceStatus } from '../../types';
import { sendSuccess, sendCreated, sendPaginated } from '../../utils/response';
import { asyncHandler } from '../../utils/errorHandler';

/**
 * Invoice controller - Handles HTTP requests and responses
 */

const invoiceService = new InvoiceService();

/**
 * Create a new invoice
 * POST /invoices
 */
export const createInvoice = asyncHandler(async (req: Request, res: Response) => {
    const invoiceData: CreateInvoiceDTO = req.body;
    const isInterState = req.body.isInterState || false;

    const invoice = await invoiceService.createInvoice(invoiceData, isInterState);

    sendCreated(res, 'Invoice created successfully', invoice);
});

/**
 * Get invoice by ID
 * GET /invoices/:id
 */
export const getInvoice = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const invoice = await invoiceService.getInvoiceById(id);

    sendSuccess(res, 'Invoice retrieved successfully', invoice);
});

/**
 * Get all invoices with pagination and filtering
 * GET /invoices?page=1&limit=10&status=draft&clientId=xxx
 */
export const getAllInvoices = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as InvoiceStatus | undefined;
    const clientId = req.query.clientId as string | undefined;

    const { invoices, total } = await invoiceService.getAllInvoices(page, limit, status, clientId);

    sendPaginated(res, 'Invoices retrieved successfully', invoices, page, limit, total);
});

/**
 * Update invoice by ID
 * PUT /invoices/:id
 */
export const updateInvoice = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData: UpdateInvoiceDTO = req.body;
    const isInterState = req.body.isInterState || false;

    const invoice = await invoiceService.updateInvoice(id, updateData, isInterState);

    sendSuccess(res, 'Invoice updated successfully', invoice);
});

/**
 * Delete invoice by ID
 * DELETE /invoices/:id
 */
export const deleteInvoice = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await invoiceService.deleteInvoice(id);

    sendSuccess(res, 'Invoice deleted successfully');
});

/**
 * Update invoice status
 * PATCH /invoices/:id/status
 */
export const updateInvoiceStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !Object.values(InvoiceStatus).includes(status)) {
        return sendSuccess(res, 'Invalid status value', null);
    }

    const invoice = await invoiceService.updateInvoiceStatus(id, status);

    sendSuccess(res, 'Invoice status updated successfully', invoice);
});

/**
 * Get invoices by client ID
 * GET /invoices/client/:clientId
 */
export const getInvoicesByClient = asyncHandler(async (req: Request, res: Response) => {
    const { clientId } = req.params;

    const invoices = await invoiceService.getInvoicesByClient(clientId);

    sendSuccess(res, 'Client invoices retrieved successfully', invoices);
});

/**
 * Get invoice statistics
 * GET /invoices/stats/summary
 */
export const getInvoiceStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await invoiceService.getInvoiceStats();

    sendSuccess(res, 'Invoice statistics retrieved successfully', stats);
});
