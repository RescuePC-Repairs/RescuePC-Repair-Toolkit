import '@testing-library/jest-dom';
import crypto from 'crypto';

// Mock crypto for tests
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length),
    subtle: crypto.subtle
  }
});

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
process.env.SECURITY_KEY = 'test-security-key';
process.env.MFA_SECRET = 'test-mfa-secret';

// Mock console.error to not pollute test output
console.error = jest.fn();

// Add custom matchers if needed
expect.extend({
  toBeSecure(received: string) {
    const pass = received.startsWith('https://');
    return {
      message: () => `expected ${received} to be a secure URL`,
      pass
    };
  }
});

// Mock createRateLimit from utils/rateLimit and utils/rate-limiter
jest.mock('@/utils/rateLimit', () => ({
  createRateLimit: jest.fn(() => ({
    check: jest.fn().mockResolvedValue(true)
  }))
}));
jest.mock('@/utils/rate-limiter', () => ({
  createRateLimit: jest.fn(() => ({
    check: jest.fn().mockResolvedValue(true)
  }))
}));

// Mock lru-cache LRUCache as a constructor
jest.mock('lru-cache', () => ({
  LRUCache: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    has: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn()
  }))
}));

// Polyfill Headers and Response for Node
if (typeof global.Headers === 'undefined') {
  (global as any).Headers = class {
    private headers: Map<string, string> = new Map();
    
    constructor(init?: Record<string, string>) {
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this.headers.set(key.toLowerCase(), value);
        });
      }
    }
    
    set(name: string, value: string): void {
      this.headers.set(name.toLowerCase(), value);
    }
    
    get(name: string): string | null {
      return this.headers.get(name.toLowerCase()) || null;
    }
    
    has(name: string): boolean {
      return this.headers.has(name.toLowerCase());
    }
    
    delete(name: string): void {
      this.headers.delete(name.toLowerCase());
    }
    
    append(name: string, value: string): void {
      const existing = this.headers.get(name.toLowerCase());
      if (existing) {
        this.headers.set(name.toLowerCase(), `${existing}, ${value}`);
      } else {
        this.headers.set(name.toLowerCase(), value);
      }
    }
  };
}

if (typeof global.Response === 'undefined') {
  (global as any).Response = class {
    public headers: any;
    public status: number;
    public statusText: string;
    
    constructor(body?: any, init?: any) {
      this.headers = new (global as any).Headers(init?.headers);
      this.status = init?.status || 200;
      this.statusText = init?.statusText || 'OK';
    }
    
    static redirect(url: string, status: number = 302): any {
      return new (global as any).Response(null, {
        status,
        headers: {
          'Location': url
        }
      });
    }
  };
}

// Global defaultFileConfig for file validation tests
(global as any).defaultFileConfig = {
  maxSize: 5 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  allowedExtensions: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/pdf': ['.pdf']
  }
};
