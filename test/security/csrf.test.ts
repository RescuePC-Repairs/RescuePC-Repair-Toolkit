import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { generateCSRFToken, validateCSRFToken } from '@/utils/csrf';

describe('CSRF Protection', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      CSRF_SECRET: 'test-csrf-secret'
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('generateCSRFToken', () => {
    it('should generate a valid token', () => {
      const token = generateCSRFToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate unique tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      expect(token1).not.toBe(token2);
    });

    it('should include timestamp in token', () => {
      const token = generateCSRFToken();
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      expect(decoded).toHaveProperty('timestamp');
      expect(typeof decoded.timestamp).toBe('number');
    });

    it('should include signature in token', () => {
      const token = generateCSRFToken();
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      expect(decoded).toHaveProperty('signature');
      expect(typeof decoded.signature).toBe('string');
    });

    it('should throw error if CSRF_SECRET is not set', () => {
      delete process.env.CSRF_SECRET;
      expect(() => generateCSRFToken()).toThrow('CSRF_SECRET environment variable is required');
    });
  });

  describe('validateCSRFToken', () => {
    it('should validate a freshly generated token', () => {
      const token = generateCSRFToken();
      expect(validateCSRFToken(token)).toBe(true);
    });

    it('should reject invalid tokens', () => {
      expect(validateCSRFToken('invalid-token')).toBe(false);
    });

    it('should reject expired tokens', () => {
      // Mock Date.now to generate an old token
      const realDateNow = Date.now;
      Date.now = jest.fn(() => 1577836800000); // 2020-01-01
      const oldToken = generateCSRFToken();

      // Restore Date.now and validate token
      Date.now = jest.fn(() => 1577923200000); // 2020-01-02
      expect(validateCSRFToken(oldToken)).toBe(false);

      // Cleanup
      Date.now = realDateNow;
    });

    it('should reject tokens with invalid signatures', () => {
      const token = generateCSRFToken();
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      decoded.signature = 'invalid-signature';
      const tamperedToken = Buffer.from(JSON.stringify(decoded)).toString('base64');
      expect(validateCSRFToken(tamperedToken)).toBe(false);
    });

    it('should reject tokens with future timestamps', () => {
      // Mock Date.now to generate a future token
      const realDateNow = Date.now;
      Date.now = jest.fn(() => 1577923200000); // 2020-01-02
      const futureToken = generateCSRFToken();

      // Restore Date.now and validate token
      Date.now = jest.fn(() => 1577836800000); // 2020-01-01
      expect(validateCSRFToken(futureToken)).toBe(false);

      // Cleanup
      Date.now = realDateNow;
    });

    it('should reject malformed tokens', () => {
      const malformedTokens = [
        '',
        'not-base64',
        Buffer.from('{"invalid": "json"}').toString('base64'),
        Buffer.from('{"token": "value", "timestamp": "not-a-number"}').toString('base64'),
        Buffer.from('{"token": "value", "timestamp": 123}').toString('base64'), // Missing signature
        Buffer.from('{"signature": "value", "timestamp": 123}').toString('base64'), // Missing token
        Buffer.from('{"token": "value", "signature": "value"}').toString('base64') // Missing timestamp
      ];

      malformedTokens.forEach((token) => {
        expect(validateCSRFToken(token)).toBe(false);
      });
    });

    it('should handle null or undefined tokens', () => {
      expect(validateCSRFToken(null as unknown as string)).toBe(false);
      expect(validateCSRFToken(undefined as unknown as string)).toBe(false);
    });

    it('should throw error if CSRF_SECRET is not set', () => {
      delete process.env.CSRF_SECRET;
      const token = generateCSRFToken(); // Generate token while secret is still set
      process.env.CSRF_SECRET = undefined;
      expect(() => validateCSRFToken(token)).toThrow(
        'CSRF_SECRET environment variable is required'
      );
    });
  });
});
