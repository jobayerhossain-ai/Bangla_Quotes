/**
 * Activity Log Controller
 */

import { Request, Response } from 'express';
import { activityLogService } from '../services/activityLog.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export class ActivityLogController {
    /**
     * Get recent activity logs
     * GET /api/v1/activity-logs
     */
    getRecent = asyncHandler(async (req: Request, res: Response) => {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
        const logs = await activityLogService.getRecentLogs(limit);

        return sendSuccess(res, logs, 'Activity logs retrieved successfully');
    });
}

export const activityLogController = new ActivityLogController();
