import { Router } from 'express';
import {
    createInvoice,
    getInvoice,
    getAllInvoices,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus,
    getInvoicesByClient,
    getInvoiceStats,
    getRevenueByMonth,
    getInvoiceByToken
} from './controller';

/**
 * Invoice routes
 */

const router = Router();

// Invoice CRUD operations
router.post('/', createInvoice);
router.get('/stats/summary', getInvoiceStats); // Must be before /:id to avoid conflict
router.get('/stats/revenue-by-month', getRevenueByMonth); // Must be before /:id to avoid conflict
router.get('/public/:token', getInvoiceByToken); // Public route
router.get('/client/:clientId', getInvoicesByClient);
router.get('/:id', getInvoice);
router.get('/', getAllInvoices);
router.put('/:id', updateInvoice);
router.patch('/:id/status', updateInvoiceStatus);
router.delete('/:id', deleteInvoice);

export default router;
