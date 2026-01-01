/**
 * Asset Routes
 * 
 * Defines all asset-related routes.
 */

import { Router } from 'express';
import { assetController } from '../controllers/asset.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { publicLimiter } from '../middleware/rateLimit.middleware';
import {
    createAssetSchema,
    updateAssetSchema,
    assetQuerySchema,
    assetIdSchema,
    bulkDeleteAssetSchema
} from '../validators/asset.validator';

const router = Router();

/**
 * @route   GET /api/v1/assets
 * @desc    Get all assets
 * @access  Public
 */
router.get(
    '/',
    publicLimiter,
    validateQuery(assetQuerySchema),
    assetController.getAll
);

/**
 * @route   GET /api/v1/assets/:id
 * @desc    Get asset by ID
 * @access  Public
 */
router.get(
    '/:id',
    publicLimiter,
    validateParams(assetIdSchema),
    assetController.getById
);

/**
 * @route   POST /api/v1/assets
 * @desc    Create a new asset
 * @access  Admin
 */
router.post(
    '/',
    authenticate,
    authorizeAdmin,
    validateBody(createAssetSchema),
    assetController.create
);

/**
 * @route   PUT /api/v1/assets/:id
 * @desc    Update asset
 * @access  Admin
 */
router.put(
    '/:id',
    authenticate,
    authorizeAdmin,
    validateParams(assetIdSchema),
    validateBody(updateAssetSchema),
    assetController.update
);

/**
 * @route   POST /api/v1/assets/bulk/delete
 * @desc    Bulk delete assets
 * @access  Admin
 */
router.post(
    '/bulk/delete',
    authenticate,
    authorizeAdmin,
    validateBody(bulkDeleteAssetSchema),
    assetController.bulkDelete
);

/**
 * @route   DELETE /api/v1/assets/:id
 * @desc    Delete asset
 * @access  Admin
 */
router.delete(
    '/:id',
    authenticate,
    authorizeAdmin,
    validateParams(assetIdSchema),
    assetController.delete
);

export default router;
