/**
 * Asset Validators
 * 
 * Zod schemas for validating asset requests.
 */

import { z } from 'zod';

/**
 * Create asset validation schema
 */
export const createAssetSchema = z.object({
    type: z.enum(['BACKGROUND_IMAGE', 'BACKGROUND_GRADIENT', 'FONT', 'TEXTURE']),
    name: z.string().min(2).max(100),
    value: z.string().min(1), // URL or CSS value
    preview: z.string().optional().nullable(),
    isPremium: z.boolean().default(false),
    isActive: z.boolean().default(true),
    order: z.number().int().default(0),
    metadata: z.record(z.any()).optional(),
});

/**
 * Update asset validation schema
 */
export const updateAssetSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    value: z.string().min(1).optional(),
    preview: z.string().optional().nullable(),
    isPremium: z.boolean().optional(),
    isActive: z.boolean().optional(),
    order: z.number().int().optional(),
    metadata: z.record(z.any()).optional(),
});

/**
 * Asset Query Schema
 */
export const assetQuerySchema = z.object({
    page: z.string().optional().default('1').transform(Number).pipe(z.number().positive()),
    limit: z.string().optional().default('20').transform(Number).pipe(z.number().positive().max(100)),
    type: z.enum(['BACKGROUND_IMAGE', 'BACKGROUND_GRADIENT', 'FONT', 'TEXTURE']).optional(),
    isActive: z.string().optional().transform(val => val === 'true').pipe(z.boolean()).optional(),
    isPremium: z.string().optional().transform(val => val === 'true').pipe(z.boolean()).optional(),
    sortBy: z.enum(['order', 'createdAt', 'usageCount']).default('order'),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

/**
 * Asset ID Schema
 */
export const assetIdSchema = z.object({
    id: z.string().cuid(),
});

/**
 * Bulk Delete Asset Schema
 */
export const bulkDeleteAssetSchema = z.object({
    ids: z.array(z.string().cuid()).min(1),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;
export type AssetQueryInput = z.infer<typeof assetQuerySchema>;
export type BulkDeleteAssetInput = z.infer<typeof bulkDeleteAssetSchema>;
