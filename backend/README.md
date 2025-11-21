# InvoSync Backend

A fully modular backend for invoice creation, client management, GST calculation, and local backup support.

## 🏗️ Architecture

This backend follows a clean, modular architecture with clear separation of concerns:

```
backend/functions/src/
├── modules/
│   ├── clients/          # Client management module
│   │   ├── model.ts      # Data validation & schema
│   │   ├── service.ts    # Business logic
│   │   ├── controller.ts # HTTP request handlers
│   │   └── routes.ts     # Route definitions
│   ├── invoices/         # Invoice management module
│   │   ├── model.ts      # Invoice schema & GST calculations
│   │   ├── service.ts    # Invoice business logic
│   │   ├── controller.ts # HTTP request handlers
│   │   └── routes.ts     # Route definitions
│   └── backup/           # Backup & export module
│       ├── service.ts    # Backup operations
│       ├── controller.ts # HTTP request handlers
│       └── routes.ts     # Route definitions
├── utils/
│   ├── errorHandler.ts   # Centralized error handling
│   ├── response.ts       # Standardized API responses
│   ├── index.ts          # Utility exports
│   └── firebase.ts       # Firebase initialization
├── types.ts              # TypeScript type definitions
└── index.ts              # Main application entry point
```

## 🚀 Features

### Client Management
- ✅ Create, read, update, delete clients
- ✅ Email validation and uniqueness
- ✅ GSTIN validation (Indian GST format)
- ✅ Search clients by name or email
- ✅ Pagination support

### Invoice Management
- ✅ Create and manage invoices
- ✅ Automatic GST calculation (CGST, SGST, IGST)
- ✅ Invoice status tracking (draft, sent, paid, overdue, cancelled)
- ✅ Auto-generated invoice numbers
- ✅ Client-based invoice filtering
- ✅ Invoice statistics and analytics

### Backup & Export
- ✅ Create local JSON backups
- ✅ List available backups
- ✅ Restore from backup
- ✅ Download backup files
- ✅ Direct data export

## 📋 Prerequisites

- Node.js 18 or higher
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Firestore enabled

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd backend/functions
   npm install
   ```

2. **Configure Firebase:**
   ```bash
   firebase login
   firebase init
   ```
   - Select "Functions" and "Firestore"
   - Choose your Firebase project
   - Select TypeScript
   - Use existing configuration files

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Firebase credentials (optional for local development)

## 🏃 Running Locally

### Option 1: Firebase Emulators (Recommended)
```bash
npm run serve
```
This will start the Firebase emulators with your functions.

### Option 2: Build and Watch
```bash
npm run dev
```
This will compile TypeScript in watch mode.

## 📦 Deployment

Deploy to Firebase:
```bash
npm run deploy
```

## 🔌 API Endpoints

### Health Check
```
GET /
```

### Clients
```
POST   /api/clients              # Create client
GET    /api/clients              # Get all clients (paginated)
GET    /api/clients/:id          # Get client by ID
PUT    /api/clients/:id          # Update client
DELETE /api/clients/:id          # Delete client
GET    /api/clients/search?q=    # Search clients
GET    /api/clients/stats/count  # Get client count
```

### Invoices
```
POST   /api/invoices                    # Create invoice
GET    /api/invoices                    # Get all invoices (paginated)
GET    /api/invoices/:id                # Get invoice by ID
PUT    /api/invoices/:id                # Update invoice
DELETE /api/invoices/:id                # Delete invoice
PATCH  /api/invoices/:id/status         # Update invoice status
GET    /api/invoices/client/:clientId   # Get invoices by client
GET    /api/invoices/stats/summary      # Get invoice statistics
```

### Backup
```
POST   /api/backup/create               # Create new backup
GET    /api/backup/list                 # List all backups
POST   /api/backup/restore              # Restore from backup
GET    /api/backup/export               # Export data as JSON
GET    /api/backup/download/:filename   # Download backup file
DELETE /api/backup/:filename            # Delete backup file
```

## 📝 Request/Response Examples

### Create Client
```json
POST /api/clients
{
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "phone": "+91-9876543210",
  "address": "123 Business Street, Mumbai",
  "gstin": "27AABCU9603R1ZM"
}
```

### Create Invoice
```json
POST /api/invoices
{
  "clientId": "client-id-here",
  "items": [
    {
      "description": "Web Development Services",
      "quantity": 1,
      "unitPrice": 50000,
      "taxRate": 18,
      "hsnCode": "998314"
    }
  ],
  "issueDate": "2024-01-15T00:00:00Z",
  "dueDate": "2024-02-15T00:00:00Z",
  "notes": "Payment terms: Net 30 days",
  "isInterState": false
}
```

### Response Format
All responses follow this structure:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🧪 Testing

You can test the API using:
- **Postman** or **Insomnia**
- **curl** commands
- Frontend integration

Example curl:
```bash
curl -X POST http://localhost:5001/your-project/us-central1/api/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "email": "test@example.com",
    "phone": "1234567890",
    "address": "Test Address"
  }'
```

## 📊 GST Calculation

The system automatically calculates GST based on:
- **Intra-state transactions**: CGST + SGST (each is 50% of total GST)
- **Inter-state transactions**: IGST (full GST amount)

Example:
- Item amount: ₹10,000
- Tax rate: 18%
- GST amount: ₹1,800
- If intra-state: CGST = ₹900, SGST = ₹900
- If inter-state: IGST = ₹1,800

## 🔒 Error Handling

All errors are handled consistently:
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

## 🗂️ Data Models

### Client
- `id`: string (auto-generated)
- `name`: string (required)
- `email`: string (required, unique)
- `phone`: string (required)
- `address`: string (required)
- `gstin`: string (optional, validated)
- `createdAt`: Date
- `updatedAt`: Date

### Invoice
- `id`: string (auto-generated)
- `invoiceNumber`: string (auto-generated)
- `clientId`: string (required)
- `clientName`: string (denormalized)
- `items`: InvoiceItem[] (required)
- `subtotal`: number (calculated)
- `gstBreakdown`: GSTBreakdown (calculated)
- `total`: number (calculated)
- `status`: enum (draft, sent, paid, overdue, cancelled)
- `issueDate`: Date (required)
- `dueDate`: Date (required)
- `notes`: string (optional)
- `createdAt`: Date
- `updatedAt`: Date

## 🤝 Contributing

This is a modular backend designed for easy extension. To add new features:

1. Create a new module in `src/modules/`
2. Follow the pattern: `model.ts`, `service.ts`, `controller.ts`, `routes.ts`
3. Register routes in `src/index.ts`

## 📄 License

MIT License - feel free to use this in your projects!

## 🆘 Support

For issues or questions, please check:
- Firebase documentation: https://firebase.google.com/docs
- TypeScript documentation: https://www.typescriptlang.org/docs

---

Built with ❤️ for InvoSync
