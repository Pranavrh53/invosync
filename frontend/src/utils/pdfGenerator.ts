import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters';

export const generateInvoicePDF = (invoice: any) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('INVOICE', 14, 22);

    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoice.invoiceNumber || 'DRAFT'}`, 14, 30);
    doc.text(`Date: ${formatDate(invoice.issueDate)}`, 14, 35);
    doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 14, 40);

    // Client Details
    doc.text('Bill To:', 14, 50);
    doc.setFontSize(12);
    doc.text(invoice.clientName || 'Client Name', 14, 56);

    // Items Table
    const tableColumn = ["Description", "Qty", "Price", "GST %", "Amount"];
    const tableRows: any[] = [];

    invoice.items.forEach((item: any) => {
        const itemData = [
            item.description,
            item.quantity,
            formatCurrency(item.unitPrice),
            `${item.taxRate}%`,
            formatCurrency(item.quantity * item.unitPrice),
        ];
        tableRows.push(itemData);
    });

    autoTable(doc, {
        startY: 65,
        head: [tableColumn],
        body: tableRows,
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY || 65;

    doc.text(`Subtotal: ${formatCurrency(invoice.subtotal || 0)}`, 140, finalY + 10);
    doc.text(`Total GST: ${formatCurrency(invoice.gstBreakdown?.totalGST || 0)}`, 140, finalY + 15);
    doc.setFontSize(12);
    doc.text(`Total: ${formatCurrency(invoice.total || 0)}`, 140, finalY + 22);

    // Save
    doc.save(`invoice_${invoice.invoiceNumber || 'draft'}.pdf`);
};
