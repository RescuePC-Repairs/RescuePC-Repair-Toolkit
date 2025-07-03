import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { generateTokens, validateJWT, hashPassword, verifyPassword } from '@/utils/auth';
import { sign, verify } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';

jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('Authentication', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    role: 'user'
  };

  const mockSecret = 'test-secret';
  const mockToken = 'mock.jwt.token';
  const mockRefreshToken = 'mock.refresh.token';
  const mockPasswordHash = 'hashed_password';

  beforeEach(() => {
    process.env.JWT_SECRET = mockSecret;
    process.env.TOKEN_EXPIRY = '1h';
    process.env.REFRESH_TOKEN_EXPIRY = '7d';

    (sign as jest.Mock).mockReturnValue(mockToken);
    (verify as jest.Mock).mockReturnValue(mockUser);
    (hash as jest.Mock).mockResolvedValue(mockPasswordHash);
    (compare as jest.Mock).mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      const tokens = generateTokens(mockUser);
      expect(tokens).toEqual({
        accessToken: mockToken,
        refreshToken: mockToken
      });
    });

    it('should call sign with correct parameters', () => {
      generateTokens(mockUser);

      expect(sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email, role: mockUser.role },
        mockSecret,
        { expiresIn: '1h' }
      );

      expect(sign).toHaveBeenCalledWith({ id: mockUser.id, type: 'refresh' }, mockSecret, {
        expiresIn: '7d'
      });
    });

    it('should throw error if JWT_SECRET is not set', () => {
      delete process.env.JWT_SECRET;
      expect(() => generateTokens(mockUser)).toThrow('JWT_SECRET environment variable is required');
    });

    it('should handle missing expiry configuration', () => {
      delete process.env.TOKEN_EXPIRY;
      delete process.env.REFRESH_TOKEN_EXPIRY;

      generateTokens(mockUser);

      expect(sign).toHaveBeenCalledWith(
        expect.any(Object),
        mockSecret,
        { expiresIn: '1h' } // Default value
      );
    });
  });

  describe('validateJWT', () => {
    it('should validate a valid token', () => {
      const result = validateJWT(mockToken);
      expect(result).toBe(true);
      expect(verify).toHaveBeenCalledWith(mockToken, mockSecret);
    });

    it('should return false for invalid token', () => {
      (verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      expect(validateJWT('invalid.token')).toBe(false);
    });

    it('should return false for expired token', () => {
      (verify as jest.Mock).mockImplementation(() => {
        throw new Error('jwt expired');
      });
      expect(validateJWT(mockToken)).toBe(false);
    });

    it('should throw error if JWT_SECRET is not set', () => {
      delete process.env.JWT_SECRET;
      expect(() => validateJWT(mockToken)).toThrow('JWT_SECRET environment variable is required');
    });

    it('should handle malformed tokens', () => {
      const malformedTokens = [
        '',
        'not.a.jwt',
        'invalid.jwt.',
        '.invalid.jwt',
        'invalid..jwt',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' // Incomplete JWT
      ];

      malformedTokens.forEach((token) => {
        expect(validateJWT(token)).toBe(false);
      });
    });
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = 'test_password';
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).toBe(mockPasswordHash);
      expect(hash).toHaveBeenCalledWith(password, 10);
    });

    it('should handle empty password', async () => {
      await expect(hashPassword('')).rejects.toThrow('Password is required');
    });

    it('should handle null or undefined password', async () => {
      await expect(hashPassword(null as unknown as string)).rejects.toThrow('Password is required');
      await expect(hashPassword(undefined as unknown as string)).rejects.toThrow(
        'Password is required'
      );
    });

    it('should handle bcrypt errors', async () => {
      (hash as jest.Mock).mockRejectedValue(new Error('Bcrypt error'));
      await expect(hashPassword('test_password')).rejects.toThrow('Failed to hash password');
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'test_password';
      const result = await verifyPassword(password, mockPasswordHash);
      expect(result).toBe(true);
      expect(compare).toHaveBeenCalledWith(password, mockPasswordHash);
    });

    it('should reject incorrect password', async () => {
      (compare as jest.Mock).mockResolvedValue(false);
      const result = await verifyPassword('wrong_password', mockPasswordHash);
      expect(result).toBe(false);
    });

    it('should handle empty password or hash', async () => {
      await expect(verifyPassword('', mockPasswordHash)).rejects.toThrow(
        'Password and hash are required'
      );
      await expect(verifyPassword('test_password', '')).rejects.toThrow(
        'Password and hash are required'
      );
    });

    it('should handle null or undefined inputs', async () => {
      await expect(verifyPassword(null as unknown as string, mockPasswordHash)).rejects.toThrow(
        'Password and hash are required'
      );
      await expect(verifyPassword('test_password', null as unknown as string)).rejects.toThrow(
        'Password and hash are required'
      );
    });

    it('should handle bcrypt errors', async () => {
      (compare as jest.Mock).mockRejectedValue(new Error('Bcrypt error'));
      await expect(verifyPassword('test_password', mockPasswordHash)).rejects.toThrow(
        'Failed to verify password'
      );
    });
  });
});
