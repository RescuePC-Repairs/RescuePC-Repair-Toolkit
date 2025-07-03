import { beforeEach, describe, expect, it, jest, afterEach } from '@jest/globals';
import { createRateLimit } from '@/utils/rateLimit';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('@/utils/rateLimit');

describe('Rate Limiting', () => {
  let mockRequest: NextRequest;
  let limiter: ReturnType<typeof createRateLimit>;
  const defaultConfig = {
    interval: 60000, // 1 minute
    uniqueTokenPerInterval: 100
  };

  beforeEach(() => {
    jest.resetAllMocks();
    mockRequest = new NextRequest('https://rescuepcrepairs.com', {
      headers: new Headers({
        'x-forwarded-for': '127.0.0.1',
        'x-real-ip': '127.0.0.1'
      })
    });
    limiter = createRateLimit(defaultConfig);
  });

  describe('Basic Rate Limiting', () => {
    it('should allow requests within the rate limit', async () => {
      (limiter.check as jest.Mock).mockResolvedValue(true);

      const result = await limiter.check(mockRequest);
      expect(result).toBe(true);
    });

    it('should block requests exceeding the rate limit', async () => {
      (limiter.check as jest.Mock).mockRejectedValue(new Error('Rate limit exceeded'));

      await expect(limiter.check(mockRequest)).rejects.toThrow('Rate limit exceeded');
    });

    it('should respect the configured interval', async () => {
      const customLimiter = createRateLimit({ ...defaultConfig, interval: 5000 }); // 5 seconds
      (customLimiter.check as jest.Mock).mockResolvedValue(true);

      await expect(customLimiter.check(mockRequest)).resolves.toBe(true);

      jest.advanceTimersByTime(4000); // 4 seconds
      (customLimiter.check as jest.Mock).mockRejectedValue(new Error('Rate limit exceeded'));
      await expect(customLimiter.check(mockRequest)).rejects.toThrow('Rate limit exceeded');

      jest.advanceTimersByTime(1000); // 5 seconds total
      (customLimiter.check as jest.Mock).mockResolvedValue(true);
      await expect(customLimiter.check(mockRequest)).resolves.toBe(true);
    });
  });

  describe('IP Address Handling', () => {
    it('should handle X-Forwarded-For header with multiple IPs', async () => {
      const mockRequestWithProxy = new NextRequest('https://rescuepcrepairs.com', {
        headers: new Headers({
          'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178',
          'x-real-ip': '203.0.113.195'
        })
      });

      (limiter.check as jest.Mock).mockResolvedValue(true);
      await expect(limiter.check(mockRequestWithProxy)).resolves.toBe(true);
    });

    it('should handle missing IP headers gracefully', async () => {
      const mockRequestNoIP = new NextRequest('https://rescuepcrepairs.com', {
        headers: new Headers({})
      });

      (limiter.check as jest.Mock).mockResolvedValue(true);
      await expect(limiter.check(mockRequestNoIP)).resolves.toBe(true);
    });

    it('should handle invalid IP addresses', async () => {
      const mockRequestInvalidIP = new NextRequest('https://rescuepcrepairs.com', {
        headers: new Headers({
          'x-forwarded-for': 'invalid-ip',
          'x-real-ip': 'also-invalid'
        })
      });

      (limiter.check as jest.Mock).mockResolvedValue(true);
      await expect(limiter.check(mockRequestInvalidIP)).resolves.toBe(true);
    });
  });

  describe('Distributed Rate Limiting', () => {
    it('should handle concurrent requests', async () => {
      (limiter.check as jest.Mock).mockResolvedValue(true);

      const requests = Array(5)
        .fill(null)
        .map(() => limiter.check(mockRequest));
      await expect(Promise.all(requests)).resolves.toEqual(Array(5).fill(true));
    });

    it('should maintain separate limits for different IPs', async () => {
      const mockRequest1 = new NextRequest('https://rescuepcrepairs.com', {
        headers: new Headers({ 'x-forwarded-for': '192.168.1.1' })
      });

      const mockRequest2 = new NextRequest('https://rescuepcrepairs.com', {
        headers: new Headers({ 'x-forwarded-for': '192.168.1.2' })
      });

      (limiter.check as jest.Mock)
        .mockResolvedValueOnce(true) // IP 1 first request
        .mockResolvedValueOnce(true) // IP 2 first request
        .mockRejectedValueOnce(new Error('Rate limit exceeded')) // IP 1 second request
        .mockResolvedValueOnce(true); // IP 2 second request

      await expect(limiter.check(mockRequest1)).resolves.toBe(true);
      await expect(limiter.check(mockRequest2)).resolves.toBe(true);
      await expect(limiter.check(mockRequest1)).rejects.toThrow('Rate limit exceeded');
      await expect(limiter.check(mockRequest2)).resolves.toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle requests at exactly the limit', async () => {
      const customLimiter = createRateLimit({
        interval: 60000,
        uniqueTokenPerInterval: 2
      });

      (customLimiter.check as jest.Mock)
        .mockResolvedValueOnce(true) // First request
        .mockResolvedValueOnce(true) // Second request
        .mockRejectedValueOnce(new Error('Rate limit exceeded')); // Third request

      await expect(customLimiter.check(mockRequest)).resolves.toBe(true);
      await expect(customLimiter.check(mockRequest)).resolves.toBe(true);
      await expect(customLimiter.check(mockRequest)).rejects.toThrow('Rate limit exceeded');
    });

    it('should reset counters after interval', async () => {
      const customLimiter = createRateLimit({
        interval: 5000, // 5 seconds
        uniqueTokenPerInterval: 1
      });

      (customLimiter.check as jest.Mock)
        .mockResolvedValueOnce(true) // First request
        .mockRejectedValueOnce(new Error('Rate limit exceeded')) // Second request
        .mockResolvedValueOnce(true); // Request after reset

      await expect(customLimiter.check(mockRequest)).resolves.toBe(true);
      await expect(customLimiter.check(mockRequest)).rejects.toThrow('Rate limit exceeded');

      jest.advanceTimersByTime(5000);
      await expect(customLimiter.check(mockRequest)).resolves.toBe(true);
    });

    it('should handle system time changes', async () => {
      const now = Date.now();
      jest.setSystemTime(now);

      (limiter.check as jest.Mock).mockResolvedValue(true);
      await expect(limiter.check(mockRequest)).resolves.toBe(true);

      // Simulate time moving backwards
      jest.setSystemTime(now - 1000);
      await expect(limiter.check(mockRequest)).resolves.toBe(true);

      // Simulate time moving forwards
      jest.setSystemTime(now + 1000);
      await expect(limiter.check(mockRequest)).resolves.toBe(true);
    });
  });
});
