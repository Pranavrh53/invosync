import { Client, CreateClientDTO, UpdateClientDTO } from '../../types';
import { ErrorFactory } from '../../utils/errorHandler';

/**
 * Client data model with validation logic
 */

export class ClientModel {
    /**
     * Validate client data for creation
     */
    static validateCreate(data: CreateClientDTO): void {
        const errors: string[] = [];

        if (!data.name || data.name.trim().length === 0) {
            errors.push('Name is required');
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Valid email is required');
        }

        if (!data.phone || data.phone.trim().length === 0) {
            errors.push('Phone number is required');
        }

        if (!data.address || data.address.trim().length === 0) {
            errors.push('Address is required');
        }

        if (data.gstin && !this.isValidGSTIN(data.gstin)) {
            errors.push('Invalid GSTIN format');
        }

        if (errors.length > 0) {
            throw ErrorFactory.validationError(
                'Client validation failed',
                undefined,
                { errors }
            );
        }
    }

    /**
     * Validate client data for update
     */
    static validateUpdate(data: UpdateClientDTO): void {
        const errors: string[] = [];

        if (data.email && !this.isValidEmail(data.email)) {
            errors.push('Invalid email format');
        }

        if (data.gstin && !this.isValidGSTIN(data.gstin)) {
            errors.push('Invalid GSTIN format');
        }

        if (errors.length > 0) {
            throw ErrorFactory.validationError(
                'Client validation failed',
                undefined,
                { errors }
            );
        }
    }

    /**
     * Email validation
     */
    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * GSTIN validation (15 characters alphanumeric)
     * Format: 22AAAAA0000A1Z5
     */
    private static isValidGSTIN(gstin: string): boolean {
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstinRegex.test(gstin);
    }

    /**
     * Sanitize client data before saving
     */
    static sanitize(data: CreateClientDTO | UpdateClientDTO): Partial<Client> {
        const sanitized: Partial<Client> = {};

        if ('name' in data && data.name) {
            sanitized.name = data.name.trim();
        }

        if ('email' in data && data.email) {
            sanitized.email = data.email.trim().toLowerCase();
        }

        if ('phone' in data && data.phone) {
            sanitized.phone = data.phone.trim();
        }

        if ('address' in data && data.address) {
            sanitized.address = data.address.trim();
        }

        if ('gstin' in data && data.gstin) {
            sanitized.gstin = data.gstin.trim().toUpperCase();
        }

        return sanitized;
    }

    /**
     * Helper to safely convert Firestore timestamps/strings to Date
     */
    private static toDate(val: any): Date | undefined {
        if (!val) return undefined;
        if (val instanceof Date) return val;
        if (typeof val.toDate === 'function') return val.toDate(); // Firestore Timestamp
        if (typeof val === 'string') return new Date(val);
        return undefined;
    }

    /**
     * Convert Firestore document to Client object
     */
    static fromFirestore(id: string, data: any): Client {
        return {
            id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            gstin: data.gstin,
            createdAt: this.toDate(data.createdAt),
            updatedAt: this.toDate(data.updatedAt)
        };
    }

    /**
     * Convert Client object to Firestore document data
     */
    static toFirestore(client: Partial<Client>): any {
        const data: any = {};

        if (client.name) data.name = client.name;
        if (client.email) data.email = client.email;
        if (client.phone) data.phone = client.phone;
        if (client.address) data.address = client.address;
        if (client.gstin !== undefined) data.gstin = client.gstin;

        return data;
    }
}
