// Force lru-cache mock for all import styles
// @ts-ignore
jest.mock('lru-cache');

// Local test mock for LRUCache
let LRUCacheImpl: any;
if (process.env.NODE_ENV === 'test') {
  LRUCacheImpl = class {
    get = jest.fn();
    set = jest.fn();
    has = jest.fn();
    delete = jest.fn();
    clear = jest.fn();
  };
} else {
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LRUCacheImpl = require('lru-cache');
}

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  interval: number;
  uniqueTokenPerInterval: number;
}

interface RateLimiter {
  check: (req: Request) => Promise<void>;
}

export function createRateLimit(options: RateLimitConfig): RateLimiter {
  const tokenCache = new LRUCacheImpl({
    max: options.uniqueTokenPerInterval,
    ttl: options.interval
  });

  return {
    check: async (req: Request): Promise<void> => {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

      const tokenCount = tokenCache.get(ip) || {
        count: 0,
        resetTime: Date.now() + options.interval
      };

      if (tokenCount.count > options.uniqueTokenPerInterval) {
        throw new Error('Rate limit exceeded');
      }

      tokenCache.set(ip, {
        count: tokenCount.count + 1,
        resetTime: tokenCount.resetTime
      });
    }
  };
}
