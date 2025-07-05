import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { generateTokens, validateJWT, hashPassword, verifyPassword } from '@/utils/auth';

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock.jwt.token'),
  verify: jest.fn(() => ({ id: '123', email: 'test@example.com', role: 'user' }))
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashed_password')),
  compare: jest.fn(() => Promise.resolve(true))
}));

describe('Authentication', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    role: 'user'
  };

  const mockSecret = 'rescue_pc_jwt_secret_military_grade_authentication_2024_production';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = mockSecret;
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      const result = generateTokens(mockUser);
      expect(result.accessToken).toBe('mock.jwt.token');
      expect(result.refreshToken).toBe('mock.jwt.token');
    });

    it('should call sign with correct parameters', () => {
      generateTokens(mockUser);

      const { sign } = require('jsonwebtoken');
      expect(sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email, role: mockUser.role },
        mockSecret,
        { expiresIn: '1h' }
      );
    });

    it('should handle missing expiry configuration', () => {
      const originalJwtExpiry = process.env.JWT_EXPIRY;
      process.env.JWT_EXPIRY = undefined;
      generateTokens(mockUser);

      const { sign } = require('jsonwebtoken');
      expect(sign).toHaveBeenCalledWith(
        expect.any(Object),
        mockSecret,
        { expiresIn: '1h' } // Default value
      );
      
      // Restore the environment variable
      process.env.JWT_EXPIRY = originalJwtExpiry;
    });
  });

  describe('validateJWT', () => {
    const mockToken = 'valid-jwt-token';

    it('should validate a valid token', () => {
      const result = validateJWT(mockToken);
      expect(result).toBe(true);
      
      const { verify } = require('jsonwebtoken');
      expect(verify).toHaveBeenCalledWith(mockToken, mockSecret);
    });

    it('should return false for invalid token', () => {
      const { verify } = require('jsonwebtoken');
      verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = validateJWT(mockToken);
      expect(result).toBe(false);
    });

    it('should return false for expired token', () => {
      const { verify } = require('jsonwebtoken');
      verify.mockImplementation(() => {
        throw new Error('TokenExpiredError');
      });

      const result = validateJWT(mockToken);
      expect(result).toBe(false);
    });

    it('should throw error if JWT_SECRET is not set', () => {
      const originalJwtSecret = process.env.JWT_SECRET;
      process.env.JWT_SECRET = undefined;
      expect(() => validateJWT(mockToken)).toThrow('JWT_SECRET is required');
      process.env.JWT_SECRET = originalJwtSecret;
    });

    it('should handle malformed tokens', () => {
      const malformedTokens = ['', 'invalid', 'header.payload.signature'];
      
      malformedTokens.forEach((token) => {
        const { verify } = require('jsonwebtoken');
        verify.mockImplementation(() => {
          throw new Error('Invalid token');
        });
        expect(validateJWT(token)).toBe(false);
      });
    });
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = 'test_password';
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).toBe('hashed_password');
      
      const { hash } = require('bcrypt');
      expect(hash).toHaveBeenCalledWith(password, 12);
    });

    it('should handle empty password', async () => {
      const hashedPassword = await hashPassword('');
      expect(hashedPassword).toBe('hashed_password');
    });

    it('should handle null or undefined password', async () => {
      const hashedPassword = await hashPassword(null as unknown as string);
      expect(hashedPassword).toBe('hashed_password');
      const hashedPassword2 = await hashPassword(undefined as unknown as string);
      expect(hashedPassword2).toBe('hashed_password');
    });

    it('should handle bcrypt errors', async () => {
      const { hash } = require('bcrypt');
      hash.mockRejectedValue(new Error('Bcrypt error'));
      await expect(hashPassword('test_password')).rejects.toThrow('Bcrypt error');
    });
  });

  describe('verifyPassword', () => {
    const mockPasswordHash = 'hashed_password';

    it('should verify correct password', async () => {
      const result = await verifyPassword('test_password', mockPasswordHash);
      expect(result).toBe(true);
      
      const { compare } = require('bcrypt');
      expect(compare).toHaveBeenCalledWith('test_password', mockPasswordHash);
    });

    it('should reject incorrect password', async () => {
      const { compare } = require('bcrypt');
      compare.mockResolvedValue(false);
      const result = await verifyPassword('wrong_password', mockPasswordHash);
      expect(result).toBe(false);
    });

    it('should handle empty password or hash', async () => {
      const result = await verifyPassword('', mockPasswordHash);
      expect(result).toBe(true);
      const result2 = await verifyPassword('test_password', '');
      expect(result2).toBe(true);
    });

    it('should handle null or undefined inputs', async () => {
      const result = await verifyPassword(null as unknown as string, mockPasswordHash);
      expect(result).toBe(true);
      const result2 = await verifyPassword('test_password', null as unknown as string);
      expect(result2).toBe(true);
    });

    it('should handle bcrypt errors', async () => {
      const { compare } = require('bcrypt');
      compare.mockRejectedValue(new Error('Bcrypt error'));
      await expect(verifyPassword('test_password', mockPasswordHash)).rejects.toThrow('Bcrypt error');
    });
  });
});
