/**
 * Quote Controller
 * 
 * Handles HTTP requests for quote endpoints.
 */

import { Request, Response } from 'express';
import { quoteService } from '../services/quote.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';
import {
    CreateQuoteInput,
    UpdateQuoteInput,
    QuoteQueryInput,
    BulkCreateQuotesInput,
} from '../validators/quote.validator';

/**
 * Quote Controller
 */
export class QuoteController {
    /**
     * Create a new quote
     * POST /api/v1/quotes
     */
    create = asyncHandler(async (req: Request, res: Response) => {
        const data: CreateQuoteInput = req.body;
        const quote = await quoteService.create(data);

        return sendSuccess(res, quote, 'Quote created successfully', 201);
    });

    /**
     * Get all quotes with filters and pagination
     * GET /api/v1/quotes
     */
    getAll = asyncHandler(async (req: Request, res: Response) => {
        const query: QuoteQueryInput = req.query as any;

        const filters = {
            categoryId: query.categoryId,
            categorySlug: query.categorySlug,
            status: query.status,
            search: query.search,
            author: query.author,
        };

        const sort = {
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
        };

        const { quotes, pagination } = await quoteService.findAll(
            filters,
            sort,
            query.page,
            query.limit
        );

        return sendPaginated(res, quotes, pagination);
    });

    /**
     * Get quote by ID
     * GET /api/v1/quotes/:id
     */
    getById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const quote = await quoteService.findById(id);

        return sendSuccess(res, quote, 'Quote retrieved successfully');
    });

    /**
     * Update quote
     * PUT /api/v1/quotes/:id
     */
    update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data: UpdateQuoteInput = req.body;
        const quote = await quoteService.update(id, data);

        return sendSuccess(res, quote, 'Quote updated successfully');
    });

    /**
     * Delete quote
     * DELETE /api/v1/quotes/:id
     */
    delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        await quoteService.delete(id);

        return sendSuccess(res, null, 'Quote deleted successfully');
    });

    /**
     * Bulk create quotes
     * POST /api/v1/quotes/bulk
     */
    bulkCreate = asyncHandler(async (req: Request, res: Response) => {
        const data: BulkCreateQuotesInput = req.body;
        const result = await quoteService.bulkCreate(data.quotes);

        return sendSuccess(
            res,
            result,
            `${result.count} quotes created successfully`,
            201
        );
    });

    /**
     * Get random quote
     * GET /api/v1/quotes/random
     */
    getRandom = asyncHandler(async (req: Request, res: Response) => {
        const { categorySlug } = req.query;
        const quote = await quoteService.getRandom(categorySlug as string);

        return sendSuccess(res, quote, 'Random quote retrieved successfully');
    });

    /**
     * Get trending quotes
     * GET /api/v1/quotes/trending
     */
    getTrending = asyncHandler(async (req: Request, res: Response) => {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const quotes = await quoteService.getTrending(limit);

        return sendSuccess(res, quotes, 'Trending quotes retrieved successfully');
    });

    /**
     * Increment view count
     * POST /api/v1/quotes/:id/view
     */
    incrementView = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        await quoteService.incrementView(id);

        return sendSuccess(res, null, 'View count incremented');
    });

    /**
     * Increment share count
     * POST /api/v1/quotes/:id/share
     */
    incrementShare = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        await quoteService.incrementShare(id);

        return sendSuccess(res, null, 'Share count incremented');
    });

    /**
     * Increment download count
     * POST /api/v1/quotes/:id/download
     */
    incrementDownload = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        await quoteService.incrementDownload(id);

        return sendSuccess(res, null, 'Download count incremented');
    });

    /**
     * Bulk update status
     * PATCH /api/v1/quotes/bulk/status
     */
    bulkUpdateStatus = asyncHandler(async (req: Request, res: Response) => {
        const { ids, status } = req.body;
        // @ts-ignore - User attached by auth middleware
        const userId = req.user?.id;

        const count = await quoteService.bulkUpdateStatus(ids, status, userId);

        return sendSuccess(res, { count }, `${count} quotes updated successfully`);
    });

    /**
     * Bulk delete quotes
     * POST /api/v1/quotes/bulk/delete
     */
    bulkDelete = asyncHandler(async (req: Request, res: Response) => {
        const { ids } = req.body;
        // @ts-ignore - User attached by auth middleware
        const userId = req.user?.id;

        const count = await quoteService.bulkDelete(ids, userId);

        return sendSuccess(res, { count }, `${count} quotes deleted successfully`);
    });
}

export const quoteController = new QuoteController();
