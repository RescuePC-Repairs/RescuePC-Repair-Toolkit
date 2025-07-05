import type { NextRequest } from 'next/server';

const KNOWN_BOT_PATTERNS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /headless/i,
  /scrape/i,
  /phantom/i,
  /selenium/i,
  /puppeteer/i,
  /chrome-lighthouse/i
];

const ALLOWED_BOTS = [
  'Googlebot',
  'Bingbot',
  'DuckDuckBot',
  'YandexBot',
  'Applebot',
  'facebookexternalhit'
];

interface BotDetectionConfig {
  allowGoodBots: boolean;
  checkUserAgent: boolean;
  checkHeaders: boolean;
  checkBehavior: boolean;
}

const defaultConfig: BotDetectionConfig = {
  allowGoodBots: true,
  checkUserAgent: true,
  checkHeaders: true,
  checkBehavior: true
};

export function detectBot(
  request: NextRequest,
  config: BotDetectionConfig = defaultConfig
): boolean {
  try {
    const userAgent = request.headers.get('user-agent') || '';

    // Allow known good bots if configured
    if (config.allowGoodBots && ALLOWED_BOTS.some((bot) => userAgent.includes(bot))) {
      return false;
    }

    if (config.checkUserAgent) {
      // Check for suspicious user agents
      if (KNOWN_BOT_PATTERNS.some((pattern) => pattern.test(userAgent))) {
        return true;
      }

      // Check for empty or suspicious user agent strings
      if (!userAgent || userAgent.length < 10 || userAgent === 'Mozilla/5.0') {
        return true;
      }
    }

    if (config.checkHeaders) {
      // Check for missing or suspicious headers
      const accept = request.headers.get('accept');
      const acceptLanguage = request.headers.get('accept-language');
      const acceptEncoding = request.headers.get('accept-encoding');

      if (!accept || !acceptLanguage || !acceptEncoding) {
        return true;
      }

      // Check for suspicious header combinations
      if (accept === '*/*' && acceptLanguage === '*' && acceptEncoding === '*') {
        return true;
      }
    }

    if (config.checkBehavior) {
      // Check request timing and patterns
      const requestTime = new Date().getTime();
      const requestSpeed = request.headers.get('x-request-start')
        ? requestTime - parseInt(request.headers.get('x-request-start') || '0')
        : 0;

      // Suspiciously fast requests (less than 50ms between requests)
      if (requestSpeed > 0 && requestSpeed < 50) {
        return true;
      }
    }

    return false;
  } catch (error) {
    // If there's an error, assume it's a bot
    return true;
  }
}

export function getBotScore(request: NextRequest): number {
  try {
    let score = 0;
    const userAgent = request.headers.get('user-agent') || '';

    // User agent checks
    if (KNOWN_BOT_PATTERNS.some((pattern) => pattern.test(userAgent))) {
      score += 0.4;
    }

    // Header checks
    const headers = [
      'accept',
      'accept-language',
      'accept-encoding',
      'connection',
      'dnt',
      'upgrade-insecure-requests'
    ];

    const missingHeaders = headers.filter((header) => !request.headers.get(header));
    score += missingHeaders.length * 0.1;

    // Behavioral checks
    if (
      request.headers.get('x-requested-with') !== 'XMLHttpRequest' &&
      request.headers.get('sec-fetch-mode') !== 'navigate'
    ) {
      score += 0.2;
    }

    // Missing user agent is very suspicious
    if (!userAgent) {
      score += 0.8;
    }

    // Empty user agent is suspicious
    if (userAgent === '') {
      score += 0.9;
    }

    return Math.min(score, 1);
  } catch (error) {
    // If there's an error, return high score
    return 1;
  }
}

export function isRateLimitExempt(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  return ALLOWED_BOTS.some((bot) => userAgent.includes(bot));
}
