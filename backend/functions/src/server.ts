/**
 * Standalone Express server for local development
 * This allows running the API without Firebase emulators
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { app } from './index';


const PORT = process.env.PORT || 3000;

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
