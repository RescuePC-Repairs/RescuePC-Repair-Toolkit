import { WebSocket, Server as WebSocketServer } from 'ws';
import { createHmac } from 'crypto';
import { AutomatedHandler } from './automated-handler';
import { PCloudHandler } from './pcloud-handler';
import { ToolkitHandler } from './toolkit-handler';
import { IncomingMessage } from 'http';
import { RateLimiter } from './rate-limiter';
import { z } from 'zod';

// Strict type definitions
const WebSocketMessageSchema = z.object({
  operation: z.string(),
  timestamp: z.string().datetime(),
  data: z.any().optional(),
  signature: z.string().optional()
});

type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;

interface WebSocketClient extends WebSocket {
  isAlive: boolean;
  lastPing: number;
  clientId: string;
  rateLimiter: RateLimiter;
}

class AIWebSocketHandler {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocketClient> = new Map();
  private pingInterval!: NodeJS.Timeout;
  private readonly config = {
    pingInterval: 30000, // 30 seconds
    pingTimeout: 10000, // 10 seconds
    maxClients: 10,
    allowedIPs: process.env.AI_SYNC_ALLOWED_IPS?.split(',') || ['127.0.0.1'],
    secret: process.env.AI_SYNC_SECRET!,
    rateLimit: {
      windowMs: 60000,
      maxRequests: 100
    }
  };

  private automatedHandler = new AutomatedHandler();
  private pcloudHandler = new PCloudHandler();
  private toolkitHandler = new ToolkitHandler();

  constructor(server: any) {
    this.wss = new WebSocketServer({
      server,
      clientTracking: true,
      perMessageDeflate: true
    });
    this.setupWebSocketServer();
    this.startPingInterval();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocketClient, req: IncomingMessage) => {
      try {
        // Check IP whitelist
        const clientIP =
          req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || '';
        if (!this.config.allowedIPs.includes(clientIP)) {
          ws.close(1008, 'IP not whitelisted');
          return;
        }

        // Check max clients
        if (this.clients.size >= this.config.maxClients) {
          ws.close(1013, 'Maximum connections reached');
          return;
        }

        // Initialize client
        ws.isAlive = true;
        ws.lastPing = Date.now();
        ws.clientId = this.generateClientId();
        ws.rateLimiter = new RateLimiter(
          this.config.rateLimit.windowMs,
          this.config.rateLimit.maxRequests
        );
        this.clients.set(ws.clientId, ws);

        // Setup event handlers
        this.setupClientHandlers(ws);

        // Send welcome message
        this.sendToClient(ws, {
          operation: 'CONNECTED',
          timestamp: new Date().toISOString(),
          data: {
            clientId: ws.clientId,
            message: 'Successfully connected to AI sync system'
          }
        });
      } catch (error) {
        console.error('Connection setup error:', error);
        ws.close(1011, 'Internal server error');
      }
    });
  }

  private setupClientHandlers(ws: WebSocketClient) {
    ws.on('message', async (data: Buffer) => {
      try {
        // Check rate limit
        if (!ws.rateLimiter.tryRequest()) {
          this.sendError(ws, 'Rate limit exceeded');
          return;
        }

        const message = JSON.parse(data.toString());

        // Validate message format using Zod
        const result = WebSocketMessageSchema.safeParse(message);
        if (!result.success) {
          this.sendError(ws, `Invalid message format: ${result.error.message}`);
          return;
        }

        // Validate signature if provided
        if (message.signature && !this.validateSignature(message)) {
          this.sendError(ws, 'Invalid signature');
          return;
        }

        // Handle message
        await this.handleMessage(ws, message);
      } catch (error) {
        console.error('Message handling error:', error);
        this.sendError(ws, 'Failed to process message');
      }
    });

    ws.on('pong', () => {
      ws.isAlive = true;
      ws.lastPing = Date.now();
    });

    ws.on('close', () => {
      this.clients.delete(ws.clientId);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${ws.clientId}:`, error);
      ws.close(1011, 'Internal error');
    });
  }

  private async handleMessage(ws: WebSocketClient, message: WebSocketMessage) {
    try {
      switch (message.operation) {
        case 'LICENSE_GENERATED':
          await this.automatedHandler.handleLicenseGeneration(message.data);
          break;

        case 'PAYMENT_PROCESSED':
          await this.automatedHandler.handlePaymentProcessing(message.data);
          break;

        case 'TOOLKIT_UPDATE':
          await this.toolkitHandler.handleToolkitUpdate(message.data);
          break;

        case 'PCLOUD_SYNC':
          await this.pcloudHandler.handlePCloudSync(message.data);
          break;

        case 'TEST_RESULTS':
          await this.handleTestResults(message.data);
          break;

        case 'PING':
          this.sendToClient(ws, {
            operation: 'PONG',
            timestamp: new Date().toISOString()
          });
          break;

        default:
          this.sendError(ws, `Unknown operation: ${message.operation}`);
      }
    } catch (error) {
      this.sendError(ws, 'Operation failed');
      console.error('Message handling error:', error);
    }
  }

  private async handleTestResults(results: any) {
    // Broadcast test results to all connected clients
    this.broadcast({
      operation: 'TEST_RESULTS_UPDATE',
      timestamp: new Date().toISOString(),
      data: results
    });

    // Log test results
    console.log('Test Results:', {
      successRate: results.successRate,
      totalDuration: results.totalDuration,
      failedTests: results.tests.filter((t: any) => !t.success).map((t: any) => t.name)
    });
  }

  private startPingInterval() {
    this.pingInterval = setInterval(() => {
      const now = Date.now();

      this.clients.forEach((ws, clientId) => {
        if (!ws.isAlive || now - ws.lastPing > this.config.pingTimeout) {
          console.log(`Client ${clientId} timed out`);
          ws.terminate();
          this.clients.delete(clientId);
          return;
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, this.config.pingInterval);
  }

  private validateMessage(message: any): message is WebSocketMessage {
    return (
      typeof message === 'object' &&
      typeof message.operation === 'string' &&
      typeof message.timestamp === 'string' &&
      new Date(message.timestamp).toString() !== 'Invalid Date'
    );
  }

  private validateSignature(message: WebSocketMessage): boolean {
    if (!message.signature) return false;

    const payload = JSON.stringify({
      operation: message.operation,
      timestamp: message.timestamp,
      data: message.data
    });

    const expectedSignature = createHmac('sha256', this.config.secret)
      .update(payload)
      .digest('hex');

    return message.signature === expectedSignature;
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sendToClient(ws: WebSocketClient, message: WebSocketMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private sendError(ws: WebSocketClient, error: string) {
    this.sendToClient(ws, {
      operation: 'ERROR',
      timestamp: new Date().toISOString(),
      data: { error }
    });
  }

  private broadcast(message: WebSocketMessage) {
    this.clients.forEach((client) => {
      this.sendToClient(client, message);
    });
  }

  public stop() {
    clearInterval(this.pingInterval);
    this.wss.close();
  }
}

export const webSocketHandler = (server: any) => new AIWebSocketHandler(server);
