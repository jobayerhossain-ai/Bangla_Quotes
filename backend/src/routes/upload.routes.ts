import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

/**
 * @route   POST /api/v1/upload
 * @desc    Upload a file
 * @access  Admin
 */
router.post(
    '/',
    authenticate,
    authorizeAdmin,
    upload.single('file'),
    uploadController.uploadFile
);

export default router;
