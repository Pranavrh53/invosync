import * as admin from 'firebase-admin';

/**
 * Initialize Firebase Admin SDK
 * This module exports the initialized Firestore instance for use across the application
 */

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
    admin.initializeApp();
}

// Export Firestore instance
export const db = admin.firestore();

// Export admin for other Firebase services if needed
export { admin };

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
