import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { AppError } from '@/core/errors/AppError';
import { HTTPStatusCode } from '@/types/HTTPStatusCode';
import { config } from 'dotenv';
config();

export const uploadToS3 = async (file: Express.Multer.File, folder: string = 'uploads'): Promise<string> => {
    const region = process.env.AWS_REGION || 'us-east-1';
    const bucketName = process.env.AWS_BUCKET_NAME || '';

    const s3Client = new S3Client({
        region,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
    });

    try {
        const ext = path.extname(file.originalname);
        const filename = `${folder}/${uuidv4()}${ext}`;
        
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: filename,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await s3Client.send(command);

        return `https://${bucketName}.s3.${region}.amazonaws.com/${filename}`;
    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw new AppError({
            statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
            message: 'Failed to upload image to S3',
            code: 'UPLOAD_ERROR',
        });
    }
};
