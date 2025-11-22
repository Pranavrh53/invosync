/**
 * Standalone Express server for local development
 * This allows running the API without Firebase emulators
 */

import * as dotenv from 'dotenv';
import * as net from 'net';
dotenv.config();

// Initialize Firebase first
import './utils/firebase';

import { app } from './index';
import cors from 'cors';

// Add CORS middleware for development
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

/**
 * Function to find an available port starting from the given port
 */
const findAvailablePort = (port: number): Promise<number> => {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        
        server.unref();
        server.on('error', (err: NodeJS.ErrnoException) => {
            if (err.code === 'EADDRINUSE') {
                // Port is in use, try the next one
                resolve(findAvailablePort(port + 1));
            } else {
                reject(err);
            }
        });
        
        server.listen(port, () => {
            const usedPort = (server.address() as net.AddressInfo).port;
            server.close(() => {
                resolve(usedPort);
            });
        });
    });
};

const startServer = async () => {
    try {
        const PORT = await findAvailablePort(DEFAULT_PORT);
        
        app.listen(PORT, () => {
            console.log('🚀 InvoSync API Server Started');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`📡 Server running on: http://localhost:${PORT}`);
            console.log(`📋 API Base URL: http://localhost:${PORT}/api`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('\n📚 Available Endpoints:');
            console.log(`   Clients:  http://localhost:${PORT}/api/clients`);
            console.log(`   Invoices: http://localhost:${PORT}/api/invoices`);
            console.log(`   Backup:   http://localhost:${PORT}/api/backup`);
            console.log('\n💡 Press Ctrl+C to stop the server\n');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
