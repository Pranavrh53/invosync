<div align="center">
  <h1>🚀 InvoSync</h1>
  <p><strong>A Modern, AI-Powered Invoice & Client Management System</strong></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**InvoSync** is a comprehensive, full-stack invoice and client management platform designed for freelancers, small businesses, and enterprises. Built with modern web technologies, it offers automated GST calculations, AI-powered document intelligence, payment integration, and real-time analytics.

### Why InvoSync?

- ✅ **Automated GST Calculations** - Supports CGST, SGST, and IGST with automatic computation
- ✅ **AI Document Intelligence** - Extract invoice data from PDFs/documents with 95% accuracy
- ✅ **Payment Integration** - Razorpay integration with mock mode for testing
- ✅ **Real-time Analytics** - Comprehensive dashboards and reports
- ✅ **Multi-format Export** - Generate professional PDFs with QR codes
- ✅ **Cloud-based** - Firebase backend with real-time sync
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

---

## ✨ Features

### 🧾 Invoice Management
- **Create & Manage Invoices** - Intuitive invoice builder with drag-and-drop item management
- **Automatic GST Calculation** - Smart calculation of CGST, SGST, and IGST based on transaction type
- **Invoice Status Tracking** - Track invoices through draft, sent, paid, overdue, and cancelled states
- **Auto-generated Invoice Numbers** - Sequential invoice numbering with custom prefixes
- **PDF Export** - Generate professional PDFs with company branding and QR codes
- **Public Invoice View** - Share invoices via secure, tokenized links
- **Payment Links** - Integrated Razorpay payment links in invoices and PDFs

### 👥 Client Management
- **Complete Client Database** - Store client details, contact info, and GSTIN
- **GSTIN Validation** - Automatic validation of Indian GST identification numbers
- **Client Search** - Fast search by name or email
- **Client Analytics** - View client-wise invoice history and payment status
- **Email Uniqueness** - Prevent duplicate client entries

### 🤖 AI-Powered Document Intelligence
- **Smart Document Upload** - Drag-and-drop support for PDF, DOCX, DOC, TXT files
- **AI Data Extraction** - Extract invoice data with 95% confidence using AI
- **Auto-fill Forms** - Instantly populate invoice forms with extracted data
- **Multi-format Support** - Process scanned images and various document formats
- **Confidence Scoring** - AI provides accuracy scores for extracted data

### 💳 Payment Features
- **Razorpay Integration** - Generate payment links for invoices
- **Mock Payment Mode** - Test payment flows without API keys
- **Payment Tracking** - Record and track payment history
- **UPI Support** - QR code generation for UPI payments
- **Payment Reminders** - Automated reminders for due/overdue invoices
- **Payment History** - Complete audit trail of all transactions

### 📊 Analytics & Reports
- **Real-time Dashboard** - Overview of revenue, invoices, and client statistics
- **Revenue Analytics** - Track income trends over time
- **Invoice Statistics** - Breakdown by status (draft, sent, paid, overdue)
- **Client Insights** - Top clients by revenue
- **GST Reports** - Detailed GST breakdown for tax filing
- **Export Reports** - Download reports in various formats

### 🔧 Additional Features
- **Items Library** - Maintain a catalog of products/services with HSN codes
- **Estimates/Quotes** - Create and send estimates before invoicing
- **Backup & Restore** - Local backup with one-click restore
- **Settings Management** - Configure company details, tax rates, and preferences
- **Multi-user Support** - Firebase Authentication with Google Sign-in
- **Responsive Design** - Mobile-first design with TailwindCSS
- **Dark Mode Ready** - Modern UI with dark mode support
- **AI Chatbot** - Integrated chatbot for user assistance

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS 3.4
- **UI Components**: Custom component library
- **State Management**: Zustand 5
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **QR Codes**: qrcode.react
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Drag & Drop**: @dnd-kit
- **AI Integration**: Google Generative AI (Gemini)

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Language**: TypeScript
- **Cloud Platform**: Firebase Functions
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Payment Gateway**: Razorpay
- **API Architecture**: RESTful with modular design

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript strict mode
- **Hosting**: Firebase Hosting
- **CI/CD**: Firebase CLI

---

## 🏗️ Architecture

