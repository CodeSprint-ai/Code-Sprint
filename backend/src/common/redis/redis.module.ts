import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Global Redis module providing an ioredis client for caching.
 * Separate from Bull's Redis connection — used for AI analysis caching.
 */
@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });

        redis.on('error', (err) => {
          console.error('[RedisModule] Connection error:', err.message);
        });

        redis.connect().catch((err) => {
          console.error('[RedisModule] Failed to connect:', err.message);
        });

        return redis;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
