import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', async (req, res) => {
    try {
        // Check database connection
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
            database: 'connected',
            version: process.env.npm_package_version || '1.0.0',
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * @route   GET /api/v1/
 * @desc    Welcome endpoint
 * @access  Public
 */
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Bangla Quotes API',
        version: '1.0.0',
        documentation: '/api/v1/docs',
        health: '/api/v1/health',
    });
});

export default router;
