import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '@/app/middleware';
import { createRateLimit } from '@/utils/rateLimit';
import { validateCSRFRequest } from '@/utils/csrf';
import { validateAuthRequest } from '@/utils/auth';
import { validateJWT } from '@/utils/auth';
import { detectBot } from '@/utils/botDetection';
import { validateOrigin } from '@/utils/originValidation';
import { validateCSRFToken } from '@/utils/csrf';

// Mock dependencies
jest.mock('@/utils/rateLimit', () => ({
  createRateLimit: jest.fn(() => ({
    check: jest.fn().mockResolvedValue(true)
  }))
}));

jest.mock('@/utils/csrf', () => ({
  validateCSRFRequest: jest.fn()
}));

jest.mock('@/utils/auth', () => ({
  validateAuthRequest: jest.fn()
}));

jest.mock('@/utils/auth');
jest.mock('@/utils/botDetection');
jest.mock('@/utils/originValidation');
jest.mock('@/utils/csrf');

// Mock process.env
const originalEnv = process.env;

describe('Middleware', () => {
  let mockRequest: NextRequest;
  let mockResponse: NextResponse;

  beforeEach(() => {
    mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
      method: 'POST',
      headers: {
        authorization: 'Bearer valid.jwt.token',
        'x-csrf-token': 'valid.csrf.token',
        origin: 'https://rescuepcrepairs.com',
        'user-agent': 'Mozilla/5.0'
      }
    });

    mockResponse = new NextResponse();

    (validateJWT as jest.Mock).mockReturnValue(true);
    (validateCSRFToken as jest.Mock).mockReturnValue(true);
    (validateOrigin as jest.Mock).mockReturnValue(true);
    (detectBot as jest.Mock).mockReturnValue(false);
    (createRateLimit as jest.Mock).mockReturnValue({
      check: jest.fn().mockResolvedValue(true)
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow valid requests', async () => {
    const response = await middleware(mockRequest);
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  });

  it('should block requests without authorization', async () => {
    mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
      method: 'POST',
      headers: {
        'x-csrf-token': 'valid.csrf.token',
        origin: 'https://rescuepcrepairs.com',
        'user-agent': 'Mozilla/5.0'
      }
    });

    const response = await middleware(mockRequest);
    expect(response.status).toBe(401);
  });

  it('should block requests with invalid JWT', async () => {
    (validateJWT as jest.Mock).mockReturnValue(false);

    const response = await middleware(mockRequest);
    expect(response.status).toBe(401);
  });

  it('should block requests without CSRF token', async () => {
    mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
      method: 'POST',
      headers: {
        authorization: 'Bearer valid.jwt.token',
        origin: 'https://rescuepcrepairs.com',
        'user-agent': 'Mozilla/5.0'
      }
    });

    const response = await middleware(mockRequest);
    expect(response.status).toBe(403);
  });

  it('should block requests with invalid CSRF token', async () => {
    (validateCSRFToken as jest.Mock).mockReturnValue(false);

    const response = await middleware(mockRequest);
    expect(response.status).toBe(403);
  });

  it('should block requests from invalid origins', async () => {
    (validateOrigin as jest.Mock).mockReturnValue(false);

    const response = await middleware(mockRequest);
    expect(response.status).toBe(403);
  });

  it('should block bot traffic', async () => {
    (detectBot as jest.Mock).mockReturnValue(true);

    const response = await middleware(mockRequest);
    expect(response.status).toBe(403);
  });

  it('should block rate-limited requests', async () => {
    (createRateLimit as jest.Mock).mockReturnValue({
      check: jest.fn().mockRejectedValue(new Error('Rate limit exceeded'))
    });

    const response = await middleware(mockRequest);
    expect(response.status).toBe(429);
  });

  it('should allow GET requests without CSRF token', async () => {
    mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
      method: 'GET',
      headers: {
        authorization: 'Bearer valid.jwt.token',
        origin: 'https://rescuepcrepairs.com',
        'user-agent': 'Mozilla/5.0'
      }
    });

    const response = await middleware(mockRequest);
    expect(response.status).not.toBe(403);
  });

  it('should set security headers', async () => {
    const response = await middleware(mockRequest);

    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
    expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
    expect(response.headers.get('Strict-Transport-Security')).toBe(
      'max-age=31536000; includeSubDomains'
    );
  });

  it('should handle public routes without authentication', async () => {
    mockRequest = new NextRequest('https://rescuepcrepairs.com/api/public', {
      method: 'GET',
      headers: {
        origin: 'https://rescuepcrepairs.com',
        'user-agent': 'Mozilla/5.0'
      }
    });

    const response = await middleware(mockRequest);
    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  });

  it('should block requests with suspicious patterns', async () => {
    mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
      method: 'POST',
      headers: {
        authorization: 'Bearer valid.jwt.token',
        'x-csrf-token': 'valid.csrf.token',
        origin: 'https://rescuepcrepairs.com',
        'user-agent': 'Mozilla/5.0',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: "'; DROP TABLE users; --"
      })
    });

    const response = await middleware(mockRequest);
    expect(response.status).toBe(403);
  });
});

