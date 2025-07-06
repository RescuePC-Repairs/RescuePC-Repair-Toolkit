import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

// Rate limiting configurations
export const createRateLimiters = () => {
  // General API rate limiter
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Strict rate limiter for sensitive endpoints
  const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many requests to sensitive endpoint, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Webhook rate limiter (more permissive for Stripe)
  const webhookLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // allow more webhook requests
    message: 'Too many webhook requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  return {
    general: generalLimiter,
    strict: strictLimiter,
    webhook: webhookLimiter,
  };
};

// CORS configuration
export const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? [
          'https://rescuepcrepairs.com',
          'https://rescue-pc-repairs-multi-os-toolkit-ofrjwva13.vercel.app',
          'https://cloud-webhook-handler-6s83chitd-rescuepc-repairs-projects.vercel.app',
        ]
      : [
          'http://localhost:4200',
          'http://localhost:3000',
          'http://localhost:4000',
        ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'stripe-signature',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
};

// Helmet security configuration
export const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'https://fonts.googleapis.com',
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: [
        "'self'",
        'https://api.stripe.com',
        'https://fonts.googleapis.com',
      ],
      frameSrc: ["'self'", 'https://js.stripe.com'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: { policy: 'require-corp' },
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
};

// Input validation middleware
export const validateInput = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /document\./i,
    /window\./i,
  ];

  const body = JSON.stringify(req.body);
  const query = JSON.stringify(req.query);
  const params = JSON.stringify(req.params);

  const allInput = `${body}${query}${params}`;

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(allInput)) {
      return res.status(400).json({
        error: 'Suspicious input detected',
        message: 'Input contains potentially malicious content',
      });
    }
  }

  next();
};

// Request logging middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
    };

    if (res.statusCode >= 400) {
      console.error('❌ Request failed:', logData);
    } else {
      console.log('✅ Request completed:', logData);
    }
  });

  next();
};

// Error handling middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('🚨 Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  // Don't expose internal errors in production
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  res.status(err.status || 500).json({
    error: 'Internal server error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Authentication middleware (placeholder)
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // TODO: Implement actual authentication logic
  // For now, just pass through
  next();
};

// Authorization middleware (placeholder)
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Implement actual authorization logic
    // For now, just pass through
    next();
  };
};

// Webhook signature validation middleware
export const validateWebhookSignature = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const signature = req.headers['stripe-signature'];

  if (!signature) {
    return res.status(400).json({ error: 'Missing webhook signature' });
  }

  // TODO: Implement actual signature validation
  // For now, just pass through
  next();
};
