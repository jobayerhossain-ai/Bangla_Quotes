/**
 * Error Handling Middleware
 * 
 * Global error handler for Express application.
 * Catches all errors and sends standardized error responses.
 */

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { sendError } from '../utils/response';
import { config } from '../config/env';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

/**
 * Global error handler middleware
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): Response => {
    // Log error in development
    if (config.isDevelopment) {
        console.error('❌ Error:', err);
    }

    // Handle ApiError
    if (err instanceof ApiError) {
        return sendError(
            res,
            err.name,
            err.message,
            err.statusCode,
            err.details
        );
    }

    // Handle Zod validation errors
    if (err instanceof ZodError) {
        const details = err.errors.map((error) => ({
            field: error.path.join('.'),
            message: error.message,
        }));

        return sendError(
            res,
            'VALIDATION_ERROR',
            'Validation failed',
            422,
            details
        );
    }

    // Handle Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return handlePrismaError(err, res);
    }

    // Handle Prisma validation errors
    if (err instanceof Prisma.PrismaClientValidationError) {
        return sendError(
            res,
            'DATABASE_VALIDATION_ERROR',
            'Invalid database query',
            400
        );
    }

    // Handle unknown errors
    return sendError(
        res,
        'INTERNAL_SERVER_ERROR',
        config.isProduction ? 'Something went wrong' : err.message,
        500,
        config.isDevelopment ? { stack: err.stack } : undefined
    );
};

/**
 * Handle Prisma-specific errors
 */
const handlePrismaError = (
    err: Prisma.PrismaClientKnownRequestError,
    res: Response
): Response => {
    switch (err.code) {
        // Unique constraint violation
        case 'P2002': {
            const field = (err.meta?.target as string[])?.join(', ') || 'field';
            return sendError(
                res,
                'UNIQUE_CONSTRAINT_VIOLATION',
                `${field} already exists`,
                409,
                { field }
            );
        }

        // Foreign key constraint violation
        case 'P2003': {
            return sendError(
                res,
                'FOREIGN_KEY_CONSTRAINT_VIOLATION',
                'Related record not found',
                400
            );
        }

        // Record not found
        case 'P2025': {
            return sendError(
                res,
                'RECORD_NOT_FOUND',
                'Record not found',
                404
            );
        }

        // Default Prisma error
        default: {
            return sendError(
                res,
                'DATABASE_ERROR',
                'Database operation failed',
                500,
                config.isDevelopment ? { code: err.code, meta: err.meta } : undefined
            );
        }
    }
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): Response => {
    return sendError(
        res,
        'NOT_FOUND',
        `Route ${req.method} ${req.path} not found`,
        404
    );
};

/**
 * Async handler wrapper
 * Catches async errors and passes them to error handler
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
