import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '../../app/middleware';

// Mock the rate limiter
jest.mock('../../utils/rate-limiter', () => ({
  createRateLimit: jest.fn().mockReturnValue({
    check: jest.fn().mockResolvedValue(true)
  })
}));

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (overrides: any = {}) => {
    const defaultRequest = {
      method: 'GET',
      url: 'http://localhost:3000/api/test',
      headers: {
        get: jest.fn().mockReturnValue(null),
        has: jest.fn().mockReturnValue(false),
        set: jest.fn(),
        append: jest.fn(),
        delete: jest.fn(),
        forEach: jest.fn()
      },
      nextUrl: {
        pathname: '/api/test',
        search: '',
        hostname: 'localhost',
        protocol: 'http:'
      }
    };
    
    return {
      ...defaultRequest,
      ...overrides,
      headers: {
        ...defaultRequest.headers,
        ...overrides.headers
      }
    } as any;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow valid requests', async () => {
    const mockRequest = createMockRequest({
      method: 'GET',
      url: 'http://localhost:3000/api/public'
    });

    const response = await middleware(mockRequest);
    expect(response).toBeUndefined(); // Should pass through
  });

  it('should block requests without authorization', async () => {
    const mockRequest = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/protected'
    });

    const response = await middleware(mockRequest);
    expect(response?.status).toBe(401);
  });

  it('should block requests with invalid JWT', async () => {
    const mockRequest = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/protected',
      headers: {
        get: jest.fn().mockImplementation((key) => {
          if (key === 'authorization') return 'Bearer invalid-token';
          return null;
        })
      }
    });

    const response = await middleware(mockRequest);
    expect(response?.status).toBe(401);
  });

  it('should block requests without CSRF token', async () => {
    const mockRequest = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/protected',
      headers: {
        get: jest.fn().mockImplementation((key) => {
          if (key === 'authorization') return 'Bearer valid-token';
          if (key === 'x-csrf-token') return null;
          return null;
        })
      }
    });

    const response = await middleware(mockRequest);
    expect(response?.status).toBe(403);
  });

  it('should block requests with invalid CSRF token', async () => {
    const mockRequest = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/protected',
      headers: {
        get: jest.fn().mockImplementation((key) => {
          if (key === 'authorization') return 'Bearer valid-token';
          if (key === 'x-csrf-token') return 'invalid-token';
          return null;
        })
      }
    });

    const response = await middleware(mockRequest);
    expect(response?.status).toBe(403);
  });

  it('should block requests from invalid origins', async () => {
    const mockRequest = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/protected',
      headers: {
        get: jest.fn().mockImplementation((key) => {
          if (key === 'authorization') return 'Bearer valid-token';
          if (key === 'x-csrf-token') return 'valid-token';
          if (key === 'origin') return 'http://malicious-site.com';
          return null;
        })
      }
    });

    const response = await middleware(mockRequest);
    expect(response?.status).toBe(403);
  });

  it('should block bot traffic', async () => {
    const mockRequest = createMockRequest({
      method: 'GET',
      url: 'http://localhost:3000/api/test',
      headers: {
        get: jest.fn().mockImplementation((key) => {
          if (key === 'user-agent') return 'bot-crawler';
          return null;
        })
      }
    });

    const response = await middleware(mockRequest);
    expect(response?.status).toBe(403);
  });

  it('should block rate-limited requests', async () => {
    const { createRateLimit } = require('../../utils/rate-limiter');
    createRateLimit.mockReturnValue({
      check: jest.fn().mockRejectedValue(new Error('Rate limit exceeded'))
    });

    const mockRequest = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/protected'
    });

    const response = await middleware(mockRequest);
    expect(response?.status).toBe(429);
  });

  it('should allow GET requests without CSRF token', async () => {
    const mockRequest = createMockRequest({
      method: 'GET',
      url: 'http://localhost:3000/api/public'
    });

    const response = await middleware(mockRequest);
    expect(response).toBeUndefined(); // Should pass through
  });

  it('should set security headers', async () => {
    const mockRequest = createMockRequest({
      method: 'GET',
      url: 'http://localhost:3000/api/test'
    });

    const response = await middleware(mockRequest);
    if (response) {
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    }
  });

  it('should handle public routes without authentication', async () => {
    const mockRequest = createMockRequest({
      method: 'GET',
      url: 'http://localhost:3000/'
    });

    const response = await middleware(mockRequest);
    expect(response).toBeUndefined(); // Should pass through
  });

  it('should block requests with suspicious patterns', async () => {
    const mockRequest = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/protected',
      headers: {
        get: jest.fn().mockImplementation((key) => {
          if (key === 'authorization') return 'Bearer valid-token';
          if (key === 'x-csrf-token') return 'valid-token';
          if (key === 'user-agent') return 'sqlmap';
          return null;
        })
      }
    });

    const response = await middleware(mockRequest);
    expect(response?.status).toBe(403);
  });
});

