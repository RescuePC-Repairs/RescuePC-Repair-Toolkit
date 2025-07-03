declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_API_URL: string;
    JWT_SECRET: string;
    SESSION_SECRET: string;
    COOKIE_DOMAIN?: string;
    RATE_LIMIT_MAX?: string;
    RATE_LIMIT_WINDOW_MS?: string;
    CSP_REPORT_URI?: string;
    CORS_ALLOWED_ORIGINS?: string;
    CSRF_TOKEN_SECRET?: string;
    BOT_DETECTION_THRESHOLD?: string;
    ORIGIN_TRUST_SCORE_THRESHOLD?: string;
    LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
    SECURITY_AUDIT_ENABLED?: string;
    SECURITY_HEADERS_STRICT?: string;
  }
}
