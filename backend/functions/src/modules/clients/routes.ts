import { Router } from 'express';
import {
    createClient,
    getClient,
    getAllClients,
    updateClient,
    deleteClient,
    searchClients,
    getClientCount
} from './controller';

/**
 * Client routes
 */

const router = Router();

// Client CRUD operations
router.post('/', createClient);
router.get('/search', searchClients); // Must be before /:id to avoid conflict
router.get('/stats/count', getClientCount);
router.get('/:id', getClient);
router.get('/', getAllClients);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;
