import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();


/**
 * @route   GET /api/v1/settings/public
 * @desc    Get public settings
 * @access  Public
 */
router.get('/public', settingsController.getPublicSettings);

// All other routes require authentication and admin role
router.use(authenticate);
router.use(authorize(['SUPER_ADMIN']));

/**
 * @route   GET /api/v1/settings
 * @desc    Get all general settings
 * @access  Admin
 */
router.get('/', settingsController.getSettings);

/**
 * @route   PUT /api/v1/settings
 * @desc    Update a setting
 * @access  Admin
 */
router.put('/', settingsController.updateSetting);

/**
 * @route   GET /api/v1/settings/feature-toggles
 * @desc    Get all feature toggles
 * @access  Admin
 */
router.get('/feature-toggles', settingsController.getFeatureToggles);

/**
 * @route   POST /api/v1/settings/feature-toggles/init
 * @desc    Initialize default feature toggles
 * @access  Admin
 */
router.post('/feature-toggles/init', settingsController.initializeFeatureToggles);

/**
 * @route   PATCH /api/v1/settings/feature-toggles/:key
 * @desc    Update feature toggle
 * @access  Admin
 */
router.patch('/feature-toggles/:key', settingsController.updateFeatureToggle);

export default router;
