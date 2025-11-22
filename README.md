<div align="center">
  <h1>InvoSync</h1>
  <p>A modern, full-stack invoice and client management system built with React, Node.js, and Firebase.</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  [![GitHub stars](https://img.shields.io/github/stars/yourusername/invosync?style=social)](https://github.com/yourusername/invosync/stargazers)
</div>

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/invosync.git
   cd invosync
   ```

2. **Install Dependencies**
   ```bash
   # Backend
   cd backend/functions
   npm install
   
   # Frontend
   cd ../../frontend
   npm install
   ```

3. **Set up Firebase**
   - Create a project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, Storage, and Hosting
   - Download your service account key and save as `serviceAccountKey.json` in the backend directory

4. **Configure Environment**
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