/**
 * Asset Controller
 * 
 * Handles HTTP requests for asset endpoints.
 */

import { Request, Response } from 'express';
import { assetService } from '../services/asset.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';
import { CreateAssetInput, UpdateAssetInput, AssetQueryInput } from '../validators/asset.validator';

export class AssetController {
    /**
     * Create a new asset
     * POST /api/v1/assets
     */
    create = asyncHandler(async (req: Request, res: Response) => {
        const data: CreateAssetInput = req.body;
        // @ts-ignore
        const userId = req.user?.id;

        const asset = await assetService.create({ ...data, userId });
        return sendSuccess(res, asset, 'Asset created successfully', 201);
    });

    /**
     * Get all assets
     * GET /api/v1/assets
     */
    getAll = asyncHandler(async (req: Request, res: Response) => {
        const query: AssetQueryInput = req.query as any;

        const result = await assetService.findAll(
            query.type,
            query.isActive,
            query.isPremium,
            query.sortBy,
            query.sortOrder,
            query.page,
            query.limit
        );

        if (result.pagination) {
            return sendPaginated(res, result.assets, result.pagination);
        }

        return sendSuccess(res, result.assets, 'Assets retrieved successfully');
    });

    /**
     * Get asset by ID
     * GET /api/v1/assets/:id
     */
    getById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const asset = await assetService.findById(id);
        return sendSuccess(res, asset, 'Asset retrieved successfully');
    });

    /**
     * Update asset
     * PUT /api/v1/assets/:id
     */
    update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data: UpdateAssetInput = req.body;
        // @ts-ignore
        const userId = req.user?.id;

        const asset = await assetService.update(id, { ...data, userId });
        return sendSuccess(res, asset, 'Asset updated successfully');
    });

    /**
     * Delete asset
     * DELETE /api/v1/assets/:id
     */
    delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user?.id;

        await assetService.delete(id, userId);
        return sendSuccess(res, null, 'Asset deleted successfully');
    });

    /**
     * Bulk delete assets
     * POST /api/v1/assets/bulk/delete
     */
    bulkDelete = asyncHandler(async (req: Request, res: Response) => {
        const { ids } = req.body;
        // @ts-ignore
        const userId = req.user?.id;

        const result = await assetService.bulkDelete(ids, userId);
        return sendSuccess(res, { count: result.count }, `${result.count} assets deleted successfully`);
    });
}

export const assetController = new AssetController();
