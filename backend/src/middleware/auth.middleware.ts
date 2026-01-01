/**
 * Authentication Middleware
 * 
 * Middleware for protecting routes and verifying user authentication.
 */

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { extractTokenFromHeader, verifyAccessToken } from '../utils/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                role: string;
            };
        }
    }
}

/**
 * Authenticate user middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract token from header
        const token = extractTokenFromHeader(req.headers.authorization);

        // Verify token
        const payload = verifyAccessToken(token);

        // Check if user exists and is active
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
            },
        });

        if (!user) {
            throw ApiError.unauthorized('User not found');
        }

        if (!user.isActive) {
            throw ApiError.forbidden('User account is inactive');
        }

        // Attach user to request
        req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Authorize admin middleware
 * Checks if authenticated user has admin role
 */
export const authorizeAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
    }

    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
        throw ApiError.forbidden('Admin access required');
    }

    next();
};

/**
 * Authorize super admin middleware
 * Checks if authenticated user has super admin role
 */
export const authorizeSuperAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
    }

    if (req.user.role !== 'SUPER_ADMIN') {
        throw ApiError.forbidden('Super admin access required');
    }

    next();
};

/**
 * Authorize generic middleware
 * Checks if authenticated user has one of the allowed roles
 */
export const authorize = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            throw ApiError.unauthorized('Authentication required');
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw ApiError.forbidden('Access denied');
        }

        next();
    };
};

/**
 * Optional authentication middleware
 * Attaches user to request if token is provided, but doesn't require it
 */
export const optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next();
        }

        const token = extractTokenFromHeader(authHeader);
        const payload = verifyAccessToken(token);

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
            },
        });

        if (user && user.isActive) {
            req.user = {
                userId: user.id,
                email: user.email,
                role: user.role,
            };
        }

        next();
    } catch (error) {
        // Ignore authentication errors for optional auth
        next();
    }
};
