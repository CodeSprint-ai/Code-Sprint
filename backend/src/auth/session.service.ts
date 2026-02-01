import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Not } from 'typeorm';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserSession } from '../profile/entities/UserSession';
import { AppLogger } from '../common/services/logger.service';

/**
 * Device information extracted from request.
 */
export interface DeviceInfo {
    device: string;
    browser: string;
    os: string;
    ipAddress: string;
    userAgent: string;
}

/**
 * Session Service
 * 
 * Manages user sessions with DB-backed storage.
 * Each session has its own refresh token for multi-device support.
 */
@Injectable()
export class SessionService {
    private readonly SESSION_EXPIRY_DAYS = parseInt(process.env.SESSION_EXPIRY_DAYS || '7', 10);
    private readonly MAX_SESSIONS_PER_USER = parseInt(process.env.MAX_SESSIONS_PER_USER || '10', 10);

    constructor(
        @InjectRepository(UserSession)
        private readonly sessionRepository: Repository<UserSession>,
        private readonly logger: AppLogger,
    ) { }

    /**
     * Create a new session for a user.
     * Returns the session and plain refresh token.
     */
    async createSession(
        userId: string,
        request: Request,
    ): Promise<{ session: UserSession; refreshToken: string }> {
        this.logger.info(`Creating session for user: ${userId}`, SessionService.name);

        // Generate a cryptographically secure refresh token
        const refreshToken = this.generateRefreshToken();
        const refreshTokenHash = await this.hashToken(refreshToken);

        // Extract device info from request
        const deviceInfo = this.extractDeviceInfo(request);

        // Calculate expiration
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.SESSION_EXPIRY_DAYS);

        // Create session
        const session = this.sessionRepository.create({
            userId,
            refreshTokenHash,
            expiresAt,
            isRevoked: false,
            isCurrent: true,
            ...deviceInfo,
        });

        const savedSession = await this.sessionRepository.save(session);

        // Enforce max sessions per user
        await this.enforceMaxSessions(userId, savedSession.uuid);

        this.logger.info(
            `Session created: ${savedSession.uuid} for user: ${userId}`,
            SessionService.name,
        );

