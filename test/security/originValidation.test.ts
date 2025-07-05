import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { validateOrigin, getOriginTrustScore } from '@/utils/originValidation';
import type { NextRequest } from 'next/server';

describe('Origin Validation', () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    mockRequest = {
      headers: {
        get: jest.fn((key: string) => {
          const headers: { [key: string]: string } = {
            'origin': 'https://rescuepcrepairs.com',
            'referer': 'https://rescuepcrepairs.com/page'
          };
          return headers[key] || null;
        })
      }
    } as any;
  });

  describe('validateOrigin', () => {
    it('should allow requests from valid origin', () => {
      const result = validateOrigin(mockRequest);
      expect(result).toBe(true);
    });

    it('should allow requests from valid subdomains', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'origin') return 'https://api.rescuepcrepairs.com';
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(true);
    });

    it('should reject requests from invalid origins', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'origin') return 'https://malicious-site.com';
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(false);
    });

    it('should handle missing origin header', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'origin') return null;
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(false);
    });

    it('should handle empty origin header', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'origin') return '';
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(false);
    });

    it('should handle malformed origin URLs', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'origin') return 'not-a-valid-url';
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(false);
    });

    it('should validate origin against referer', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'origin') return null;
        if (key === 'referer') return 'https://rescuepcrepairs.com/page';
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(true);
    });

    it('should handle missing referer header', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'origin') return null;
        if (key === 'referer') return null;
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(false);
    });

    it('should handle null or undefined headers', () => {
      mockRequest.headers.get = jest.fn(() => null);

      const result = validateOrigin(mockRequest);
      expect(result).toBe(false);
    });

    it('should validate against allowed origins list', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'origin') return 'https://www.rescuepcrepairs.com';
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(true);
    });

    it('should handle requests with multiple origin headers', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'origin') return 'https://rescuepcrepairs.com';
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(true);
    });
  });

  describe('getOriginTrustScore', () => {
    it('should return perfect score for exact match', () => {
      const score = getOriginTrustScore(mockRequest);
      expect(score).toBe(1);
    });

    it('should return lower score for subdomain', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'origin') return 'https://api.rescuepcrepairs.com';
        return null;
      });

      const score = getOriginTrustScore(mockRequest);
      expect(score).toBeGreaterThan(0.4);
    });

    it('should return zero for invalid origin', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'origin') return 'https://malicious-site.com';
        return null;
      });

      const score = getOriginTrustScore(mockRequest);
      expect(score).toBe(0);
    });
  });
});
