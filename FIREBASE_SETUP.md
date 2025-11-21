# Firebase Authentication & Firestore Setup Guide

## Overview
This guide will help you set up Firebase Authentication and Firestore for your InvoSync application.

## Step 1: Firebase Project Setup

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `invosync-e8e8b` (or create a new one)

## Step 2: Enable Firebase Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and provide a support email

## Step 3: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (e.g., `us-central`)
5. Click **Enable**

## Step 4: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click on the **Web app** icon (`</>`) or select your existing web app
4. Copy the `firebaseConfig` object

## Step 5: Configure Frontend

1. **Create `.env` file** in `frontend/` directory:
```bash
cd frontend
cp .env.example .env
```

2. **Edit `.env`** and add your Firebase config values:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=invosync-e8e8b.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=invosync-e8e8b
VITE_FIREBASE_STORAGE_BUCKET=invosync-e8e8b.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_API_URL=http://localhost:3000/api
```

## Step 6: Configure Backend for Production

### Option A: Using Firebase Admin SDK (Recommended for Production)

1. **Generate Service Account Key**:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click **Generate new private key**
   - Download the JSON file

2. **For Render Deployment**:
   - Go to your Render dashboard
   - Add environment variables:
     - `FIREBASE_PROJECT_ID`: Your project ID
     - `FIREBASE_CLIENT_EMAIL`: From the service account JSON
     - `FIREBASE_PRIVATE_KEY`: From the service account JSON (keep the `\n` characters)

### Option B: Using Firebase Emulator (Local Development)

1. **Install Firebase Emulators**:
```bash
cd backend
firebase setup:emulators:firestore
```

2. **Start Emulators**:
```bash
cd backend/functions
npm run serve
```

## Step 7: Firestore Security Rules

Update your Firestore rules for proper security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Clients collection - only authenticated users can read/write their own data
    match /clients/{clientId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    // Invoices collection - only authenticated users can read/write their own data
    match /invoices/{invoiceId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

## Step 8: Update Backend to Use User-Specific Data

The backend needs to be updated to:
1. Verify Firebase Auth tokens
2. Store data with user IDs
3. Query data filtered by user ID

## Step 9: Test the Setup

1. **Start Backend**:
```bash
cd backend/functions
npm run dev:server
```

2. **Start Frontend**:
```bash
cd frontend
npm run dev
```

3. **Test Authentication**:
   - Go to `http://localhost:5173`
   - You should be redirected to `/login`
   - Create a new account
   - You should be redirected to the dashboard

## Deployment to Render

### Backend Deployment

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure**:
   - Build Command: `cd backend/functions && npm install && npm run build`
   - Start Command: `cd backend/functions && node lib/server.js`
4. **Add Environment Variables**:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `PORT=3000`

### Frontend Deployment

1. **Create a new Static Site** on Render
2. **Configure**:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
3. **Add Environment Variables**:
   - All `VITE_FIREBASE_*` variables
   - `VITE_API_URL=https://your-backend-url.onrender.com/api`

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure you've enabled Email/Password authentication in Firebase Console

### "Missing or insufficient permissions"
- Check your Firestore security rules
- Make sure you're authenticated

### "Firebase app not initialized"
- Check that all environment variables are set correctly
- Restart the dev server after changing `.env`

## Next Steps

1. Update backend to verify Firebase Auth tokens
2. Add user ID to all database operations
3. Implement proper error handling
4. Add loading states
5. Test thoroughly before deploying
