import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { NextRequest } from 'next/server';
import { validateOrigin } from '@/utils/originValidation';

describe('Origin Validation', () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
      headers: {
        origin: 'https://rescuepcrepairs.com',
        referer: 'https://rescuepcrepairs.com/dashboard'
      }
    });
  });

  it('should allow requests from valid origin', () => {
    expect(validateOrigin(mockRequest)).toBe(true);
  });

  it('should allow requests from valid subdomains', () => {
    mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
      headers: {
        origin: 'https://app.rescuepcrepairs.com',
        referer: 'https://app.rescuepcrepairs.com/dashboard'
      }
    });
    expect(validateOrigin(mockRequest)).toBe(true);
  });

  it('should reject requests from invalid origins', () => {
    const invalidOrigins = [
      'https://malicious-site.com',
      'http://rescuepcrepairs.com', // Non-HTTPS
      'https://rescuepcrepairs.com.evil.com',
      'https://fake-rescuepcrepairs.com',
      'data:text/html,<script>alert("xss")</script>',
      'javascript:alert("xss")',
      'file:///etc/passwd'
    ];

    for (const origin of invalidOrigins) {
      mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
        headers: {
          origin: origin,
          referer: origin + '/dashboard'
        }
      });
      expect(validateOrigin(mockRequest)).toBe(false);
    }
  });

  it('should handle missing origin header', () => {
    mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
      headers: {}
    });
    expect(validateOrigin(mockRequest)).toBe(false);
  });

  it('should handle empty origin header', () => {
    mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
      headers: {
        origin: ''
      }
    });
    expect(validateOrigin(mockRequest)).toBe(false);
  });

  it('should handle malformed origin URLs', () => {
    const malformedOrigins = [
      'not-a-url',
      'https://',
      'https://[invalid-ip]',
      'https:///no-host',
      'ftp://rescuepcrepairs.com'
    ];

    for (const origin of malformedOrigins) {
      mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
        headers: {
          origin: origin
        }
      });
      expect(validateOrigin(mockRequest)).toBe(false);
    }
  });

  it('should validate origin against referer', () => {
    mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
      headers: {
        origin: 'https://rescuepcrepairs.com',
        referer: 'https://malicious-site.com'
      }
    });
    expect(validateOrigin(mockRequest)).toBe(false);
  });

  it('should handle missing referer header', () => {
    mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
      headers: {
        origin: 'https://rescuepcrepairs.com'
      }
    });
    expect(validateOrigin(mockRequest)).toBe(true);
  });

  it('should handle null or undefined headers', () => {
    mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
      headers: {
        origin: null as unknown as string,
        referer: undefined as unknown as string
      }
    });
    expect(validateOrigin(mockRequest)).toBe(false);
  });

  it('should validate against allowed origins list', () => {
    const allowedOrigins = [
      'https://rescuepcrepairs.com',
      'https://app.rescuepcrepairs.com',
      'https://api.rescuepcrepairs.com',
      'https://admin.rescuepcrepairs.com'
    ];

    for (const origin of allowedOrigins) {
      mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
        headers: {
          origin: origin,
          referer: `${origin}/dashboard`
        }
      });
      expect(validateOrigin(mockRequest)).toBe(true);
    }
  });

  it('should handle requests with multiple origin headers', () => {
    mockRequest = new NextRequest('https://rescuepcrepairs.com/api/secure', {
      headers: {
        origin: 'https://rescuepcrepairs.com, https://malicious-site.com'
      }
    });
    expect(validateOrigin(mockRequest)).toBe(false);
  });
});
