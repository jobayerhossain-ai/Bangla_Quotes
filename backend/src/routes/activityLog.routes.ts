/**
 * Activity Log Routes
 */

import { Router } from 'express';
import { activityLogController } from '../controllers/activityLog.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

// All routes require admin authentication
router.use(authenticate, authorizeAdmin);

router.get('/', activityLogController.getRecent);

export default router;
