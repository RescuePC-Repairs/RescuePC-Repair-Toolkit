import { createCipheriv, createDecipheriv, randomBytes, createHash, scrypt } from 'crypto';
import { promisify } from 'util';

const ALGORITHM = 'aes-256-gcm';
const ITERATIONS = 1000000; // High iteration count for key derivation
const KEY_LENGTH = 32;
const SALT_LENGTH = 32;
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

export class Encryption {
  private static async deriveKey(password: string, salt: Buffer): Promise<Buffer> {
    const scryptAsync = promisify(scrypt);
    return scryptAsync(password, salt, KEY_LENGTH) as Promise<Buffer>;
  }

  public static async encrypt(data: string, password: string): Promise<string> {
    try {
      // Generate random salt and IV
      const salt = randomBytes(SALT_LENGTH);
      const iv = randomBytes(IV_LENGTH);

      // Derive encryption key
      const key = await this.deriveKey(password, salt);

      // Create cipher
      const cipher = createCipheriv(ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH
      });

      // Encrypt data
      const encryptedData = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);

      // Get auth tag
      const authTag = cipher.getAuthTag();

      // Combine all components
      const result = Buffer.concat([salt, iv, authTag, encryptedData]);

      // Add integrity check
      const hash = createHash('sha3-512').update(result).digest();

      return Buffer.concat([result, hash]).toString('base64');
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Encryption failed');
    }
  }

  public static async decrypt(encryptedData: string, password: string): Promise<string> {
    try {
      // Convert from base64
      const data = Buffer.from(encryptedData, 'base64');

      // Verify integrity
      const storedHash = data.slice(-64); // SHA3-512 hash is 64 bytes
      const actualData = data.slice(0, -64);
      const calculatedHash = createHash('sha3-512').update(actualData).digest();

      if (!calculatedHash.equals(storedHash)) {
        throw new Error('Data integrity check failed');
      }

      // Extract components
      const salt = actualData.slice(0, SALT_LENGTH);
      const iv = actualData.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
      const authTag = actualData.slice(
        SALT_LENGTH + IV_LENGTH,
        SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH
      );
      const encryptedContent = actualData.slice(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);

      // Derive key
      const key = await this.deriveKey(password, salt);

      // Create decipher
      const decipher = createDecipheriv(ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH
      });
      decipher.setAuthTag(authTag);

      // Decrypt data
      const decrypted = Buffer.concat([decipher.update(encryptedContent), decipher.final()]);

      return decrypted.toString('utf8');
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Decryption failed - data may be corrupted or tampered with');
    }
  }

  public static generateSecureKey(length = 32): string {
    return randomBytes(length).toString('base64');
  }

  public static async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(SALT_LENGTH);
    const key = await this.deriveKey(password, salt);
    return `${salt.toString('base64')}.${key.toString('base64')}`;
  }

  public static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const [storedSalt, storedHash] = hashedPassword.split('.');
    const salt = Buffer.from(storedSalt, 'base64');
    const hash = Buffer.from(storedHash, 'base64');
    const key = await this.deriveKey(password, salt);
    return key.equals(hash);
  }
}
