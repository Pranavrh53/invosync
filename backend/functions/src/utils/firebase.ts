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
            // 1. Try Environment Variables (Highest Priority & Safest)
            if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
                console.log('🔐 Using Environment Variable credentials');
                // Handle private key newlines which might be escaped in .env
                const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: projectId,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: privateKey
                    }),
                    projectId: projectId
                });
            }
            // 2. Try service account file
            else {
                const serviceAccountPath = path.join(__dirname, '..', '..', 'serviceAccountKey.json');

                if (fs.existsSync(serviceAccountPath)) {
                    try {
                        const serviceAccount = require(serviceAccountPath);
                        // Basic validation to ensure the file isn't empty or dummy
                        if (serviceAccount.private_key && serviceAccount.client_email) {
                            console.log('🔐 Using Service Account file credentials');
                            admin.initializeApp({
                                credential: admin.credential.cert(serviceAccount),
                                projectId: projectId
                            });
                        } else {
                            throw new Error("Invalid serviceAccountKey.json content");
                        }
                    } catch (e) {
                        console.warn('⚠️  Found serviceAccountKey.json but it was invalid. Falling back to default credentials.');
                        admin.initializeApp({ projectId: projectId });
                    }
                } else {
                    // 3. Fallback to Default Credentials (ADC)
                    console.log('⚠️  No credentials found in Env or File. Using Application Default Credentials.');
                    console.log('    Ensure you have run "gcloud auth application-default login" or are in a cloud environment.');
                    admin.initializeApp({
                        projectId: projectId
                    });
                }
            }
        }

        console.log(`🔥 Using Firebase Project: ${projectId}`);
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        // Don't throw here, let the app try to continue or fail gracefully later
        // throwing here crashes the whole server startup
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
