---
description: How to use the new payment features
---

# Payment Features Guide

## 🚀 Quick Setup

### 1. Configure Razorpay (Optional but Recommended)

To enable real payment links:

1. **Sign up** at [https://razorpay.com/](https://razorpay.com/)
2. Go to **Dashboard → Settings → API Keys**
3. Switch to **Test Mode** (toggle in top-right)
4. Click **Generate Test Key**
5. Copy **Key ID** and **Key Secret**
6. Create `.env` file in `backend/functions/`:
   ```bash
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
   FRONTEND_URL=http://localhost:5173
   ```
7. Restart backend server

**Note:** Without Razorpay keys, the system will use mock payment links (still fully functional for testing).

---

## 📋 Features

### 1. UPI QR Code

**Setup:**
- Go to **Settings** page
- Enter your **UPI ID** (e.g., `yourname@paytm`)
- Enter your **Freelancer Name**
- Click **Save Changes**

**Usage:**
- Open any invoice in Edit mode
- UPI QR code appears in "Payment Options" section
- QR code is automatically included in PDF exports
- Clients can scan to pay directly

---

### 2. Razorpay Payment Links

**Generate Link:**
1. Open an invoice in Edit mode
2. Click **Generate Payment Link** button
3. Link is generated and displayed below the button
4. Link is automatically saved in the invoice

**What happens:**
- If Razorpay keys are configured:
  - Real payment link created via Razorpay API
  - Link format: `https://rzp.io/i/xxxxxxx`
  - Supports partial payments
  - Secure payment processing
  
- If Razorpay keys are NOT configured:
  - Mock link created: `http://localhost:5173/pay/:invoiceId`
  - Use "Simulate Payment" button to test
  - All features work normally

**Payment Link Features:**
- ✅ Included in PDF exports
- ✅ Clickable link in emails
- ✅ Partial payment support
- ✅ Automatic callback to invoice page
- ✅ Test mode (free, no verification needed)

---

### 3. Partial Payments

**Record a Payment:**
1. Open an invoice in Edit mode
2. Click **Record Payment** button
3. Enter:
   - **Amount** (can be less than total)
   - **Payment Mode** (UPI, Bank Transfer, Cash, Card)
4. Click **Save Payment**

**What happens:**
- Payment is recorded in "Payment History"
- Balance Due is automatically calculated
- Invoice status updates:
  - `Paid` - if fully paid
  - `Partially Paid` - if partially paid
  - Remains current status otherwise

**View Payment History:**
- All payments shown in "Payment History" card
- Each payment shows:
  - Amount paid
  - Date and time
  - Payment mode
  - Status (completed/pending)

---

### 4. Simulate Payment (Testing)

**For Testing Only:**
1. Open an invoice in Edit mode
2. Click **Simulate Payment (Test)** button
3. Simulates a full payment via Razorpay
4. Invoice status changes to `Paid`
5. Payment appears in history

**Use this to:**
- Test payment recording
- Test invoice status updates
- Test balance calculations
- Demo the payment flow

---

## 📄 PDF Export with Payment Info

When you download an invoice PDF, it includes:

1. **Invoice Details** (as usual)
2. **Payment Information Section:**
   - UPI ID and Payee name (if configured)
   - Payment link (if generated)
   - Instructions for online payment
3. **Professional Footer**

**To generate PDF:**
- Click **Download PDF** button
- PDF opens/downloads automatically
- Share with client via email

---

## 📧 Email Templates

Use the email template generator:

```typescript
import { generateInvoiceEmailTemplate } from './utils/emailTemplate';

const emailHTML = generateInvoiceEmailTemplate({
    invoiceNumber: invoice.invoiceNumber,
    clientName: invoice.clientName,
    total: invoice.total,
    dueDate: invoice.dueDate,
    paymentLink: invoice.paymentLink,
    upiId: preferences.upiId,
    freelancerName: preferences.freelancerName,
    items: invoice.items,
    subtotal: invoice.subtotal,
    gstBreakdown: invoice.gstBreakdown
});

// Send emailHTML via your email service
```

**Email includes:**
- Professional HTML design
- Invoice details table
- Payment link button (if available)
- UPI payment info (if configured)
- Responsive design for mobile

---

## 🧪 Testing Razorpay Payments

### Test Cards (Use in Razorpay payment page)

**Successful Payment:**
- Card: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: `12/25`
- Name: Any name

**Failed Payment:**
- Card: `4000 0000 0000 0002`
- CVV: `123`
- Expiry: `12/25`

**Test UPI:**
- Success: `success@razorpay`
- Failure: `failure@razorpay`

### Testing Flow

1. Generate payment link
2. Click the link
3. Enter test card details
4. Complete payment
5. You'll be redirected back to the invoice
6. Check payment history

**Note:** Test mode is FREE and doesn't require business verification!

---

## 🔧 Troubleshooting

### Payment link shows mock URL
- **Reason:** Razorpay keys not configured
- **Solution:** Add keys to `.env` or use mock mode for testing

### "Invalid API Key" error
- **Reason:** Incorrect or expired keys
- **Solution:** Regenerate keys from Razorpay Dashboard

### Callback not working
- **Reason:** Wrong `FRONTEND_URL` in `.env`
- **Solution:** Set to `http://localhost:5173` for local dev

### QR code not showing
- **Reason:** UPI ID not configured in Settings
- **Solution:** Go to Settings and add your UPI ID

---

## 📚 Additional Resources

- **Full Documentation:** `docs/RAZORPAY_INTEGRATION.md`
- **Razorpay Dashboard:** [https://dashboard.razorpay.com/](https://dashboard.razorpay.com/)
- **Test Cards:** [https://razorpay.com/docs/payments/payments/test-card-details/](https://razorpay.com/docs/payments/payments/test-card-details/)

---

**Last Updated:** November 22, 2025
