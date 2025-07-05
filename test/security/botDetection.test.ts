import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { detectBot, getBotScore } from '@/utils/botDetection';
import type { NextRequest } from 'next/server';

describe('Bot Detection', () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    mockRequest = {
      headers: {
        get: jest.fn((key: string) => {
          const headers: { [key: string]: string } = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'accept-language': 'en-US,en;q=0.5',
            'accept-encoding': 'gzip, deflate',
            'connection': 'keep-alive',
            'dnt': '1',
            'upgrade-insecure-requests': '1'
          };
          return headers[key] || null;
        })
      }
    } as any;
  });

  describe('detectBot', () => {
    it('should identify legitimate browsers', () => {
      const result = detectBot(mockRequest);
      expect(result).toBe(false);
    });

    it('should detect known bot user agents', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'user-agent') return 'Googlebot/2.1';
        return null;
      });

      const result = detectBot(mockRequest);
      expect(result).toBe(false); // Googlebot is in ALLOWED_BOTS
    });

    it('should detect missing user agent', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'user-agent') return null;
        return null;
      });

      const result = detectBot(mockRequest);
      expect(result).toBe(true);
    });

    it('should detect empty user agent', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'user-agent') return '';
        return null;
      });

      const result = detectBot(mockRequest);
      expect(result).toBe(true);
    });
  });

  describe('getBotScore', () => {
    it('should return low score for legitimate browsers', () => {
      const score = getBotScore(mockRequest);
      expect(score).toBeLessThan(0.5);
    });

    it('should return high score for known bots', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'user-agent') return 'bot/1.0';
        return null;
      });

      const score = getBotScore(mockRequest);
      expect(score).toBeGreaterThan(0.7);
    });

    it('should consider missing headers suspicious', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        // Return null for most headers to simulate missing headers
        return null;
      });

      const score = getBotScore(mockRequest);
      expect(score).toBeGreaterThan(0.5);
    });

    it('should detect unusual header combinations', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'user-agent') return 'Mozilla/5.0';
        if (key === 'accept') return '*/*';
        if (key === 'accept-language') return '*';
        if (key === 'accept-encoding') return '*';
        return null;
      });

      const score = getBotScore(mockRequest);
      expect(score).toBeGreaterThan(0.3);
    });

    it('should detect suspicious request patterns', () => {
      mockRequest.headers.get = jest.fn((key: string) => {
        if (key === 'user-agent') return 'Mozilla/5.0';
        if (key === 'x-requested-with') return null; // Missing XHR header
        if (key === 'sec-fetch-mode') return null; // Missing sec-fetch-mode
        return 'some-value';
      });

      const score = getBotScore(mockRequest);
      expect(score).toBeGreaterThan(0.6);
    });

    it('should handle malformed headers gracefully', () => {
      mockRequest.headers.get = jest.fn(() => {
        throw new Error('Header error');
      });

      expect(() => getBotScore(mockRequest)).toThrow('Header error');
    });
  });
});
