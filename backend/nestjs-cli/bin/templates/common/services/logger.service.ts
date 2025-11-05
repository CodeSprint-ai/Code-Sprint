import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLogger {
    private readonly logger = new Logger('AppLogger');

    info(message: string, context?: string) {
        this.logger.log(message, context);
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, context);
    }

    error(message: string, trace?: string, context?: string) {
        this.logger.error(message, trace, context);
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, context);
    }
}
