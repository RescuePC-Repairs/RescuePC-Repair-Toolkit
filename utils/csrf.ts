import { randomBytes, createHmac } from 'crypto';

if (!process.env.CSRF_SECRET) {
  throw new Error('CSRF_SECRET environment variable is required');
}

const SECRET_KEY = process.env.CSRF_SECRET;
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
  const token = randomBytes(TOKEN_LENGTH).toString('hex');
  const timestamp = Date.now();
  const signature = createSignature(token, timestamp);

  const csrfToken: CSRFToken = {
    token,
    timestamp,
    signature
  };

  return Buffer.from(JSON.stringify(csrfToken)).toString('base64');
}

/**
 * Validates a CSRF token
 * @param {string} encodedToken - The CSRF token to validate
 * @returns {boolean} Whether the token is valid
 */
export function validateCSRFToken(encodedToken: string | null | undefined): boolean {
  if (!encodedToken) {
    return false;
  }

  try {
    const decodedToken = Buffer.from(encodedToken, 'base64').toString();
    const csrfToken: CSRFToken = JSON.parse(decodedToken);

    // Check if token has expired
    if (Date.now() - csrfToken.timestamp > TOKEN_EXPIRY) {
      return false;
    }

    // Verify signature
    const expectedSignature = createSignature(csrfToken.token, csrfToken.timestamp);
    return csrfToken.signature === expectedSignature;
  } catch (error) {
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
  return validateCSRFToken(token);
}