InvoSync follows a **modular, layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │Dashboard │ Invoices │ Clients  │   AI     │ Payments │  │
│  │          │          │          │  Docs    │          │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         State Management (Zustand)                     │ │
│  │         API Services (Axios)                           │ │
│  │         UI Components (TailwindCSS)                    │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API (HTTPS)
┌────────────────────────▼────────────────────────────────────┐
│              BACKEND (Firebase Functions)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Express.js Router                     │ │
│  └──────────┬──────────┬──────────┬──────────┬───────────┘ │
│  ┌──────────▼─┐  ┌─────▼──────┐  ┌▼─────────┐  ┌─────────┐│
│  │  Clients   │  │  Invoices  │  │  Backup  │  │ Payment ││
│  │  Module    │  │  Module    │  │  Module  │  │ Module  ││
│  │            │  │            │  │          │  │         ││
│  │ • Routes   │  │ • Routes   │  │ • Routes │  │• Routes ││
│  │ • Controller│ │ • Controller│ │• Service │  │• Service││
│  │ • Service  │  │ • Service  │  │          │  │         ││
│  │ • Model    │  │ • Model    │  │          │  │         ││
│  └────────────┘  └────────────┘  └──────────┘  └─────────┘│
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Utilities (Error Handling, Response)          │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │ Firebase SDK
┌────────────────────────▼────────────────────────────────────┐
│                   FIREBASE SERVICES                          │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │Firestore │   Auth   │ Storage  │ Hosting  │Functions │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Principles

1. **Modular Architecture** - Each feature is a self-contained module
2. **Type Safety** - Full TypeScript coverage across frontend and backend
3. **RESTful API** - Clean, consistent API design with standard HTTP methods
4. **Error Handling** - Centralized error handling with custom error types
5. **Validation** - Input validation at both frontend and backend layers
6. **Scalability** - Firebase's auto-scaling infrastructure
7. **Security** - Firebase Auth, Firestore rules, and input sanitization

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Firebase Project** with Firestore, Auth, and Functions enabled
- **Razorpay Account** (optional, for payment features)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Pranavrh53/invosync.git
   cd invosync
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend/functions
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../../frontend
   npm install
   ```

### Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Enable **Firestore Database**, **Authentication**, **Storage**, and **Functions**

2. **Configure Firebase Authentication**
   - Enable **Email/Password** authentication
   - Enable **Google** authentication (optional)

3. **Get Firebase Configuration**
   - Go to Project Settings → Your apps
   - Copy the Firebase config object

4. **Configure Frontend Environment**
   ```bash
   cd frontend
   cp .env.example .env
   ```
   
   Edit `.env` with your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_URL=http://localhost:3000/api
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Configure Backend Environment** (Optional for local development)
   ```bash
   cd backend/functions
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   FRONTEND_URL=http://localhost:5173
   ```

### Running Locally

1. **Start Backend Server**
   ```bash
   cd backend/functions
   npm run dev:server
   ```
   Backend will run on `http://localhost:3000`

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open in Browser**
   Navigate to `http://localhost:5173`

### First-Time Setup

1. **Create an Account**
   - Click "Sign Up" on the login page
   - Enter your email and password
   - Or use Google Sign-in

2. **Configure Settings**
   - Go to Settings page
   - Add your company details
   - Configure tax rates and preferences
   - Add UPI ID for payment QR codes

3. **Add Your First Client**
   - Navigate to Clients page
   - Click "Add Client"
   - Fill in client details

4. **Create Your First Invoice**
   - Go to Invoices → New Invoice
   - Select client
   - Add items
   - Generate and download PDF

---

## 📁 Project Structure

