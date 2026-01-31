import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';
import { AppLogger } from '../services/logger.service';

export interface CloudinaryUploadResult {
    publicId: string;
    url: string;
    secureUrl: string;
}

@Injectable()
export class CloudinaryService {
    constructor(private readonly logger: AppLogger) { }

    /**
     * Upload an image to Cloudinary with optimizations
     * @param file - The file buffer from multer
     * @param folder - Cloudinary folder path
     * @returns Upload result with URLs
     */
    async uploadImage(
        file: Express.Multer.File,
        folder: string = 'avatars',
    ): Promise<CloudinaryUploadResult> {
        // Validate file type
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`,
            );
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new BadRequestException('File size exceeds 5MB limit');
        }

        this.logger.info(
            `Uploading image: ${file.originalname} (${file.size} bytes)`,
            CloudinaryService.name,
        );

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'image',
                    transformation: [
                        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                        { quality: 'auto', fetch_format: 'auto' },
                    ],
                    overwrite: true,
                },
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error) {
                        this.logger.error(
                            `Cloudinary upload failed: ${error.message}`,
                            CloudinaryService.name,
                        );
                        reject(new BadRequestException('Failed to upload image to cloud storage'));
                    } else if (result) {
                        this.logger.info(
                            `Image uploaded successfully: ${result.public_id}`,
                            CloudinaryService.name,
                        );
                        resolve({
                            publicId: result.public_id,
                            url: result.url,
                            secureUrl: result.secure_url,
                        });
                    }
                },
            );

            // Convert buffer to readable stream and pipe to upload
            const readable = new Readable();
            readable.push(file.buffer);
            readable.push(null);
            readable.pipe(uploadStream);
        });
    }

    /**
     * Delete an image from Cloudinary by public ID
     * @param publicId - The Cloudinary public ID
     */
    async deleteImage(publicId: string): Promise<void> {
        if (!publicId) return;

        try {
            this.logger.info(`Deleting image: ${publicId}`, CloudinaryService.name);
            await cloudinary.uploader.destroy(publicId);
            this.logger.info(`Image deleted successfully: ${publicId}`, CloudinaryService.name);
        } catch (error) {
            this.logger.warn(
                `Failed to delete image ${publicId}: ${error.message}`,
                CloudinaryService.name,
            );
            // Don't throw - deletion failure shouldn't block main operation
        }
    }

    /**
     * Extract public ID from a Cloudinary URL
     * @param url - Full Cloudinary URL
     * @returns Public ID or null
     */
    extractPublicId(url: string): string | null {
        if (!url || !url.includes('cloudinary.com')) return null;

        try {
            // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{extension}
            const parts = url.split('/upload/');
            if (parts.length < 2) return null;

            // Remove version prefix (v1234567890/) and file extension
            const pathWithVersion = parts[1];
            const pathWithoutVersion = pathWithVersion.replace(/^v\d+\//, '');
            const publicId = pathWithoutVersion.replace(/\.[^.]+$/, '');

            return publicId;
        } catch {
            return null;
        }
    }
}
