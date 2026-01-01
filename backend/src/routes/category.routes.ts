/**
 * Category Routes
 * 
 * Defines all category-related routes.
 */

import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { publicLimiter } from '../middleware/rateLimit.middleware';
import {
    createCategorySchema,
    updateCategorySchema,
    categoryIdSchema,
    categorySlugSchema,
    categoryQuerySchema,
    bulkDeleteCategorySchema,
} from '../validators/category.validator';

const router = Router();

/**
 * @route   GET /api/v1/categories/popular
 * @desc    Get popular categories
 * @access  Public
 */
router.get(
    '/popular',
    publicLimiter,
    categoryController.getPopular
);

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get(
    '/',
    publicLimiter,
    validateQuery(categoryQuerySchema),
    categoryController.getAll
);

/**
 * @route   GET /api/v1/categories/id/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get(
    '/id/:id',
    publicLimiter,
    validateParams(categoryIdSchema),
    categoryController.getById
);

/**
 * @route   GET /api/v1/categories/:slug
 * @desc    Get category by slug
 * @access  Public
 */
router.get(
    '/:slug',
    publicLimiter,
    validateParams(categorySlugSchema),
    categoryController.getBySlug
);

/**
 * @route   GET /api/v1/categories/:slug/quotes
 * @desc    Get quotes by category slug
 * @access  Public
 */
router.get(
    '/:slug/quotes',
    publicLimiter,
    validateParams(categorySlugSchema),
    categoryController.getQuotesBySlug
);

/**
 * @route   POST /api/v1/categories
 * @desc    Create a new category
 * @access  Admin
 */
router.post(
    '/',
    authenticate,
    authorizeAdmin,
    validateBody(createCategorySchema),
    categoryController.create
);

/**
 * @route   POST /api/v1/categories/bulk/delete
 * @desc    Bulk delete categories
 * @access  Admin
 */
router.post(
    '/bulk/delete',
    authenticate,
    authorizeAdmin,
    validateBody(bulkDeleteCategorySchema),
    categoryController.bulkDelete
);

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update category
 * @access  Admin
 */
router.put(
    '/:id',
    authenticate,
    authorizeAdmin,
    validateParams(categoryIdSchema),
    validateBody(updateCategorySchema),
    categoryController.update
);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete category
 * @access  Admin
 */
router.delete(
    '/:id',
    authenticate,
    authorizeAdmin,
    validateParams(categoryIdSchema),
    categoryController.delete
);

export default router;
