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

    doc.setFontSize(10);
    doc.text(`Subtotal: ${formatCurrency(invoice.subtotal || 0)}`, 140, finalY + 10);
    const gstTotal = invoice.gstBreakdown?.total ?? invoice.gstBreakdown?.totalGST ?? 0;
    doc.text(`Total GST: ${formatCurrency(gstTotal)}`, 140, finalY + 15);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${formatCurrency(invoice.total || 0)}`, 140, finalY + 22);

    // Payment Information Section
    let paymentY = finalY + 35;

    // Add separator line
    doc.setLineWidth(0.5);
    doc.line(14, paymentY, 196, paymentY);
    paymentY += 8;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Information', 14, paymentY);
    paymentY += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Add UPI information if available
    if (invoice.upiId && invoice.freelancerName) {
        doc.text(`UPI ID: ${invoice.upiId}`, 14, paymentY);
        paymentY += 5;
        doc.text(`Payee: ${invoice.freelancerName}`, 14, paymentY);
        paymentY += 5;
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('(Scan QR code in digital invoice or use UPI ID above)', 14, paymentY);
        doc.setTextColor(0, 0, 0);
        paymentY += 8;
    }

    // Add payment link if available
    if (invoice.paymentLink) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Online Payment Link:', 14, paymentY);
        paymentY += 5;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 255);
        doc.textWithLink(invoice.paymentLink, 14, paymentY, { url: invoice.paymentLink });
        doc.setTextColor(0, 0, 0);
        paymentY += 5;

        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('Click the link above to pay securely online via Razorpay', 14, paymentY);
        doc.setTextColor(0, 0, 0);
    }

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for your business!', 105, pageHeight - 15, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, pageHeight - 10, { align: 'center' });

    // Save
    doc.save(`invoice_${invoice.invoiceNumber || 'draft'}.pdf`);
};
