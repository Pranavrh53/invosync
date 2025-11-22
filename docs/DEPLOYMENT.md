# Deployment Guide

This guide covers the deployment process for InvoSync to production and staging environments.

## Prerequisites

- Firebase CLI installed (`npm install -g firebase-tools`)
- Node.js v18+
- A Firebase project with billing enabled
- Required Firebase services enabled:
  - Authentication
  - Firestore
  - Storage
  - Hosting
  - Cloud Functions

## Environment Setup

1. **Create a new Firebase project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics if desired

2. **Set up Firebase services**
   - Go to Authentication > Sign-in method and enable Email/Password
   - Go to Firestore Database and create a new database in production mode
   - Go to Storage and set up Cloud Storage with default settings

## Deployment Process

### 1. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id

# Backend Configuration
NODE_ENV=production
PORT=5001

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=30d
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend/functions
npm install

# Install frontend dependencies
cd ../../frontend
npm install
```

### 3. Build Frontend

```bash
cd frontend
npm run build
```

### 4. Deploy to Firebase

```bash
# Login to Firebase (if not already logged in)
firebase login

# Set the Firebase project
firebase use your-project-id

# Deploy all services
firebase deploy
```

This will deploy:
- Cloud Functions
- Firestore security rules
- Storage security rules
- Hosting
- Firestore indexes

## Environment Variables in Production

For security, set the environment variables in Firebase Cloud Functions:

```bash
firebase functions:config:set \
  app.environment="production" \
  jwt.secret="your-jwt-secret" \
  sendgrid.api_key="your-sendgrid-api-key"
```

## CI/CD Setup (Optional)

For automated deployments, set up a CI/CD pipeline using GitHub Actions:

1. Create a new GitHub repository
2. Add the following secrets to your repository:
   - `FIREBASE_SERVICE_ACCOUNT`: Your Firebase service account JSON
   - `FIREBASE_TOKEN`: Firebase CI token (`firebase login:ci`)

3. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
          
      - name: Install Dependencies
        run: |
          npm ci
          cd frontend && npm ci
          cd ../backend/functions && npm ci
          
      - name: Build
        run: |
          cd frontend
          npm run build
          
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting,functions,firestore:rules,storage:rules
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## Post-Deployment

1. **Verify Deployment**
   - Check the Firebase Console for any deployment errors
   - Test the application thoroughly in production
   - Verify all environment variables are set correctly

2. **Monitoring**
   - Set up error tracking with Firebase Crashlytics
   - Monitor performance in the Firebase Console
   - Set up alerts for errors and performance issues

3. **Scaling**
   - For high traffic, consider:
     - Enabling auto-scaling for Cloud Functions
     - Setting up a CDN for static assets
     - Implementing database indexing for common queries

## Rollback Procedure

If needed, you can rollback to a previous deployment:

```bash
# List recent deployments
firebase hosting:list

# Rollback to a specific version
firebase hosting:rollback VERSION_ID
```

For Cloud Functions, you'll need to redeploy the previous working version from your Git history.
