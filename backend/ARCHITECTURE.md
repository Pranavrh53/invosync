# InvoSync Backend Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Lovable)                       │
│                    React/Next.js Application                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/REST API
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    FIREBASE CLOUD FUNCTIONS                      │
│                         (Express.js)                             │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    src/index.ts                          │   │
│  │              Main Express Application                    │   │
│  │  • CORS Middleware                                       │   │
│  │  • JSON Parser                                           │   │
│  │  • Route Registration                                    │   │
│  │  • Error Handler                                         │   │
│  └──────────┬──────────────┬──────────────┬─────────────────┘   │
│             │              │              │                      │
│    ┌────────▼────┐  ┌──────▼──────┐  ┌───▼────────┐           │
│    │   Clients   │  │  Invoices   │  │   Backup   │           │
│    │   Module    │  │   Module    │  │   Module   │           │
│    └────────┬────┘  └──────┬──────┘  └───┬────────┘           │
│             │              │              │                      │
│    ┌────────▼────────────────────────────▼────────┐            │
│    │         Modular Architecture Pattern         │            │
│    │                                               │            │
│    │  ┌─────────────────────────────────────┐    │            │
│    │  │  routes.ts                          │    │            │
│    │  │  • Define HTTP endpoints            │    │            │
│    │  │  • Map to controllers               │    │            │
│    │  └──────────────┬──────────────────────┘    │            │
│    │                 │                            │            │
│    │  ┌──────────────▼──────────────────────┐    │            │
│    │  │  controller.ts                      │    │            │
│    │  │  • Handle HTTP requests             │    │            │
│    │  │  • Parse request data               │    │            │
│    │  │  • Call service layer               │    │            │
│    │  │  • Format responses                 │    │            │
│    │  └──────────────┬──────────────────────┘    │            │
│    │                 │                            │            │
│    │  ┌──────────────▼──────────────────────┐    │            │
│    │  │  service.ts                         │    │            │
│    │  │  • Business logic                   │    │            │
│    │  │  • Data validation                  │    │            │
│    │  │  • Database operations              │    │            │
│    │  │  • GST calculations (invoices)      │    │            │
│    │  └──────────────┬──────────────────────┘    │            │
│    │                 │                            │            │
│    │  ┌──────────────▼──────────────────────┐    │            │
│    │  │  model.ts                           │    │            │
│    │  │  • Data schema                      │    │            │
│    │  │  • Validation rules                 │    │            │
│    │  │  • Firestore converters             │    │            │
│    │  │  • GST calculation logic            │    │            │
│    │  └─────────────────────────────────────┘    │            │
│    └───────────────────────────────────────────────┘            │
│                                                                   │
│    ┌─────────────────────────────────────────────────────┐     │
│    │                  Utilities Layer                     │     │
│    │                                                       │     │
│    │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │     │
│    │  │ errorHandler │  │   response   │  │  firebase │ │     │
│    │  │              │  │              │  │           │ │     │
│    │  │ • AppError   │  │ • Success    │  │ • Admin   │ │     │
│    │  │ • Factory    │  │ • Error      │  │ • Firestore│ │    │
│    │  │ • Middleware │  │ • Paginated  │  │ • Helpers │ │     │
│    │  └──────────────┘  └──────────────┘  └───────────┘ │     │
│    │                                                       │     │
│    │  ┌──────────────────────────────────────────────┐   │     │
│    │  │              types.ts                        │   │     │
│    │  │  • TypeScript Interfaces                     │   │     │
│    │  │  • Enums (InvoiceStatus, ErrorCode)          │   │     │
│    │  │  • DTOs (Create/Update)                      │   │     │
│    │  └──────────────────────────────────────────────┘   │     │
│    └─────────────────────────────────────────────────────┘     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Firestore SDK
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      FIREBASE FIRESTORE                          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   clients    │  │   invoices   │  │   backups    │          │
│  │  collection  │  │  collection  │  │  collection  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└───────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Client Creation Flow
```
Frontend → POST /api/clients
    ↓
routes.ts → createClient handler
    ↓
controller.ts → Parse request body
    ↓
service.ts → Validate & check duplicates
    ↓
model.ts → Sanitize & validate GSTIN
    ↓
Firestore → Save client document
    ↓
Response ← Success with client data
```

### 2. Invoice Creation with GST Flow
```
Frontend → POST /api/invoices
    ↓
routes.ts → createInvoice handler
    ↓
controller.ts → Parse request + isInterState flag
    ↓
service.ts → Verify client exists
    ↓
model.ts → Process items
    ├─ Calculate item amounts
    ├─ Calculate subtotal
    ├─ Calculate GST (CGST+SGST or IGST)
    └─ Calculate total
    ↓
service.ts → Generate invoice number
    ↓
Firestore → Save invoice document
    ↓
Response ← Success with invoice + GST breakdown
```

### 3. Backup Flow
```
Frontend → POST /api/backup/create
    ↓
routes.ts → createBackup handler
    ↓
controller.ts → Trigger backup
    ↓
service.ts → Export all data
    ├─ Fetch all clients
    ├─ Fetch all invoices
    └─ Create JSON file
    ↓
File System → Save backup file
    ↓
Response ← Success with metadata
```

## Module Responsibilities

### Clients Module
- ✅ CRUD operations for clients
- ✅ Email uniqueness validation
- ✅ GSTIN format validation
- ✅ Search functionality
- ✅ Pagination

### Invoices Module
- ✅ CRUD operations for invoices
- ✅ GST calculation (CGST, SGST, IGST)
- ✅ Invoice number generation
- ✅ Status management
- ✅ Client relationship
- ✅ Statistics & analytics

### Backup Module
- ✅ Data export to JSON
- ✅ Local file management
- ✅ Backup restoration
- ✅ Download functionality

## Technology Stack

```
┌─────────────────────────────────────┐
│         Application Layer           │
│  • TypeScript (strict mode)         │
│  • Express.js                        │
│  • Node.js 18                        │
└─────────────────────────────────────┘
                 │
┌─────────────────────────────────────┐
│         Cloud Platform              │
│  • Firebase Functions               │
│  • Firebase Firestore               │
│  • Firebase Admin SDK               │
└─────────────────────────────────────┘
                 │
┌─────────────────────────────────────┐
│         Development Tools           │
│  • TypeScript Compiler              │
│  • Firebase CLI                     │
│  • npm                               │
└─────────────────────────────────────┘
```

## Error Handling Flow

```
Error Occurs
    ↓
Is it AppError? ─── Yes ──→ Return structured error
    │                        with status code
    No
    ↓
Catch in asyncHandler
    ↓
Pass to errorHandler middleware
    ↓
Log error details
    ↓
Return generic 500 error
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "statusCode": 400
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Security Layers

```
Request
    ↓
┌─────────────────────┐
│  CORS Validation    │
└─────────────────────┘
    ↓
┌─────────────────────┐
│  Input Validation   │
│  (Model Layer)      │
└─────────────────────┘
    ↓
┌─────────────────────┐
│  Business Rules     │
│  (Service Layer)    │
└─────────────────────┘
    ↓
┌─────────────────────┐
│  Error Sanitization │
│  (Error Handler)    │
└─────────────────────┘
    ↓
Response
```

---

This architecture ensures:
- ✅ **Modularity**: Easy to extend with new features
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Scalability**: Can handle growing data and traffic
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Error Resilience**: Comprehensive error handling
- ✅ **Clean Code**: Follows best practices
