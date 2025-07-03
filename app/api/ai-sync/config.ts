import { z } from 'zod';

// Environment detection
const isPCloud = process.env.DEPLOYMENT_ENV === 'pcloud';
const isDev = process.env.NODE_ENV === 'development';

// Base URLs for different environments
const getBaseUrl = () => {
  if (isPCloud) {
    return process.env.PCLOUD_SYNC_URL || 'https://pcloud.rescuepcrepairs.com/ai-sync';
  }
  if (isDev) {
    return 'http://localhost:3000/api/ai-sync';
  }
  return 'https://rescuepcrepairs.com/api/ai-sync';
};

// WebSocket URLs for different environments
const getWsUrl = () => {
  if (isPCloud) {
    return process.env.PCLOUD_WS_URL || 'wss://pcloud.rescuepcrepairs.com/ai-sync/ws';
  }
  if (isDev) {
    return 'ws://localhost:3001';
  }
  return 'wss://rescuepcrepairs.com/ws';
};

// Validation schemas
const OperationConfig = z.object({
  type: z.enum(['websocket', 'pull']),
  retry: z.boolean(),
  priority: z.enum(['high', 'medium', 'low']),
  interval: z.number().optional()
});

const SecurityConfig = z.object({
  secretRotation: z.object({
    interval: z.number(),
    gracePeriod: z.number()
  }),
  retryStrategy: z.object({
    maxRetries: z.number(),
    initialDelay: z.number(),
    backoff: z.enum(['exponential', 'linear'])
  }),
  ipWhitelist: z.array(z.string())
});

const HealthConfig = z.object({
  clientPing: z.object({
    interval: z.number(),
    timeout: z.number()
  }),
  metrics: z.object({
    broadcast: z.number(),
    include: z.array(z.string())
  })
});

// Configuration
export const AI_SYNC_CONFIG = {
  deployment: {
    type: isPCloud ? 'pcloud' : isDev ? 'development' : 'production',
    baseUrl: getBaseUrl(),
    syncEnabled: true,
    allowLocalDevelopment: true
  },

  websocket: {
    endpoint: getWsUrl(),
    port: isPCloud ? Number(process.env.PCLOUD_WS_PORT) || 3001 : 3001,
    authentication: {
      headers: {
        'x-ai-client-id': 'Required',
        'x-ai-signature': 'HMAC SHA256',
        'x-timestamp': 'ISO timestamp',
        'x-deployment-type': isPCloud ? 'pcloud' : isDev ? 'development' : 'production'
      }
    }
  },

  security: {
    secretRotation: {
      interval: 24 * 60 * 60 * 1000, // 24 hours
      gracePeriod: 5000 // 5 seconds
    },
    retryStrategy: {
      maxRetries: 3,
      initialDelay: 1000,
      backoff: 'exponential' as const
    },
    ipWhitelist: process.env.ALLOWED_IPS?.split(',') || [],
    pcloudSpecific: {
      requireSignedUrls: true,
      validateOrigin: true,
      allowedOrigins: [
        'https://pcloud.rescuepcrepairs.com',
        'https://rescuepcrepairs.com',
        ...(isDev ? ['http://localhost:3000'] : [])
      ]
    }
  },

  operations: {
    realTime: {
      LICENSE_ACTIVATION: {
        type: 'websocket' as const,
        retry: true,
        priority: 'high' as const
      },
      LICENSE_DEACTIVATION: {
        type: 'websocket' as const,
        retry: true,
        priority: 'high' as const
      },
      PAYMENT_VERIFICATION: {
        type: 'websocket' as const,
        retry: true,
        priority: 'high' as const
      }
    },
    interval: {
      license_status: {
        type: 'pull' as const,
        interval: 5 * 60 * 1000, // 5 minutes
        retry: true,
        priority: 'medium' as const
      },
      payment_status: {
        type: 'pull' as const,
        interval: 5 * 60 * 1000, // 5 minutes
        retry: true,
        priority: 'medium' as const
      },
      email_delivery: {
        type: 'pull' as const,
        interval: 15 * 60 * 1000, // 15 minutes
        retry: true,
        priority: 'medium' as const
      },
      webhook_health: {
        type: 'pull' as const,
        interval: 60 * 60 * 1000, // 1 hour
        retry: true,
        priority: 'low' as const
      }
    },
    pcloudSync: {
      enabled: true,
      syncInterval: 5 * 60 * 1000, // 5 minutes
      retryOnFailure: true,
      maxRetries: 3,
      backupToLocal: true
    }
  },

  health: {
    clientPing: {
      interval: 30 * 1000, // 30 seconds
      timeout: 30 * 1000 // 30 seconds
    },
    metrics: {
      broadcast: 5 * 1000, // 5 seconds
      include: [
        'clientCount',
        'successRate',
        'responseTime',
        'errorRate',
        'memoryUsage',
        'cpuUsage',
        'pcloudSyncStatus'
      ]
    }
  }
};

// Type-safe config validation
export type AIConfig = typeof AI_SYNC_CONFIG;
export const validateConfig = () => {
  SecurityConfig.parse(AI_SYNC_CONFIG.security);
  HealthConfig.parse(AI_SYNC_CONFIG.health);

  // Validate all operations
  Object.values(AI_SYNC_CONFIG.operations.realTime).forEach((op) => OperationConfig.parse(op));
  Object.values(AI_SYNC_CONFIG.operations.interval).forEach((op) => OperationConfig.parse(op));
};