```
invosync/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Base UI components (Button, Card, etc.)
│   │   │   ├── invoices/      # Invoice-specific components
│   │   │   ├── clients/       # Client-specific components
│   │   │   ├── analytics/     # Analytics components
│   │   │   └── ai/            # AI chatbot components
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Invoices.tsx
│   │   │   ├── InvoiceBuilder.tsx
│   │   │   ├── Clients.tsx
│   │   │   ├── Items.tsx
│   │   │   ├── DocumentIntelligence.tsx
│   │   │   ├── Payments.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── services/          # API service layer
│   │   │   ├── api.ts
│   │   │   ├── clientApi.ts
│   │   │   ├── invoiceApi.ts
│   │   │   └── revenueApi.ts
│   │   ├── store/             # Zustand state management
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   ├── config/            # Configuration files
│   │   ├── router.tsx         # React Router configuration
│   │   └── main.tsx           # Application entry point
│   ├── public/                # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                    # Firebase Functions backend
│   ├── functions/
│   │   ├── src/
│   │   │   ├── modules/       # Feature modules
│   │   │   │   ├── clients/   # Client management
│   │   │   │   │   ├── model.ts
│   │   │   │   │   ├── service.ts
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   └── routes.ts
│   │   │   │   ├── invoices/  # Invoice management
│   │   │   │   │   ├── model.ts
│   │   │   │   │   ├── service.ts
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   └── routes.ts
│   │   │   │   └── backup/    # Backup & restore
│   │   │   │       ├── service.ts
│   │   │   │       ├── controller.ts
│   │   │   │       └── routes.ts
│   │   │   ├── utils/         # Utility functions
│   │   │   │   ├── errorHandler.ts
│   │   │   │   ├── response.ts
│   │   │   │   └── firebase.ts
│   │   │   ├── types.ts       # TypeScript type definitions
│   │   │   └── index.ts       # Main entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── firestore.rules        # Firestore security rules
│   ├── firestore.indexes.json # Firestore indexes
│   └── firebase.json          # Firebase configuration
│
├── docs/                       # Documentation
│   ├── API_REFERENCE.md
│   ├── ARCHITECTURE.md
│   └── IMPLEMENTATION_SUMMARY.md
│
├── .agent/                     # Agent workflows
│   └── workflows/
│       └── payment_features_setup.md
│
├── FIREBASE_SETUP.md          # Firebase setup guide
├── RAZORPAY_QUICKSTART.md     # Razorpay integration guide
├── README.md                  # This file
└── firebase.json              # Firebase project config
```

---

## 🔄 How It Works

### 1. Invoice Creation Flow

```
User → Dashboard → Create Invoice
  ↓
Select Client (from client database)
  ↓
Add Items (from items library or custom)
  ↓
System calculates:
  • Subtotal (sum of all items)
  • GST (CGST+SGST or IGST based on state)
  • Total amount
  ↓
Save as Draft or Send
  ↓
Generate PDF with:
  • Company branding
  • Invoice details
  • GST breakdown
  • Payment link (if Razorpay configured)
  • UPI QR code
  ↓
Share via email or download
```

### 2. GST Calculation Logic

**Intra-State Transaction** (Same state):
```
Subtotal: ₹10,000
Tax Rate: 18%
CGST: ₹900 (9%)
SGST: ₹900 (9%)
Total: ₹11,800
```

**Inter-State Transaction** (Different states):
```
Subtotal: ₹10,000
Tax Rate: 18%
IGST: ₹1,800 (18%)
Total: ₹11,800
```

### 3. AI Document Intelligence Flow

```
User uploads invoice document (PDF/DOCX)
  ↓
AI analyzes document structure
  ↓
Extracts:
  • Invoice number
  • Client details
  • Line items
  • Amounts and taxes
  • Dates
  ↓
Displays extracted data with confidence score
  ↓
User reviews and confirms
  ↓
Auto-fills invoice form OR exports formatted PDF
```

### 4. Payment Flow

```
Invoice created → Generate Payment Link (Razorpay)
  ↓
Link embedded in:
  • PDF invoice
  • Email template
  • Public invoice view
  ↓
Client clicks link → Razorpay payment page
  ↓
Payment completed → Webhook notification
  ↓
Invoice status updated to "Paid"
  ↓
Payment recorded in history
```

### 5. Data Backup Flow

```
User → Settings → Backup & Restore
  ↓
Click "Create Backup"
  ↓
System exports:
  • All clients
  • All invoices
  • All items
  ↓
Generates JSON file with timestamp
  ↓
User downloads backup file
  ↓
To restore: Upload backup file → System imports data
```

---

## 📚 API Documentation

### Base URL
- **Local**: `http://localhost:3000/api`
- **Production**: `https://your-region-your-project.cloudfunctions.net/api`

