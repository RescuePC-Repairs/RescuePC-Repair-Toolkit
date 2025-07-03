import { createHmac } from 'crypto';
import { generateSyncKey } from './sync-key';

interface ConnectionVerification {
  stripeKey: string;
  awsKey: string;
  environment: string;
  timestamp: string;
  signature: string;
}

export async function verifyConnection(otherAI: ConnectionVerification): Promise<boolean> {
  // Verify environment keys match
  const ourStripeKey = process.env.STRIPE_SECRET_KEY?.slice(-8);
  const ourAwsKey = process.env.AWS_ACCESS_KEY_ID?.slice(-8);

  if (otherAI.stripeKey !== ourStripeKey || otherAI.awsKey !== ourAwsKey) {
    console.error('Environment key mismatch:', {
      stripe: { ours: ourStripeKey, theirs: otherAI.stripeKey },
      aws: { ours: ourAwsKey, theirs: otherAI.awsKey }
    });
    return false;
  }

  // Verify signature
  const syncKey = generateSyncKey();
  const expectedSignature = createHmac('sha256', syncKey)
    .update(
      `${otherAI.timestamp}.${JSON.stringify({
        stripeKey: otherAI.stripeKey,
        awsKey: otherAI.awsKey,
        environment: otherAI.environment
      })}`
    )
    .digest('hex');

  if (otherAI.signature !== expectedSignature) {
    console.error('Signature mismatch');
    return false;
  }

  return true;
}

export async function generateConnectionRequest(): Promise<ConnectionVerification> {
  const timestamp = new Date().toISOString();
  const syncKey = generateSyncKey();

  if (!process.env.STRIPE_SECRET_KEY || !process.env.AWS_ACCESS_KEY_ID) {
    throw new Error('Required environment variables not set');
  }

  const data = {
    stripeKey: process.env.STRIPE_SECRET_KEY.slice(-8),
    awsKey: process.env.AWS_ACCESS_KEY_ID.slice(-8),
    environment: process.env.NODE_ENV || 'production',
    timestamp
  };

  const signature = createHmac('sha256', syncKey)
    .update(
      `${timestamp}.${JSON.stringify({
        stripeKey: data.stripeKey,
        awsKey: data.awsKey,
        environment: data.environment
      })}`
    )
    .digest('hex');

  return {
    ...data,
    signature
  };
}
