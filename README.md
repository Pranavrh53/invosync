# InvoSync

A modern, full-stack invoice and client management system built with React, Node.js, and Firebase.

## ✨ Features

- **🤖 AI-Powered Invoicing**: Generate invoices from natural language prompts ("Create invoice for website design...").
- **🔮 Predictive Analytics**: Forecast future cash flow and revenue trends.
- **📄 Document Intelligence**: Extract data from uploaded invoices automatically.
- **📊 Dashboard**: Real-time revenue tracking, payment heatmaps, and client insights.
- **📝 Invoice Management**: Create, edit, and track invoices with ease.
- **👥 Client Management**: Manage client details and payment history.
- **📱 Responsive Design**: Works seamlessly on desktop and mobile.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm
- A Firebase project (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/invosync.git
   cd invosync
   ```

2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend/functions
   npm install

   # Install frontend dependencies
   cd ../../frontend
   npm install
   ```

### 🔐 Configuration (Important!)

To run the backend locally, you need to authenticate with Firebase. You have two options:

#### Option 1: Use Your Own Firebase Project (Recommended)
1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Go to Project Settings > Service Accounts
3. Click "Generate new private key"
4. Create a `.env` file in `backend/functions/` based on `.env.example`
5. Add your credentials:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-email@...
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
   ```

#### Option 2: Use Service Account File
If you have a `serviceAccountKey.json` file, place it in `backend/` (root of backend folder).

> **Note:** The application will automatically fallback to "Application Default Credentials" if deployed to Firebase Hosting, so these keys are **NOT** required for production deployment.

### 🏃‍♂️ Running Locally

1. **Start the Backend Server**
   ```bash
   cd backend/functions
   npm run dev:server
   ```

2. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173)

## 🛠️ Tech Stack
- **Frontend:** React, Vite, TailwindCSS, Shadcn UI
- **Backend:** Node.js, Express, Firebase Functions
- **Database:** Firestore
- **Auth:** Firebase Auth

## 📦 Deployment

To deploy to Firebase Hosting:

```bash
# Build frontend
cd frontend
npm run build

# Deploy
cd ..
firebase deploy --only hosting
```