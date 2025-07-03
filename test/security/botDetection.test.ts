import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { NextRequest } from 'next/server';
import { detectBot, getBotScore } from '@/utils/botDetection';

describe('Bot Detection', () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    mockRequest = new NextRequest('https://rescuepcrepairs.com', {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.5',
        'accept-encoding': 'gzip, deflate, br'
      }
    });
  });

  describe('detectBot', () => {
    it('should identify legitimate browsers', () => {
      const result = detectBot(mockRequest);
      expect(result).toBe(false);
    });

    it('should detect known bot user agents', () => {
      const botUserAgents = [
        'Googlebot/2.1 (+http://www.google.com/bot.html)',
        'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
        'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)',
        'DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)',
        'Baiduspider/2.0; +http://www.baidu.com/search/spider.html',
        'PetalBot',
        'AhrefsBot/7.0',
        'Twitterbot/1.0',
        'facebookexternalhit/1.1',
        'LinkedInBot/1.0',
        'Slackbot-LinkExpanding 1.0',
        'HeadlessChrome',
        'PhantomJS',
        'Puppeteer',
        'Selenium',
        'Python-urllib/2.7'
      ];

      for (const userAgent of botUserAgents) {
        mockRequest = new NextRequest('https://rescuepcrepairs.com', {
          headers: {
            'user-agent': userAgent
          }
        });
        expect(detectBot(mockRequest)).toBe(true);
      }
    });

    it('should detect missing user agent', () => {
      mockRequest = new NextRequest('https://rescuepcrepairs.com', {
        headers: {}
      });
      expect(detectBot(mockRequest)).toBe(true);
    });

    it('should detect empty user agent', () => {
      mockRequest = new NextRequest('https://rescuepcrepairs.com', {
        headers: {
          'user-agent': ''
        }
      });
      expect(detectBot(mockRequest)).toBe(true);
    });
  });

  describe('getBotScore', () => {
    it('should return low score for legitimate browsers', () => {
      const score = getBotScore(mockRequest);
      expect(score).toBeLessThan(0.3);
    });

    it('should return high score for known bots', () => {
      mockRequest = new NextRequest('https://rescuepcrepairs.com', {
        headers: {
          'user-agent': 'Googlebot/2.1',
          accept: '*/*'
        }
      });
      const score = getBotScore(mockRequest);
      expect(score).toBeGreaterThan(0.7);
    });

    it('should consider missing headers suspicious', () => {
      mockRequest = new NextRequest('https://rescuepcrepairs.com', {
        headers: {
          'user-agent': 'Mozilla/5.0'
        }
      });
      const score = getBotScore(mockRequest);
      expect(score).toBeGreaterThan(0.5);
    });

    it('should detect unusual header combinations', () => {
      mockRequest = new NextRequest('https://rescuepcrepairs.com', {
        headers: {
          'user-agent': 'Mozilla/5.0',
          accept: 'text/html',
          'accept-language': '*'
        }
      });
      const score = getBotScore(mockRequest);
      expect(score).toBeGreaterThan(0.4);
    });

    it('should detect suspicious request patterns', () => {
      const requests = [
        {
          userAgent: 'curl/7.64.1',
          headers: {},
          expectedScore: 0.7
        },
        {
          userAgent: 'Python-requests/2.25.1',
          headers: {
            accept: '*/*'
          },
          expectedScore: 0.8
        },
        {
          userAgent: 'Mozilla/5.0',
          headers: {
            accept: 'application/json',
            'accept-language': '*'
          },
          expectedScore: 0.6
        }
      ];

      for (const { userAgent, headers, expectedScore } of requests) {
        mockRequest = new NextRequest('https://rescuepcrepairs.com', {
          headers: {
            'user-agent': userAgent,
            ...headers
          }
        });
        const score = getBotScore(mockRequest);
        expect(score).toBeCloseTo(expectedScore, 1);
      }
    });

    it('should handle malformed headers gracefully', () => {
      const malformedHeaders = [
        { 'user-agent': undefined },
        { 'user-agent': null },
        { 'user-agent': 'Mozilla/5.0', accept: undefined },
        { 'user-agent': 'Mozilla/5.0', 'accept-language': null }
      ];

      for (const headers of malformedHeaders) {
        mockRequest = new NextRequest('https://rescuepcrepairs.com', {
          headers: headers as Record<string, string>
        });
        expect(() => getBotScore(mockRequest)).not.toThrow();
      }
    });
  });
});
