import * as admin from 'firebase-admin';

/**
 * Initialize Firebase Admin SDK
 * This module exports the initialized Firestore instance for use across the application
 */

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
    // For local development, set the project ID
    const projectId = process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'invosync-e8e8b';

    try {
        admin.initializeApp({
            projectId: projectId
        });

        // Use Firestore emulator if FIRESTORE_EMULATOR_HOST is set
        if (process.env.FIRESTORE_EMULATOR_HOST) {
            console.log(`🔧 Using Firestore Emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
        } else {
            console.log(`🔥 Using Firebase Project: ${projectId}`);
            console.log(`⚠️  Note: For production use, ensure proper credentials are configured`);
        }
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
