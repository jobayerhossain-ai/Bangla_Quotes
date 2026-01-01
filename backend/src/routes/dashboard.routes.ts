
import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Dashboard routes - Admin only
router.get('/stats', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), dashboardController.getStats);

export const dashboardRoutes = router;
