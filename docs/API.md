# API Documentation

This document provides comprehensive documentation for the InvoSync API, including payment integrations.

## Base URL
```
https://us-central1-<your-project-id>.cloudfunctions.net/api
```

## Authentication
All endpoints require authentication via JWT token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Login
```
POST /auth/login
```
**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
**Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Invoices

#### Get All Invoices
```
GET /invoices
```
**Query Parameters**
- `status` (optional): Filter by status (draft, sent, paid, overdue)
- `clientId` (optional): Filter by client ID
- `startDate` (optional): Filter by start date (ISO format)
- `endDate` (optional): Filter by end date (ISO format)

**Response**
```json
{
  "data": [
    {
      "id": "inv_123",
      "invoiceNumber": "INV-2023-001",
      "clientId": "client_123",
      "status": "paid",
      "dueDate": "2023-12-31",
      "amount": 1500.00,
      "currency": "USD"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

#### Create Invoice
```
POST /invoices
```
**Request Body**
```json
{
  "clientId": "client_123",
  "items": [
    {
      "description": "Website Development",
      "quantity": 1,
      "unitPrice": 1000.00,
      "taxRate": 18
    }
  ],
  "dueDate": "2023-12-31",
  "notes": "Thank you for your business!"
}
```

### Clients

#### Get All Clients
```
GET /clients
```
**Query Parameters**
- `search` (optional): Search by name or email
- `status` (optional): Filter by status (active, inactive)

**Response**
```json
{
  "data": [
    {
      "id": "client_123",
      "name": "Acme Corp",
      "email": "contact@acmecorp.com",
      "phone": "+1234567890",
      "address": "123 Business St, City, Country",
      "taxId": "TAX123456",
      "status": "active"
    }
  ],
  "total": 1
}
```

## Error Handling

All error responses follow this format:
```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      "field1": "Validation error for field1"
    }
  }
}
```

### Common Error Codes
- `400`: Bad Request - Invalid request data
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Something went wrong

## Rate Limiting
- 100 requests per minute per IP address
- Exceeding the limit will result in a 429 status code

## Payment Integration (Razorpay)

### Setup
1. Sign up for a Razorpay account at [https://razorpay.com](https://razorpay.com)
2. Get your API keys from the Razorpay Dashboard
3. Configure the following environment variables:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

### Endpoints

#### Create Payment Link
```
POST /api/payments/razorpay/create
```
**Request Body**
```json
{
  "invoiceId": "inv_123",
  "amount": 1000,
  "currency": "INR",
  "description": "Payment for invoice #123",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "contact": "+919876543210"
  },
  "notes": {
    "invoice_id": "inv_123"
  }
}
```

## Webhooks

### Available Events
- `invoice.created`
- `invoice.paid`
- `invoice.overdue`
- `payment.captured` (Razorpay)
- `payment.failed` (Razorpay)
- `client.created`
- `client.updated`

#### Webhook Verification
All Razorpay webhook calls include a signature that should be verified:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(webhookBody, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(webhookBody))
    .digest('hex');
    
  return expectedSignature === signature;
}