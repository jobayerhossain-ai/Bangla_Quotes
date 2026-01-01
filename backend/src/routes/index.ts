import { Router } from 'express';
import authRoutes from './auth.routes';
import quoteRoutes from './quote.routes';
import categoryRoutes from './category.routes';
import healthRoutes from './health.routes';
import activityLogRoutes from './activityLog.routes';
import assetRoutes from './asset.routes';
import userRoutes from './user.routes';
import settingsRoutes from './settings.routes';
import { dashboardRoutes } from './dashboard.routes';
import uploadRoutes from './upload.routes';

const router = Router();

// Health check (no /api/v1 prefix needed if mounted at root, but here we mount at /api/v1 usually)
// Let's assume this router is mounted at /api/v1 in app.ts
router.use('/', healthRoutes);

// API routes
router.use('/auth', authRoutes);
router.use('/quotes', quoteRoutes);
router.use('/categories', categoryRoutes);
router.use('/assets', assetRoutes);
router.use('/users', userRoutes);
router.use('/settings', settingsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/activity-logs', activityLogRoutes);
router.use('/upload', uploadRoutes);

export default router;
