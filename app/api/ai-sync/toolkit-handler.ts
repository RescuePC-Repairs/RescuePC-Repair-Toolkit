import { WebSocket } from 'ws';
import { createHmac } from 'crypto';

interface ToolkitUpdateData {
  version: string;
  components: string[];
  features: string[];
  timestamp: string;
  metadata?: Record<string, any>;
}

export class ToolkitHandler {
  private readonly config = {
    wsEndpoint: 'wss://pcloud.rescuepcrepairs.com/ai-sync/ws',
    httpEndpoint: 'https://pcloud.rescuepcrepairs.com/ai-sync',
    secret: process.env.AI_SYNC_SECRET!,
    toolkitPath: 'configuration/toolkit',
    backupPath: 'backups/toolkit'
  };

  private ws: WebSocket | null = null;

  constructor() {
    this.connectWebSocket();
  }

  private connectWebSocket() {
    this.ws = new WebSocket(this.config.wsEndpoint);

    this.ws.on('open', () => {
      console.log('ToolkitHandler connected to WebSocket');
    });

    this.ws.on('error', (error) => {
      console.error('ToolkitHandler WebSocket error:', error);
    });

    this.ws.on('close', () => {
      console.log('ToolkitHandler WebSocket closed, reconnecting...');
      setTimeout(() => this.connectWebSocket(), 5000);
    });
  }

  public async handleToolkitUpdate(data: ToolkitUpdateData) {
    try {
      // Validate update data
      this.validateUpdateData(data);

      // Generate HMAC signature
      const signature = this.generateSignature(data);

      // Process toolkit update
      await this.processToolkitUpdate(data);

      // Notify other systems
      this.notifyUpdateComplete(data, signature);

      console.log('Toolkit update completed successfully:', data.version);
    } catch (error) {
      console.error('Toolkit update failed:', error);
      throw error;
    }
  }

  private validateUpdateData(data: ToolkitUpdateData) {
    if (!data.version || !data.components || !data.features || !data.timestamp) {
      throw new Error('Invalid update data');
    }

    if (!this.isValidVersion(data.version)) {
      throw new Error('Invalid version format');
    }

    if (!Array.isArray(data.components) || data.components.length === 0) {
      throw new Error('Invalid components array');
    }

    if (!Array.isArray(data.features) || data.features.length === 0) {
      throw new Error('Invalid features array');
    }

    if (new Date(data.timestamp).toString() === 'Invalid Date') {
      throw new Error('Invalid timestamp');
    }
  }

  private isValidVersion(version: string): boolean {
    // Validate semantic version (major.minor.patch)
    const versionRegex = /^\d+\.\d+\.\d+$/;
    return versionRegex.test(version);
  }

  private generateSignature(data: any): string {
    return createHmac('sha256', this.config.secret).update(JSON.stringify(data)).digest('hex');
  }

  private async processToolkitUpdate(data: ToolkitUpdateData) {
    const fs = require('fs').promises;
    const path = require('path');

    // Create version directory
    const versionPath = path.join(this.config.toolkitPath, data.version);
    const backupPath = path.join(this.config.backupPath, data.version);

    await fs.mkdir(versionPath, { recursive: true });
    await fs.mkdir(backupPath, { recursive: true });

    // Update version file
    const versionFile = path.join(this.config.toolkitPath, 'version.json');
    await fs.writeFile(
      versionFile,
      JSON.stringify(
        {
          current: data.version,
          timestamp: data.timestamp,
          components: data.components,
          features: data.features
        },
        null,
        2
      )
    );

    // Backup version file
    const backupVersionFile = path.join(this.config.backupPath, 'version.json');
    await fs.copyFile(versionFile, backupVersionFile);

    // Update components
    for (const component of data.components) {
      try {
        const sourcePath = path.join('components', component);
        const targetPath = path.join(versionPath, component);
        const backupComponentPath = path.join(backupPath, component);

        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.mkdir(path.dirname(backupComponentPath), { recursive: true });

        await fs.copyFile(sourcePath, targetPath);
        await fs.copyFile(sourcePath, backupComponentPath);
      } catch (error) {
        console.error(`Failed to update component ${component}:`, error);
      }
    }
  }

  private notifyUpdateComplete(data: ToolkitUpdateData, signature: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          operation: 'TOOLKIT_UPDATE_COMPLETE',
          timestamp: new Date().toISOString(),
          data,
          signature
        })
      );
    }
  }
}

export const toolkitHandler = new ToolkitHandler();