describe('Security Middleware', () => {
  let mockRequest: NextRequest;
  let mockResponse: NextResponse;

  beforeEach(() => {
    jest.resetAllMocks();
    // Reset process.env before each test
    process.env = { ...originalEnv };
    mockRequest = new NextRequest('https://rescuepcrepairs.com/api/endpoint', {
      headers: new Headers({
        'x-csrf-token': 'valid-token',
        authorization: 'Bearer valid.jwt.token'
      })
    });
    mockResponse = new NextResponse();
  });

  afterEach(() => {
    // Restore process.env after each test
    process.env = originalEnv;
  });

  describe('Security Headers', () => {
    it('should set all required security headers', async () => {
      const response = await middleware(mockRequest);
      const headers = response.headers;

      // Content Security Policy
      expect(headers.get('Content-Security-Policy')).toBe(
        "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; " +
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
          "img-src 'self' data: https:; " +
          "font-src 'self' https://fonts.gstatic.com; " +
          "connect-src 'self' https://api.stripe.com; " +
          "frame-src 'self' https://js.stripe.com; " +
          "object-src 'none'; " +
          "base-uri 'self'; " +
          "form-action 'self';"
      );

      // HSTS
      expect(headers.get('Strict-Transport-Security')).toBe(
        'max-age=31536000; includeSubDomains; preload'
      );

      // Frame protection
      expect(headers.get('X-Frame-Options')).toBe('DENY');

      // XSS protection
      expect(headers.get('X-XSS-Protection')).toBe('1; mode=block');

      // Content type options
      expect(headers.get('X-Content-Type-Options')).toBe('nosniff');

      // Referrer policy
      expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');

      // Permissions policy
      expect(headers.get('Permissions-Policy')).toBe(
        'camera=(), microphone=(), geolocation=(), payment=(self), usb=(), ' +
          'magnetometer=(), accelerometer=(), gyroscope=(), ' +
          'midi=(), sync-xhr=(self), fullscreen=(self)'
      );

      // Cross-Origin policies
      expect(headers.get('Cross-Origin-Opener-Policy')).toBe('same-origin');
      expect(headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin');
      expect(headers.get('Cross-Origin-Embedder-Policy')).toBe('require-corp');
    });

    it('should handle CSP nonces correctly', async () => {
      const response = await middleware(mockRequest);
      const csp = response.headers.get('Content-Security-Policy');

      expect(csp).toContain("'nonce-");
      const nonce = csp?.match(/'nonce-([^']+)'/)?.[1];
      expect(nonce).toBeDefined();
      expect(nonce?.length).toBeGreaterThanOrEqual(16);
    });

    it('should set appropriate headers for static assets', async () => {
      const staticRequest = new NextRequest('https://rescuepcrepairs.com/images/logo.png');
      const response = await middleware(staticRequest);
      const headers = response.headers;

      expect(headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
      expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
    });

    it('should set appropriate headers for API endpoints', async () => {
      const apiRequest = new NextRequest('https://rescuepcrepairs.com/api/data');
      const response = await middleware(apiRequest);
      const headers = response.headers;

      expect(headers.get('Cache-Control')).toBe('no-store, no-cache, must-revalidate');
      expect(headers.get('Pragma')).toBe('no-cache');
      expect(headers.get('Expires')).toBe('0');
    });
  });

  describe('CSP Report-Only Mode', () => {
    it('should set CSP in report-only mode for development', async () => {
      // Use Object.defineProperty to set NODE_ENV
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        configurable: true
      });

      const response = await middleware(mockRequest);
      const headers = response.headers;

      expect(headers.get('Content-Security-Policy-Report-Only')).toBeDefined();
      expect(headers.get('Content-Security-Policy')).toBeNull();
    });

    it('should include report-uri in CSP for violation reporting', async () => {
      const response = await middleware(mockRequest);
      const csp = response.headers.get('Content-Security-Policy');

      expect(csp).toContain('report-uri /api/csp-report;');
    });
  });

  describe('Dynamic CSP Rules', () => {
    it('should adjust CSP for pages with Stripe integration', async () => {
      const stripeRequest = new NextRequest('https://rescuepcrepairs.com/checkout');
      const response = await middleware(stripeRequest);
      const csp = response.headers.get('Content-Security-Policy');

      expect(csp).toContain('https://js.stripe.com');
      expect(csp).toContain('https://api.stripe.com');
    });

    it('should adjust CSP for pages with external content', async () => {
      const externalRequest = new NextRequest('https://rescuepcrepairs.com/blog');
      const response = await middleware(externalRequest);
      const csp = response.headers.get('Content-Security-Policy');

      expect(csp).toContain('https://www.youtube-nocookie.com');
      expect(csp).toContain('https://player.vimeo.com');
    });
  });

  describe('Header Validation', () => {
    it('should validate CORS headers', async () => {
      const corsRequest = new NextRequest('https://rescuepcrepairs.com/api/data', {
        headers: new Headers({
          Origin: 'https://trusted-domain.com'
        })
      });
      const response = await middleware(corsRequest);
      const headers = response.headers;

      expect(headers.get('Access-Control-Allow-Origin')).toBe('https://trusted-domain.com');
      expect(headers.get('Access-Control-Allow-Methods')).toBe('GET, POST, OPTIONS');
      expect(headers.get('Access-Control-Allow-Headers')).toBe('Content-Type, Authorization');
      expect(headers.get('Access-Control-Max-Age')).toBe('86400');
    });

    it('should block requests with suspicious headers', async () => {
      const suspiciousRequest = new NextRequest('https://rescuepcrepairs.com/api/data', {
        headers: new Headers({
          'X-Forwarded-Host': 'malicious-site.com'
        })
      });

      const response = await middleware(suspiciousRequest);
      expect(response.status).toBe(400);
    });

    it('should handle missing or malformed headers gracefully', async () => {
      const malformedRequest = new NextRequest('https://rescuepcrepairs.com/api/data', {
        headers: new Headers({
          'Content-Security-Policy': 'invalid-policy'
        })
      });

      const response = await middleware(malformedRequest);
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Security-Policy')).not.toBe('invalid-policy');
    });
  });
});
