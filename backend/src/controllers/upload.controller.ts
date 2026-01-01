import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export class UploadController {
    /**
     * Upload single file
     * POST /api/v1/upload
     */
    uploadFile = asyncHandler(async (req: Request, res: Response) => {
        if (!req.file) {
            return sendError(res, 'No file uploaded', 400);
        }
        // Helper to check if file is from Cloudinary
        const isCloudinary = (file: any) => file.path && file.path.startsWith('http');

        // Construct full URL
        const fileUrl = isCloudinary(req.file)
            ? req.file!.path
            : `${req.protocol}://${req.get('host')}/uploads/${req.file!.filename}`;

        return sendSuccess(res, {
            url: fileUrl,
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size
        }, 'File uploaded successfully');
    });
}

export const uploadController = new UploadController();
