/**
 * API Response Utilities
 * 
 * Standardized response formatters for consistent API responses.
 */

import { Response } from 'express';

export interface ApiResponseData<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    timestamp: string;
}

export interface ApiErrorData {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
    };
    timestamp: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginatedResponseData<T> {
    success: true;
    data: T[];
    pagination: PaginationMeta;
    timestamp: string;
}

/**
 * Send a successful response
 */
export const sendSuccess = <T = any>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
): Response => {
    const response: ApiResponseData<T> = {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
};

/**
 * Send a paginated response
 */
export const sendPaginated = <T = any>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    statusCode: number = 200
): Response => {
    const response: PaginatedResponseData<T> = {
        success: true,
        data,
        pagination,
        timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
};

/**
 * Send an error response
 */
export const sendError = (
    res: Response,
    code: string,
    message: string,
    statusCode: number = 500,
    details?: any
): Response => {
    const response: ApiErrorData = {
        success: false,
        error: {
            code,
            message,
            details,
        },
        timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
};

/**
 * Calculate pagination metadata
 */
export const calculatePagination = (
    page: number,
    limit: number,
    total: number
): PaginationMeta => {
    const totalPages = Math.ceil(total / limit);

    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
};
