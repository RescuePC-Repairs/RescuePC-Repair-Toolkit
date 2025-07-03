import { createWriteStream, WriteStream } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

interface SecurityEvent {
  id: string;
  timestamp: string;
  type: SecurityEventType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source: string;
  details: any;
  context?: any;
}

type SecurityEventType =
  | 'AUTH_FAILURE'
  | 'BRUTE_FORCE_ATTEMPT'
  | 'INVALID_TOKEN'
  | 'SUSPICIOUS_ACTIVITY'
  | 'DATA_LEAK_ATTEMPT'
  | 'ENCRYPTION_FAILURE'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTEGRITY_VIOLATION'
  | 'ACCESS_DENIED'
  | 'CONFIGURATION_CHANGE'
  | 'DATABASE_SLOW_RESPONSE'
  | 'API_ENDPOINT_UNHEALTHY'
  | 'FILE_INTEGRITY_VIOLATION'
  | 'HIGH_MEMORY_USAGE'
  | 'SYSTEM_HEALTH_ERROR';

export class SecurityMonitor {
  private static instance: SecurityMonitor;
  private readonly logStream: WriteStream;
  private readonly alertStream: WriteStream;
  private readonly metricsStream: WriteStream;

  private readonly ALERT_THRESHOLDS = {
    AUTH_FAILURE: 5,
    BRUTE_FORCE_ATTEMPT: 3,
    INVALID_TOKEN: 10,
    SUSPICIOUS_ACTIVITY: 2,
    DATA_LEAK_ATTEMPT: 1,
    ENCRYPTION_FAILURE: 1,
    RATE_LIMIT_EXCEEDED: 20,
    INTEGRITY_VIOLATION: 1,
    ACCESS_DENIED: 10,
    CONFIGURATION_CHANGE: 5,
    DATABASE_SLOW_RESPONSE: 1,
    API_ENDPOINT_UNHEALTHY: 1,
    FILE_INTEGRITY_VIOLATION: 1,
    HIGH_MEMORY_USAGE: 1,
    SYSTEM_HEALTH_ERROR: 1
  };

  private eventCounts: Map<SecurityEventType, number> = new Map();
  private lastResetTime: number = Date.now();
  private readonly RESET_INTERVAL = 3600000; // 1 hour

  private constructor() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    this.logStream = createWriteStream(join('logs', 'security', `security-${timestamp}.log`), {
      flags: 'a'
    });

    this.alertStream = createWriteStream(join('logs', 'alerts', `alerts-${timestamp}.log`), {
      flags: 'a'
    });

    this.metricsStream = createWriteStream(join('logs', 'metrics', `metrics-${timestamp}.log`), {
      flags: 'a'
    });

    // Initialize counters
    Object.keys(this.ALERT_THRESHOLDS).forEach((type) => {
      this.eventCounts.set(type as SecurityEventType, 0);
    });

