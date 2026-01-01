/**
 * Category Validators
 * 
 * Zod schemas for validating category requests.
 */

import { z } from 'zod';

/**
 * Create category validation schema
 */
export const createCategorySchema = z.object({
    nameBn: z
        .string()
        .min(1, 'Bangla name is required')
        .min(2, 'Bangla name must be at least 2 characters')
        .max(100, 'Bangla name must not exceed 100 characters'),
    nameEn: z
        .string()
        .min(1, 'English name is required')
        .min(2, 'English name must be at least 2 characters')
        .max(100, 'English name must not exceed 100 characters'),
    slug: z
        .string()
        .min(2, 'Slug must be at least 2 characters')
        .max(100, 'Slug must not exceed 100 characters')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only')
        .optional(),
    description: z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .optional()
        .nullable(),
    isActive: z
        .boolean()
        .optional()
        .default(true),
    order: z
        .number()
        .int()
        .min(0)
        .optional()
        .default(0),
});

/**
 * Update category validation schema
 */
export const updateCategorySchema = z.object({
    nameBn: z
        .string()
        .min(2, 'Bangla name must be at least 2 characters')
        .max(100, 'Bangla name must not exceed 100 characters')
        .optional(),
    nameEn: z
        .string()
        .min(2, 'English name must be at least 2 characters')
        .max(100, 'English name must not exceed 100 characters')
        .optional(),
    slug: z
        .string()
        .min(2, 'Slug must be at least 2 characters')
        .max(100, 'Slug must not exceed 100 characters')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only')
        .optional(),
    description: z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .optional()
        .nullable(),
    isActive: z
        .boolean()
        .optional(),
    order: z
        .number()
        .int()
        .min(0)
        .optional(),
});

/**
 * Category ID parameter validation schema
 */
export const categoryIdSchema = z.object({
    id: z
        .string()
        .min(1, 'Category ID is required')
        .cuid('Invalid category ID format'),
});

/**
 * Category slug parameter validation schema
 */
export const categorySlugSchema = z.object({
    slug: z
        .string()
        .min(1, 'Category slug is required')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
});

/**
 * Category query parameters validation schema
 */
export const categoryQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .default('1')
        .transform(Number)
        .pipe(z.number().int().positive()),
    limit: z
        .string()
        .optional()
        .default('20')
        .transform(Number)
        .pipe(z.number().int().positive().max(100)),
    isActive: z
        .string()
        .optional()
        .transform((val) => {
            if (val === undefined) return undefined;
            return val === 'true';
        })
        .pipe(z.boolean().optional()),
    sortBy: z
        .enum(['order', 'nameBn', 'nameEn', 'createdAt'])
        .optional()
        .default('order'),
    sortOrder: z
        .enum(['asc', 'desc'])
        .optional()
        .default('asc'),
});

// ... (previous code)

/**
 * Bulk delete categories validation schema
 */
export const bulkDeleteCategorySchema = z.object({
    ids: z
        .array(z.string().cuid('Invalid UUID format'))
        .min(1, 'At least one ID is required'),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryIdInput = z.infer<typeof categoryIdSchema>;
export type CategorySlugInput = z.infer<typeof categorySlugSchema>;
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;
export type BulkDeleteCategoryInput = z.infer<typeof bulkDeleteCategorySchema>;
