import { AuthFortress } from '@/utils/auth-fortress';
import { ZeroTrustSecurity } from '@/utils/zero-trust';
import { SecurityMonitor } from '@/utils/security-monitor';
import { randomBytes } from 'crypto';

describe('AuthFortress', () => {
  let authFortress: AuthFortress;
  const mockContext = {
    userId: 'test-user',
    deviceId: 'test-device',
    timestamp: Date.now(),
    nonce: randomBytes(16).toString('hex'),
    signature: 'test-signature',
    geoLocation: '127.0.0.1'
  };

  beforeEach(() => {
    authFortress = new AuthFortress();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should successfully authenticate with valid credentials', async () => {
      const result = await authFortress.authenticate(mockContext);
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.expiresAt).toBeDefined();
    });

    it('should require MFA when enabled', async () => {
      const result = await authFortress.authenticate({
        ...mockContext,
        mfaToken: undefined
      });
      expect(result.success).toBe(false);
      expect(result.mfaRequired).toBe(true);
    });

    it('should require biometric verification when enabled', async () => {
      const result = await authFortress.authenticate({
        ...mockContext,
        biometricData: undefined
      });
      expect(result.success).toBe(false);
      expect(result.biometricRequired).toBe(true);
    });

    it('should reject invalid timestamps', async () => {
      const result = await authFortress.authenticate({
        ...mockContext,
        timestamp: Date.now() - 3600000 // 1 hour old
      });
      expect(result.success).toBe(false);
      expect(result.reason).toBe('Invalid timestamp');
    });

    it('should reject invalid signatures', async () => {
      const result = await authFortress.authenticate({
        ...mockContext,
        signature: 'invalid-signature'
      });
      expect(result.success).toBe(false);
      expect(result.reason).toBe('Invalid signature');
    });

    it('should enforce device registration limits', async () => {
      // Register max number of devices
      for (let i = 0; i < 5; i++) {
        await authFortress.authenticate({
          ...mockContext,
          deviceId: `device-${i}`
        });
      }

      // Try to register one more device
      const result = await authFortress.authenticate({
        ...mockContext,
        deviceId: 'new-device'
      });
      expect(result.success).toBe(false);
      expect(result.reason).toBe('Device registration failed');
    });

    it('should validate through Zero Trust Security', async () => {
      const zeroTrustSpy = jest.spyOn(ZeroTrustSecurity.prototype, 'validateRequest');
      await authFortress.authenticate(mockContext);
      expect(zeroTrustSpy).toHaveBeenCalled();
    });

    it('should log security events', async () => {
      const monitorSpy = jest.spyOn(SecurityMonitor.getInstance(), 'logSecurityEvent');
      await authFortress.authenticate(mockContext);
      expect(monitorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'AUTH_SUCCESS'
        })
      );
    });
  });

  describe('token management', () => {
    it('should rotate tokens periodically', async () => {
      const firstAuth = await authFortress.authenticate(mockContext);
      const firstToken = firstAuth.token;

      // Fast forward time
      jest.advanceTimersByTime(86400000); // 24 hours

      const secondAuth = await authFortress.authenticate(mockContext);
      expect(secondAuth.token).not.toBe(firstToken);
    });

    it('should handle token expiration', async () => {
      const auth = await authFortress.authenticate(mockContext);

      // Fast forward past expiration
      jest.advanceTimersByTime(3600000); // 1 hour

      const isValid = await authFortress.validateToken(auth.token!);
      expect(isValid).toBe(false);
    });
  });

  describe('MFA verification', () => {
    it('should validate MFA tokens', async () => {
      const result = await authFortress.authenticate({
        ...mockContext,
        mfaToken: 'valid-mfa-token'
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid MFA tokens', async () => {
      const result = await authFortress.authenticate({
        ...mockContext,
        mfaToken: 'invalid-mfa-token'
      });
      expect(result.success).toBe(false);
      expect(result.reason).toBe('MFA verification failed');
    });
  });

  describe('biometric verification', () => {
    it('should validate biometric data', async () => {
      const result = await authFortress.authenticate({
        ...mockContext,
        biometricData: 'valid-biometric-data'
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid biometric data', async () => {
      const result = await authFortress.authenticate({
        ...mockContext,
        biometricData: 'invalid-biometric-data'
      });
      expect(result.success).toBe(false);
      expect(result.reason).toBe('Biometric verification failed');
    });
  });
});
