/**
 * Quote Service
 * 
 * Business logic for quote management.
 */

import { Quote, QuoteStatus, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/ApiError';
import { calculatePagination, PaginationMeta } from '../utils/response';
import { activityLogService } from './activityLog.service';

export interface CreateQuoteDTO {
    textBn: string;
    textEn?: string | null;
    author?: string | null;
    categoryId: string;
    status?: QuoteStatus;
    publishedAt?: Date | null;
    userId?: string; // For logging
}

export interface UpdateQuoteDTO {
    textBn?: string;
    textEn?: string | null;
    author?: string | null;
    categoryId?: string;
    status?: QuoteStatus;
    publishedAt?: Date | null;
    userId?: string; // For logging
}

export interface QuoteFilters {
    categoryId?: string;
    categorySlug?: string;
    status?: QuoteStatus;
    search?: string;
    author?: string;
}

export interface QuoteSortOptions {
    sortBy: 'createdAt' | 'views' | 'shares' | 'downloads' | 'updatedAt' | 'performanceScore';
    sortOrder: 'asc' | 'desc';
}

export interface QuoteWithCategory extends Quote {
    category: {
        id: string;
        nameBn: string;
        nameEn: string;
        slug: string;
    };
}

/**
 * Quote Service
 */
export class QuoteService {
    /**
     * Create a new quote
     */
    async create(data: CreateQuoteDTO): Promise<QuoteWithCategory> {
        // Verify category exists
        const category = await prisma.category.findUnique({
            where: { id: data.categoryId },
        });

        if (!category) {
            throw ApiError.notFound('Category not found');
        }

        if (!category.isActive) {
            throw ApiError.badRequest('Cannot add quote to inactive category');
        }

        // Auto-set publishedAt if status is PUBLISHED
        const publishedAt = data.status === 'PUBLISHED' && !data.publishedAt
            ? new Date()
            : data.publishedAt;

        const quote = await prisma.quote.create({
            data: {
                textBn: data.textBn,
                textEn: data.textEn,
                author: data.author,
                categoryId: data.categoryId,
                status: data.status || 'DRAFT',
                publishedAt,
                // Set initial modified by if available
                lastModifiedBy: data.userId,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        nameBn: true,
                        nameEn: true,
                        slug: true,
                    },
                },
            },
        });

        // Log Activity
        if (data.userId) {
            await activityLogService.log(
                data.userId,
                'CREATE',
                'QUOTE',
                quote.id,
                { title: quote.textBn.substring(0, 50) + '...' }
            );
        }

        return quote;
    }

    /**
     * Find all quotes with filters and pagination
     */
    async findAll(
        filters: QuoteFilters,
        sort: QuoteSortOptions,
        page: number,
        limit: number
    ): Promise<{ quotes: QuoteWithCategory[]; pagination: PaginationMeta }> {
        // Build where clause
        const where: Prisma.QuoteWhereInput = {};

        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }

        if (filters.categorySlug) {
            where.category = {
                slug: filters.categorySlug,
            };
        }

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.author) {
            where.author = {
                contains: filters.author,
                mode: 'insensitive',
            };
        }

        if (filters.search) {
            where.OR = [
                {
                    textBn: {
                        contains: filters.search,
                        mode: 'insensitive',
                    },
                },
                {
                    textEn: {
                        contains: filters.search,
                        mode: 'insensitive',
                    },
                },
                {
                    author: {
                        contains: filters.search,
                        mode: 'insensitive',
                    },
                },
            ];
        }

        // Get total count
        const total = await prisma.quote.count({ where });

        // Calculate pagination
        const pagination = calculatePagination(page, limit, total);

        // Get quotes
        const quotes = await prisma.quote.findMany({
            where,
            include: {
                category: {
                    select: {
                        id: true,
                        nameBn: true,
                        nameEn: true,
                        slug: true,
                    },
                },
            },
            orderBy: {
                [sort.sortBy]: sort.sortOrder,
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { quotes, pagination };
    }

    /**
     * Find quote by ID
     */
    async findById(id: string): Promise<QuoteWithCategory> {
        const quote = await prisma.quote.findUnique({
            where: { id },
            include: {
                category: {
                    select: {
                        id: true,
                        nameBn: true,
                        nameEn: true,
                        slug: true,
                    },
                },
            },
        });

        if (!quote) {
            throw ApiError.notFound('Quote not found');
        }

        return quote;
    }

    /**
     * Update quote
     */
    async update(id: string, data: UpdateQuoteDTO): Promise<QuoteWithCategory> {
        // Check if quote exists
        const existingQuote = await prisma.quote.findUnique({
            where: { id },
        });

        if (!existingQuote) {
            throw ApiError.notFound('Quote not found');
        }

        // If categoryId is being updated, verify it exists
        if (data.categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: data.categoryId },
            });

            if (!category) {
                throw ApiError.notFound('Category not found');
            }

            if (!category.isActive) {
                throw ApiError.badRequest('Cannot move quote to inactive category');
            }
        }

        // Auto-set publishedAt if status is changing to PUBLISHED
        let publishedAt = data.publishedAt;
        if (data.status === 'PUBLISHED' && existingQuote.status !== 'PUBLISHED' && !publishedAt) {
            publishedAt = new Date();
        }

        const quote = await prisma.quote.update({
            where: { id },
            data: {
                textBn: data.textBn,
                textEn: data.textEn,
                author: data.author,
                categoryId: data.categoryId,
                status: data.status,
                publishedAt,
                // Track modification
                lastModifiedBy: data.userId,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        nameBn: true,
                        nameEn: true,
                        slug: true,
                    },
                },
            },
        });

        // Log Activity
        if (data.userId) {
            await activityLogService.log(
                data.userId,
                'UPDATE',
                'QUOTE',
                quote.id,
                { changes: data }
            );
        }

        return quote;
    }

    /**
     * Delete quote
     */
    async delete(id: string, userId?: string): Promise<void> {
        const quote = await prisma.quote.findUnique({
            where: { id },
        });

        if (!quote) {
            throw ApiError.notFound('Quote not found');
        }

        // Perform Soft Delete (middleware handles setting deletedAt)
        await prisma.quote.delete({
            where: { id },
        });

        // Log Activity
        if (userId) {
            await activityLogService.log(
                userId,
                'DELETE',
                'QUOTE',
                id,
                { previousText: quote.textBn }
            );
        }
    }

    /**
     * Bulk create quotes
     */
    async bulkCreate(quotes: CreateQuoteDTO[], userId?: string): Promise<{ count: number; quotes: Quote[] }> {
        // Verify all categories exist
        const categoryIds = [...new Set(quotes.map((q) => q.categoryId))];
        const categories = await prisma.category.findMany({
            where: {
                id: { in: categoryIds },
                isActive: true,
            },
        });

        if (categories.length !== categoryIds.length) {
            throw ApiError.badRequest('One or more categories not found or inactive');
        }

        // Create quotes
        const createdQuotes: Quote[] = [];

        for (const quoteData of quotes) {
            const publishedAt = quoteData.status === 'PUBLISHED' && !quoteData.publishedAt
                ? new Date()
                : quoteData.publishedAt;

            const quote = await prisma.quote.create({
                data: {
                    textBn: quoteData.textBn,
                    textEn: quoteData.textEn,
                    author: quoteData.author,
                    categoryId: quoteData.categoryId,
                    status: quoteData.status || 'DRAFT',
                    publishedAt,
                    lastModifiedBy: userId,
                },
            });

            createdQuotes.push(quote);
        }

        // Log Activity
        if (userId) {
            await activityLogService.log(
                userId,
                'BULK_CREATE',
                'QUOTE',
                undefined,
                { count: createdQuotes.length }
            );
        }

        return {
            count: createdQuotes.length,
            quotes: createdQuotes,
        };
    }

    /**
     * Get random quote
     */
    async getRandom(categorySlug?: string): Promise<QuoteWithCategory> {
        const where: Prisma.QuoteWhereInput = {
            status: 'PUBLISHED',
        };

        if (categorySlug) {
            where.category = {
                slug: categorySlug,
            };
        }

        const count = await prisma.quote.count({ where });

        if (count === 0) {
            throw ApiError.notFound('No quotes found');
        }

        const skip = Math.floor(Math.random() * count);

        const quote = await prisma.quote.findFirst({
            where,
            skip,
            include: {
                category: {
                    select: {
                        id: true,
                        nameBn: true,
                        nameEn: true,
                        slug: true,
                    },
                },
            },
        });

        if (!quote) {
            throw ApiError.notFound('Quote not found');
        }

        // Calculate a basic performance score if needed or trigger async calculation
        // but for read only it's fine.

        return quote;
    }

    /**
     * Increment view count
     */
    async incrementView(id: string): Promise<void> {
        // Use an atomic update to increment views and update performanceScore if needed
        // For simplicity, just increment view here.
        await prisma.quote.update({
            where: { id },
            data: {
                views: { increment: 1 },
                // Simple score boost
                performanceScore: { increment: 0.1 }
            },
        });

        // Track analytics
        await prisma.analytics.create({
            data: {
                quoteId: id,
                event: 'QUOTE_VIEW',
            },
        });
    }

    /**
     * Increment share count
     */
    async incrementShare(id: string): Promise<void> {
        await prisma.quote.update({
            where: { id },
            data: {
                shares: { increment: 1 },
                performanceScore: { increment: 1.0 } // shares are worth more
            },
        });

        // Track analytics
        await prisma.analytics.create({
            data: {
                quoteId: id,
                event: 'QUOTE_SHARE',
            },
        });
    }

    /**
     * Increment download count
     */
    async incrementDownload(id: string): Promise<void> {
        await prisma.quote.update({
            where: { id },
            data: {
                downloads: { increment: 1 },
                performanceScore: { increment: 2.0 } // downloads are high value
            },
        });

        // Track analytics
        await prisma.analytics.create({
            data: {
                quoteId: id,
                event: 'QUOTE_DOWNLOAD',
            },
        });
    }

    /**
     * Get trending quotes
     */
    async getTrending(limit: number = 10): Promise<QuoteWithCategory[]> {
        const quotes = await prisma.quote.findMany({
            where: {
                status: 'PUBLISHED',
            },
            include: {
                category: {
                    select: {
                        id: true,
                        nameBn: true,
                        nameEn: true,
                        slug: true,
                    },
                },
            },
            orderBy: [
                { performanceScore: 'desc' }, // Use new score
                { views: 'desc' },
            ],
            take: limit,
        });

        return quotes;
    }

    /**
     * Bulk update quote status
     */
    async bulkUpdateStatus(ids: string[], status: QuoteStatus, userId?: string): Promise<number> {
        // Validate IDs format if needed, but Prisma will complain if UUIDs are invalid

        let publishedAt: Date | undefined | null = undefined;
        if (status === 'PUBLISHED') {
            publishedAt = new Date();
        }

        const result = await prisma.quote.updateMany({
            where: {
                id: { in: ids },
            },
            data: {
                status,
                publishedAt,
                lastModifiedBy: userId,
            },
        });

        // Log Activity
        if (userId) {
            await activityLogService.log(
                userId,
                'BULK_UPDATE_STATUS',
                'QUOTE',
                undefined,
                { count: result.count, status, ids }
            );
        }

        return result.count;
    }

    /**
     * Bulk delete quotes
     */
    async bulkDelete(ids: string[], userId?: string): Promise<number> {
        const result = await prisma.quote.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        // Log Activity
        if (userId) {
            await activityLogService.log(
                userId,
                'BULK_DELETE',
                'QUOTE',
                undefined,
                { count: result.count, ids }
            );
        }

        return result.count;
    }
}

export const quoteService = new QuoteService();
