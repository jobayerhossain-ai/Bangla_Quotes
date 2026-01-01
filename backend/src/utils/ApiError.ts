/**
 * Custom API Error Class
 * 
 * Extends the built-in Error class to include HTTP status codes
 * and operational error flags for better error handling.
 */

export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(
        message: string,
        statusCode: number = 500,
        isOperational: boolean = true,
        details?: any
    ) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;

        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Create a Bad Request error (400)
     */
    static badRequest(message: string, details?: any): ApiError {
        return new ApiError(message, 400, true, details);
    }

    /**
     * Create an Unauthorized error (401)
     */
    static unauthorized(message: string = 'Unauthorized'): ApiError {
        return new ApiError(message, 401, true);
    }

    /**
     * Create a Forbidden error (403)
     */
    static forbidden(message: string = 'Forbidden'): ApiError {
        return new ApiError(message, 403, true);
    }

    /**
     * Create a Not Found error (404)
     */
    static notFound(message: string = 'Resource not found'): ApiError {
        return new ApiError(message, 404, true);
    }

    /**
     * Create a Conflict error (409)
     */
    static conflict(message: string, details?: any): ApiError {
        return new ApiError(message, 409, true, details);
    }

    /**
     * Create a Validation error (422)
     */
    static validation(message: string, details?: any): ApiError {
        return new ApiError(message, 422, true, details);
    }

    /**
     * Create an Internal Server error (500)
     */
    static internal(message: string = 'Internal server error'): ApiError {
        return new ApiError(message, 500, false);
    }
}
