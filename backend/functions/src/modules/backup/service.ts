import { db, COLLECTIONS } from '../../firebase';
import { BackupData, BackupMetadata, Client, Invoice } from '../../types';
import { ClientModel } from '../clients/model';
import { InvoiceModel } from '../invoices/model';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Backup service - Handles data export and local backup operations
 */

export class BackupService {
    private backupDir: string;

    constructor() {
        // Default backup directory (can be configured)
        this.backupDir = path.join(process.cwd(), 'backups');
        this.ensureBackupDirectory();
    }

    /**
     * Ensure backup directory exists
     */
    private ensureBackupDirectory(): void {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }

    /**
     * Export all data to JSON
     */
    async exportAllData(): Promise<BackupData> {
        // Fetch all clients
        const clientsSnapshot = await db.collection(COLLECTIONS.CLIENTS).get();
        const clients: Client[] = clientsSnapshot.docs.map((doc: any) =>
            ClientModel.fromFirestore(doc.id, doc.data())
        );

        // Fetch all invoices
        const invoicesSnapshot = await db.collection(COLLECTIONS.INVOICES).get();
        const invoices: Invoice[] = invoicesSnapshot.docs.map((doc: any) =>
            InvoiceModel.fromFirestore(doc.id, doc.data())
        );

        const backupData: BackupData = {
            clients,
            invoices,
            exportedAt: new Date(),
            version: '1.0.0'
        };

        return backupData;
    }

    /**
     * Create a local backup file
     */
    async createLocalBackup(): Promise<BackupMetadata> {
        const backupData = await this.exportAllData();

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `invosync-backup-${timestamp}.json`;
        const filepath = path.join(this.backupDir, filename);

        // Write to file
        fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2), 'utf-8');

        const metadata: BackupMetadata = {
            filename,
            timestamp: new Date(),
            recordCount: {
                clients: backupData.clients.length,
                invoices: backupData.invoices.length
            }
        };

        return metadata;
    }

    /**
     * Get list of available backups
     */
    getAvailableBackups(): BackupMetadata[] {
        const files = fs.readdirSync(this.backupDir);
        const backupFiles = files.filter(file => file.startsWith('invosync-backup-') && file.endsWith('.json'));

        return backupFiles.map(filename => {
            const filepath = path.join(this.backupDir, filename);
            const stats = fs.statSync(filepath);

            // Try to read record count from file
            let recordCount = { clients: 0, invoices: 0 };
            try {
                const content = fs.readFileSync(filepath, 'utf-8');
                const data = JSON.parse(content);
                recordCount = {
                    clients: data.clients?.length || 0,
                    invoices: data.invoices?.length || 0
                };
            } catch (error) {
                // If file is corrupted, just use default counts
            }

            return {
                filename,
                timestamp: stats.mtime,
                recordCount
            };
        }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    /**
     * Restore data from a backup file
     */
    async restoreFromBackup(filename: string): Promise<{ clients: number, invoices: number }> {
        const filepath = path.join(this.backupDir, filename);

        if (!fs.existsSync(filepath)) {
            throw new Error(`Backup file '${filename}' not found`);
        }

        // Read backup file
        const content = fs.readFileSync(filepath, 'utf-8');
        const backupData: BackupData = JSON.parse(content);

        // Restore clients
        const clientsCollection = db.collection(COLLECTIONS.CLIENTS);
        let clientsRestored = 0;
        for (const client of backupData.clients) {
            const { id, ...clientData } = client;
            if (id) {
                await clientsCollection.doc(id).set(clientData);
            } else {
                await clientsCollection.add(clientData);
            }
            clientsRestored++;
        }

        // Restore invoices
        const invoicesCollection = db.collection(COLLECTIONS.INVOICES);
        let invoicesRestored = 0;
        for (const invoice of backupData.invoices) {
            const { id, ...invoiceData } = invoice;
            if (id) {
                await invoicesCollection.doc(id).set(invoiceData);
            } else {
                await invoicesCollection.add(invoiceData);
            }
            invoicesRestored++;
        }

        return {
            clients: clientsRestored,
            invoices: invoicesRestored
        };
    }

    /**
     * Delete a backup file
     */
    deleteBackup(filename: string): void {
        const filepath = path.join(this.backupDir, filename);

        if (!fs.existsSync(filepath)) {
            throw new Error(`Backup file '${filename}' not found`);
        }

        fs.unlinkSync(filepath);
    }

    /**
     * Get backup file path for download
     */
    getBackupFilePath(filename: string): string {
        const filepath = path.join(this.backupDir, filename);

        if (!fs.existsSync(filepath)) {
            throw new Error(`Backup file '${filename}' not found`);
        }

        return filepath;
    }

    /**
     * Export data as downloadable JSON (in-memory)
     */
    async exportAsJSON(): Promise<string> {
        const backupData = await this.exportAllData();
        return JSON.stringify(backupData, null, 2);
    }
}
