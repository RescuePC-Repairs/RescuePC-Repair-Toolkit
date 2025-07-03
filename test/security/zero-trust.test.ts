import { ZeroTrustSecurity } from '@/utils/zero-trust';
import { randomBytes } from 'crypto';

describe('ZeroTrustSecurity', () => {
  let zeroTrust: ZeroTrustSecurity;
  const mockContext = {
    requestId: randomBytes(16).toString('hex'),
    timestamp: Date.now(),
    clientId: 'test-client',
    ipAddress: '127.0.0.1',
    userAgent: 'test-agent',
    geoLocation: 'test-location',
    riskScore: 0.5
  };

  beforeEach(() => {
    zeroTrust = new ZeroTrustSecurity();
    jest.clearAllMocks();
  });

  describe('validateRequest', () => {
    it('should validate legitimate requests', async () => {
      const result = await zeroTrust.validateRequest(mockContext);
      expect(result).toBe(true);
    });

    it('should reject high-risk requests', async () => {
      const result = await zeroTrust.validateRequest({
        ...mockContext,
        riskScore: 0.9
      });
      expect(result).toBe(false);
    });

    it('should reject requests with invalid timestamps', async () => {
      const result = await zeroTrust.validateRequest({
        ...mockContext,
        timestamp: Date.now() - 3600000 // 1 hour old
      });
      expect(result).toBe(false);
    });

    it('should handle lockout after multiple failures', async () => {
      // Trigger multiple failed attempts
      for (let i = 0; i < 3; i++) {
        await zeroTrust.validateRequest({
          ...mockContext,
          riskScore: 0.9
        });
      }

      // Try a legitimate request
      const result = await zeroTrust.validateRequest(mockContext);
      expect(result).toBe(false);
    });

    it('should reset lockout after duration expires', async () => {
      // Trigger lockout
      for (let i = 0; i < 3; i++) {
        await zeroTrust.validateRequest({
          ...mockContext,
          riskScore: 0.9
        });
      }

      // Fast forward past lockout duration
      jest.advanceTimersByTime(3600000); // 1 hour

      // Try a legitimate request
      const result = await zeroTrust.validateRequest(mockContext);
      expect(result).toBe(true);
    });
  });

  describe('trust scoring', () => {
    it('should calculate behavioral score', async () => {
      const result = await zeroTrust.validateRequest({
        ...mockContext,
        riskScore: 0.3
      });
      expect(result).toBe(true);
    });

    it('should calculate contextual score', async () => {
      const result = await zeroTrust.validateRequest({
        ...mockContext,
        ipAddress: '192.168.1.1',
        userAgent: 'known-agent'
      });
      expect(result).toBe(true);
    });

    it('should maintain historical trust scores', async () => {
      // Build up trust with multiple successful requests
      for (let i = 0; i < 5; i++) {
        await zeroTrust.validateRequest(mockContext);
      }

      // Should allow slightly riskier request due to trust history
      const result = await zeroTrust.validateRequest({
        ...mockContext,
        riskScore: 0.7 // Higher than normal but below absolute threshold
      });
      expect(result).toBe(true);
    });
  });

  describe('security patterns', () => {
    it('should detect unusual timing patterns', async () => {
      const result = await zeroTrust.validateRequest({
        ...mockContext,
        timestamp: Date.now() - 290000 // Just within 5-minute window
      });
      expect(result).toBe(true);
    });

    it('should detect unusual location patterns', async () => {
      // First request from one location
      await zeroTrust.validateRequest({
        ...mockContext,
        geoLocation: 'location-1'
      });

      // Immediate request from different location
      const result = await zeroTrust.validateRequest({
        ...mockContext,
        geoLocation: 'location-2'
      });
      expect(result).toBe(false);
    });

    it('should handle missing location data', async () => {
      const result = await zeroTrust.validateRequest({
        ...mockContext,
        geoLocation: undefined
      });
      expect(result).toBe(true); // Should still pass but with lower trust score
    });
  });

  describe('security notifications', () => {
    it('should notify security team on lockout', async () => {
      const consoleSpy = jest.spyOn(console, 'error');

      // Trigger lockout
      for (let i = 0; i < 3; i++) {
        await zeroTrust.validateRequest({
          ...mockContext,
          riskScore: 0.9
        });
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        'Security Alert:',
        expect.objectContaining({
          event: 'ACCOUNT_LOCKOUT'
        })
      );
    });
  });
});
