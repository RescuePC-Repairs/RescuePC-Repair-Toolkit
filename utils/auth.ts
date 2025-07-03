import { verify, sign, JwtPayload } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import { randomBytes } from 'crypto';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '1h';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  tokenVersion?: number;
}

/**
 * Generates access and refresh tokens
 * @param {object} payload - The data to encode in the token
 * @returns {object} Object containing access and refresh tokens
 */
export function generateTokens(payload: Omit<CustomJwtPayload, 'iat' | 'exp'>): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken = sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  const refreshToken = sign({ ...payload, tokenVersion: payload.tokenVersion || 0 }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY
  });

  return { accessToken, refreshToken };
}

/**
 * Validates a JWT token
 * @param {string} token - The token to validate
 * @returns {boolean} Whether the token is valid
 */
export function validateJWT(token: string): boolean {
  try {
    verify(token, JWT_SECRET) as CustomJwtPayload;
    return true;
  } catch {
    return false;
  }
}

/**
 * Decodes a JWT token without validating
 * @param {string} token - The token to decode
 * @returns {CustomJwtPayload | null} The decoded token payload or null if invalid
 */
export function decodeJWT(token: string): CustomJwtPayload | null {
  try {
    return verify(token, JWT_SECRET) as CustomJwtPayload;
  } catch {
    return null;
  }
}

/**
 * Hashes a password using bcrypt
 * @param {string} password - The password to hash
 * @returns {Promise<string>} The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

/**
 * Verifies a password against its hash
 * @param {string} password - The password to verify
 * @param {string} hash - The hash to verify against
 * @returns {Promise<boolean>} Whether the password matches
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

/**
 * Generates a secure random token
 * @param {number} bytes - Number of bytes for the token
 * @returns {string} The generated token
 */
export function generateSecureToken(bytes: number = 32): string {
  return randomBytes(bytes).toString('hex');
}

/**
 * Validates user permissions
 * @param {string} token - The JWT token
 * @param {string[]} requiredPermissions - The permissions to check for
 * @returns {boolean} Whether the user has all required permissions
 */
export function validatePermissions(token: string, requiredPermissions: string[]): boolean {
  const payload = decodeJWT(token);
  if (!payload) {
    return false;
  }

  return requiredPermissions.every((permission) => payload.permissions.includes(permission));
}

/**
 * Middleware to validate authentication
 * @param {Request} req - The incoming request
 * @returns {boolean} Whether the request is authenticated
 */
export function validateAuthRequest(req: Request): boolean {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.split(' ')[1];
  return validateJWT(token);
}

/**
 * Middleware to validate role-based access
 * @param {Request} req - The incoming request
 * @param {string[]} allowedRoles - The roles that have access
 * @returns {boolean} Whether the request has the required role
 */
export function validateRole(req: Request, allowedRoles: string[]): boolean {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.split(' ')[1];
  const payload = decodeJWT(token);
  if (!payload) {
    return false;
  }

  return allowedRoles.includes(payload.role);
}
