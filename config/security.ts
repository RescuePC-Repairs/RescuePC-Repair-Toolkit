// import type { SecurityConfig } from '@/types/security';
import '@/types/env';

declare const process: {
  env: {
    NODE_ENV?: string;
    JWT_SECRET?: string;
    SESSION_SECRET?: string;
    COOKIE_DOMAIN?: string;
    RATE_LIMIT_MAX?: string;
    RATE_LIMIT_WINDOW_MS?: string;
    CSP_REPORT_URI?: string;
    CORS_ALLOWED_ORIGINS?: string;
    BOT_DETECTION_THRESHOLD?: string;
    ORIGIN_TRUST_SCORE_THRESHOLD?: string;
    LOG_LEVEL?: string;
    SECURITY_AUDIT_ENABLED?: string;
    SECURITY_HEADERS_STRICT?: string;
    HSTS_MAX_AGE?: string;
    ALLOWED_ORIGINS?: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    SUPPORT_EMAIL?: string;
    BUSINESS_EMAIL?: string;
    WEBHOOK_DOMAIN?: string;
    NEXT_PUBLIC_DOMAIN?: string;
    PCLOUD_DOWNLOAD_LINK?: string;
    GMAIL_APP_PASSWORD?: string;
  };
};

const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-session-secret';
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
const CSP_REPORT_URI = process.env.CSP_REPORT_URI;
const CORS_ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000'
];
const BOT_DETECTION_THRESHOLD = parseFloat(process.env.BOT_DETECTION_THRESHOLD || '0.8');
const ORIGIN_TRUST_SCORE_THRESHOLD = parseFloat(process.env.ORIGIN_TRUST_SCORE_THRESHOLD || '0.7');
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const SECURITY_AUDIT_ENABLED = process.env.SECURITY_AUDIT_ENABLED === 'true';
const SECURITY_HEADERS_STRICT = process.env.SECURITY_HEADERS_STRICT === 'true';
const HSTS_MAX_AGE = parseInt(process.env.HSTS_MAX_AGE || '31536000', 10);
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || '';

export const securityConfig = {
  rateLimit: {
    max: 10,
    windowMs: 10000, // 10 seconds
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false
  },
  csrf: {
    tokenLength: 32,
    cookieName: 'XSRF-TOKEN',
    headerName: 'X-CSRF-Token'
  },
  cors: {
    origin: 'https://rescuepcrepairs.com',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
    credentials: true
  },
  headers: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://js.stripe.com'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'", 'https://checkout.stripe.com'],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: true
      }
    },
    strictTransportSecurity: {
      maxAge: 63072000,
      includeSubDomains: true,
      preload: SECURITY_HEADERS_STRICT
    },
    permissionsPolicy: {
      features: {
        camera: [],
        microphone: [],
        geolocation: [],
        payment: [],
        fullscreen: ["'self'"]
      }
    }
  },
  auth: {
    jwtSecret: JWT_SECRET,
    jwtExpiresIn: '1h',
    passwordMinLength: 12,
    passwordMaxLength: 128,
    passwordRequirements: {
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }
  },
  session: {
    name: 'sid',
    secret: SESSION_SECRET,
    cookie: {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
      path: '/',
      domain: COOKIE_DOMAIN
    }
  },
  botDetection: {
    enabled: true,
    threshold: BOT_DETECTION_THRESHOLD,
    blockSuspectedBots: SECURITY_HEADERS_STRICT
  },
  originValidation: {
    enabled: true,
    trustScoreThreshold: ORIGIN_TRUST_SCORE_THRESHOLD,
    blockUntrustedOrigins: SECURITY_HEADERS_STRICT
  },
  logging: {
    level: LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error',
    format: 'json',
    securityEvents: SECURITY_AUDIT_ENABLED,
    auditTrail: SECURITY_AUDIT_ENABLED,
    sensitiveFields: ['password', 'token', 'secret', 'credit_card', 'ssn']
  },
  forceHttps: NODE_ENV === 'production',
  tlsVersion: '1.3',
  hstsMaxAge: HSTS_MAX_AGE,
  hstsIncludeSubdomains: true,
  hstsPreload: true,
  cspEnabled: true,
  cspReportOnly: NODE_ENV !== 'production',
  cspDirectives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https:'],
    styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
    imgSrc: ["'self'", 'data:', 'https:'],
    fontSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https:'],
    mediaSrc: ["'self'", 'https:'],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"]
  },
  corsEnabled: true,
  allowedOrigins: ALLOWED_ORIGINS.split(','),
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  corsMaxAge: 86400,
  rateLimiting: {
    enabled: true,
    windowMs: 60 * 1000,
    maxRequests: 100,
    burstLimit: 10,
    burstWindow: 1000,
    ipWhitelist: new Set(['127.0.0.1']),
    blockDuration: 3600000,
    notifyOnBlock: true
  },
  authTokenExpiry: 1800,
  refreshTokenExpiry: 86400,
  encryptionAlgorithm: 'aes-256-gcm',
  keyDerivationIterations: 2000000,
  saltLength: 64,
  ivLength: 16,
  authTagLength: 16,
  securityMeasures: {
    enforceHttps: true,
    requireStrongPasswords: true,
    enableBruteForceProtection: true,
    enableAuditLogging: true,
    enableRealTimeAlerts: true,
    maxLoginAttempts: 5,
    lockoutDuration: 900000,
    passwordRequirements: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      preventPasswordReuse: true,
      passwordHistory: 10
    }
  },
  stripe: {
    webhookUrl: process.env.WEBHOOK_DOMAIN
      ? `https://${process.env.WEBHOOK_DOMAIN}/api/webhook/stripe`
      : 'http://localhost:3000/api/webhook/stripe',
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },
  email: {
    sender: process.env.SUPPORT_EMAIL || '***REMOVED***',
    replyTo: process.env.BUSINESS_EMAIL || '***REMOVED***',
    appPassword: process.env.GMAIL_APP_PASSWORD
  },
  license: {
    prefix: 'RPCR',
    format: 'XXXX-XXXX-XXXX-XXXX',
    keyLength: 16,
    packages: {
      basic: { count: 1, name: 'Basic License' },
      professional: { count: 5, name: 'Professional License' },
      enterprise: { count: 25, name: 'Enterprise License' },
      government: { count: 100, name: 'Government License' },
      lifetime: { count: -1, name: 'Lifetime Enterprise' }
    }
  },
  domain: {
    main: process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000',
    webhook: process.env.WEBHOOK_DOMAIN
  },
  download: {
    url: process.env.PCLOUD_DOWNLOAD_LINK
  }
} as any;

