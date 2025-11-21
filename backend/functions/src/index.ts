import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';

// Import routes
import clientRoutes from './modules/clients/routes';
import invoiceRoutes from './modules/invoices/routes';
import backupRoutes from './modules/backup/routes';

// Import error handler
import { errorHandler } from './utils/errorHandler';
import { sendSuccess } from './utils/response';

/**
 * InvoSync Backend - Main Entry Point
 * Modular REST API for invoice and client management
 */

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: true })); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/', (req, res) => {
    sendSuccess(res, 'InvoSync API is running', {
        version: '1.0.0',
        timestamp: new Date(),
        endpoints: {
            clients: '/api/clients',
            invoices: '/api/invoices',
            backup: '/api/backup'
        }
    });
});

// API Routes
app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/backup', backupRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
        timestamp: new Date()
    });
});

// Global error handler (must be last)
app.use(errorHandler);

// Export the Express app as a Firebase Cloud Function
export const api = functions.https.onRequest(app);

/**
 * Alternative exports for local development
 * You can also export the app directly for testing
 */
export { app };
