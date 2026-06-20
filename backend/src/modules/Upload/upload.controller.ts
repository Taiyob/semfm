import { Request, Response } from 'express';
import { BaseController } from '@/core/BaseController';
import { catchAsync } from '@/utils/catchAsync';
import { uploadToS3 } from '@/utils/s3Uploader';
import { AppError } from '@/core/errors/AppError';
import { HTTPStatusCode } from '@/types/HTTPStatusCode';

export class UploadController extends BaseController {
    public uploadImage = catchAsync(async (req: Request, res: Response) => {
        if (!req.file) {
            throw new AppError({
                statusCode: HTTPStatusCode.BAD_REQUEST,
                message: 'No file provided',
                code: 'FILE_REQUIRED',
            });
        }

        const imageUrl = await uploadToS3(req.file, 'semfm-images');
        
        return this.sendResponse(req, res, 'Image uploaded successfully', undefined, { imageUrl });
    });
}
