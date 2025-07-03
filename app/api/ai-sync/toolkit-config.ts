export const TOOLKIT_CONFIG = {
  download: {
    pcloudLink: '***REMOVED***',
    isTemporary: false,
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  },
  sync: {
    checkInterval: 60 * 60 * 1000, // Check every hour
    notifyOnUpdate: true,
    autoUpdateCheck: true,
    updateMethod: 'manual'
  },
  validation: {
    requireChecksum: true,
    validateDownload: true,
    trackDownloads: true
  }
};

export type ToolkitStatus = {
  available: boolean;
  link: string;
  version: string;
  lastChecked: string;
  isTemporary: boolean;
  nextCheckTime: string;
  downloadCount?: number;
  updateMethod?: 'manual' | 'automatic';
};
