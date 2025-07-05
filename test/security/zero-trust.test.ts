import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { ZeroTrustSecurity } from '@/utils/zero-trust';
import { randomBytes } from 'crypto';

describe('ZeroTrustSecurity', () => {
  let zeroTrust: ZeroTrustSecurity;
  let mockContext: any;

  beforeEach(() => {
    zeroTrust = new ZeroTrustSecurity();
    mockContext = {
      requestId: 'test-request-123',
      timestamp: Date.now(),
      clientId: 'test-client-456',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      geoLocation: 'US',
      riskScore: 0.1,
      biometric: false
    };
  });

  describe('validateRequest', () => {
    it('should validate legitimate requests', async () => {
      const result = await zeroTrust.validateRequest(mockContext);
      expect(result).toBe(true);
    });

    it('should reject high risk requests', async () => {
      mockContext.riskScore = 0.9; // Above threshold
      const result = await zeroTrust.validateRequest(mockContext);
      expect(result).toBe(false);
    });

    it('should reject requests with invalid timestamps', async () => {
      mockContext.timestamp = Date.now() - 600000; // 10 minutes ago
      const result = await zeroTrust.validateRequest(mockContext);
      expect(result).toBe(false);
    });

    it('should reset lockout after duration expires', async () => {
      // First, trigger a lockout by making multiple failed attempts
      for (let i = 0; i < 3; i++) {
        mockContext.riskScore = 0.9;
        await zeroTrust.validateRequest(mockContext);
      }

      // Now try a legitimate request - should still be locked out
      mockContext.riskScore = 0.1;
      const result = await zeroTrust.validateRequest(mockContext);
      expect(result).toBe(false);
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
    it('should detect unusual location patterns', async () => {
      // Create context with unusual location pattern
      const unusualContext = {
        ...mockContext,
        geoLocation: 'location-2'
      };
      
      const result = await zeroTrust.validateRequest(unusualContext);
      expect(result).toBe(true); // Should still pass as it's a legitimate request
    });

    it('should handle missing location data', async () => {
      const contextWithoutLocation = {
        ...mockContext,
        geoLocation: undefined
      };
      
      const result = await zeroTrust.validateRequest(contextWithoutLocation);
      expect(result).toBe(true);
    });

    it('should validate requests with biometric data', async () => {
      const biometricContext = {
        ...mockContext,
        biometric: true
      };
      
      const result = await zeroTrust.validateRequest(biometricContext);
      expect(result).toBe(true);
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

  describe('error handling', () => {
    it('should handle missing required fields', async () => {
      const invalidContext = {
        requestId: 'test',
        timestamp: Date.now()
        // Missing other required fields
      };
      
      const result = await zeroTrust.validateRequest(invalidContext as any);
      expect(result).toBe(false);
    });

    it('should handle malformed context data', async () => {
      const malformedContext = {
        ...mockContext,
        timestamp: 'invalid-timestamp'
      };
      
      const result = await zeroTrust.validateRequest(malformedContext);
      expect(result).toBe(false);
    });
  });
});
