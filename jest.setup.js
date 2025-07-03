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
  SIGNING_KEY: 'test-signing-key'
};

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};
