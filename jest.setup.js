// Add Jest extended matchers
import '@testing-library/jest-dom';

// Mock the crypto module
const mockRandomUUID = jest.fn(() => 'test-uuid');
const mockRandomValues = jest.fn((array) => {
  array.fill(1);
  return array;
});

global.crypto = {
  randomUUID: mockRandomUUID,
  getRandomValues: mockRandomValues,
  subtle: {
    digest: jest.fn().mockResolvedValue(new Uint8Array(32).fill(1))
  }
};

// Mock environment variables
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  ENCRYPTION_KEY: 'test-encryption-key',
  SIGNING_KEY: 'test-signing-key',
  JWT_SECRET: 'rescue_pc_jwt_secret_military_grade_authentication_2024_production',
  BCRYPT_SALT_ROUNDS: '12',
  CSRF_SECRET: 'test_csrf_secret'
};

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

// Polyfill Request/NextRequest/NextResponse/Response for Node
if (typeof global.Request === 'undefined') {
  global.Request = function () {};
}
if (typeof global.NextRequest === 'undefined') {
  global.NextRequest = function () {};
}
if (typeof global.NextResponse === 'undefined') {
  global.NextResponse = function () {};
}
if (typeof global.Response === 'undefined') {
  global.Response = function () {};
}

// Mock nodemailer with proper default export
jest.mock('nodemailer', () => {
  const createTransport = jest.fn(() => ({
    sendMail: jest.fn(() => Promise.resolve({ messageId: 'mocked' }))
  }));
  return {
    __esModule: true,
    default: { createTransport },
    createTransport
  };
});

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked.jwt.token'),
  verify: jest.fn(() => ({ id: 'mocked', email: 'mocked', role: 'user' }))
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashed_password')),
  compare: jest.fn(() => Promise.resolve(true))
}));

// Mock Stripe as a class
jest.mock('stripe', () => {
  const Stripe = jest.fn().mockImplementation(() => ({
    customers: { create: jest.fn(), retrieve: jest.fn() },
    subscriptions: { create: jest.fn(), retrieve: jest.fn() },
    paymentIntents: { create: jest.fn(), retrieve: jest.fn() },
    checkout: { sessions: { create: jest.fn(), retrieve: jest.fn() } },
    webhooks: { constructEvent: jest.fn() },
    products: { list: jest.fn() },
    prices: { list: jest.fn() },
    invoices: { create: jest.fn(), retrieve: jest.fn() },
    paymentMethods: { attach: jest.fn() },
    balanceTransactions: { retrieve: jest.fn() },
    events: { list: jest.fn() },
  }));
  return { __esModule: true, default: Stripe };
});

// Mock @upstash/redis to avoid ESM issues
jest.mock('@upstash/redis', () => ({
  Redis: Object.assign(jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
  })), {
    fromEnv: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      incr: jest.fn(),
      expire: jest.fn(),
    }))
  })
}));

// Mock @upstash/ratelimit to avoid ESM issues
jest.mock('@upstash/ratelimit', () => ({
  Ratelimit: jest.fn().mockImplementation(() => ({
    limit: jest.fn(() => Promise.resolve({ success: true }))
  }))
}));

// Mock the Ratelimit constructor and static methods
const RatelimitMock = jest.fn().mockImplementation(() => ({
  limit: jest.fn(() => Promise.resolve({ success: true }))
}));
RatelimitMock.slidingWindow = jest.fn(() => ({
  limit: jest.fn(() => Promise.resolve({ success: true }))
}));

jest.doMock('@upstash/ratelimit', () => ({
  Ratelimit: RatelimitMock
}));

// Mock @edge-runtime/cookies to avoid undefined errors in NextRequest/NextResponse
jest.mock('next/dist/compiled/@edge-runtime/cookies', () => ({
  RequestCookies: jest.fn().mockImplementation(() => ({ get: jest.fn() })),
  ResponseCookies: jest.fn().mockImplementation(() => ({ getSetCookie: jest.fn() })),
}));

// Mock lru-cache for rate limiting
jest.mock('lru-cache', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    has: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
  })),
}));

// Explicitly mock utility functions as Jest mock functions
jest.mock('@/utils/auth', () => ({
  __esModule: true,
  validateJWT: jest.fn(),
  generateTokens: jest.fn(),
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
}));
jest.mock('@/utils/csrf', () => ({
  __esModule: true,
  validateCSRFToken: jest.fn(),
  generateCSRFToken: jest.fn(),
}));
jest.mock('@/utils/originValidation', () => ({
  __esModule: true,
  validateOrigin: jest.fn(),
  getOriginTrustScore: jest.fn(),
}));
jest.mock('@/utils/botDetection', () => ({
  __esModule: true,
  detectBot: jest.fn(),
  getBotScore: jest.fn(),
}));
