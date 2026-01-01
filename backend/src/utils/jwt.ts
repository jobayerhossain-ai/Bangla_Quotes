/**
 * JWT Utilities
 * 
 * Functions for generating and verifying JWT tokens.
 */

import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { ApiError } from './ApiError';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

/**
 * Generate access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
    });
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokens = (payload: TokenPayload) => {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
    try {
        const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw ApiError.unauthorized('Token expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw ApiError.unauthorized('Invalid token');
        }
        throw ApiError.unauthorized('Token verification failed');
    }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
    try {
        const decoded = jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw ApiError.unauthorized('Refresh token expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw ApiError.unauthorized('Invalid refresh token');
        }
        throw ApiError.unauthorized('Refresh token verification failed');
    }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader?: string): string => {
    if (!authHeader) {
        throw ApiError.unauthorized('No authorization header provided');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw ApiError.unauthorized('Invalid authorization header format');
    }

    return parts[1];
};
