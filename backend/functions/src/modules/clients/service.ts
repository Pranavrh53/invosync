import { db, COLLECTIONS, serverTimestamp } from '../../firebase';
import { Client, CreateClientDTO, UpdateClientDTO } from '../../types';
import { ClientModel } from './model';
import { ErrorFactory } from '../../utils/errorHandler';

/**
 * Client service - Business logic layer for client operations
 */

export class ClientService {
    private collection = db.collection(COLLECTIONS.CLIENTS);

    /**
     * Create a new client
     */
    async createClient(data: CreateClientDTO): Promise<Client> {
        // Validate input
        ClientModel.validateCreate(data);

        // Check for duplicate email
        const existingClient = await this.findByEmail(data.email);
        if (existingClient) {
            throw ErrorFactory.duplicateEntry('Client', 'email', data.email);
        }

        // Sanitize and prepare data
        const sanitizedData = ClientModel.sanitize(data);
        const clientData = {
            ...sanitizedData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        // Save to Firestore
        const docRef = await this.collection.add(clientData);
        const doc = await docRef.get();

        return ClientModel.fromFirestore(doc.id, doc.data());
    }

    /**
     * Get client by ID
     */
    async getClientById(id: string): Promise<Client> {
        const doc = await this.collection.doc(id).get();

        if (!doc.exists) {
            throw ErrorFactory.notFound('Client', id);
        }

        return ClientModel.fromFirestore(doc.id, doc.data());
    }

    /**
     * Get all clients with optional pagination
     */
    async getAllClients(page: number = 1, limit: number = 10): Promise<{ clients: Client[], total: number }> {
        const offset = (page - 1) * limit;

        // Get total count
        const snapshot = await this.collection.get();
        const total = snapshot.size;

        // Get paginated results
        const querySnapshot = await this.collection
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .offset(offset)
            .get();

        const clients = querySnapshot.docs.map((doc: any) =>
            ClientModel.fromFirestore(doc.id, doc.data())
        );

        return { clients, total };
    }

    /**
     * Update client by ID
     */
    async updateClient(id: string, data: UpdateClientDTO): Promise<Client> {
        // Validate input
        ClientModel.validateUpdate(data);

        // Check if client exists
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw ErrorFactory.notFound('Client', id);
        }

        // Check for duplicate email if email is being updated
        if (data.email) {
            const existingClient = await this.findByEmail(data.email);
            if (existingClient && existingClient.id !== id) {
                throw ErrorFactory.duplicateEntry('Client', 'email', data.email);
            }
        }

        // Sanitize and update
        const sanitizedData = ClientModel.sanitize(data);
        const updateData = {
            ...sanitizedData,
            updatedAt: serverTimestamp()
        };

        await docRef.update(updateData);
        const updatedDoc = await docRef.get();

        return ClientModel.fromFirestore(updatedDoc.id, updatedDoc.data());
    }

    /**
     * Delete client by ID
     */
    async deleteClient(id: string): Promise<void> {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw ErrorFactory.notFound('Client', id);
        }

        await docRef.delete();
    }

    /**
     * Search clients by name or email
     */
    async searchClients(query: string): Promise<Client[]> {
        const snapshot = await this.collection.get();
        const searchTerm = query.toLowerCase();

        const clients = snapshot.docs
            .map((doc: any) => ClientModel.fromFirestore(doc.id, doc.data()))
            .filter((client: Client) =>
                client.name.toLowerCase().includes(searchTerm) ||
                client.email.toLowerCase().includes(searchTerm)
            );

        return clients;
    }

    /**
     * Find client by email (helper method)
     */
    private async findByEmail(email: string): Promise<Client | null> {
        const snapshot = await this.collection
            .where('email', '==', email.toLowerCase())
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return ClientModel.fromFirestore(doc.id, doc.data());
    }

    /**
     * Get client count
     */
    async getClientCount(): Promise<number> {
        const snapshot = await this.collection.get();
        return snapshot.size;
    }
}
