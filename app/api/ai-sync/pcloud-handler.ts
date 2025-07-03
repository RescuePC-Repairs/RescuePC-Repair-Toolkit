import { WebSocket } from 'ws';
import { createHmac } from 'crypto';

interface PCloudSyncData {
  operation: 'BACKUP' | 'RESTORE' | 'SYNC';
  files: string[];
  timestamp: string;
  metadata?: Record<string, any>;
}

export class PCloudHandler {
  private readonly config = {
    wsEndpoint: 'wss://pcloud.rescuepcrepairs.com/ai-sync/ws',
    httpEndpoint: 'https://pcloud.rescuepcrepairs.com/ai-sync',
    secret: process.env.AI_SYNC_SECRET!,
    backupPath: 'backups',
    syncPath: 'sync'
  };

  private ws: WebSocket | null = null;

  constructor() {
    this.connectWebSocket();
  }

  private connectWebSocket() {
    this.ws = new WebSocket(this.config.wsEndpoint);

    this.ws.on('open', () => {
      console.log('PCloudHandler connected to WebSocket');
    });

    this.ws.on('error', (error) => {
      console.error('PCloudHandler WebSocket error:', error);
    });

    this.ws.on('close', () => {
      console.log('PCloudHandler WebSocket closed, reconnecting...');
      setTimeout(() => this.connectWebSocket(), 5000);
    });
  }

  public async handlePCloudSync(data: PCloudSyncData) {
    try {
      // Validate sync data
      this.validateSyncData(data);

      // Generate HMAC signature
      const signature = this.generateSignature(data);

      // Process sync operation
      await this.processSyncOperation(data);

      // Notify other systems
      this.notifySyncComplete(data, signature);

      console.log('PCloud sync completed successfully:', data.operation);
    } catch (error) {
      console.error('PCloud sync failed:', error);
      throw error;
    }
  }

  private validateSyncData(data: PCloudSyncData) {
    if (!data.operation || !data.files || !data.timestamp) {
      throw new Error('Invalid sync data');
    }

    if (!['BACKUP', 'RESTORE', 'SYNC'].includes(data.operation)) {
      throw new Error('Invalid operation type');
    }

    if (!Array.isArray(data.files) || data.files.length === 0) {
      throw new Error('Invalid files array');
    }

    if (new Date(data.timestamp).toString() === 'Invalid Date') {
      throw new Error('Invalid timestamp');
    }
  }

  private generateSignature(data: any): string {
    return createHmac('sha256', this.config.secret).update(JSON.stringify(data)).digest('hex');
  }

  private async processSyncOperation(data: PCloudSyncData) {
    const fs = require('fs').promises;
    const path = require('path');

    switch (data.operation) {
      case 'BACKUP':
        await this.handleBackup(data.files);
        break;
      case 'RESTORE':
        await this.handleRestore(data.files);
        break;
      case 'SYNC':
        await this.handleSync(data.files);
        break;
    }
  }

  private async handleBackup(files: string[]) {
    const fs = require('fs').promises;
    const path = require('path');

    for (const file of files) {
      try {
        const sourcePath = path.resolve(file);
        const backupPath = path.join(this.config.backupPath, file);

        await fs.mkdir(path.dirname(backupPath), { recursive: true });
        await fs.copyFile(sourcePath, backupPath);
      } catch (error) {
        console.error(`Failed to backup file ${file}:`, error);
      }
    }
  }

  private async handleRestore(files: string[]) {
    const fs = require('fs').promises;
    const path = require('path');

    for (const file of files) {
      try {
        const backupPath = path.join(this.config.backupPath, file);
        const targetPath = path.resolve(file);

        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.copyFile(backupPath, targetPath);
      } catch (error) {
        console.error(`Failed to restore file ${file}:`, error);
      }
    }
  }

  private async handleSync(files: string[]) {
    const fs = require('fs').promises;
    const path = require('path');

    for (const file of files) {
      try {
        const sourcePath = path.resolve(file);
        const syncPath = path.join(this.config.syncPath, file);

        // Check if source is newer
        const sourceStats = await fs.stat(sourcePath);
        let syncStats;
        try {
          syncStats = await fs.stat(syncPath);
        } catch {
          syncStats = { mtime: new Date(0) };
        }

        if (sourceStats.mtime > syncStats.mtime) {
          await fs.mkdir(path.dirname(syncPath), { recursive: true });
          await fs.copyFile(sourcePath, syncPath);
        }
      } catch (error) {
        console.error(`Failed to sync file ${file}:`, error);
      }
    }
  }

  private notifySyncComplete(data: PCloudSyncData, signature: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          operation: 'PCLOUD_SYNC_COMPLETE',
          timestamp: new Date().toISOString(),
          data,
          signature
        })
      );
    }
  }
}

// Export singleton instance
export const pcloudHandler = new PCloudHandler();
