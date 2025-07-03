type Duration = `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`;

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Check if Redis environment variables are set
const hasRedisConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize Redis client only if environment variables are set
const redis = hasRedisConfig
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!
    })
  : null;

// Create rate limiters only if Redis is available
export const apiLimiter = hasRedisConfig
  ? new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 seconds
      analytics: true,
      prefix: '@upstash/ratelimit'
    })
  : null;

export const globalLimiter = hasRedisConfig
  ? new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(50, '1 m'), // 1 minute
      analytics: true,
      prefix: '@upstash/ratelimit'
    })
  : null;

// Factory function to create rate limiters
export function createRateLimit(requests: number, window: Duration, prefix?: string) {
  if (!hasRedisConfig) {
    console.warn('Redis not configured, rate limiting disabled');
    return null;
  }

  return new Ratelimit({
    redis: redis!,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix: prefix || '@upstash/ratelimit'
  });
}
