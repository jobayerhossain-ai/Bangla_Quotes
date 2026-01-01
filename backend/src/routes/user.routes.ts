import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize(['SUPER_ADMIN', 'CONTENT_MANAGER']));

/**
 * @route   GET /api/v1/users
 * @desc    Get all users with pagination
 * @access  Admin
 */
router.get('/', userController.getAll);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Admin
 */
router.get('/:id', userController.getById);

/**
 * @route   PATCH /api/v1/users/:id/status
 * @desc    Update user status (block/unblock)
 * @access  Admin
 */
router.patch('/:id/status', userController.updateStatus);

/**
 * @route   PATCH /api/v1/users/:id/role
 * @desc    Update user role
 * @access  Admin
 */
router.patch('/:id/role', userController.updateRole);

export default router;
