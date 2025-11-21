# InvoSync Backend - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd backend/functions
npm install
```

### Step 2: Build the Project
```bash
npm run build
```

### Step 3: Start Development Server
```bash
npm run serve
```

Your API will be available at: `http://localhost:5001/your-project/us-central1/api`

---

## 📋 Quick Test

### Create a Client
```bash
curl -X POST http://localhost:5001/your-project/us-central1/api/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "email": "test@company.com",
    "phone": "+91-9876543210",
    "address": "123 Test Street, Mumbai",
    "gstin": "27AABCU9603R1ZM"
  }'
```

### Create an Invoice
```bash
curl -X POST http://localhost:5001/your-project/us-central1/api/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "CLIENT_ID_FROM_ABOVE",
    "items": [
      {
        "description": "Web Development",
        "quantity": 1,
        "unitPrice": 50000,
        "taxRate": 18,
        "hsnCode": "998314"
      }
    ],
    "issueDate": "2024-01-15T00:00:00Z",
    "dueDate": "2024-02-15T00:00:00Z",
    "isInterState": false
  }'
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run serve` | Start Firebase emulators |
| `npm run dev` | Watch mode for development |
| `npm run deploy` | Deploy to Firebase |

---

## 📁 Project Structure

```
backend/functions/
├── src/              # Source code
│   ├── modules/      # Feature modules
│   ├── utils/        # Utilities
│   ├── types.ts      # Type definitions
│   └── index.ts      # Main entry
├── lib/              # Compiled output (auto-generated)
├── package.json      # Dependencies
└── tsconfig.json     # TypeScript config
```

---

## 🌐 API Base URL

**Local**: `http://localhost:5001/your-project/us-central1/api`  
**Production**: `https://your-region-your-project.cloudfunctions.net/api`

---

## 📖 Full Documentation

See `README.md` for complete API documentation and examples.

---

## ✅ Health Check

Test if the API is running:
```bash
curl http://localhost:5001/your-project/us-central1/api/
```

Expected response:
```json
{
  "success": true,
  "message": "InvoSync API is running",
  "data": {
    "version": "1.0.0",
    "endpoints": {
      "clients": "/api/clients",
      "invoices": "/api/invoices",
      "backup": "/api/backup"
    }
  }
}
```

---

## 🐛 Troubleshooting

**Build errors?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Port already in use?**
- Check if another Firebase emulator is running
- Kill the process or use a different port

**Firebase not initialized?**
```bash
firebase login
firebase init
```

---

Happy coding! 🎉
