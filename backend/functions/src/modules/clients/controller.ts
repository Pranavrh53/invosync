import { Request, Response } from 'express';
import { ClientService } from './service';
import { CreateClientDTO, UpdateClientDTO } from '../../types';
import { sendSuccess, sendCreated, sendPaginated } from '../../utils/response';
import { asyncHandler } from '../../utils/errorHandler';

/**
 * Client controller - Handles HTTP requests and responses
 */

const clientService = new ClientService();

/**
 * Create a new client
 * POST /clients
 */
export const createClient = asyncHandler(async (req: Request, res: Response) => {
    const clientData: CreateClientDTO = req.body;
    const client = await clientService.createClient(clientData);

    sendCreated(res, 'Client created successfully', client);
});

/**
 * Get client by ID
 * GET /clients/:id
 */
export const getClient = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const client = await clientService.getClientById(id);

    sendSuccess(res, 'Client retrieved successfully', client);
});

/**
 * Get all clients with pagination
 * GET /clients?page=1&limit=10
 */
export const getAllClients = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { clients, total } = await clientService.getAllClients(page, limit);

    sendPaginated(res, 'Clients retrieved successfully', clients, page, limit, total);
});

/**
 * Update client by ID
 * PUT /clients/:id
 */
export const updateClient = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData: UpdateClientDTO = req.body;

    const client = await clientService.updateClient(id, updateData);

    sendSuccess(res, 'Client updated successfully', client);
});

/**
 * Delete client by ID
 * DELETE /clients/:id
 */
export const deleteClient = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await clientService.deleteClient(id);

    sendSuccess(res, 'Client deleted successfully');
});

/**
 * Search clients by name or email
 * GET /clients/search?q=query
 */
export const searchClients = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query.q as string;

    if (!query) {
        return sendSuccess(res, 'Search query is required', []);
    }

    const clients = await clientService.searchClients(query);

    sendSuccess(res, 'Search completed successfully', clients);
});

/**
 * Get client count
 * GET /clients/stats/count
 */
export const getClientCount = asyncHandler(async (req: Request, res: Response) => {
    const count = await clientService.getClientCount();

    sendSuccess(res, 'Client count retrieved successfully', { count });
});
