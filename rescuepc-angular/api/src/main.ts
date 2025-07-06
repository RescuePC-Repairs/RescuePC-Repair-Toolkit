/**
 * RescuePC Repairs Express API Server
 * Production-ready with security middleware and all routes
 */

import express from 'express';
import * as path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';

// Import route modules
import { createCheckoutSessionRouter } from './routes/create-checkout-session';
import { validateLicenseRouter } from './routes/validate-license';
import { webhookRouter } from './routes/webhook';
import { enterpriseWebhookRouter } from './routes/enterprise-webhook';
import { healthRouter } from './routes/health';
import { emailCaptureRouter } from './routes/email-capture';
import { testEmailRouter } from './routes/test-email';
import { testWebhookRouter } from './routes/test-webhook';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://fonts.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://fonts.googleapis.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: { policy: "require-corp" },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://rescuepcrepairs.com', 'https://rescue-pc-repairs-multi-os-toolkit-ofrjwva13.vercel.app']
    : ['http://localhost:4200', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// API Routes
app.use('/api/create-checkout-session', createCheckoutSessionRouter);
app.use('/api/validate-license', validateLicenseRouter);
app.use('/api/webhook', webhookRouter);
app.use('/api/enterprise-webhook', enterpriseWebhookRouter);
app.use('/api/health', healthRouter);
app.use('/api/email-capture', emailCaptureRouter);
app.use('/api/test-email', testEmailRouter);
app.use('/api/test-webhook', testWebhookRouter);

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'RescuePC Repairs API', 
    version: '2.0.0',
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`🚀 RescuePC Repairs API listening at http://localhost:${port}/api`);
  console.log(`🔒 Security headers enabled`);
  console.log(`⚡ Rate limiting active`);
});

server.on('error', console.error);

export default app;
