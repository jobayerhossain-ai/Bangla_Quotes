import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary if credentials exist
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

// Ensure upload directory exists for local storage
const uploadDir = config.upload.uploadDir;
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine selection
const getStorage = () => {
    // If Cloudinary creds are present, use it (Best for production)
    if (process.env.CLOUDINARY_CLOUD_NAME) {
        return new CloudinaryStorage({
            cloudinary: cloudinary,
            params: {
                folder: 'bangla-quotes',
                allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'svg', 'ico'],
                public_id: (req: any, file: any) => uuidv4(),
            } as any,
        });
    }

    // Fallback to local disk storage
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = uuidv4();
            cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        }
    });
};

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept images specific formats (including ico for favicon)
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/)) {
        return cb(new Error('Only image files (jpg, jpeg, png, gif, svg, webp, ico) are allowed!'));
    }
    cb(null, true);
};

export const upload = multer({
    storage: getStorage(),
    fileFilter: fileFilter,
    limits: {
        fileSize: config.upload.maxFileSize
    }
});
