// Mock SecurityMonitor import
const SecurityMonitor = {
  instance: null
};

// Mock timers for all security tests
beforeEach(() => {
  jest.useFakeTimers();
  // Reset SecurityMonitor singleton
  (SecurityMonitor as any).instance = null;
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

// Mock crypto functions
global.crypto = {
  getRandomValues: jest.fn((arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  }),
  subtle: {
    generateKey: jest.fn(),
    sign: jest.fn(),
    verify: jest.fn(),
    encrypt: jest.fn(),
    decrypt: jest.fn()
  }
} as any;

// Mock fetch
global.fetch = jest.fn();

// Mock console methods
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

// Mock environment variables
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  ENCRYPTION_KEY: 'test-encryption-key',
  SIGNING_KEY: 'test-signing-key'
};
