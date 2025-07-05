import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://rescuepcrepairs.com',
  'https://www.rescuepcrepairs.com',
  'https://api.rescuepcrepairs.com'
];

const ALLOWED_DEVELOPMENT_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000'];

interface OriginValidationConfig {
  allowLocalhost: boolean;
  strictHttps: boolean;
  allowSubdomains: boolean;
  allowNull: boolean;
}

const defaultConfig: OriginValidationConfig = {
  allowLocalhost: process.env.NODE_ENV === 'development',
  strictHttps: process.env.NODE_ENV === 'production',
  allowSubdomains: true,
  allowNull: false
};

export function validateOrigin(
  request: NextRequest,
  config: OriginValidationConfig = defaultConfig
): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Handle null origin (e.g., same-origin requests)
  if (!origin) {
    if (config.allowNull) {
      return true;
    }
    // Fall back to referer check if available
    if (referer) {
      return validateUrl(referer, config);
    }
    return false;
  }

  return validateUrl(origin, config);
}

function validateUrl(url: string, config: OriginValidationConfig): boolean {
  try {
    const urlObj = new URL(url);

    // Check for HTTPS in production
    if (config.strictHttps && urlObj.protocol !== 'https:') {
      return false;
    }

    // Allow localhost in development
    if (config.allowLocalhost && ALLOWED_DEVELOPMENT_ORIGINS.includes(url)) {
      return true;
    }

    // Check against allowed origins
    if (ALLOWED_ORIGINS.includes(url)) {
      return true;
    }

    // Check subdomains if allowed
    if (config.allowSubdomains) {
      return ALLOWED_ORIGINS.some((allowed) => {
        const allowedUrl = new URL(allowed);
        return urlObj.hostname.endsWith(allowedUrl.hostname);
      });
    }

    return false;
  } catch (error) {
    console.error('Origin validation error:', error);
    return false;
  }
}

export function isAllowedOrigin(origin: string): boolean {
  return validateUrl(origin, defaultConfig);
}

export function getOriginTrustScore(request: NextRequest): number {
  let score = 0;
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Perfect score for exact match
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return 1;
  }

  // Check origin
  if (origin) {
    try {
      const originUrl = new URL(origin);

      // HTTPS bonus
      if (originUrl.protocol === 'https:') {
        score += 0.3;
      }

      // Subdomain check
      if (
        ALLOWED_ORIGINS.some((allowed) => {
          const allowedUrl = new URL(allowed);
          return originUrl.hostname.endsWith(allowedUrl.hostname);
        })
      ) {
        score += 0.4;
      }
    } catch {
      score = 0;
    }
  }

  // Check referer
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (
        ALLOWED_ORIGINS.some((allowed) => {
          const allowedUrl = new URL(allowed);
          return refererUrl.hostname.endsWith(allowedUrl.hostname);
        })
      ) {
        score += 0.2;
      }
    } catch {
      // Invalid referer URL
    }
  }

  // If no origin or referer, return low score
  if (!origin && !referer) {
    return 0.5;
  }

  return Math.min(score, 1);
}
