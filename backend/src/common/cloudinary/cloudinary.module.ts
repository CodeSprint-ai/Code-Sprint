import { Module, Global } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.config';
import { CloudinaryService } from './cloudinary.service';
import { AppLogger } from '../services/logger.service';

@Global()
@Module({
    providers: [CloudinaryProvider, CloudinaryService, AppLogger],
    exports: [CloudinaryService],
})
export class CloudinaryModule { }