// Validate configuration at runtime
function validateConfig(config: any): void {
  // Validate rate limiting
  if (config.rateLimit.windowMs < 1000) {
    throw new Error('Rate limit window must be at least 1 second');
  }
  if (config.rateLimit.max < 1) {
    throw new Error('Rate limit max must be at least 1');
  }

  // Validate CSRF
  if (config.csrf.tokenLength < 32) {
    throw new Error('CSRF token length must be at least 32 characters');
  }

  // Validate auth
  if (config.auth.passwordMinLength < 12) {
    throw new Error('Password minimum length must be at least 12 characters');
  }
  if (config.auth.passwordMaxLength < config.auth.passwordMinLength) {
    throw new Error('Password maximum length must be greater than minimum length');
  }

  // Validate bot detection
  if (config.botDetection.threshold < 0 || config.botDetection.threshold > 1) {
    throw new Error('Bot detection threshold must be between 0 and 1');
  }

  // Validate origin trust score
  if (
    config.originValidation.trustScoreThreshold < 0 ||
    config.originValidation.trustScoreThreshold > 1
  ) {
    throw new Error('Origin trust score threshold must be between 0 and 1');
  }
}

// Validate configuration
validateConfig(securityConfig);

export type Config = typeof securityConfig;

// Utility functions
export function getCSPDirectives(nonce?: string): string {
  const cspDirectives = securityConfig.cspDirectives as any;
  const directives = { ...cspDirectives };

  if (nonce) {
    directives.scriptSrc = [...directives.scriptSrc, `'nonce-${nonce}'`];
  }

  // Add upgrade-insecure-requests for HTTPS enforcement
  directives.upgradeInsecureRequests = true;

  return Object.entries(directives)
    .map(([key, values]) => {
      const directive = key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
      if (typeof values === 'boolean') {
        return values ? directive : '';
      }
      return `${directive} ${(values as string[]).join(' ')}`;
    })
    .filter(Boolean)
    .join('; ');
}

export function getCORSHeaders(origin?: string | null): Record<string, string> {
  const { allowedMethods, allowedHeaders, corsMaxAge } = securityConfig;

  // Always allow localhost in development
  const allowedOrigin =
    origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))
      ? origin
      : securityConfig.allowedOrigins.includes(origin || '')
        ? origin
        : null;

  if (!allowedOrigin) {
    return {};
  }

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': allowedMethods.join(', '),
    'Access-Control-Allow-Headers': allowedHeaders.join(', '),
    'Access-Control-Max-Age': corsMaxAge.toString()
  };
}

export function getSecurityHeaders(nonce?: string): Record<string, string> {
  const { hstsMaxAge, hstsIncludeSubdomains, hstsPreload } = securityConfig;

  return {
    'Strict-Transport-Security': [
      `max-age=${hstsMaxAge}`,
      hstsIncludeSubdomains ? 'includeSubDomains' : '',
      hstsPreload ? 'preload' : ''
    ]
      .filter(Boolean)
      .join('; '),
    'Content-Security-Policy': getCSPDirectives(nonce),
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': [
      'accelerometer=()',
      'camera=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'payment=()',
      'usb=()'
    ].join(', '),
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp'
  };
}
