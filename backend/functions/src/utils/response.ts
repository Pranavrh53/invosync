import { ApiResponse, PaginatedResponse } from '../types';

/**
 * Utility functions to format standardized API responses
 */

/**
 * Success response formatter
 */
export const successResponse = <T = any>(
    message: string,
    data?: T,
    statusCode: number = 200
): ApiResponse<T> => {
    return {
        success: true,
        message,
        data,
        timestamp: new Date()
    };
};

/**
 * Error response formatter
 */
export const errorResponse = (
    message: string,
    error?: string,
    statusCode: number = 500
): ApiResponse => {
    return {
        success: false,
        message,
        error,
        timestamp: new Date()
    };
};

/**
 * Paginated response formatter
 */
export const paginatedResponse = <T = any>(
    message: string,
    data: T[],
    page: number,
    limit: number,
    total: number
): PaginatedResponse<T> => {
    const totalPages = Math.ceil(total / limit);

    return {
        success: true,
        message,
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages
        },
        timestamp: new Date()
    };
};

/**
 * Send success response with proper status code
 */
export const sendSuccess = <T = any>(
    res: any,
    message: string,
    data?: T,
    statusCode: number = 200
) => {
    return res.status(statusCode).json(successResponse(message, data, statusCode));
};

/**
 * Send error response with proper status code
 */
export const sendError = (
    res: any,
    message: string,
    error?: string,
    statusCode: number = 500
) => {
    return res.status(statusCode).json(errorResponse(message, error, statusCode));
};

/**
 * Send paginated response
 */
export const sendPaginated = <T = any>(
    res: any,
    message: string,
    data: T[],
    page: number,
    limit: number,
    total: number,
    statusCode: number = 200
) => {
    return res.status(statusCode).json(
        paginatedResponse(message, data, page, limit, total)
    );
};

/**
 * Send created response (201)
 */
export const sendCreated = <T = any>(
    res: any,
    message: string,
    data?: T
) => {
    return sendSuccess(res, message, data, 201);
};

/**
 * Send no content response (204)
 */
export const sendNoContent = (res: any) => {
    return res.status(204).send();
};
