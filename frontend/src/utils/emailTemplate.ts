/**
 * Email template generator for invoices
 * This generates HTML email templates that can be sent to clients
 */

interface EmailTemplateData {
    invoiceNumber: string;
    clientName: string;
    total: number;
    dueDate: string;
    paymentLink?: string;
    upiId?: string;
    freelancerName?: string;
    items: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
        taxRate: number;
    }>;
    subtotal: number;
    gstBreakdown: {
        totalGST: number;
    };
}

export const generateInvoiceEmailTemplate = (data: EmailTemplateData): string => {
    const {
        invoiceNumber,
        clientName,
        total,
        dueDate,
        paymentLink,
        upiId,
        freelancerName,
        items,
        subtotal,
        gstBreakdown
    } = data;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const itemsHTML = items.map(item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.unitPrice)}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.taxRate}%</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${formatCurrency(item.quantity * item.unitPrice)}</td>
        </tr>
    `).join('');

    const paymentSection = paymentLink ? `
        <div style="margin-top: 30px; padding: 20px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">💳 Pay Online</h3>
            <p style="margin: 0 0 15px 0; color: #475569;">Click the button below to pay securely via Razorpay:</p>
            <a href="${paymentLink}" 
               style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin-bottom: 10px;">
                Pay ${formatCurrency(total)} Now
            </a>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b;">
                Or copy this link: <a href="${paymentLink}" style="color: #3b82f6;">${paymentLink}</a>
            </p>
        </div>
    ` : '';

    const upiSection = (upiId && freelancerName) ? `
        <div style="margin-top: 20px; padding: 20px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
            <h3 style="margin: 0 0 15px 0; color: #15803d; font-size: 18px;">📱 Pay via UPI</h3>
            <p style="margin: 0 0 10px 0; color: #475569;">
                <strong>UPI ID:</strong> <code style="background-color: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${upiId}</code>
            </p>
            <p style="margin: 0; color: #475569;">
                <strong>Payee:</strong> ${freelancerName}
            </p>
        </div>
    ` : '';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoiceNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">INVOICE</h1>
            <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 18px;">#${invoiceNumber}</p>
        </div>

        <!-- Main Content -->
        <div style="background-color: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Greeting -->
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #334155;">
                Dear <strong>${clientName}</strong>,
            </p>
            <p style="margin: 0 0 30px 0; font-size: 14px; color: #64748b;">
                Thank you for your business! Please find your invoice details below.
            </p>

            <!-- Invoice Details -->
            <div style="margin-bottom: 30px; padding: 15px; background-color: #f8fafc; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #64748b; font-size: 14px;">Invoice Number:</span>
                    <strong style="color: #1e293b; font-size: 14px;">${invoiceNumber}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #64748b; font-size: 14px;">Due Date:</span>
                    <strong style="color: #dc2626; font-size: 14px;">${formatDate(dueDate)}</strong>
                </div>
            </div>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background-color: #f1f5f9;">
                        <th style="padding: 12px; text-align: left; color: #475569; font-weight: 600; font-size: 14px;">Description</th>
                        <th style="padding: 12px; text-align: center; color: #475569; font-weight: 600; font-size: 14px;">Qty</th>
                        <th style="padding: 12px; text-align: right; color: #475569; font-weight: 600; font-size: 14px;">Price</th>
                        <th style="padding: 12px; text-align: center; color: #475569; font-weight: 600; font-size: 14px;">GST</th>
                        <th style="padding: 12px; text-align: right; color: #475569; font-weight: 600; font-size: 14px;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>

            <!-- Totals -->
            <div style="margin-bottom: 30px; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #64748b; font-size: 14px;">Subtotal:</span>
                    <span style="color: #1e293b; font-size: 14px;">${formatCurrency(subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 14px;">Total GST:</span>
                    <span style="color: #1e293b; font-size: 14px;">${formatCurrency(gstBreakdown.totalGST)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #1e293b; font-size: 18px; font-weight: 700;">Total Amount:</span>
                    <span style="color: #3b82f6; font-size: 20px; font-weight: 700;">${formatCurrency(total)}</span>
                </div>
            </div>

            <!-- Payment Options -->
            ${paymentSection}
            ${upiSection}

            <!-- Footer Note -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;">
                    If you have any questions about this invoice, please contact us.
                </p>
                <p style="margin: 0; font-size: 14px; color: #64748b;">
                    Thank you for your business!
                </p>
            </div>
        </div>

        <!-- Email Footer -->
        <div style="margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            <p style="margin: 0;">This is an automated email. Please do not reply.</p>
            <p style="margin: 5px 0 0 0;">Generated on ${new Date().toLocaleDateString('en-IN')}</p>
        </div>
    </div>
</body>
</html>
    `.trim();
};

/**
 * Generate plain text version of the invoice email
 */
export const generateInvoiceEmailPlainText = (data: EmailTemplateData): string => {
    const {
        invoiceNumber,
        clientName,
        total,
        dueDate,
        paymentLink,
        upiId,
        freelancerName,
        items,
        subtotal,
        gstBreakdown
    } = data;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    let text = `
INVOICE #${invoiceNumber}
${'='.repeat(50)}

Dear ${clientName},

Thank you for your business! Please find your invoice details below.

Invoice Number: ${invoiceNumber}
Due Date: ${formatDate(dueDate)}

ITEMS
${'='.repeat(50)}
`;

    items.forEach(item => {
        text += `
${item.description}
Qty: ${item.quantity} | Price: ${formatCurrency(item.unitPrice)} | GST: ${item.taxRate}%
Amount: ${formatCurrency(item.quantity * item.unitPrice)}
`;
    });

    text += `
${'='.repeat(50)}
TOTALS
${'='.repeat(50)}
Subtotal: ${formatCurrency(subtotal)}
Total GST: ${formatCurrency(gstBreakdown.totalGST)}
TOTAL AMOUNT: ${formatCurrency(total)}

`;

    if (paymentLink) {
        text += `
PAYMENT LINK
${'='.repeat(50)}
Pay securely online via Razorpay:
${paymentLink}

`;
    }

    if (upiId && freelancerName) {
        text += `
UPI PAYMENT
${'='.repeat(50)}
UPI ID: ${upiId}
Payee: ${freelancerName}

`;
    }

    text += `
If you have any questions about this invoice, please contact us.
Thank you for your business!

---
This is an automated email. Please do not reply.
Generated on ${new Date().toLocaleDateString('en-IN')}
    `.trim();

    return text;
};
