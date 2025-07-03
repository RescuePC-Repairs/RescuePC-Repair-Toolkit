import { createHmac } from 'crypto';
import { generateSyncKey } from './sync-key';

interface TestOperation {
  operation: string;
  timestamp: string;
  signature: string;
  data: Record<string, unknown>;
}

export async function generateTestOperation(): Promise<TestOperation> {
  const syncKey = generateSyncKey();
  const timestamp = new Date().toISOString();

  const data = {
    operation: 'TEST_SYNC',
    data: {
      stripeKey: process.env.STRIPE_SECRET_KEY?.slice(-8),
      awsKey: process.env.AWS_ACCESS_KEY_ID?.slice(-8),
      environment: process.env.NODE_ENV,
      timestamp
    }
  };

  const signature = createHmac('sha256', syncKey)
    .update(`${timestamp}.${JSON.stringify(data)}`)
    .digest('hex');

  return {
    ...data,
    timestamp,
    signature
  };
}

export async function verifyTestOperation(operation: TestOperation): Promise<boolean> {
  const syncKey = generateSyncKey();

  const expectedSignature = createHmac('sha256', syncKey)
    .update(
      `${operation.timestamp}.${JSON.stringify({
        operation: operation.operation,
        data: operation.data
      })}`
    )
    .digest('hex');

  return operation.signature === expectedSignature;
}
