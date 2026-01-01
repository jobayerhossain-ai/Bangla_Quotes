/**
 * Quote Validators
 * 
 * Zod schemas for validating quote requests.
 */

import { z } from 'zod';

/**
 * Create quote validation schema
 */
export const createQuoteSchema = z.object({
    textBn: z
        .string()
        .min(1, 'Bangla text is required')
        .min(10, 'Bangla text must be at least 10 characters')
        .max(1000, 'Bangla text must not exceed 1000 characters'),
    textEn: z
        .string()
        .min(10, 'English text must be at least 10 characters')
        .max(1000, 'English text must not exceed 1000 characters')
        .optional()
        .nullable(),
    author: z
        .string()
        .min(2, 'Author name must be at least 2 characters')
        .max(100, 'Author name must not exceed 100 characters')
        .optional()
        .nullable(),
    categoryId: z
        .string()
        .min(1, 'Category ID is required')
        .cuid('Invalid category ID format'),
    status: z
        .enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'])
        .default('DRAFT'),
    publishedAt: z
        .string()
        .datetime()
        .optional()
        .nullable()
        .transform((val) => (val ? new Date(val) : null)),
});

/**
 * Update quote validation schema
 */
export const updateQuoteSchema = z.object({
    textBn: z
        .string()
        .min(10, 'Bangla text must be at least 10 characters')
        .max(1000, 'Bangla text must not exceed 1000 characters')
        .optional(),
    textEn: z
        .string()
        .min(10, 'English text must be at least 10 characters')
        .max(1000, 'English text must not exceed 1000 characters')
        .optional()
        .nullable(),
    author: z
        .string()
        .min(2, 'Author name must be at least 2 characters')
        .max(100, 'Author name must not exceed 100 characters')
        .optional()
        .nullable(),
    categoryId: z
        .string()
        .cuid('Invalid category ID format')
        .optional(),
    status: z
        .enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'])
        .optional(),
    publishedAt: z
        .string()
        .datetime()
        .optional()
        .nullable()
        .transform((val) => (val ? new Date(val) : null)),
});

/**
 * Quote query parameters validation schema
 */
export const quoteQuerySchema = z.object({
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
    categoryId: z
        .string()
        .cuid('Invalid category ID format')
        .optional(),
    categorySlug: z
        .string()
        .optional(),
    status: z
        .enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'])
        .optional(),
    search: z
        .string()
        .optional(),
    author: z
        .string()
        .optional(),
    sortBy: z
        .enum(['createdAt', 'views', 'shares', 'downloads', 'updatedAt'])
        .optional()
        .default('createdAt'),
    sortOrder: z
        .enum(['asc', 'desc'])
        .optional()
        .default('desc'),
});

/**
 * Quote ID parameter validation schema
 */
export const quoteIdSchema = z.object({
    id: z
        .string()
        .min(1, 'Quote ID is required')
        .cuid('Invalid quote ID format'),
});

/**
 * Bulk create quotes validation schema
 */
export const bulkCreateQuotesSchema = z.object({
    quotes: z
        .array(createQuoteSchema)
        .min(1, 'At least one quote is required')
        .max(100, 'Cannot create more than 100 quotes at once'),
});

/**
 * Bulk update status validation schema
 */
export const bulkUpdateStatusSchema = z.object({
    ids: z
        .array(z.string().cuid('Invalid UUID format'))
        .min(1, 'At least one ID is required'),
    status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']),
});

/**
 * Bulk delete validation schema
 */
export const bulkDeleteSchema = z.object({
    ids: z
        .array(z.string().cuid('Invalid UUID format'))
        .min(1, 'At least one ID is required'),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
export type QuoteQueryInput = z.infer<typeof quoteQuerySchema>;
export type QuoteIdInput = z.infer<typeof quoteIdSchema>;
export type BulkCreateQuotesInput = z.infer<typeof bulkCreateQuotesSchema>;
export type BulkUpdateStatusInput = z.infer<typeof bulkUpdateStatusSchema>;
export type BulkDeleteInput = z.infer<typeof bulkDeleteSchema>;
