/**
 * Rate Limiting Middleware
 * 
 * Protects API endpoints from abuse by limiting request rates.
 */

import rateLimit from 'express-rate-limit';
import { config } from '../config/env';
import { sendError } from '../utils/response';

/**
 * General rate limiter for all routes
 */
export const generalLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        sendError(
            res,
            'RATE_LIMIT_EXCEEDED',
            'Too many requests from this IP, please try again later',
            429
        );
    },
});

/**
 * Strict rate limiter for authentication routes
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
    handler: (req, res) => {
        sendError(
            res,
            'AUTH_RATE_LIMIT_EXCEEDED',
            'Too many login attempts, please try again after 15 minutes',
            429
        );
    },
});

/**
 * Upload rate limiter for file uploads
 */
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 uploads per hour
    message: 'Too many uploads, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        sendError(
            res,
            'UPLOAD_RATE_LIMIT_EXCEEDED',
            'Too many uploads, please try again after 1 hour',
            429
        );
    },
});

/**
 * Lenient rate limiter for public routes
 */
export const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 requests per window
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        sendError(
            res,
            'RATE_LIMIT_EXCEEDED',
            'Too many requests, please try again later',
            429
        );
    },
});
