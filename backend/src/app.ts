/**
 * Express Application Setup
 * 
 * Configures and exports the Express application with all middleware.
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import { config } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { generalLimiter } from './middleware/rateLimit.middleware';

// Import routes
import router from './routes';

/**
 * Create and configure Express application
 */
export const createApp = (): Application => {
    const app = express();

    // ============================================================================
    // SECURITY MIDDLEWARE
    // ============================================================================

    // Helmet - Security headers
    app.use(helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: { // Tighter CSP
            directives: {
                defaultSrc: ["'self'"],
                baseUri: ["'self'"],
                fontSrc: ["'self'", "https:", "data:"],
                formAction: ["'self'"],
                frameAncestors: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"], // Allow images from https and data URIs
                objectSrc: ["'none'"],
                scriptSrc: ["'self'"],
                scriptSrcAttr: ["'none'"],
                styleSrc: ["'self'", "https:", "'unsafe-inline'"],
                upgradeInsecureRequests: [],
            },
        },
    }));

    // CORS - Cross-Origin Resource Sharing
    app.use(cors({
        origin: config.cors.origin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // HPP - HTTP Parameter Pollution protection
    app.use(hpp());

    // ============================================================================
    // BODY PARSING MIDDLEWARE
    // ============================================================================

    app.use(express.json({ limit: '10mb' })); // Limit body size to prevent DoS
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // ============================================================================
    // RATE LIMITING
    // ============================================================================

    app.use('/api', generalLimiter);

    // ============================================================================
    // STATIC FILES
    // ============================================================================

    app.use('/uploads', express.static(config.upload.uploadDir));

    // ============================================================================
    // HEALTH CHECK
    // ============================================================================

    app.get('/health', (req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: config.env,
        });
    });

    // Root route
    app.get('/', (req, res) => {
        res.json({
            message: 'Bangla Quotes API Service',
            status: 'running',
            version: '1.0.0',
            api_access: '/api/v1',
            health: '/health'
        });
    });

    // ============================================================================
    // API ROUTES
    // ============================================================================



    const API_VERSION = '/api/v1';

    // API Routes
    app.use(API_VERSION, router);

    // Temporary welcome route
    app.get(API_VERSION, (req, res) => {
        res.json({
            message: 'Welcome to Bangla Quotes API',
            version: '1.0.0',
            endpoints: {
                health: '/health',
                auth: `${API_VERSION}/auth`,
                quotes: `${API_VERSION}/quotes`,
                categories: `${API_VERSION}/categories`,
                assets: `${API_VERSION}/assets`,
            },
        });
    });

    // ============================================================================
    // ERROR HANDLING
    // ============================================================================

    // 404 handler
    app.use(notFoundHandler);

    // Global error handler (must be last)
    app.use(errorHandler);

    return app;
};