### Authentication
All API requests require Firebase Authentication token in the header:
```
Authorization: Bearer <firebase_id_token>
```

### Endpoints Overview

#### Clients API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/clients` | Create new client |
| GET | `/api/clients` | Get all clients (paginated) |
| GET | `/api/clients/:id` | Get client by ID |
| PUT | `/api/clients/:id` | Update client |
| DELETE | `/api/clients/:id` | Delete client |
| GET | `/api/clients/search?q=` | Search clients |
| GET | `/api/clients/stats/count` | Get client count |

#### Invoices API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/invoices` | Create new invoice |
| GET | `/api/invoices` | Get all invoices (paginated) |
| GET | `/api/invoices/:id` | Get invoice by ID |
| PUT | `/api/invoices/:id` | Update invoice |
| DELETE | `/api/invoices/:id` | Delete invoice |
| PATCH | `/api/invoices/:id/status` | Update invoice status |
| GET | `/api/invoices/client/:clientId` | Get invoices by client |
| GET | `/api/invoices/stats/summary` | Get invoice statistics |

#### Backup API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/backup/create` | Create new backup |
| GET | `/api/backup/list` | List all backups |
| POST | `/api/backup/restore` | Restore from backup |
| GET | `/api/backup/export` | Export data as JSON |
| GET | `/api/backup/download/:filename` | Download backup file |
| DELETE | `/api/backup/:filename` | Delete backup file |

### Example Request

**Create Invoice:**
```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "clientId": "client_123",
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

**Response:**
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "id": "invoice_xyz789",
    "invoiceNumber": "INV-20240115-1234",
    "subtotal": 50000,
    "gstBreakdown": {
      "cgst": 4500,
      "sgst": 4500,
      "igst": 0,
      "total": 9000
    },
    "total": 59000
  }
}
```

For complete API documentation, see [API_REFERENCE.md](backend/API_REFERENCE.md)

---

## 🚀 Deployment

### Deploy to Firebase

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy Functions and Hosting**
   ```bash
   cd ..
   firebase deploy
   ```

3. **Deploy Only Functions**
   ```bash
   firebase deploy --only functions
   ```

4. **Deploy Only Hosting**
   ```bash
   firebase deploy --only hosting
   ```

### Environment Variables for Production

**Frontend** (Firebase Hosting):
- Set in `.env.production`
- All `VITE_*` variables
- Update `VITE_API_URL` to production function URL

**Backend** (Firebase Functions):
- Set via Firebase CLI:
  ```bash
  firebase functions:config:set razorpay.key_id="rzp_live_xxx"
  firebase functions:config:set razorpay.key_secret="xxx"
  ```

### Firestore Security Rules

Update `firestore.rules` for production:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clients/{clientId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    match /invoices/{invoiceId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 📸 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Real-time analytics and overview of your business*

### Invoice Builder
![Invoice Builder](docs/screenshots/invoice-builder.png)
*Intuitive drag-and-drop invoice creation*

### AI Document Intelligence
![AI Document Intelligence](docs/screenshots/ai-docs.png)
*Extract invoice data from documents with AI*

### Client Management
![Client Management](docs/screenshots/clients.png)
*Comprehensive client database*

### PDF Export
![PDF Export](docs/screenshots/pdf-export.png)
*Professional invoices with payment links*

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure code passes linting (`npm run lint`)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Firebase** - Backend infrastructure
- **Razorpay** - Payment gateway
- **Google Gemini** - AI capabilities
- **Lucide** - Beautiful icons
- **TailwindCSS** - Styling framework

---

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/Pranavrh53/invosync/issues)
- **Email**: support@invosync.com

---

## 🗺️ Roadmap

- [ ] Multi-currency support
- [ ] Recurring invoices
- [ ] Email automation
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Team collaboration
- [ ] API webhooks
- [ ] Custom branding themes

---

<div align="center">
  <p>Built with ❤️ by the InvoSync Team</p>
  <p>
    <a href="https://github.com/Pranavrh53/invosync">⭐ Star us on GitHub</a> •
    <a href="https://github.com/Pranavrh53/invosync/issues">🐛 Report Bug</a> •
    <a href="https://github.com/Pranavrh53/invosync/issues">✨ Request Feature</a>
  </p>
</div>