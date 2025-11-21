# InvoSync API - Test Payloads & Examples

This document contains example test payloads for all API endpoints in the InvoSync backend.

---

## Table of Contents
1. [Clients Module](#clients-module)
2. [Invoices Module](#invoices-module)
3. [Backup Module](#backup-module)

---

## Clients Module

Base URL: `/api/clients`

### 1. Create Client
**Endpoint:** `POST /api/clients`

**Request Body:**
```json
{
  "name": "Acme Corporation",
  "email": "contact@acmecorp.com",
  "phone": "+91-9876543210",
  "address": "123 Business Park, Mumbai, Maharashtra 400001",
  "gstin": "27AABCU9603R1ZM"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "id": "client123abc",
    "name": "Acme Corporation",
    "email": "contact@acmecorp.com",
    "phone": "+91-9876543210",
    "address": "123 Business Park, Mumbai, Maharashtra 400001",
    "gstin": "27AABCU9603R1ZM",
    "createdAt": "2025-11-21T14:30:00.000Z",
    "updatedAt": "2025-11-21T14:30:00.000Z"
  },
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

**GSTIN Validation:**
- Format: `/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/`
- Example valid GSTIN: `27AABCU9603R1ZM`
- 15 characters: 2 digits (state code) + 5 letters + 4 digits + 1 letter + 1 alphanumeric + Z + 1 alphanumeric

---

### 2. Get Client by ID
**Endpoint:** `GET /api/clients/:id`

**Example:** `GET /api/clients/client123abc`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Client retrieved successfully",
  "data": {
    "id": "client123abc",
    "name": "Acme Corporation",
    "email": "contact@acmecorp.com",
    "phone": "+91-9876543210",
    "address": "123 Business Park, Mumbai, Maharashtra 400001",
    "gstin": "27AABCU9603R1ZM",
    "createdAt": "2025-11-21T14:30:00.000Z",
    "updatedAt": "2025-11-21T14:30:00.000Z"
  },
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

---

### 3. Get All Clients (Paginated)
**Endpoint:** `GET /api/clients?page=1&limit=10`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Clients retrieved successfully",
  "data": [
    {
      "id": "client123abc",
      "name": "Acme Corporation",
      "email": "contact@acmecorp.com",
      "phone": "+91-9876543210",
      "address": "123 Business Park, Mumbai, Maharashtra 400001",
      "gstin": "27AABCU9603R1ZM",
      "createdAt": "2025-11-21T14:30:00.000Z",
      "updatedAt": "2025-11-21T14:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

---

### 4. Update Client
**Endpoint:** `PUT /api/clients/:id`

**Request Body (all fields optional):**
```json
{
  "name": "Acme Corporation Ltd.",
  "phone": "+91-9876543211",
  "address": "456 New Business Park, Mumbai, Maharashtra 400002"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Client updated successfully",
  "data": {
    "id": "client123abc",
    "name": "Acme Corporation Ltd.",
    "email": "contact@acmecorp.com",
    "phone": "+91-9876543211",
    "address": "456 New Business Park, Mumbai, Maharashtra 400002",
    "gstin": "27AABCU9603R1ZM",
    "createdAt": "2025-11-21T14:30:00.000Z",
    "updatedAt": "2025-11-21T14:35:00.000Z"
  },
  "timestamp": "2025-11-21T14:35:00.000Z"
}
```

---

### 5. Delete Client
**Endpoint:** `DELETE /api/clients/:id`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Client deleted successfully",
  "timestamp": "2025-11-21T14:40:00.000Z"
}
```

---

### 6. Search Clients
**Endpoint:** `GET /api/clients/search?q=acme`

**Query Parameters:**
- `q` (required): Search query (searches in name and email)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": [
    {
      "id": "client123abc",
      "name": "Acme Corporation",
      "email": "contact@acmecorp.com",
      "phone": "+91-9876543210",
      "address": "123 Business Park, Mumbai, Maharashtra 400001",
      "gstin": "27AABCU9603R1ZM",
      "createdAt": "2025-11-21T14:30:00.000Z",
      "updatedAt": "2025-11-21T14:30:00.000Z"
    }
  ],
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

---

### 7. Get Client Count
**Endpoint:** `GET /api/clients/stats/count`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Client count retrieved successfully",
  "data": {
    "count": 42
  },
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

---

## Invoices Module

Base URL: `/api/invoices`

### 1. Create Invoice
**Endpoint:** `POST /api/invoices`

**Request Body:**
```json
{
  "clientId": "client123abc",
  "items": [
    {
      "description": "Web Development Services",
      "quantity": 40,
      "unitPrice": 1500,
      "taxRate": 18,
      "hsnCode": "998314"
    },
    {
      "description": "UI/UX Design",
      "quantity": 20,
      "unitPrice": 2000,
      "taxRate": 18,
      "hsnCode": "998313"
    }
  ],
  "issueDate": "2025-11-21T00:00:00.000Z",
  "dueDate": "2025-12-21T00:00:00.000Z",
  "notes": "Payment terms: Net 30 days",
  "status": "draft",
  "isInterState": false
}
```

**Allowed GST Rates:** 5%, 12%, 18%, 28%

**Success Response (201):**
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "id": "invoice456def",
    "invoiceNumber": "INV-202511-0001",
    "clientId": "client123abc",
    "clientName": "Acme Corporation",
    "items": [
      {
        "description": "Web Development Services",
        "quantity": 40,
        "unitPrice": 1500,
        "amount": 60000,
        "taxRate": 18,
        "hsnCode": "998314"
      },
      {
        "description": "UI/UX Design",
        "quantity": 20,
        "unitPrice": 2000,
        "amount": 40000,
        "taxRate": 18,
        "hsnCode": "998313"
      }
    ],
    "subtotal": 100000,
    "gstBreakdown": {
      "cgst": 9000,
      "sgst": 9000,
      "igst": 0,
      "total": 18000
    },
    "total": 118000,
    "status": "draft",
    "issueDate": "2025-11-21T00:00:00.000Z",
    "dueDate": "2025-12-21T00:00:00.000Z",
    "notes": "Payment terms: Net 30 days",
    "createdAt": "2025-11-21T14:30:00.000Z",
    "updatedAt": "2025-11-21T14:30:00.000Z"
  },
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

**Invoice Number Format:** `INV-YYYYMM-XXXX`
- Example: `INV-202511-0001`
- YYYY: Year (4 digits)
- MM: Month (2 digits)
- XXXX: Random 4-digit number

**GST Calculation:**
- For **intra-state** transactions (`isInterState: false`):
  - CGST = Total GST / 2
  - SGST = Total GST / 2
  - IGST = 0
- For **inter-state** transactions (`isInterState: true`):
  - CGST = 0
  - SGST = 0
  - IGST = Total GST

---

### 2. Get Invoice by ID
**Endpoint:** `GET /api/invoices/:id`

**Example:** `GET /api/invoices/invoice456def`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Invoice retrieved successfully",
  "data": {
    "id": "invoice456def",
    "invoiceNumber": "INV-202511-0001",
    "clientId": "client123abc",
    "clientName": "Acme Corporation",
    "items": [...],
    "subtotal": 100000,
    "gstBreakdown": {
      "cgst": 9000,
      "sgst": 9000,
      "igst": 0,
      "total": 18000
    },
    "total": 118000,
    "status": "draft",
    "issueDate": "2025-11-21T00:00:00.000Z",
    "dueDate": "2025-12-21T00:00:00.000Z",
    "notes": "Payment terms: Net 30 days",
    "createdAt": "2025-11-21T14:30:00.000Z",
    "updatedAt": "2025-11-21T14:30:00.000Z"
  },
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

---

### 3. Get All Invoices (Paginated & Filtered)
**Endpoint:** `GET /api/invoices?page=1&limit=10&status=draft&clientId=client123abc`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `status` (optional): draft | sent | paid | overdue | cancelled
- `clientId` (optional): Filter by client ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Invoices retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  },
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

