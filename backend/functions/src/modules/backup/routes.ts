import { Router } from 'express';
import {
    createBackup,
    listBackups,
    restoreBackup,
    deleteBackup,
    downloadBackup,
    exportData
} from './controller';

/**
 * Backup routes
 */

const router = Router();

// Backup operations
router.post('/create', createBackup);
router.post('/restore', restoreBackup);
router.get('/list', listBackups);
router.get('/export', exportData);
router.get('/download/:filename', downloadBackup);
router.delete('/:filename', deleteBackup);

export default router;
