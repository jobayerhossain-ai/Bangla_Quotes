import { Request, Response } from 'express';
import { settingsService } from '../services/settings.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export class SettingsController {
    /**
     * Get all feature toggles
     * GET /api/v1/settings/feature-toggles
     */
    getFeatureToggles = asyncHandler(async (req: Request, res: Response) => {
        const toggles = await settingsService.getFeatureToggles();
        return sendSuccess(res, toggles, 'Feature toggles retrieved successfully');
    });

    /**
     * Update feature toggle
     * PATCH /api/v1/settings/feature-toggles/:key
     */
    updateFeatureToggle = asyncHandler(async (req: Request, res: Response) => {
        const { key } = req.params;
        const { isEnabled } = req.body;
        const updatedBy = req.user?.userId || 'system';

        const toggle = await settingsService.updateFeatureToggle(key, isEnabled, updatedBy);
        return sendSuccess(res, toggle, 'Feature toggle updated successfully');
    });

    /**
     * Initialize feature toggles
     * POST /api/v1/settings/feature-toggles/init
     */
    initializeFeatureToggles = asyncHandler(async (req: Request, res: Response) => {
        const toggles = await settingsService.initializeFeatureToggles();
        return sendSuccess(res, toggles, 'Feature toggles initialized successfully');
    });

    /**
     * Get all general settings
     * GET /api/v1/settings
     */
    getSettings = asyncHandler(async (req: Request, res: Response) => {
        const { group } = req.query;
        const settings = await settingsService.getSettings(group as string);
        return sendSuccess(res, settings, 'Settings retrieved successfully');
    });

    /**
     * Get public settings
     * GET /api/v1/settings/public
     */
    getPublicSettings = asyncHandler(async (req: Request, res: Response) => {
        const settings = await settingsService.getPublicSettings();
        return sendSuccess(res, settings, 'Public settings retrieved successfully');
    });

    /**
     * Update setting
     * PUT /api/v1/settings
     */
    updateSetting = asyncHandler(async (req: Request, res: Response) => {
        const setting = await settingsService.upsertSetting(req.body);
        return sendSuccess(res, setting, 'Setting updated successfully');
    });
}

export const settingsController = new SettingsController();