---

### 4. Update Invoice
**Endpoint:** `PUT /api/invoices/:id`

**Request Body (all fields optional):**
```json
{
  "items": [
    {
      "description": "Web Development Services (Updated)",
      "quantity": 50,
      "unitPrice": 1500,
      "taxRate": 18,
      "hsnCode": "998314"
    }
  ],
  "notes": "Payment terms: Net 45 days",
  "status": "sent",
  "isInterState": false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Invoice updated successfully",
  "data": {
    "id": "invoice456def",
    "invoiceNumber": "INV-202511-0001",
    "clientId": "client123abc",
    "clientName": "Acme Corporation",
    "items": [...],
    "subtotal": 75000,
    "gstBreakdown": {
      "cgst": 6750,
      "sgst": 6750,
      "igst": 0,
      "total": 13500
    },
    "total": 88500,
    "status": "sent",
    "issueDate": "2025-11-21T00:00:00.000Z",
    "dueDate": "2025-12-21T00:00:00.000Z",
    "notes": "Payment terms: Net 45 days",
    "createdAt": "2025-11-21T14:30:00.000Z",
    "updatedAt": "2025-11-21T14:35:00.000Z"
  },
  "timestamp": "2025-11-21T14:35:00.000Z"
}
```

---

### 5. Update Invoice Status
**Endpoint:** `PATCH /api/invoices/:id/status`

