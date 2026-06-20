import { Router } from 'express';
import multer from 'multer';
import { UploadController } from './upload.controller';
import { authMiddleware } from '@/middleware/authMiddleware';

const router = Router();
const uploadController = new UploadController();
const upload = multer({ storage: multer.memoryStorage() });

// Generic upload endpoint for authenticated users
router.post(
    '/',
    authMiddleware,
    upload.single('image'),
    uploadController.uploadImage
);

export default router;
