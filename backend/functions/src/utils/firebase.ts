import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Initialize Firebase Admin SDK
 * This module exports the initialized Firestore instance for use across the application
 */

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
    const projectId = process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'invosync-ac500';

    try {
        // Check if we're using the emulator
        if (process.env.FIRESTORE_EMULATOR_HOST) {
            console.log(`🔧 Using Firestore Emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
            admin.initializeApp({
                projectId: projectId
            });
        } else {
            // Try to use service account file for production
            const serviceAccountPath = path.join(__dirname, '..', '..', 'serviceAccountKey.json');

            if (fs.existsSync(serviceAccountPath)) {
                console.log('🔐 Using Service Account credentials');
                const serviceAccount = require(serviceAccountPath);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    projectId: projectId
                });
            } else {
                // Fallback to environment variables
                console.log('⚠️  No service account file found, using default credentials');
                console.log('⚠️  Note: This may not work for local development');
                admin.initializeApp({
                    projectId: projectId
                });
            }
        }

        console.log(`🔥 Using Firebase Project: ${projectId}`);
        console.log(`⚠️  Note: For production use, ensure proper credentials are configured`);
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        throw error;
    }
}

// Export Firestore instance
export const db = admin.firestore();

// Export admin for other Firebase services if needed
export { admin };
export const auth = admin.auth();

// Collection names as constants for consistency
export const COLLECTIONS = {
    CLIENTS: 'clients',
    INVOICES: 'invoices',
    BACKUPS: 'backups'
} as const;

/**
 * Helper function to get a collection reference
 */
export const getCollection = (collectionName: string) => {
    return db.collection(collectionName);
};

/**
 * Helper function to generate a new document ID
 */
export const generateId = (collectionName: string): string => {
    return db.collection(collectionName).doc().id;
};

/**
 * Helper to get current server timestamp
 */
export const serverTimestamp = () => {
    return admin.firestore.FieldValue.serverTimestamp();
};
