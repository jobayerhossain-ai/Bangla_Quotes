/**
 * Category Service
 * 
 * Business logic for category management.
 */

import { PrismaClient, Category, Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { generateUniqueSlug } from '../utils/slug';
import { activityLogService } from './activityLog.service';
import { calculatePagination, PaginationMeta } from '../utils/response';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

console.log('🔌 DATABASE URL:', process.env.DATABASE_URL);

export interface CreateCategoryDTO {
    nameBn: string;
    nameEn: string;
    slug?: string;
    description?: string | null;
    isActive?: boolean;
    order?: number;
}

export interface UpdateCategoryDTO {
    nameBn?: string;
    nameEn?: string;
    slug?: string;
    description?: string | null;
    isActive?: boolean;
    order?: number;
}

export interface CategoryWithQuoteCount extends Category {
    _count: {
        quotes: number;
    };
}

/**
 * Category Service
 */
export class CategoryService {
    /**
     * Create a new category
     */
    async create(data: CreateCategoryDTO): Promise<CategoryWithQuoteCount> {
        // Generate slug if not provided
        let slug = data.slug;

        if (!slug) {
            slug = await generateUniqueSlug(data.nameBn, async (s) => {
                const existing = await prisma.category.findUnique({ where: { slug: s } });
                return !!existing;
            });
        } else {
            // Check if slug already exists
            const existing = await prisma.category.findUnique({ where: { slug } });
            if (existing) {
                throw ApiError.conflict('Category with this slug already exists');
            }
        }

        const category = await prisma.category.create({
            data: {
                nameBn: data.nameBn,
                nameEn: data.nameEn,
                slug,
                description: data.description,
                isActive: data.isActive ?? true,
                order: data.order ?? 0,
            },
            include: {
                _count: {
                    select: { quotes: true },
                },
            },
        });

        return category;
    }

    /**
     * Find all categories
     */
    async findAll(
        isActive?: boolean,
        sortBy: string = 'order',
        sortOrder: 'asc' | 'desc' = 'asc',
        page?: number,
        limit?: number
    ): Promise<{ categories: CategoryWithQuoteCount[]; pagination?: PaginationMeta }> {
        const where: Prisma.CategoryWhereInput = {};

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        // If pagination is requested
        if (page && limit) {
            console.log(`🔍 findAll executing with where: ${JSON.stringify(where)}`);
            const total = await prisma.category.count({ where });
            console.log(`📊 Total categories found: ${total}`);
            const pagination = calculatePagination(page, limit, total);

            const categories = await prisma.category.findMany({
                where,
                include: {
                    _count: {
                        select: { quotes: true },
                    },
                },
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            return { categories, pagination };
        }

        // Without pagination
        const categories = await prisma.category.findMany({
            where,
            include: {
                _count: {
                    select: { quotes: true },
                },
            },
            orderBy: {
                [sortBy]: sortOrder,
            },
        });

        return { categories };
    }

    /**
     * Find category by ID
     */
    async findById(id: string): Promise<CategoryWithQuoteCount> {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { quotes: true },
                },
            },
        });

        if (!category) {
            throw ApiError.notFound('Category not found');
        }

        return category;
    }

    /**
     * Find category by slug
     */
    async findBySlug(slug: string): Promise<CategoryWithQuoteCount> {
        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                _count: {
                    select: { quotes: true },
                },
            },
        });

        if (!category) {
            throw ApiError.notFound('Category not found');
        }

        return category;
    }

    /**
     * Update category
     */
    async update(id: string, data: UpdateCategoryDTO): Promise<CategoryWithQuoteCount> {
        // Check if category exists
        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            throw ApiError.notFound('Category not found');
        }

        // If slug is being updated, check uniqueness
        if (data.slug && data.slug !== existingCategory.slug) {
            const slugExists = await prisma.category.findUnique({
                where: { slug: data.slug },
            });

            if (slugExists) {
                throw ApiError.conflict('Category with this slug already exists');
            }
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                nameBn: data.nameBn,
                nameEn: data.nameEn,
                slug: data.slug,
                description: data.description,
                isActive: data.isActive,
                order: data.order,
            },
            include: {
                _count: {
                    select: { quotes: true },
                },
            },
        });

        return category;
    }

    /**
     * Delete category
     */
    async delete(id: string): Promise<void> {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { quotes: true },
                },
            },
        });

        if (!category) {
            throw ApiError.notFound('Category not found');
        }

        // Check if category has quotes
        if (category._count.quotes > 0) {
            throw ApiError.badRequest(
                `Cannot delete category with ${category._count.quotes} quotes. Please reassign or delete the quotes first.`
            );
        }

        await prisma.category.delete({
            where: { id },
        });
    }

    /**
     * Get quotes by category slug
     */
    async getQuotesBySlug(
        slug: string,
        page: number,
        limit: number,
        sortBy: string = 'createdAt',
        sortOrder: 'asc' | 'desc' = 'desc'
    ) {
        // Verify category exists
        const category = await this.findBySlug(slug);

        const where: Prisma.QuoteWhereInput = {
            categoryId: category.id,
            status: 'PUBLISHED',
        };

        const total = await prisma.quote.count({ where });
        const pagination = calculatePagination(page, limit, total);

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
                [sortBy]: sortOrder,
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { category, quotes, pagination };
    }

    /**
     * Get popular categories (by quote count)
     */
    async getPopular(limit: number = 10): Promise<CategoryWithQuoteCount[]> {
        const categories = await prisma.category.findMany({
            where: {
                isActive: true,
            },
            include: {
                _count: {
                    select: { quotes: true },
                },
            },
            orderBy: {
                quotes: {
                    _count: 'desc',
                },
            },
            take: limit,
        });

        return categories;
    }
    // ... (ActivityLogService import needed)

    /**
     * Bulk delete categories
     */
    async bulkDelete(ids: string[], userId?: string): Promise<{ count: number; errors: string[] }> {
        const errors: string[] = [];
        let deletedCount = 0;

        for (const id of ids) {
            try {
                // Check for quotes dependency manually per item to provide specific errors if possible
                // Or just use deleteMany and let it fail if constraints exist (but Prisma Cascade might be dangerous if not careful)
                // The schema says Quote -> Category (onDelete: Cascade). Wait! 
                // Let's check schema: `category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)`
                // This means deleting a category WILL delete its quotes. 
                // BUT the single delete method prevents this:
                /* 
                if (category._count.quotes > 0) {
                    throw ApiError.badRequest(...)
                }
                */
                // We should probably enforce the same rule for bulk delete to be safe.

                const category = await prisma.category.findUnique({
                    where: { id },
                    include: { _count: { select: { quotes: true } } }
                });

                if (!category) {
                    errors.push(`Category ${id} not found`);
                    continue;
                }

                if (category._count.quotes > 0) {
                    errors.push(`Category "${category.nameEn}" has ${category._count.quotes} quotes. Cannot delete.`);
                    continue;
                }

                await prisma.category.delete({ where: { id } });
                deletedCount++;

            } catch (error) {
                errors.push(`Failed to delete category ${id}`);
            }
        }

        // Log Activity
        if (userId && deletedCount > 0) {
            await activityLogService.log(
                userId,
                'BULK_DELETE',
                'CATEGORY',
                undefined,
                { count: deletedCount, ids }
            );
        }

        return { count: deletedCount, errors };
    }
}


export const categoryService = new CategoryService();
