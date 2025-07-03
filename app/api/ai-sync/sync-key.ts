import { createHash, randomBytes } from 'crypto';

// Generate a deterministic sync key based on our environment
export function generateSyncKey(): string {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.AWS_ACCESS_KEY_ID) {
    throw new Error('Required environment variables not set');
  }

  // Use production credentials to generate a deterministic key
  const seed = `${process.env.STRIPE_SECRET_KEY}:${process.env.AWS_ACCESS_KEY_ID}`;
  const hash = createHash('sha256').update(seed).digest('hex');

  // Generate a random salt
  const salt = randomBytes(16).toString('hex');

  // Combine hash and salt
  return `sync_${hash.slice(0, 32)}${salt}`;
}

// Validate incoming sync key
export function validateSyncKey(key: string): boolean {
  if (!key.startsWith('sync_')) return false;

  const hash = key.slice(5, 37);
  const salt = key.slice(37);

  if (hash.length !== 32 || salt.length !== 32) return false;

  // Regenerate our key and compare the hash portion
  const ourKey = generateSyncKey();
  const ourHash = ourKey.slice(5, 37);

  return hash === ourHash;
}