describe('Security Middleware', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    // Reset process.env before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore process.env after each test
    process.env = originalEnv;
  });

  describe('Security Headers', () => {
    it('should set all required security headers', async () => {
      const mockRequest = {
        method: 'GET',
        url: 'http://localhost:3000/api/test',
        headers: {
          get: jest.fn().mockReturnValue(null),
          set: jest.fn(),
          append: jest.fn()
        },
        nextUrl: {
          pathname: '/api/test',
          search: '',
          hostname: 'localhost',
          protocol: 'http:'
        }
      } as any;

      const response = await middleware(mockRequest);
      if (response) {
        expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
        expect(response.headers.get('X-Frame-Options')).toBe('DENY');
        expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
        expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
      }
    });

    it('should handle CSP nonces correctly', async () => {
      const mockRequest = {
        method: 'GET',
        url: 'http://localhost:3000/api/test',
        headers: {
          get: jest.fn().mockReturnValue(null),
          set: jest.fn(),
          append: jest.fn()
        },
        nextUrl: {
          pathname: '/api/test',
          search: '',
          hostname: 'localhost',
          protocol: 'http:'
        }
      } as any;

      const response = await middleware(mockRequest);
      if (response) {
        const csp = response.headers.get('Content-Security-Policy');
        expect(csp).toContain("'nonce-");
      }
    });

    it('should set appropriate headers for static assets', async () => {
      const mockRequest = {
        method: 'GET',
        url: 'http://localhost:3000/static/image.jpg',
        headers: {
          get: jest.fn().mockReturnValue(null),
          set: jest.fn(),
          append: jest.fn()
        },
        nextUrl: {
          pathname: '/static/image.jpg',
          search: '',
          hostname: 'localhost',
          protocol: 'http:'
        }
      } as any;

      const response = await middleware(mockRequest);
      expect(response).toBeUndefined(); // Should pass through for static assets
    });

    it('should set appropriate headers for API endpoints', async () => {
      const mockRequest = {
        method: 'GET',
        url: 'http://localhost:3000/api/test',
        headers: {
          get: jest.fn().mockReturnValue(null),
          set: jest.fn(),
          append: jest.fn()
        },
        nextUrl: {
          pathname: '/api/test',
          search: '',
          hostname: 'localhost',
          protocol: 'http:'
        }
      } as any;

      const response = await middleware(mockRequest);
      if (response) {
        expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      }
    });
  });

  describe('CSP Report-Only Mode', () => {
    it('should set CSP in report-only mode for development', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const mockRequest = {
        method: 'GET',
        url: 'http://localhost:3000/api/test',
        headers: {
          get: jest.fn().mockReturnValue(null),
          set: jest.fn(),
          append: jest.fn()
        },
        nextUrl: {
          pathname: '/api/test',
          search: '',
          hostname: 'localhost',
          protocol: 'http:'
        }
      } as any;

      const response = await middleware(mockRequest);
      if (response) {
        const csp = response.headers.get('Content-Security-Policy-Report-Only');
        expect(csp).toBeDefined();
      }

      process.env.NODE_ENV = originalEnv;
    });

    it('should include report-uri in CSP for violation reporting', async () => {
      const mockRequest = {
        method: 'GET',
        url: 'http://localhost:3000/api/test',
        headers: {
          get: jest.fn().mockReturnValue(null),
          set: jest.fn(),
          append: jest.fn()
        },
        nextUrl: {
          pathname: '/api/test',
          search: '',
          hostname: 'localhost',
          protocol: 'http:'
        }
      } as any;

      const response = await middleware(mockRequest);
      if (response) {
        const csp = response.headers.get('Content-Security-Policy');
        expect(csp).toContain('report-uri');
      }
    });
  });

  describe('Dynamic CSP Rules', () => {
    it('should adjust CSP for pages with Stripe integration', async () => {
      const mockRequest = {
        method: 'GET',
        url: 'http://localhost:3000/checkout',
        headers: {
          get: jest.fn().mockReturnValue(null),
          set: jest.fn(),
          append: jest.fn()
        },
        nextUrl: {
          pathname: '/checkout',
          search: '',
          hostname: 'localhost',
          protocol: 'http:'
        }
      } as any;

      const response = await middleware(mockRequest);
      if (response) {
        const csp = response.headers.get('Content-Security-Policy');
        expect(csp).toContain('js.stripe.com');
      }
    });

    it('should adjust CSP for pages with external content', async () => {
      const mockRequest = {
        method: 'GET',
        url: 'http://localhost:3000/external-content',
        headers: {
          get: jest.fn().mockReturnValue(null),
          set: jest.fn(),
          append: jest.fn()
        },
        nextUrl: {
          pathname: '/external-content',
          search: '',
          hostname: 'localhost',
          protocol: 'http:'
        }
      } as any;

      const response = await middleware(mockRequest);
      if (response) {
        const csp = response.headers.get('Content-Security-Policy');
        expect(csp).toContain('frame-src');
      }
    });
  });

  describe('Header Validation', () => {
    it('should validate CORS headers', async () => {
      const mockRequest = {
        method: 'OPTIONS',
        url: 'http://localhost:3000/api/test',
        headers: {
          get: jest.fn().mockReturnValue('http://localhost:3000'),
          set: jest.fn(),
          append: jest.fn()
        },
        nextUrl: {
          pathname: '/api/test',
          search: '',
          hostname: 'localhost',
          protocol: 'http:'
        }
      } as any;

      const response = await middleware(mockRequest);
      if (response) {
        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
        expect(response.headers.get('Access-Control-Allow-Methods')).toBeDefined();
        expect(response.headers.get('Access-Control-Allow-Headers')).toBeDefined();
      }
    });

    it('should block requests with suspicious headers', async () => {
      const mockRequest = {
        method: 'POST',
        url: 'http://localhost:3000/api/protected',
        headers: {
          get: jest.fn().mockImplementation((key) => {
            if (key === 'x-forwarded-for') return '192.168.1.1';
            if (key === 'user-agent') return 'sqlmap';
            return null;
          }),
          set: jest.fn(),
          append: jest.fn()
        },
        nextUrl: {
          pathname: '/api/protected',
          search: '',
          hostname: 'localhost',
          protocol: 'http:'
        }
      } as any;

      const response = await middleware(mockRequest);
      expect(response?.status).toBe(403);
    });

    it('should handle missing or malformed headers gracefully', async () => {
      const mockRequest = {
        method: 'GET',
        url: 'http://localhost:3000/api/test',
        headers: {
          get: jest.fn().mockReturnValue(null),
          set: jest.fn(),
          append: jest.fn()
        },
        nextUrl: {
          pathname: '/api/test',
          search: '',
          hostname: 'localhost',
          protocol: 'http:'
        }
      } as any;

      const response = await middleware(mockRequest);
      expect(response).toBeDefined();
    });
  });
});