        return { session: savedSession, refreshToken };
    }

    /**
     * Validate a session by ID and refresh token.
     */
    async validateSession(
        sessionId: string,
        refreshToken: string,
    ): Promise<UserSession | null> {
        const session = await this.sessionRepository.findOne({
            where: { uuid: sessionId, isRevoked: false },
            relations: ['user'],
        });

        if (!session) {
            this.logger.warn(`Session not found or revoked: ${sessionId}`, SessionService.name);
            return null;
        }

        // Check expiration
        if (new Date() > session.expiresAt) {
            this.logger.warn(`Session expired: ${sessionId}`, SessionService.name);
            await this.revokeSession(sessionId);
            return null;
        }

        // Validate refresh token
        const isValid = await this.compareTokens(refreshToken, session.refreshTokenHash);
        if (!isValid) {
            this.logger.warn(`Invalid refresh token for session: ${sessionId}`, SessionService.name);
            return null;
        }

        return session;
    }

    /**
     * Rotate refresh token for a session.
     * Generates new token and invalidates old one.
     */
    async rotateRefreshToken(sessionId: string): Promise<{ refreshToken: string; session: UserSession } | null> {
        const session = await this.sessionRepository.findOneBy({ uuid: sessionId, isRevoked: false });

        if (!session) {
            return null;
        }

        // Generate new refresh token
        const refreshToken = this.generateRefreshToken();
        const refreshTokenHash = await this.hashToken(refreshToken);

        // Update session
        session.refreshTokenHash = refreshTokenHash;
        session.lastActiveAt = new Date();

        // Extend expiration
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.SESSION_EXPIRY_DAYS);
        session.expiresAt = expiresAt;

        await this.sessionRepository.save(session);

        this.logger.debug(`Refresh token rotated for session: ${sessionId}`, SessionService.name);

        return { refreshToken, session };
    }

    /**
     * Revoke a specific session.
     */
    async revokeSession(sessionId: string): Promise<boolean> {
        const result = await this.sessionRepository.update(
            { uuid: sessionId },
            { isRevoked: true },
        );

        if (result.affected && result.affected > 0) {
            this.logger.info(`Session revoked: ${sessionId}`, SessionService.name);
            return true;
        }

        return false;
    }

    /**
     * Revoke all sessions for a user, optionally except one.
     */
    async revokeAllSessions(userId: string, exceptSessionId?: string): Promise<number> {
        let result;

        if (exceptSessionId) {
            result = await this.sessionRepository.update(
                { userId, uuid: Not(exceptSessionId), isRevoked: false },
                { isRevoked: true },
            );
        } else {
            result = await this.sessionRepository.update(
                { userId, isRevoked: false },
                { isRevoked: true },
            );
        }

        const count = result.affected || 0;
        this.logger.info(
            `Revoked ${count} sessions for user: ${userId}${exceptSessionId ? ` (except ${exceptSessionId})` : ''}`,
            SessionService.name,
        );

        return count;
    }

    /**
     * Get all active sessions for a user.
     */
    async getUserSessions(userId: string): Promise<UserSession[]> {
        return this.sessionRepository.find({
            where: { userId, isRevoked: false },
            order: { lastActiveAt: 'DESC' },
        });
    }

    /**
     * Get a session by ID.
     */
    async getSessionById(sessionId: string): Promise<UserSession | null> {
        return this.sessionRepository.findOneBy({ uuid: sessionId });
    }

    /**
     * Cleanup expired sessions (scheduled job).
     */
    async cleanupExpiredSessions(): Promise<number> {
        const result = await this.sessionRepository.delete({
            expiresAt: LessThan(new Date()),
        });

        const count = result.affected || 0;
        if (count > 0) {
            this.logger.info(`Cleaned up ${count} expired sessions`, SessionService.name);
        }

        return count;
    }

    /**
     * Update session's last active timestamp.
     */
    async updateLastActive(sessionId: string): Promise<void> {
        await this.sessionRepository.update(
            { uuid: sessionId },
            { lastActiveAt: new Date() },
        );
    }

    /**
     * Extract device information from request.
     */
    private extractDeviceInfo(request: Request): DeviceInfo {
        const userAgent = request.headers['user-agent'] || '';
        const ipAddress = this.getClientIp(request);

        // Parse user agent for device info
        const deviceInfo = this.parseUserAgent(userAgent);

        return {
            device: deviceInfo.device,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            ipAddress,
            userAgent,
        };
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

    /**
     * Parse user agent string for device info.
     */
    private parseUserAgent(userAgent: string): { device: string; browser: string; os: string } {
        let device = 'Unknown Device';
        let browser = 'Unknown Browser';
        let os = 'Unknown OS';

        // Detect OS
        if (userAgent.includes('Windows')) os = 'Windows';
        else if (userAgent.includes('Mac OS')) os = 'macOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

        // Detect Browser
        if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Edg/')) browser = 'Edge';
        else if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';

        // Detect Device Type
        if (userAgent.includes('Mobile')) device = 'Mobile';
        else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) device = 'Tablet';
        else device = 'Desktop';

        return { device, browser, os };
    }

    /**
     * Generate a cryptographically secure refresh token.
     */
    private generateRefreshToken(): string {
        return crypto.randomBytes(64).toString('hex');
    }

    /**
     * Hash a token using bcrypt.
     */
    private async hashToken(token: string): Promise<string> {
        return bcrypt.hash(token, 10);
    }

    /**
     * Compare a plain token with its hash.
     */
    private async compareTokens(plainToken: string, hashedToken: string): Promise<boolean> {
        return bcrypt.compare(plainToken, hashedToken);
    }

    /**
     * Enforce maximum sessions per user by removing oldest sessions.
     */
    private async enforceMaxSessions(userId: string, currentSessionId: string): Promise<void> {
        const sessions = await this.sessionRepository.find({
            where: { userId, isRevoked: false },
            order: { createdAt: 'ASC' },
        });

        if (sessions.length > this.MAX_SESSIONS_PER_USER) {
            const sessionsToRevoke = sessions
                .filter(s => s.uuid !== currentSessionId)
                .slice(0, sessions.length - this.MAX_SESSIONS_PER_USER);

            for (const session of sessionsToRevoke) {
                await this.revokeSession(session.uuid);
                this.logger.info(
                    `Auto-revoked old session ${session.uuid} to enforce max sessions limit`,
                    SessionService.name,
                );
            }
        }
    }
}
