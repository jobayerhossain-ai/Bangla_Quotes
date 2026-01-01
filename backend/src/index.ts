/**
 * Application Entry Point
 * 
 * Starts the Express server and handles graceful shutdown.
 */

import { createApp } from './app';
import { config } from './config/env';
import { prisma } from './lib/prisma';

/**
 * Start the server
 */
const startServer = async () => {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connected successfully');

        // Create Express app
        const app = createApp();

        // Start listening
        const server = app.listen(config.port, () => {
            console.log('');
            console.log('🚀 Bangla Quotes API Server Started');
            console.log('=====================================');
            console.log(`📍 Environment: ${config.env}`);
            console.log(`🌐 Server: http://localhost:${config.port}`);
            console.log(`🏥 Health: http://localhost:${config.port}/health`);
            console.log(`📚 API: http://localhost:${config.port}/api/v1`);
            console.log('=====================================');
            console.log('');
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal: string) => {
            console.log(`\n${signal} received. Starting graceful shutdown...`);

            // Close server
            server.close(async () => {
                console.log('✅ HTTP server closed');

                // Disconnect from database
                await prisma.$disconnect();
                console.log('✅ Database disconnected');

                console.log('👋 Graceful shutdown completed');
                process.exit(0);
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                console.error('❌ Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        // Handle shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle uncaught errors
        process.on('uncaughtException', (error) => {
            console.error('❌ Uncaught Exception:', error);
            gracefulShutdown('UNCAUGHT_EXCEPTION');
        });

        process.on('unhandledRejection', (reason, promise) => {
            console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
            gracefulShutdown('UNHANDLED_REJECTION');
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();
