import { WebSocket } from 'ws';
import { createHmac } from 'crypto';
import fetch from 'cross-fetch';
import { performance } from 'perf_hooks';

interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  error?: string;
  metrics?: Record<string, number>;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  startTime: number;
  endTime: number;
  totalDuration: number;
  successRate: number;
}

class AIIntegrationTestSuite {
  private config = {
    wsEndpoint: 'wss://pcloud.rescuepcrepairs.com/ai-sync/ws',
    httpEndpoint: 'https://pcloud.rescuepcrepairs.com/ai-sync',
    backupEndpoint: 'https://api.rescuepcrepairs.com/ai-sync-backup',
    secret: process.env.AI_SYNC_SECRET!,
    allowedIPs: ['127.0.0.1', process.env.AI_SYNC_IP!]
  };

  private results: TestResult[] = [];
  private startTime: number = 0;
  private endTime: number = 0;

  // WebSocket connection test
  private async testWebSocketConnection(): Promise<TestResult> {
    const start = performance.now();
    try {
      const ws = new WebSocket(this.config.wsEndpoint);

      await new Promise((resolve, reject) => {
        ws.on('open', resolve);
        ws.on('error', reject);
        setTimeout(() => reject(new Error('WebSocket connection timeout')), 5000);
      });

      const latency = performance.now() - start;
      ws.close();

      return {
        name: 'WebSocket Connection',
        success: true,
        duration: latency,
        metrics: { latency }
      };
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      return {
        name: 'WebSocket Connection',
        success: false,
        duration: performance.now() - start,
        error
      };
    }
  }

  // HTTP endpoint test
  private async testHTTPEndpoint(): Promise<TestResult> {
    const start = performance.now();
    try {
      const timestamp = Date.now().toString();
      const signature = createHmac('sha256', this.config.secret).update(timestamp).digest('hex');

      const response = await fetch(this.config.httpEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Timestamp': timestamp,
          'X-Signature': signature
        },
        body: JSON.stringify({ operation: 'TEST' })
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const latency = performance.now() - start;
      return {
        name: 'HTTP Endpoint',
        success: true,
        duration: latency,
        metrics: { latency }
      };
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      return {
        name: 'HTTP Endpoint',
        success: false,
        duration: performance.now() - start,
        error
      };
    }
  }

  // Security test
  private async testSecurity(): Promise<TestResult> {
    const start = performance.now();
    try {
      // Test HMAC validation
      const invalidSignature = await fetch(this.config.httpEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Timestamp': Date.now().toString(),
          'X-Signature': 'invalid'
        },
        body: JSON.stringify({ operation: 'TEST' })
      });

      if (invalidSignature.status !== 401) {
        throw new Error('HMAC validation failed');
      }

      // Test IP whitelisting
      const response = await fetch(this.config.httpEndpoint, {
        method: 'POST',
        headers: {
          'X-Forwarded-For': '1.2.3.4'
        }
      });

      if (response.status !== 403) {
        throw new Error('IP whitelisting failed');
      }

      return {
        name: 'Security Checks',
        success: true,
        duration: performance.now() - start
      };
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      return {
        name: 'Security Checks',
        success: false,
        duration: performance.now() - start,
        error
      };
    }
  }

  // Backup endpoint test
  private async testBackupEndpoint(): Promise<TestResult> {
    const start = performance.now();
    try {
      const timestamp = Date.now().toString();
      const signature = createHmac('sha256', this.config.secret).update(timestamp).digest('hex');

      const response = await fetch(this.config.backupEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Timestamp': timestamp,
          'X-Signature': signature
        },
        body: JSON.stringify({ operation: 'TEST' })
      });

      if (!response.ok) {
        throw new Error(`Backup endpoint error: ${response.status}`);
      }

      const latency = performance.now() - start;
      return {
        name: 'Backup Endpoint',
        success: true,
        duration: latency,
        metrics: { latency }
      };
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      return {
        name: 'Backup Endpoint',
        success: false,
        duration: performance.now() - start,
        error
      };
    }
  }

  // Run all tests
  public async runTests(): Promise<TestSuite> {
    this.startTime = performance.now();
    this.results = [];

    // Run tests in parallel
    const tests = await Promise.all([
      this.testWebSocketConnection(),
      this.testHTTPEndpoint(),
      this.testSecurity(),
      this.testBackupEndpoint()
    ]);

    this.results.push(...tests);
    this.endTime = performance.now();

    const successCount = this.results.filter((r) => r.success).length;
    const totalDuration = this.endTime - this.startTime;

    return {
      name: 'AI Integration Test Suite',
      tests: this.results,
      startTime: this.startTime,
      endTime: this.endTime,
      totalDuration,
      successRate: (successCount / this.results.length) * 100
    };
  }

  // Broadcast results via WebSocket
  public async broadcastResults(results: TestSuite): Promise<void> {
    try {
      const ws = new WebSocket(this.config.wsEndpoint);

      await new Promise((resolve) => {
        ws.on('open', resolve);
      });

      ws.send(
        JSON.stringify({
          operation: 'TEST_RESULTS',
          data: results
        })
      );

      ws.close();
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to broadcast test results:', error);
    }
  }
}

// Export test suite
export const testSuite = new AIIntegrationTestSuite();

// Run tests every 5 minutes
export async function startTestSchedule() {
  while (true) {
    try {
      const results = await testSuite.runTests();
      await testSuite.broadcastResults(results);

      // Log results
      console.log('Test Suite Results:', {
        successRate: results.successRate,
        totalDuration: results.totalDuration,
        failedTests: results.tests.filter((t) => !t.success).map((t) => t.name)
      });

      // Wait 5 minutes
      await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000));
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      console.error('Test schedule error:', error);
      // Wait 1 minute before retrying on error
      await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
    }
  }
}
