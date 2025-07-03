export interface SecurityConfig {
  rateLimit: {
    windowMs: number;
    max: number;
    standardHeaders: boolean;
    legacyHeaders: boolean;
    skipSuccessfulRequests: boolean;
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
  headers: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: string[];
        scriptSrc: string[];
        styleSrc: string[];
        imgSrc: string[];
        fontSrc: string[];
        connectSrc: string[];
        mediaSrc: string[];
        objectSrc: string[];
        frameAncestors: string[];
        baseUri: string[];
        formAction: string[];
        frameSrc: string[];
        manifestSrc: string[];
        workerSrc: string[];
        upgradeInsecureRequests: boolean;
        blockAllMixedContent: boolean;
      };
    };
    strictTransportSecurity: {
      maxAge: number;
      includeSubDomains: boolean;
      preload: boolean;
    };
    permissionsPolicy: {
      features: {
        [key: string]: string[];
      };
    };
  };
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
    passwordMinLength: number;
    passwordMaxLength: number;
    passwordRequirements: {
      minLowercase: number;
      minUppercase: number;
      minNumbers: number;
      minSymbols: number;
    };
  };
  session: {
    name: string;
    secret: string;
    cookie: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'strict' | 'lax' | 'none';
      maxAge: number;
      path: string;
      domain?: string;
    };
  };
  botDetection: {
    enabled: boolean;
    threshold: number;
    blockSuspectedBots: boolean;
  };
  originValidation: {
    enabled: boolean;
    trustScoreThreshold: number;
    blockUntrustedOrigins: boolean;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: string;
    securityEvents: boolean;
    auditTrail: boolean;
    sensitiveFields: string[];
  };
}
