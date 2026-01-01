/**
 * Quote Routes
 * 
 * Defines all quote-related routes.
 */

import { Router } from 'express';
import { quoteController } from '../controllers/quote.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { publicLimiter } from '../middleware/rateLimit.middleware';
import {
    createQuoteSchema,
    updateQuoteSchema,
    quoteQuerySchema,
    quoteIdSchema,
    bulkCreateQuotesSchema,
    bulkUpdateStatusSchema,
    bulkDeleteSchema,
} from '../validators/quote.validator';

const router = Router();

/**
 * @route   GET /api/v1/quotes/random
 * @desc    Get random quote
 * @access  Public
 */
router.get(
    '/random',
    publicLimiter,
    quoteController.getRandom
);

/**
 * @route   GET /api/v1/quotes/trending
 * @desc    Get trending quotes
 * @access  Public
 */
router.get(
    '/trending',
    publicLimiter,
    quoteController.getTrending
);

/**
 * @route   GET /api/v1/quotes
 * @desc    Get all quotes with filters and pagination
 * @access  Public
 */
router.get(
    '/',
    publicLimiter,
    validateQuery(quoteQuerySchema),
    quoteController.getAll
);

/**
 * @route   GET /api/v1/quotes/:id
 * @desc    Get quote by ID
 * @access  Public
 */
router.get(
    '/:id',
    publicLimiter,
    validateParams(quoteIdSchema),
    quoteController.getById
);

/**
 * @route   POST /api/v1/quotes
 * @desc    Create a new quote
 * @access  Admin
 */
router.post(
    '/',
    authenticate,
    authorizeAdmin,
    validateBody(createQuoteSchema),
    quoteController.create
);

/**
 * @route   POST /api/v1/quotes/bulk
 * @desc    Bulk create quotes
 * @access  Admin
 */
router.post(
    '/bulk',
    authenticate,
    authorizeAdmin,
    validateBody(bulkCreateQuotesSchema),
    quoteController.bulkCreate
);

/**
 * @route   PATCH /api/v1/quotes/bulk/status
 * @desc    Bulk update status
 * @access  Admin
 */
router.patch(
    '/bulk/status',
    authenticate,
    authorizeAdmin,
    validateBody(bulkUpdateStatusSchema),
    quoteController.bulkUpdateStatus
);

/**
 * @route   POST /api/v1/quotes/bulk/delete
 * @desc    Bulk delete quotes
 * @access  Admin
 */
router.post(
    '/bulk/delete',
    authenticate,
    authorizeAdmin,
    validateBody(bulkDeleteSchema),
    quoteController.bulkDelete
);

/**
 * @route   PUT /api/v1/quotes/:id
 * @desc    Update quote
 * @access  Admin
 */
router.put(
    '/:id',
    authenticate,
    authorizeAdmin,
    validateParams(quoteIdSchema),
    validateBody(updateQuoteSchema),
    quoteController.update
);

/**
 * @route   DELETE /api/v1/quotes/:id
 * @desc    Delete quote
 * @access  Admin
 */
router.delete(
    '/:id',
    authenticate,
    authorizeAdmin,
    validateParams(quoteIdSchema),
    quoteController.delete
);

/**
 * @route   POST /api/v1/quotes/:id/view
 * @desc    Increment view count
 * @access  Public
 */
router.post(
    '/:id/view',
    publicLimiter,
    validateParams(quoteIdSchema),
    quoteController.incrementView
);

/**
 * @route   POST /api/v1/quotes/:id/share
 * @desc    Increment share count
 * @access  Public
 */
router.post(
    '/:id/share',
    publicLimiter,
    validateParams(quoteIdSchema),
    quoteController.incrementShare
);

/**
 * @route   POST /api/v1/quotes/:id/download
 * @desc    Increment download count
 * @access  Public
 */
router.post(
    '/:id/download',
    publicLimiter,
    validateParams(quoteIdSchema),
    quoteController.incrementDownload
);

export default router;
