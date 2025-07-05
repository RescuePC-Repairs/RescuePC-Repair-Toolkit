import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { validateOrigin } from '@/utils/originValidation';

describe('Origin Validation', () => {
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      headers: {
        get: jest.fn((name: string) => {
          const headers: { [key: string]: string } = {
            'origin': 'https://rescuepcrepairs.com',
            'referer': 'https://rescuepcrepairs.com/dashboard'
          };
          return headers[name] || null;
        })
      },
      url: 'https://rescuepcrepairs.com/api/secure'
    };
  });

  describe('validateOrigin', () => {
    it('should allow requests from valid origin', () => {
      const result = validateOrigin(mockRequest);
      expect(result).toBe(true);
    });

    it('should allow requests from valid subdomains', () => {
      mockRequest.headers.get = jest.fn((name: string) => {
        if (name === 'origin') {
          return 'https://app.rescuepcrepairs.com';
        }
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(true);
    });

    it('should reject requests from invalid origins', () => {
      mockRequest.headers.get = jest.fn((name: string) => {
        if (name === 'origin') {
          return 'https://malicious-site.com';
        }
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(false);
    });

    it('should handle missing origin header', () => {
      mockRequest.headers.get = jest.fn(() => null);

      const result = validateOrigin(mockRequest);
      expect(result).toBe(false);
    });

    it('should handle empty origin header', () => {
      mockRequest.headers.get = jest.fn((name: string) => {
        if (name === 'origin') {
          return '';
        }
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(false);
    });

    it('should handle malformed origin URLs', () => {
      mockRequest.headers.get = jest.fn((name: string) => {
        if (name === 'origin') {
          return 'not-a-valid-url';
        }
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(false);
    });

    it('should validate origin against referer', () => {
      mockRequest.headers.get = jest.fn((name: string) => {
        const headers: { [key: string]: string } = {
          'origin': 'https://rescuepcrepairs.com',
          'referer': 'https://rescuepcrepairs.com/dashboard'
        };
        return headers[name] || null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(true);
    });

    it('should handle missing referer header', () => {
      mockRequest.headers.get = jest.fn((name: string) => {
        if (name === 'origin') {
          return 'https://rescuepcrepairs.com';
        }
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(true);
    });

    it('should handle null or undefined headers', () => {
      mockRequest.headers.get = jest.fn(() => null);

      const result = validateOrigin(mockRequest);
      expect(result).toBe(false);
    });

    it('should validate against allowed origins list', () => {
      mockRequest.headers.get = jest.fn((name: string) => {
        if (name === 'origin') {
          return 'https://rescuepcrepairs.com';
        }
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(true);
    });

    it('should handle requests with multiple origin headers', () => {
      mockRequest.headers.get = jest.fn((name: string) => {
        if (name === 'origin') {
          return 'https://rescuepcrepairs.com';
        }
        return null;
      });

      const result = validateOrigin(mockRequest);
      expect(result).toBe(true);
    });
  });
});