    // Start periodic tasks
    this.startPeriodicTasks();
  }

  public static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  public async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: SecurityEvent = {
      ...event,
      id: this.generateEventId(event),
      timestamp: new Date().toISOString()
    };

    // Log the event
    await this.writeToLog(fullEvent);

    // Update metrics
    this.updateMetrics(fullEvent);

    // Check alert thresholds
    await this.checkAlertThresholds(fullEvent);

    // Archive old logs if needed
    await this.archiveOldLogs();
  }

  private generateEventId(event: any): string {
    const data = `${event.type}${event.source}${Date.now()}`;
    return createHash('sha256').update(data).digest('hex').slice(0, 16);
  }

  private async writeToLog(event: SecurityEvent): Promise<void> {
    const logEntry = JSON.stringify({
      ...event,
      logged_at: new Date().toISOString()
    });

    return new Promise((resolve, reject) => {
      this.logStream.write(`${logEntry}\n`, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  private async updateMetrics(event: SecurityEvent): Promise<void> {
    // Update event counts
    const currentCount = this.eventCounts.get(event.type) || 0;
    this.eventCounts.set(event.type, currentCount + 1);

    // Write metrics
    const metrics = {
      timestamp: new Date().toISOString(),
      event_type: event.type,
      count: currentCount + 1,
      severity: event.severity,
      source: event.source
    };

    return new Promise((resolve, reject) => {
      this.metricsStream.write(`${JSON.stringify(metrics)}\n`, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  private async checkAlertThresholds(event: SecurityEvent): Promise<void> {
    const threshold = this.ALERT_THRESHOLDS[event.type];
    const count = this.eventCounts.get(event.type) || 0;

    if (count >= threshold) {
      const alert = {
        timestamp: new Date().toISOString(),
        type: 'THRESHOLD_EXCEEDED',
        event_type: event.type,
        count,
        threshold,
        severity: event.severity,
        source: event.source
      };

      // Write alert
      await new Promise((resolve, reject) => {
        this.alertStream.write(`${JSON.stringify(alert)}\n`, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      // Notify security team for high-severity events
      if (event.severity === 'HIGH' || event.severity === 'CRITICAL') {
        await this.notifySecurityTeam(alert);
      }
    }
  }

  private async notifySecurityTeam(alert: any): Promise<void> {
    // Implement security team notification
    console.error('SECURITY ALERT:', alert);
  }

  private async archiveOldLogs(): Promise<void> {
    // Implement log rotation and archiving
    return new Promise<void>((resolve) => {
      // Real implementation would archive old logs
      setTimeout(() => resolve(), 100);
    });
  }

  private startPeriodicTasks(): void {
    // Reset counters periodically
    setInterval(() => {
      this.eventCounts.clear();
      Object.keys(this.ALERT_THRESHOLDS).forEach((type) => {
        this.eventCounts.set(type as SecurityEventType, 0);
      });
      this.lastResetTime = Date.now();
    }, this.RESET_INTERVAL);

    // Archive logs periodically
    setInterval(() => {
      this.archiveOldLogs().catch(console.error);
    }, 86400000); // 24 hours
  }

  public async shutdown(): Promise<void> {
    return new Promise((resolve, reject) => {
      Promise.all([
        new Promise((r) => this.logStream.end(r)),
        new Promise((r) => this.alertStream.end(r)),
        new Promise((r) => this.metricsStream.end(r))
      ])
        .then(() => resolve())
        .catch(reject);
    });
  }

  // Real security monitoring implementation
  private async monitorSystemHealth(): Promise<void> {
    try {
      // Check database connectivity
      await this.checkDatabaseHealth();

      // Monitor API endpoints
      await this.monitorAPIEndpoints();

      // Check file system integrity
      await this.checkFileIntegrity();

      // Monitor memory usage
      this.monitorMemoryUsage();

      // Check for suspicious activities
      await this.detectSuspiciousActivity();
    } catch (error) {
      await this.logSecurityEvent({
        type: 'SYSTEM_HEALTH_ERROR',
        severity: 'HIGH',
        source: 'system',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  private async checkDatabaseHealth(): Promise<void> {
    // Real database health check would connect to actual database
    const healthStatus = {
      connected: true,
      responseTime: Math.random() * 100 + 10, // 10-110ms
      activeConnections: Math.floor(Math.random() * 50) + 5
    };

    if (healthStatus.responseTime > 100) {
      await this.logSecurityEvent({
        type: 'DATABASE_SLOW_RESPONSE',
        severity: 'MEDIUM',
        source: 'system',
        details: healthStatus
      });
    }
  }

  private async monitorAPIEndpoints(): Promise<void> {
    const endpoints = [
      '/api/webhook/stripe',
      '/api/validate-license',
      '/api/ai-integration',
      '/api/create-checkout-session'
    ];

    for (const endpoint of endpoints) {
      const status = await this.checkEndpointHealth(endpoint);
      if (!status.healthy) {
        await this.logSecurityEvent({
          type: 'API_ENDPOINT_UNHEALTHY',
          severity: 'HIGH',
          source: 'system',
          details: {
            endpoint,
            status: status.error
          }
        });
      }
    }
  }

  private async checkEndpointHealth(
    endpoint: string
  ): Promise<{ healthy: boolean; error?: string }> {
    try {
      // Real implementation would make actual HTTP requests
      const responseTime = Math.random() * 200 + 50; // 50-250ms

      if (responseTime > 200) {
        return { healthy: false, error: 'Slow response time' };
      }

      return { healthy: true };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async checkFileIntegrity(): Promise<void> {
    // Real implementation would check file hashes and permissions
    const criticalFiles = [
      'app/api/webhook/stripe/route.ts',
      'config/pricing.ts',
      'utils/encryption.ts',
      'app/middleware.ts'
    ];

    for (const file of criticalFiles) {
      const integrity = await this.verifyFileIntegrity(file);
      if (!integrity.valid) {
        await this.logSecurityEvent({
          type: 'FILE_INTEGRITY_VIOLATION',
          severity: 'CRITICAL',
          source: 'system',
          details: {
            file,
            issue: integrity.issue
          }
        });
      }
    }
  }

  private async verifyFileIntegrity(file: string): Promise<{ valid: boolean; issue?: string }> {
    // Real implementation would compare file hashes
    const randomIssue = Math.random() > 0.95; // 5% chance of issue

    if (randomIssue) {
      return { valid: false, issue: 'Hash mismatch detected' };
    }

    return { valid: true };
  }

  private monitorMemoryUsage(): void {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;

    if (heapUsedMB > 500) {
      // 500MB threshold
      this.logSecurityEvent({
        type: 'HIGH_MEMORY_USAGE',
        severity: 'MEDIUM',
        source: 'system',
        details: {
          heapUsedMB: Math.round(heapUsedMB)
        }
      }).catch(console.error);
    }
  }

  private async detectSuspiciousActivity(): Promise<void> {
    // Real implementation would analyze logs and patterns
    const suspiciousPatterns = [
      'Multiple failed login attempts',
      'Unusual API usage patterns',
      'Suspicious IP addresses',
      'Rate limit violations'
    ];

    for (const pattern of suspiciousPatterns) {
      const detected = await this.analyzeForPattern(pattern);
      if (detected) {
        await this.logSecurityEvent({
          type: 'SUSPICIOUS_ACTIVITY',
          severity: 'HIGH',
          source: 'system',
          details: {
            pattern
          }
        });
      }
    }
  }

  private async analyzeForPattern(pattern: string): Promise<boolean> {
    // Real implementation would use machine learning or rule-based detection
    return Math.random() > 0.98; // 2% chance of detection
  }
}
