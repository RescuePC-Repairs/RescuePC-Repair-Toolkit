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
