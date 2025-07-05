import { test, expect } from '@playwright/test';
import { securityConfig } from '../../config/security';

test.describe('Security Headers and CSP', () => {
  test('should have all required security headers', async ({ page }) => {
    // Visit the homepage
    await page.goto('/');

    // Get response headers
    const response = await page.waitForResponse((response) => response.url().includes('/'));
    const headers = response.headers();

    // Test security headers
    expect(headers['strict-transport-security']).toBe(
      'max-age=31536000; includeSubDomains; preload'
    );
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-xss-protection']).toBe('1; mode=block');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('geolocation=()');
    expect(headers['x-permitted-cross-domain-policies']).toBe('none');
    expect(headers['cross-origin-embedder-policy']).toBe('require-corp');
    expect(headers['cross-origin-opener-policy']).toBe('same-origin');
    expect(headers['cross-origin-resource-policy']).toBe('same-origin');

    // Test CSP header
    const csp = headers['content-security-policy'];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com");
    expect(csp).toContain("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com");
    expect(csp).toContain("img-src 'self' data: https:");
    expect(csp).toContain("font-src 'self' https://fonts.gstatic.com");
    expect(csp).toContain("connect-src 'self' https://api.stripe.com");
  });
});

test.describe('Rate Limiting', () => {
  test('should rate limit excessive requests', async ({ request }) => {
    const maxRequests = securityConfig.rateLimit.max;
    const responses = [];

    // Make requests up to the limit
    for (let i = 0; i < maxRequests + 1; i++) {
      const response = await request.get('/');
      responses.push(response);
    }

    // The last request should be rate limited
    const lastResponse = responses[responses.length - 1];
    if (!lastResponse) {
      throw new Error('No response received');
    }
    expect(lastResponse.status()).toBe(429);

    const body = await lastResponse.json();
    expect(body.error).toBe('Too many requests');
    expect(body.retryAfter).toBeDefined();
  });

  test('should reset rate limit after window expires', async ({ request }) => {
    const maxRequests = securityConfig.rateLimit.max;

    // Make requests up to the limit
    for (let i = 0; i < maxRequests; i++) {
      await request.get('/');
    }

    // Wait for rate limit window to expire
    await new Promise((resolve) => setTimeout(resolve, securityConfig.rateLimit.windowMs));

    // Should be able to make another request
    const response = await request.get('/');
    expect(response.status()).toBe(200);
  });
});

test.describe('CSRF Protection', () => {
  test('should reject POST requests without CSRF token', async ({ request }) => {
    const response = await request.post('/api/email-capture', {
      data: {
        email: 'test@example.com',
        name: 'Test User'
      }
    });

    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.error).toBe('Invalid CSRF token');
  });

  test('should accept POST requests with valid CSRF token', async ({ page, request }) => {
    // First get a valid session and CSRF token
    await page.goto('/');
    const sessionToken = await page.evaluate(() => {
      return document.cookie.match(/sessionToken=([^;]+)/)?.[1];
    });

    const csrfToken = await page.evaluate(() => {
      return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    });

    expect(sessionToken).toBeDefined();
    expect(csrfToken).toBeDefined();

    // Make POST request with CSRF token
    const response = await request.post('/api/email-capture', {
      data: {
        email: 'test@example.com',
        name: 'Test User'
      },
      headers: {
        'X-CSRF-Token': csrfToken!,
        Cookie: `sessionToken=${sessionToken}`
      }
    });

    expect(response.status()).toBe(200);
  });
});

test.describe('Input Validation and Sanitization', () => {
  test('should sanitize and validate email input', async ({ request }) => {
    const response = await request.post('/api/email-capture', {
      data: {
        email: ' TEST@EXAMPLE.COM ',
        name: ' Test User '
      },
      headers: {
        'X-CSRF-Token': 'test-token',
        Cookie: 'sessionToken=test-session'
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.sanitizedEmail).toBe('test@example.com');
    expect(body.sanitizedName).toBe('Test User');
  });

  test('should reject invalid email formats', async ({ request }) => {
    const response = await request.post('/api/email-capture', {
      data: {
        email: 'invalid-email',
        name: 'Test User'
      },
      headers: {
        'X-CSRF-Token': 'test-token',
        Cookie: 'sessionToken=test-session'
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Invalid input');
    expect(body.details).toContain('Invalid email format');
  });
});
