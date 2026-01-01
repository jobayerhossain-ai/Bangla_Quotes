/**
 * Category Controller
 * 
 * Handles HTTP requests for category endpoints.
 */

import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';
import {
    CreateCategoryInput,
    UpdateCategoryInput,
    CategoryQueryInput,
} from '../validators/category.validator';

/**
 * Category Controller
 */
export class CategoryController {
    /**
     * Create a new category
     * POST /api/v1/categories
     */
    create = asyncHandler(async (req: Request, res: Response) => {
        const data: CreateCategoryInput = req.body;
        const category = await categoryService.create(data);

        return sendSuccess(res, category, 'Category created successfully', 201);
    });

    /**
     * Get all categories
     * GET /api/v1/categories
     */
    getAll = asyncHandler(async (req: Request, res: Response) => {
        const query: CategoryQueryInput = req.query as any;
        console.log('📝 Controller Request Query:', req.query);
        console.log('📝 Parsed Query isActive:', query.isActive, typeof query.isActive);

        const result = await categoryService.findAll(
            query.isActive,
            query.sortBy,
            query.sortOrder,
            query.page,
            query.limit
        );

        if (result.pagination) {
            return sendPaginated(res, result.categories, result.pagination);
        }

        return sendSuccess(res, result.categories, 'Categories retrieved successfully');
    });

    /**
     * Get category by ID
     * GET /api/v1/categories/id/:id
     */
    getById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const category = await categoryService.findById(id);

        return sendSuccess(res, category, 'Category retrieved successfully');
    });

    /**
     * Get category by slug
     * GET /api/v1/categories/:slug
     */
    getBySlug = asyncHandler(async (req: Request, res: Response) => {
        const { slug } = req.params;
        const category = await categoryService.findBySlug(slug);

        return sendSuccess(res, category, 'Category retrieved successfully');
    });

    /**
     * Update category
     * PUT /api/v1/categories/:id
     */
    update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data: UpdateCategoryInput = req.body;
        const category = await categoryService.update(id, data);

        return sendSuccess(res, category, 'Category updated successfully');
    });

    /**
     * Delete category
     * DELETE /api/v1/categories/:id
     */
    delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        await categoryService.delete(id);

        return sendSuccess(res, null, 'Category deleted successfully');
    });

    /**
     * Get quotes by category slug
     * GET /api/v1/categories/:slug/quotes
     */
    getQuotesBySlug = asyncHandler(async (req: Request, res: Response) => {
        const { slug } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const sortBy = (req.query.sortBy as string) || 'createdAt';
        const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

        const result = await categoryService.getQuotesBySlug(
            slug,
            page,
            limit,
            sortBy,
            sortOrder
        );

        return sendSuccess(
            res,
            {
                category: result.category,
                quotes: result.quotes,
                pagination: result.pagination,
            },
            'Category quotes retrieved successfully'
        );
    });

    /**
     * Get popular categories
     * GET /api/v1/categories/popular
     */
    getPopular = asyncHandler(async (req: Request, res: Response) => {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const categories = await categoryService.getPopular(limit);

        return sendSuccess(res, categories, 'Popular categories retrieved successfully');
    });

    /**
     * Bulk delete categories
     * POST /api/v1/categories/bulk/delete
     */
    bulkDelete = asyncHandler(async (req: Request, res: Response) => {
        const { ids } = req.body;
        // @ts-ignore - User attached by auth middleware
        const userId = req.user?.id;

        const result = await categoryService.bulkDelete(ids, userId);

        if (result.errors.length > 0) {
            // Partial success or failure
            return sendSuccess(
                res,
                result,
                `Deleted ${result.count} categories. ${result.errors.length} failed.`,
                result.count > 0 ? 200 : 400
            );
        }

        return sendSuccess(res, { count: result.count }, `${result.count} categories deleted successfully`);
    });
}

export const categoryController = new CategoryController();
