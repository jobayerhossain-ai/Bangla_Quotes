/**
 * Environment Configuration
 * 
 * Centralized configuration for all environment variables.
 * Validates and exports typed environment variables.
 */

import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Environment variable schema
const envSchema = z.object({
    // Environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default('5000'),

    // Database
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

    // JWT
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

    // CORS
    CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:3001'),

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),

    // File Upload
    MAX_FILE_SIZE: z.string().transform(Number).default('5242880'), // 5MB
    UPLOAD_DIR: z.string().default('./uploads'),

    // Admin
    ADMIN_EMAIL: z.string().email().default('admin@banglaquotes.com'),
    ADMIN_PASSWORD: z.string().min(8).default('Admin@123456'),
});

// Validate environment variables
const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Environment validation failed:');
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
};

const env = parseEnv();

// Export typed configuration
export const config = {
    env: env.NODE_ENV,
    port: env.PORT,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',

    database: {
        url: env.DATABASE_URL,
    },

    jwt: {
        secret: env.JWT_SECRET,
        refreshSecret: env.JWT_REFRESH_SECRET,
        expiresIn: env.JWT_EXPIRES_IN,
        refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },

    cors: {
        origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
    },

    rateLimit: {
        windowMs: env.RATE_LIMIT_WINDOW_MS,
        maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    },

    upload: {
        maxFileSize: env.MAX_FILE_SIZE,
        uploadDir: env.UPLOAD_DIR,
    },

    admin: {
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
    },
} as const;

// Log configuration (only in development)
if (config.isDevelopment) {
    console.log('📝 Configuration loaded:');
    console.log(`  - Environment: ${config.env}`);
    console.log(`  - Port: ${config.port}`);
    console.log(`  - CORS Origins: ${config.cors.origin.join(', ')}`);
    console.log(`  - Upload Directory: ${config.upload.uploadDir}`);
}
