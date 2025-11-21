import { ErrorCode } from '../types';

/**
 * Custom Application Error class for standardized error handling
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: ErrorCode;
    public readonly isOperational: boolean;
    public readonly field?: string;
    public readonly details?: any;

    constructor(
        message: string,
        statusCode: number = 500,
        code: ErrorCode = ErrorCode.INTERNAL_ERROR,
        isOperational: boolean = true,
        field?: string,
        details?: any
    ) {
        super(message);

        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        this.field = field;
        this.details = details;

        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);

        // Set the prototype explicitly
        Object.setPrototypeOf(this, AppError.prototype);
    }

    /**
     * Convert error to JSON format for API responses
     */
    toJSON() {
        return {
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            field: this.field,
            details: this.details
        };
    }
}

/**
 * Predefined error factory functions for common scenarios
 */
export class ErrorFactory {
    static notFound(resource: string, id?: string): AppError {
        const message = id
            ? `${resource} with ID '${id}' not found`
            : `${resource} not found`;

        return new AppError(message, 404, ErrorCode.NOT_FOUND);
    }

    static validationError(message: string, field?: string, details?: any): AppError {
        return new AppError(
            message,
            400,
            ErrorCode.VALIDATION_ERROR,
            true,
            field,
            details
        );
    }

    static duplicateEntry(resource: string, field: string, value: string): AppError {
        return new AppError(
            `${resource} with ${field} '${value}' already exists`,
            409,
            ErrorCode.DUPLICATE_ENTRY,
            true,
            field
        );
    }

    static unauthorized(message: string = 'Unauthorized access'): AppError {
        return new AppError(message, 401, ErrorCode.UNAUTHORIZED);
    }

    static forbidden(message: string = 'Access forbidden'): AppError {
        return new AppError(message, 403, ErrorCode.FORBIDDEN);
    }

    static databaseError(message: string, details?: any): AppError {
        return new AppError(
            message,
            500,
            ErrorCode.DATABASE_ERROR,
            true,
            undefined,
            details
        );
    }

    static internalError(message: string = 'Internal server error', details?: any): AppError {
        return new AppError(
            message,
            500,
            ErrorCode.INTERNAL_ERROR,
            false,
            undefined,
            details
        );
    }
}

/**
 * Global error handler middleware for Express
 */
export const errorHandler = (err: Error | AppError, req: any, res: any, next: any) => {
    // Log error for debugging
    console.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });

    // Handle AppError instances
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: err.toJSON(),
            timestamp: new Date()
        });
    }

    // Handle unknown errors
    return res.status(500).json({
        success: false,
        message: 'An unexpected error occurred',
        error: {
            message: err.message,
            code: ErrorCode.INTERNAL_ERROR
        },
        timestamp: new Date()
    });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn: Function) => {
    return (req: any, res: any, next: any) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
