import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Request } from 'express';
import { SecurityLog } from './entities/SecurityLog';
import { SecurityEventType } from './enum/SecurityEventType';
import { AppLogger } from '../common/services/logger.service';

/**
 * Security Log Service
 * 
 * Handles audit logging for security-related events.
 */
@Injectable()
export class SecurityLogService {
    constructor(
        @InjectRepository(SecurityLog)
        private readonly securityLogRepository: Repository<SecurityLog>,
        private readonly logger: AppLogger,
    ) { }

    /**
     * Log a security event.
     */
    async log(
        eventType: SecurityEventType,
        options: {
            userId?: string;
            request?: Request;
            sessionId?: string;
            success?: boolean;
            errorMessage?: string;
            metadata?: Record<string, any>;
        } = {},
    ): Promise<SecurityLog> {
        const { userId, request, sessionId, success = true, errorMessage, metadata = {} } = options;

        const log = this.securityLogRepository.create({
            userId,
            eventType,
            ipAddress: request ? this.getClientIp(request) : undefined,
            userAgent: request?.headers['user-agent'],
            sessionId,
            success,
            errorMessage,
            metadata,
        });

        const saved = await this.securityLogRepository.save(log);

        this.logger.debug(
            `Security event logged: ${eventType} for user: ${userId || 'unknown'}`,
            SecurityLogService.name,
        );

        return saved;
    }

    /**
     * Log a successful login event.
     */
    async logLoginSuccess(userId: string, sessionId: string, request: Request): Promise<SecurityLog> {
        return this.log(SecurityEventType.LOGIN_SUCCESS, {
            userId,
            sessionId,
            request,
            metadata: { method: 'email_password' },
        });
    }

    /**
     * Log a failed login event.
     */
    async logLoginFailed(email: string, request: Request, reason: string): Promise<SecurityLog> {
        return this.log(SecurityEventType.LOGIN_FAILED, {
            request,
            success: false,
            errorMessage: reason,
            metadata: { email },
        });
    }

    /**
     * Log an OAuth login event.
     */
    async logOAuthLogin(
        userId: string,
        sessionId: string,
        provider: string,
        request: Request,
        isNewUser: boolean,
    ): Promise<SecurityLog> {
        return this.log(SecurityEventType.LOGIN_SUCCESS, {
            userId,
            sessionId,
            request,
            metadata: { method: 'oauth', provider, isNewUser },
        });
    }

    /**
     * Log a logout event.
     */
    async logLogout(userId: string, sessionId: string, request?: Request): Promise<SecurityLog> {
        return this.log(SecurityEventType.LOGOUT, {
            userId,
            sessionId,
            request,
        });
    }

    /**
     * Log a logout all devices event.
     */
    async logLogoutAll(userId: string, sessionsRevoked: number, request?: Request): Promise<SecurityLog> {
        return this.log(SecurityEventType.LOGOUT_ALL, {
            userId,
            request,
            metadata: { sessionsRevoked },
        });
    }

    /**
     * Log a password change event.
     */
    async logPasswordChange(userId: string, request?: Request): Promise<SecurityLog> {
        return this.log(SecurityEventType.PASSWORD_CHANGE, {
            userId,
            request,
        });
    }

    /**
     * Log a password reset request event.
     */
    async logPasswordResetRequest(email: string, request: Request): Promise<SecurityLog> {
        return this.log(SecurityEventType.PASSWORD_RESET_REQUEST, {
            request,
            metadata: { email },
        });
    }

    /**
     * Log a password reset success event.
     */
    async logPasswordResetSuccess(userId: string, request?: Request): Promise<SecurityLog> {
        return this.log(SecurityEventType.PASSWORD_RESET_SUCCESS, {
            userId,
            request,
        });
    }

    /**
     * Log a session revocation event.
     */
    async logSessionRevoked(userId: string, sessionId: string, request?: Request): Promise<SecurityLog> {
        return this.log(SecurityEventType.SESSION_REVOKED, {
            userId,
            sessionId,
            request,
        });
    }

    /**
     * Log a new device login event.
     */
    async logNewDeviceLogin(userId: string, sessionId: string, request: Request): Promise<SecurityLog> {
        return this.log(SecurityEventType.NEW_DEVICE_LOGIN, {
            userId,
            sessionId,
            request,
        });
    }

    /**
     * Log an OAuth linking event.
     */
    async logOAuthLink(userId: string, provider: string, request?: Request): Promise<SecurityLog> {
        return this.log(SecurityEventType.OAUTH_LINK, {
            userId,
            request,
            metadata: { provider },
        });
    }

    /**
     * Log an OAuth unlinking event.
     */
    async logOAuthUnlink(userId: string, provider: string, request?: Request): Promise<SecurityLog> {
        return this.log(SecurityEventType.OAUTH_UNLINK, {
            userId,
            request,
            metadata: { provider },
        });
    }

    /**
     * Get security logs for a user.
     */
    async getLogsForUser(
        userId: string,
        options: {
            eventTypes?: SecurityEventType[];
            startDate?: Date;
            endDate?: Date;
            limit?: number;
        } = {},
    ): Promise<SecurityLog[]> {
        const { eventTypes, startDate, endDate, limit = 100 } = options;

        const query = this.securityLogRepository
            .createQueryBuilder('log')
            .where('log.userId = :userId', { userId })
            .orderBy('log.createdAt', 'DESC')
            .take(limit);

        if (eventTypes && eventTypes.length > 0) {
            query.andWhere('log.eventType IN (:...eventTypes)', { eventTypes });
        }

        if (startDate && endDate) {
            query.andWhere('log.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
        }

        return query.getMany();
    }

    /**
     * Get recent failed login attempts for an IP.
     */
    async getRecentFailedLogins(
        ipAddress: string,
        windowMinutes: number = 15,
    ): Promise<number> {
        const startTime = new Date(Date.now() - windowMinutes * 60 * 1000);

        const count = await this.securityLogRepository.count({
            where: {
                ipAddress,
                eventType: SecurityEventType.LOGIN_FAILED,
                createdAt: Between(startTime, new Date()),
            },
        });

        return count;
    }

    /**
     * Get client IP address from request.
     */
    private getClientIp(request: Request): string {
        const forwardedFor = request.headers['x-forwarded-for'];
        if (forwardedFor) {
            const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(',')[0];
            return ips.trim();
        }
        return request.ip || request.socket?.remoteAddress || 'unknown';
    }
}
