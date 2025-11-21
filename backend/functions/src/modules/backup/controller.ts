import { Request, Response } from 'express';
import { BackupService } from './service';
import { sendSuccess, sendCreated } from '../../utils/response';
import { asyncHandler } from '../../utils/errorHandler';

/**
 * Backup controller - Handles HTTP requests and responses for backup operations
 */

const backupService = new BackupService();

/**
 * Create a new local backup
 * POST /backup/create
 */
export const createBackup = asyncHandler(async (req: Request, res: Response) => {
    const metadata = await backupService.createLocalBackup();

    sendCreated(res, 'Backup created successfully', metadata);
});

/**
 * Get list of available backups
 * GET /backup/list
 */
export const listBackups = asyncHandler(async (req: Request, res: Response) => {
    const backups = backupService.getAvailableBackups();

    sendSuccess(res, 'Backups retrieved successfully', backups);
});

/**
 * Restore data from a backup file
 * POST /backup/restore
 */
export const restoreBackup = asyncHandler(async (req: Request, res: Response) => {
    const { filename } = req.body;

    if (!filename) {
        return sendSuccess(res, 'Filename is required', null);
    }

    const result = await backupService.restoreFromBackup(filename);

    sendSuccess(res, 'Backup restored successfully', result);
});

/**
 * Delete a backup file
 * DELETE /backup/:filename
 */
export const deleteBackup = asyncHandler(async (req: Request, res: Response) => {
    const { filename } = req.params;

    backupService.deleteBackup(filename);

    sendSuccess(res, 'Backup deleted successfully');
});

/**
 * Download a backup file
 * GET /backup/download/:filename
 */
export const downloadBackup = asyncHandler(async (req: Request, res: Response) => {
    const { filename } = req.params;

    const filepath = backupService.getBackupFilePath(filename);

    res.download(filepath, filename);
});

/**
 * Export current data as JSON (in-memory, for immediate download)
 * GET /backup/export
 */
export const exportData = asyncHandler(async (req: Request, res: Response) => {
    const jsonData = await backupService.exportAsJSON();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `invosync-export-${timestamp}.json`;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(jsonData);
});
