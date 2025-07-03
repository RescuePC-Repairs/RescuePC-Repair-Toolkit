import { NextRequest, NextResponse } from 'next/server';

declare global {
  // Extend NodeJS global
  namespace NodeJS {
    interface Global {
      NextRequest: typeof NextRequest;
      NextResponse: typeof NextResponse;
      crypto: Crypto;
    }
  }

  // Extend Window global
  interface Window {
    crypto: Crypto;
  }

  // Custom types for security features
  interface SecurityConfig {
    rateLimit: {
      windowMs: number;
      max: number;
    };
    csrf: {
      tokenLength: number;
      cookieName: string;
      headerName: string;
    };
    cors: {
      allowedOrigins: string[];
      allowedMethods: string[];
      allowedHeaders: string[];
      exposedHeaders: string[];
      maxAge: number;
    };
  }

  // Custom types for file validation
  interface FileValidation {
    validateFileType: (filename: string, mimeType: string, allowedTypes?: string[]) => boolean;
    validateFileSize: (size: number, maxSize?: number) => boolean;
    validateFileContent: (content: Buffer, declaredType: string) => boolean;
  }

  // Custom types for bot detection
  interface BotDetection {
    detectBot: (request: NextRequest, config?: BotDetectionConfig) => boolean;
    getBotScore: (request: NextRequest) => number;
    isRateLimitExempt: (request: NextRequest) => boolean;
  }

  interface BotDetectionConfig {
    allowGoodBots: boolean;
    checkUserAgent: boolean;
    checkHeaders: boolean;
    checkBehavior: boolean;
  }

  // Custom types for origin validation
  interface OriginValidation {
    validateOrigin: (request: NextRequest, config?: OriginValidationConfig) => boolean;
    getOriginTrustScore: (request: NextRequest) => number;
    isAllowedOrigin: (origin: string) => boolean;
  }

  interface OriginValidationConfig {
    allowLocalhost: boolean;
    strictHttps: boolean;
    allowSubdomains: boolean;
    allowNull: boolean;
  }

  // Extend Jest matchers
  namespace jest {
    interface Matchers<R> {
      toHaveSecureHeaders(): R;
      toBeValidJWT(): R;
      toBeValidCSRFToken(): R;
    }
  }
}

export {};