**Request Body:**
```json
{
  "status": "paid"
}
```

**Allowed Status Values:**
- `draft`
- `sent`
- `paid`
- `overdue`
- `cancelled`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Invoice status updated successfully",
  "data": {
    "id": "invoice456def",
    "invoiceNumber": "INV-202511-0001",
    "status": "paid",
    ...
  },
  "timestamp": "2025-11-21T14:40:00.000Z"
}
```

---

### 6. Delete Invoice
**Endpoint:** `DELETE /api/invoices/:id`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Invoice deleted successfully",
  "timestamp": "2025-11-21T14:40:00.000Z"
}
```

---

### 7. Get Invoices by Client
**Endpoint:** `GET /api/invoices/client/:clientId`

**Example:** `GET /api/invoices/client/client123abc`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Client invoices retrieved successfully",
  "data": [
    {
      "id": "invoice456def",
      "invoiceNumber": "INV-202511-0001",
      "clientId": "client123abc",
      "clientName": "Acme Corporation",
      ...
    }
  ],
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

---

### 8. Get Invoice Statistics
**Endpoint:** `GET /api/invoices/stats/summary`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Invoice statistics retrieved successfully",
  "data": {
    "total": 25,
    "byStatus": {
      "draft": 5,
      "sent": 10,
      "paid": 8,
      "overdue": 2,
      "cancelled": 0
    },
    "totalAmount": 2500000,
    "paidAmount": 1200000,
    "pendingAmount": 1300000
  },
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

---

## Backup Module

Base URL: `/api/backup`

### 1. Create Backup
**Endpoint:** `POST /api/backup/create`

**Request Body:** None

