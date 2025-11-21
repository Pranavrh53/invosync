# Razorpay Payment Integration Guide

## Overview

InvoSync now supports **Razorpay Payment Links** for seamless online payment collection. This integration works in **Test/Sandbox Mode** by default, allowing you to test the complete payment flow without actual money transactions.

---

## Features

✅ **Automatic Payment Link Generation** - Generate secure payment links for any invoice  
✅ **Test Mode Support** - Use Razorpay test keys for free testing  
✅ **Payment Link in PDF** - Payment links are automatically included in generated PDFs  
✅ **Email Templates** - Professional HTML email templates with payment links  
✅ **UPI Integration** - Display UPI QR codes alongside Razorpay links  
✅ **Partial Payments** - Support for partial payment collection  
✅ **Payment Tracking** - Track all payments against invoices  

---

## Setup Instructions

### Step 1: Create Razorpay Account

1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Click **Sign Up** and create a free account
3. Complete the basic registration (no business verification needed for test mode)

### Step 2: Get Test API Keys

1. Log in to your Razorpay Dashboard
2. Navigate to **Settings** → **API Keys**
3. Make sure you're in **Test Mode** (toggle in the top-right corner)
4. Click **Generate Test Key**
5. Copy both:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (keep this confidential)

### Step 3: Configure Backend

1. Navigate to `backend/functions/` directory
2. Create a `.env` file (if not exists)
3. Add the following configuration:

```bash
# Razorpay Configuration (Test Mode)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Frontend URL (for payment callbacks)
FRONTEND_URL=http://localhost:5173
```

4. Replace the `xxx` values with your actual test keys

### Step 4: Restart Backend Server

```bash
cd backend/functions
npm run dev
```

---

## How It Works

### 1. Generate Payment Link

When you click **"Generate Payment Link"** on an invoice:

1. Backend checks for Razorpay credentials in `.env`
2. If credentials exist:
   - Creates a Razorpay Payment Link via API
   - Stores the link in the invoice document
   - Returns the short URL to the frontend
3. If credentials are missing:
   - Falls back to a mock payment link
   - Points to local payment simulation page

### 2. Payment Link Details

The generated payment link includes:
- Invoice amount (with partial payment support)
- Client name and contact details (from your database)
- Invoice number and reference
- Callback URL (redirects back to your app after payment)
- Test mode indicator

### 3. Payment Flow

```
User clicks "Pay Now" 
    ↓
Redirected to Razorpay Payment Page
    ↓
Enters test card details (see below)
    ↓
Payment processed
    ↓
Redirected back to InvoSync
    ↓
Payment recorded in invoice
```

---

## Testing Payments

### Test Card Details

Razorpay provides test cards for testing payments:

#### Successful Payment
- **Card Number:** `4111 1111 1111 1111`
- **CVV:** Any 3 digits (e.g., `123`)
- **Expiry:** Any future date (e.g., `12/25`)
- **Name:** Any name

#### Failed Payment
- **Card Number:** `4000 0000 0000 0002`
- **CVV:** Any 3 digits
- **Expiry:** Any future date

#### More Test Cards
Visit: [https://razorpay.com/docs/payments/payments/test-card-details/](https://razorpay.com/docs/payments/payments/test-card-details/)

### Test UPI IDs
- **Success:** `success@razorpay`
- **Failure:** `failure@razorpay`

---

## Features in Detail

### 1. Payment Link in PDF

When you download an invoice PDF, it automatically includes:
- Payment link (clickable)
- UPI QR code (if configured in Settings)
- Payment instructions

**Location in PDF:** Bottom section under "Payment Information"

### 2. Email Templates

Use the email template generator to send professional invoices:

```typescript
import { generateInvoiceEmailTemplate } from './utils/emailTemplate';

const emailHTML = generateInvoiceEmailTemplate({
    invoiceNumber: 'INV-202511-0001',
    clientName: 'John Doe',
    total: 10000,
    dueDate: '2025-12-01',
    paymentLink: 'https://rzp.io/i/abc123',
    items: [...],
    // ... other invoice data
});

// Send emailHTML via your email service
```

### 3. Payment Tracking

All payments are tracked in the invoice:
- Payment amount
- Payment date
- Payment mode (UPI, Card, etc.)
- Payment status (completed/pending)
- Balance due calculation

### 4. Partial Payments

Razorpay payment links support partial payments:
- Minimum partial amount: ₹1.00
- Clients can pay any amount ≥ minimum
- Balance due is automatically calculated
- Invoice status updates to "Partially Paid"

---

## API Endpoints

### Generate Payment Link
```http
POST /api/invoices/:id/payment-link
```

**Response:**
```json
{
  "success": true,
  "message": "Payment link generated successfully",
  "data": {
    "link": "https://rzp.io/i/abc123"
  }
}
```

### Add Payment
```http
POST /api/invoices/:id/payments
```

**Request Body:**
```json
{
  "amount": 5000,
  "date": "2025-11-22T00:00:00.000Z",
  "mode": "UPI"
}
```

### Simulate Payment (Testing)
```http
POST /api/invoices/:id/simulate-payment
```

Simulates a full payment for testing purposes.

---

## Troubleshooting

### Issue: Payment link not generating

**Solution:**
1. Check if `.env` file exists in `backend/functions/`
2. Verify Razorpay keys are correct
3. Ensure keys start with `rzp_test_` (test mode)
4. Check backend console for error messages

### Issue: "Invalid API Key" error

**Solution:**
1. Regenerate API keys from Razorpay Dashboard
2. Make sure you're in Test Mode
3. Copy the entire key without extra spaces
4. Restart the backend server

### Issue: Payment link shows mock URL

**Solution:**
This is expected when Razorpay keys are not configured. The mock link allows you to test the UI without actual Razorpay integration.

### Issue: Callback not working

**Solution:**
1. Check `FRONTEND_URL` in `.env`
2. Ensure it matches your frontend URL
3. For local development: `http://localhost:5173`
4. For production: Your actual domain

---

## Security Best Practices

### ⚠️ IMPORTANT

1. **Never commit `.env` file** to version control
2. **Never use live keys** in development
3. **Keep Key Secret confidential** - never share or expose it
4. **Use environment variables** for all sensitive data
5. **Validate webhook signatures** (for production)

### Switching to Live Mode

When ready for production:

1. Complete Razorpay KYC verification
2. Generate **Live Mode** API keys (start with `rzp_live_`)
3. Update `.env` with live keys
4. Test thoroughly before going live
5. Enable webhook signatures for security

---

## Mock Mode (No Razorpay Account)

If you don't have Razorpay keys configured:

1. Payment links will point to: `http://localhost:5173/pay/:invoiceId`
2. You can create a mock payment page at this route
3. Use the "Simulate Payment" button to test payment recording
4. All other features work normally

---

## Additional Resources

- **Razorpay Documentation:** [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **Payment Links API:** [https://razorpay.com/docs/payments/payment-links/](https://razorpay.com/docs/payments/payment-links/)
- **Test Cards:** [https://razorpay.com/docs/payments/payments/test-card-details/](https://razorpay.com/docs/payments/payments/test-card-details/)
- **Razorpay Dashboard:** [https://dashboard.razorpay.com/](https://dashboard.razorpay.com/)

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Razorpay documentation
3. Check backend console logs for detailed error messages
4. Verify all environment variables are set correctly

---

**Last Updated:** November 22, 2025  
**Version:** 1.0.0
