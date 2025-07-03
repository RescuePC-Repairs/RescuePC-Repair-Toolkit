import { randomBytes } from 'crypto';

// Mock environment variables for security tests
process.env.SECURITY_SALT = randomBytes(32).toString('hex');
process.env.JWT_SECRET = randomBytes(32).toString('hex');
process.env.MFA_ISSUER = 'RescuePC-Test';
process.env.BIOMETRIC_ENABLED = 'true';
process.env.ZERO_TRUST_ENABLED = 'true';
process.env.SECURITY_LOG_LEVEL = 'debug';

// Mock security-related functions
jest.mock('@/utils/encryption', () => ({
  Encryption: {
    encrypt: jest.fn().mockImplementation((data: string) => `encrypted_${data}`),
    decrypt: jest.fn().mockImplementation((data: string) => data.replace('encrypted_', '')),
    hash: jest.fn().mockImplementation((data: string) => `hashed_${data}`),
    compare: jest
      .fn()
      .mockImplementation((plain: string, hashed: string) => `hashed_${plain}` === hashed)
  }
}));

// Mock security monitoring
jest.mock('@/utils/security-monitor', () => ({
  SecurityMonitor: {
    getInstance: jest.fn().mockReturnValue({
      logSecurityEvent: jest.fn().mockResolvedValue(undefined),
      getSecurityEvents: jest.fn().mockResolvedValue([]),
      clearEvents: jest.fn().mockResolvedValue(undefined)
    })
  }
}));

// Mock biometric verification
jest.mock('@/utils/biometric', () => ({
  BiometricVerifier: {
    verify: jest.fn().mockResolvedValue(true),
    enroll: jest.fn().mockResolvedValue(true)
  }
}));
