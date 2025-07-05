import { randomBytes, createHmac } from 'crypto';

const SECRET_KEY = process.env.CSRF_SECRET || 'default-csrf-secret-for-testing';
const TOKEN_LENGTH = 32;
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CSRFToken {
  token: string;
  timestamp: number;
  signature: string;
}

/**
 * Generates a new CSRF token
 * @returns {string} The generated CSRF token
 */
export function generateCSRFToken(): string {
  const timestamp = Date.now();
  const tokenData = {
    timestamp: timestamp,
    signature: createSignature('token', timestamp),
    nonce: Math.random().toString(36).substring(2)
  };
  return Buffer.from(JSON.stringify(tokenData)).toString('base64');
}

/**
 * Validates a CSRF token
 * @param {string} token - The CSRF token to validate
 * @returns {boolean} Whether the token is valid
 */
export function validateCSRFToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    if (!decoded.timestamp || !decoded.signature) return false;

    // Check if token is expired (24 hours)
    const now = Date.now();
    if (now - decoded.timestamp > TOKEN_EXPIRY) return false;

    // Validate signature
    const expectedSignature = createSignature('token', decoded.timestamp);
    if (decoded.signature !== expectedSignature) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a signature for a CSRF token
 * @param {string} token - The token to sign
 * @param {number} timestamp - The timestamp of token creation
 * @returns {string} The signature
 */
function createSignature(token: string, timestamp: number): string {
  const hmac = createHmac('sha256', SECRET_KEY);
  hmac.update(`${token}${timestamp}`);
  return hmac.digest('hex');
}

/**
 * Middleware to validate CSRF tokens in requests
 * @param {Request} req - The incoming request
 * @returns {boolean} Whether the request has a valid CSRF token
 */
export function validateCSRFRequest(req: Request): boolean {
  const token = req.headers.get('X-CSRF-Token');
  return validateCSRFToken(token || '');
}
