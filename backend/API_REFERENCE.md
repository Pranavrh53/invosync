# InvoSync API Reference

Complete API documentation for all endpoints.

---

## Base URL

**Local**: `http://localhost:5001/your-project/us-central1/api`  
**Production**: `https://your-region-your-project.cloudfunctions.net/api`

---

## Authentication

Currently, the API does not require authentication. Add Firebase Auth or custom auth as needed.

---

## Common Response Format

All endpoints return JSON in this format:

### Success Response
```json
{
  "success": true,
  "message": "Description of the operation",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "statusCode": 400,
    "field": "fieldName"  // Optional
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 👥 Clients API

### Create Client
**POST** `/api/clients`

Creates a new client.

**Request Body:**
```json
{
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "+91-9876543210",
  "address": "123 Business Street, Mumbai, Maharashtra 400001",
  "gstin": "27AABCU9603R1ZM"  // Optional, must match format if provided
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "id": "client_abc123",
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+91-9876543210",
    "address": "123 Business Street, Mumbai, Maharashtra 400001",
    "gstin": "27AABCU9603R1ZM",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `email`: Required, valid email format, must be unique
- `phone`: Required, non-empty string
- `address`: Required, non-empty string
- `gstin`: Optional, must match format `22AAAAA0000A1Z5` if provided

---

### Get All Clients
**GET** `/api/clients?page=1&limit=10`

Retrieves a paginated list of clients.

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Clients retrieved successfully",
  "data": [
    {
      "id": "client_abc123",
      "name": "Acme Corporation",
      "email": "contact@acme.com",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Get Client by ID
**GET** `/api/clients/:id`

Retrieves a single client by ID.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Client retrieved successfully",
  "data": {
    "id": "client_abc123",
    "name": "Acme Corporation",
    ...
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error:** `404 Not Found` if client doesn't exist

---

### Update Client
**PUT** `/api/clients/:id`

Updates an existing client.

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "email": "newemail@acme.com",
  "phone": "+91-9876543211",
  "address": "New Address",
  "gstin": "27AABCU9603R1ZM"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Client updated successfully",
  "data": {
    "id": "client_abc123",
    "name": "Updated Name",
    ...
    "updatedAt": "2024-01-15T11:00:00.000Z"
  },
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

---

### Delete Client
**DELETE** `/api/clients/:id`

Deletes a client.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Client deleted successfully",
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

---

### Search Clients
**GET** `/api/clients/search?q=acme`

Searches clients by name or email.

**Query Parameters:**
- `q`: Search query (required)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": [
    {
      "id": "client_abc123",
      "name": "Acme Corporation",
      "email": "contact@acme.com",
      ...
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Get Client Count
**GET** `/api/clients/stats/count`

Returns the total number of clients.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Client count retrieved successfully",
  "data": {
    "count": 45
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📄 Invoices API

### Create Invoice
**POST** `/api/invoices`

Creates a new invoice with automatic GST calculation.

**Request Body:**
```json
{
  "clientId": "client_abc123",
  "items": [
    {
      "description": "Web Development Services",
      "quantity": 1,
      "unitPrice": 50000,
      "taxRate": 18,
      "hsnCode": "998314"  // Optional
    },
    {
      "description": "Hosting Services",
      "quantity": 12,
      "unitPrice": 1000,
      "taxRate": 18
    }
  ],
  "issueDate": "2024-01-15T00:00:00.000Z",
  "dueDate": "2024-02-15T00:00:00.000Z",
  "notes": "Payment terms: Net 30 days",  // Optional
  "status": "draft",  // Optional: draft, sent, paid, overdue, cancelled
  "isInterState": false  // true for IGST, false for CGST+SGST
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "id": "invoice_xyz789",
    "invoiceNumber": "INV-20240115-1234",
    "clientId": "client_abc123",
    "clientName": "Acme Corporation",
    "items": [
      {
        "description": "Web Development Services",
        "quantity": 1,
        "unitPrice": 50000,
        "amount": 50000,
        "taxRate": 18,
        "hsnCode": "998314"
      },
      {
        "description": "Hosting Services",
        "quantity": 12,
        "unitPrice": 1000,
        "amount": 12000,
        "taxRate": 18
      }
    ],
    "subtotal": 62000,
    "gstBreakdown": {
      "cgst": 5580,    // 9% of subtotal
      "sgst": 5580,    // 9% of subtotal
      "igst": 0,       // 0 for intra-state
      "total": 11160   // Total GST
    },
    "total": 73160,    // subtotal + GST
    "status": "draft",
    "issueDate": "2024-01-15T00:00:00.000Z",
    "dueDate": "2024-02-15T00:00:00.000Z",
    "notes": "Payment terms: Net 30 days",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**GST Calculation:**
- If `isInterState = false`: CGST = SGST = (subtotal × taxRate) / 2
- If `isInterState = true`: IGST = subtotal × taxRate

---

### Get All Invoices
**GET** `/api/invoices?page=1&limit=10&status=draft&clientId=client_abc123`

Retrieves a paginated list of invoices with optional filtering.

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10
- `status` (optional): Filter by status (draft, sent, paid, overdue, cancelled)
- `clientId` (optional): Filter by client ID

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Invoices retrieved successfully",
  "data": [
    {
      "id": "invoice_xyz789",
      "invoiceNumber": "INV-20240115-1234",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Get Invoice by ID
**GET** `/api/invoices/:id`

Retrieves a single invoice by ID.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Invoice retrieved successfully",
  "data": {
    "id": "invoice_xyz789",
    "invoiceNumber": "INV-20240115-1234",
    ...
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Update Invoice
**PUT** `/api/invoices/:id`

Updates an existing invoice. GST is recalculated if items are updated.

**Request Body:** (all fields optional)
```json
{
  "clientId": "client_abc123",
  "items": [...],
  "issueDate": "2024-01-15T00:00:00.000Z",
  "dueDate": "2024-02-15T00:00:00.000Z",
  "notes": "Updated notes",
  "status": "sent",
  "isInterState": false
}
```

**Response:** `200 OK`

---

### Delete Invoice
**DELETE** `/api/invoices/:id`

Deletes an invoice.

**Response:** `200 OK`

---

### Update Invoice Status
**PATCH** `/api/invoices/:id/status`

Updates only the status of an invoice.

**Request Body:**
```json
{
  "status": "paid"  // draft, sent, paid, overdue, cancelled
}
```

**Response:** `200 OK`

---

### Get Invoices by Client
**GET** `/api/invoices/client/:clientId`

Retrieves all invoices for a specific client.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Client invoices retrieved successfully",
  "data": [
    {
      "id": "invoice_xyz789",
      ...
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Get Invoice Statistics
**GET** `/api/invoices/stats/summary`

Returns comprehensive invoice statistics.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Invoice statistics retrieved successfully",
  "data": {
    "total": 150,
    "byStatus": {
      "draft": 20,
      "sent": 50,
      "paid": 70,
      "overdue": 8,
      "cancelled": 2
    },
    "totalAmount": 5000000.00,
    "paidAmount": 3500000.00,
    "pendingAmount": 1500000.00
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 💾 Backup API

### Create Backup
**POST** `/api/backup/create`

Creates a new local backup file.

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Backup created successfully",
  "data": {
    "filename": "invosync-backup-2024-01-15T10-30-00-000Z.json",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "recordCount": {
      "clients": 45,
      "invoices": 150
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### List Backups
**GET** `/api/backup/list`

Lists all available backup files.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Backups retrieved successfully",
  "data": [
    {
      "filename": "invosync-backup-2024-01-15T10-30-00-000Z.json",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "recordCount": {
        "clients": 45,
        "invoices": 150
      }
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Restore from Backup
**POST** `/api/backup/restore`

Restores data from a backup file.

**Request Body:**
```json
{
  "filename": "invosync-backup-2024-01-15T10-30-00-000Z.json"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Backup restored successfully",
  "data": {
    "clients": 45,
    "invoices": 150
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Download Backup
**GET** `/api/backup/download/:filename`

Downloads a backup file.

**Response:** File download (application/json)

---

### Export Data
**GET** `/api/backup/export`

Exports current data as JSON (in-memory, no file saved).

**Response:** File download (application/json)

---

### Delete Backup
**DELETE** `/api/backup/:filename`

Deletes a backup file.

**Response:** `200 OK`

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `NOT_FOUND` | 404 | Resource not found |
| `DUPLICATE_ENTRY` | 409 | Duplicate entry (e.g., email) |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Access denied |
| `INTERNAL_ERROR` | 500 | Server error |
| `DATABASE_ERROR` | 500 | Database operation failed |

---

## Rate Limiting

Currently not implemented. Add as needed for production.

---

## CORS

CORS is enabled for all origins in development. Configure for specific domains in production.

---

## Testing with cURL

### Create a client
```bash
curl -X POST http://localhost:5001/your-project/us-central1/api/api/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Co","email":"test@test.com","phone":"1234567890","address":"Test Address"}'
```

### Get all clients
```bash
curl http://localhost:5001/your-project/us-central1/api/api/clients
```

### Create an invoice
```bash
curl -X POST http://localhost:5001/your-project/us-central1/api/api/invoices \
  -H "Content-Type: application/json" \
  -d '{"clientId":"CLIENT_ID","items":[{"description":"Service","quantity":1,"unitPrice":10000,"taxRate":18}],"issueDate":"2024-01-15T00:00:00Z","dueDate":"2024-02-15T00:00:00Z"}'
```

---

## Postman Collection

Import this collection for easy testing:

```json
{
  "info": {
    "name": "InvoSync API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Clients",
      "item": [
        {
          "name": "Create Client",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/clients",
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"Test Company\",\"email\":\"test@company.com\",\"phone\":\"+91-9876543210\",\"address\":\"Test Address\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5001/your-project/us-central1/api"
    }
  ]
}
```

---

**Last Updated**: 2024-01-15  
**API Version**: 1.0.0