**Success Response (201):**
```json
{
  "success": true,
  "message": "Backup created successfully",
  "data": {
    "filename": "invosync-backup-2025-11-21T14-30-00-000Z.json",
    "timestamp": "2025-11-21T14:30:00.000Z",
    "recordCount": {
      "clients": 42,
      "invoices": 125
    }
  },
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

---

### 2. List Backups
**Endpoint:** `GET /api/backup/list`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Backups retrieved successfully",
  "data": [
    {
      "filename": "invosync-backup-2025-11-21T14-30-00-000Z.json",
      "timestamp": "2025-11-21T14:30:00.000Z",
      "recordCount": {
        "clients": 42,
        "invoices": 125
      }
    },
    {
      "filename": "invosync-backup-2025-11-20T10-15-00-000Z.json",
      "timestamp": "2025-11-20T10:15:00.000Z",
      "recordCount": {
        "clients": 40,
        "invoices": 120
      }
    }
  ],
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

---

### 3. Restore Backup
**Endpoint:** `POST /api/backup/restore`

**Request Body:**
```json
{
  "filename": "invosync-backup-2025-11-21T14-30-00-000Z.json"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Backup restored successfully",
  "data": {
    "clients": 42,
    "invoices": 125
  },
  "timestamp": "2025-11-21T14:35:00.000Z"
}
```

---

### 4. Export Data (Download JSON)
**Endpoint:** `GET /api/backup/export`

**Response:** Downloads a JSON file with the following structure:

```json
{
  "clients": [
    {
      "id": "client123abc",
      "name": "Acme Corporation",
      "email": "contact@acmecorp.com",
      "phone": "+91-9876543210",
      "address": "123 Business Park, Mumbai, Maharashtra 400001",
      "gstin": "27AABCU9603R1ZM",
      "createdAt": "2025-11-21T14:30:00.000Z",
      "updatedAt": "2025-11-21T14:30:00.000Z"
    }
  ],
  "invoices": [
    {
      "id": "invoice456def",
      "invoiceNumber": "INV-202511-0001",
      "clientId": "client123abc",
      "clientName": "Acme Corporation",
      "items": [...],
      "subtotal": 100000,
      "gstBreakdown": {
        "cgst": 9000,
        "sgst": 9000,
        "igst": 0,
        "total": 18000
      },
      "total": 118000,
      "status": "draft",
      "issueDate": "2025-11-21T00:00:00.000Z",
      "dueDate": "2025-12-21T00:00:00.000Z",
      "notes": "Payment terms: Net 30 days",
      "createdAt": "2025-11-21T14:30:00.000Z",
      "updatedAt": "2025-11-21T14:30:00.000Z"
    }
  ],
  "exportedAt": "2025-11-21T14:30:00.000Z",
  "version": "1.0.0"
}
```

---

### 5. Download Backup File
**Endpoint:** `GET /api/backup/download/:filename`

**Example:** `GET /api/backup/download/invosync-backup-2025-11-21T14-30-00-000Z.json`

**Response:** Downloads the specified backup file

---

### 6. Delete Backup
**Endpoint:** `DELETE /api/backup/:filename`

**Example:** `DELETE /api/backup/invosync-backup-2025-11-21T14-30-00-000Z.json`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Backup deleted successfully",
  "timestamp": "2025-11-21T14:40:00.000Z"
}
```

---

## Error Responses

All endpoints return standardized error responses:

### Validation Error (400)
```json
{
  "success": false,
  "message": "Client validation failed",
  "error": {
    "message": "Client validation failed",
    "code": "VALIDATION_ERROR",
    "statusCode": 400,
    "details": {
      "errors": [
        "Valid email is required",
        "Invalid GSTIN format"
      ]
    }
  },
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Client with ID 'xyz123' not found",
  "error": {
    "message": "Client with ID 'xyz123' not found",
    "code": "NOT_FOUND",
    "statusCode": 404
  },
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

### Duplicate Entry (409)
```json
{
  "success": false,
  "message": "Client with email 'contact@acmecorp.com' already exists",
  "error": {
    "message": "Client with email 'contact@acmecorp.com' already exists",
    "code": "DUPLICATE_ENTRY",
    "statusCode": 409,
    "field": "email"
  },
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "message": "An unexpected error occurred",
  "error": {
    "message": "Database connection failed",
    "code": "INTERNAL_ERROR"
  },
  "timestamp": "2025-11-21T14:30:00.000Z"
}
```

---

## Notes

1. **All timestamps** are in ISO 8601 format (UTC)
2. **All monetary values** are in the smallest currency unit (e.g., paise for INR)
3. **GSTIN validation** follows the official Indian GST format
4. **GST rates** are restricted to: 5%, 12%, 18%, 28%
5. **Invoice numbers** are auto-generated in the format: `INV-YYYYMM-XXXX`
6. **Pagination** is available for clients and invoices list endpoints
7. **Backup files** are stored locally in the `backups/` directory
