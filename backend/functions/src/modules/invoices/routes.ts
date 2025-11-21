import { Router } from 'express';
import * as invoiceController from './controller';

const router = Router();

// Invoice CRUD operations
router.post('/', invoiceController.createInvoice);
router.get('/stats/summary', invoiceController.getInvoiceStats); // Must be before /:id
router.get('/stats/revenue-by-month', invoiceController.getRevenueByMonth); // Must be before /:id
router.post('/check-overdue', invoiceController.checkOverdue);
router.get('/client/:clientId', invoiceController.getInvoicesByClient);
router.get('/:id', invoiceController.getInvoice);
router.get('/', invoiceController.getAllInvoices);
router.put('/:id', invoiceController.updateInvoice);
router.patch('/:id/status', invoiceController.updateInvoiceStatus);
router.delete('/:id', invoiceController.deleteInvoice);

// Payments
router.post('/:id/payments', invoiceController.addPayment);
router.post('/:id/payment-link', invoiceController.generatePaymentLink);
router.post('/:id/simulate-payment', invoiceController.simulatePayment);

export default router;
