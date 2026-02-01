import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AppLogger } from '../../common/services/logger.service';

/**
 * Rate limit configuration.
 */
export interface RateLimitConfig {
    /** Maximum number of requests allowed in the window */
    maxAttempts: number;
    /** Window duration in seconds */
    windowSeconds: number;
    /** Custom key generator (default: IP-based) */
    keyGenerator?: (request: Request) => string;
}

/**
 * Decorator to apply rate limiting to a route.
 */
export const RATE_LIMIT_KEY = 'rateLimit';
export const RateLimit = (config: RateLimitConfig) => {
    return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
        if (descriptor) {
            Reflect.defineMetadata(RATE_LIMIT_KEY, config, descriptor.value);
        }
    };
};

/**
 * In-memory store for rate limiting.
 * In production, consider using Redis for distributed rate limiting.
 */
interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetAt < now) {
            rateLimitStore.delete(key);
        }
    }
}, 60000); // Cleanup every minute

/**
 * Rate Limiter Guard
 * 
 * Implements rate limiting to protect against brute-force attacks.
 * Uses in-memory storage (use Redis for production/distributed systems).
 */
@Injectable()
export class RateLimiterGuard implements CanActivate {
    // Default limits from environment or fallbacks
    private readonly defaultMaxAttempts = parseInt(process.env.RATE_LIMIT_LOGIN_MAX || '5', 10);
    private readonly defaultWindowSeconds = parseInt(process.env.RATE_LIMIT_LOGIN_WINDOW_SECONDS || '900', 10);

    constructor(
        private readonly reflector: Reflector,
        private readonly logger: AppLogger,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        // Get rate limit config from decorator or use defaults
        const config = this.reflector.get<RateLimitConfig>(
            RATE_LIMIT_KEY,
            context.getHandler(),
        ) || {
            maxAttempts: this.defaultMaxAttempts,
            windowSeconds: this.defaultWindowSeconds,
        };

        // Generate rate limit key
        const key = config.keyGenerator
            ? config.keyGenerator(request)
            : this.getDefaultKey(request);

        const now = Date.now();
        const windowMs = config.windowSeconds * 1000;

        // Get or create entry
        let entry = rateLimitStore.get(key);

        if (!entry || entry.resetAt < now) {
            // Create new entry
            entry = {
                count: 1,
                resetAt: now + windowMs,
            };
            rateLimitStore.set(key, entry);
            return true;
        }

        // Increment count
        entry.count++;

        if (entry.count > config.maxAttempts) {
            const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);

            this.logger.warn(
                `Rate limit exceeded for key: ${key}, attempts: ${entry.count}`,
                RateLimiterGuard.name,
            );

            throw new HttpException(
                {
                    statusCode: HttpStatus.TOO_MANY_REQUESTS,
                    message: 'Too many requests. Please try again later.',
                    retryAfter: retryAfterSeconds,
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        return true;
    }

    /**
     * Get default rate limit key based on IP and route.
     */
    private getDefaultKey(request: Request): string {
        const ip = this.getClientIp(request);
        const route = request.route?.path || request.path;
        return `rate_limit:${ip}:${route}`;
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

/**
 * Helper to create rate limit key that includes both IP and user identifier.
 */
export const createUserRateLimitKey = (identifier: string) => {
    return (request: Request): string => {
        const ip = request.headers['x-forwarded-for']?.[0] || request.ip || 'unknown';
        return `rate_limit:${ip}:${identifier}`;
    };
};
