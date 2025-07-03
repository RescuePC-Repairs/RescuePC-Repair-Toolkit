import { createHmac } from 'crypto';
import { headers } from 'next/headers';

interface SyncRequest {
  operation:
    | 'TEST_SYNC'
    | 'LICENSE_ACTIVATION'
    | 'LICENSE_DEACTIVATION'
    | 'PAYMENT_VERIFICATION'
    | 'EMAIL_DELIVERY'
    | 'WEBHOOK_STATUS';
  data: Record<string, any>;
}

interface ErrorResponse {
  status: 'error';
  code: string;
  message: string;
}

const ENDPOINT = 'https://rescuepcrepairs.com/api/route';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

export class AISyncImplementation {
  private generateSignature(timestamp: string, body: any): string {
    const message = `${timestamp}.${JSON.stringify(body)}`;
    return createHmac('sha256', process.env.AI_SYNC_SECRET!).update(message).digest('hex');
  }

  private async makeRequest(operation: string, data: any, retryCount = 0): Promise<any> {
    const timestamp = new Date().toISOString();
    const body = { operation, data };

    const requestHeaders = {
      'x-ai-signature': this.generateSignature(timestamp, body),
      'x-timestamp': timestamp,
      'x-ai-client-id': process.env.AI_CLIENT_ID || 'AI_2',
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error: ErrorResponse = await response.json();

        // Handle rate limiting
        if (response.status === 429 && retryCount < MAX_RETRIES) {
          const retryAfter = parseInt(response.headers.get('retry-after') || '1', 10);
          await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
          return this.makeRequest(operation, data, retryCount + 1);
        }

        throw new Error(`${error.code}: ${error.message}`);
      }

      return response.json();
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.makeRequest(operation, data, retryCount + 1);
      }
      throw error;
    }
  }

  async testSync(): Promise<any> {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.AWS_ACCESS_KEY_ID) {
      throw new Error('Required environment variables not set');
    }

    return this.makeRequest('TEST_SYNC', {
      stripeKey: process.env.STRIPE_SECRET_KEY.slice(-8),
      awsKey: process.env.AWS_ACCESS_KEY_ID.slice(-8),
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString()
    });
  }

  async activateLicense(licenseKey: string, pcIdentifier: string): Promise<any> {
    return this.makeRequest('LICENSE_ACTIVATION', {
      licenseKey,
      pcIdentifier
    });
  }

  async deactivateLicense(licenseKey: string, pcIdentifier: string): Promise<any> {
    return this.makeRequest('LICENSE_DEACTIVATION', {
      licenseKey,
      pcIdentifier
    });
  }

  async verifyPayment(paymentIntentId: string): Promise<any> {
    return this.makeRequest('PAYMENT_VERIFICATION', {
      paymentIntentId
    });
  }

  async checkEmailDelivery(emailId: string): Promise<any> {
    return this.makeRequest('EMAIL_DELIVERY', {
      emailId
    });
  }

  async checkWebhookHealth(webhookType: string): Promise<any> {
    return this.makeRequest('WEBHOOK_STATUS', {
      webhookType
    });
  }

  // Automated health check that runs every hour
  async startHealthCheck(intervalMs = 3600000): Promise<void> {
    const runHealthCheck = async () => {
      try {
        // Test basic connectivity
        await this.testSync();

        // Check webhook health
        const webhookStatus = await this.checkWebhookHealth('stripe_webhook');

        // Log health metrics
        console.info('AI Sync Health Check:', {
          timestamp: new Date().toISOString(),
          webhookSuccessRate: webhookStatus.data.successRate,
          recentEvents: webhookStatus.data.recentEvents.length
        });
      } catch (error) {
        console.error('AI Sync Health Check Failed:', error);
      }
    };

    // Initial check
    await runHealthCheck();

    // Schedule recurring checks
    setInterval(runHealthCheck, intervalMs);
  }
}
