/**
 * @fileoverview Enterprise Logger
 * Advanced logging system with multiple transports and levels
 * 
 * @author RescuePC Engineering Team
 * @version 2.0.0
 */

/**
 * Log entry structure
 * 
 * @typedef {Object} LogEntry
 * @property {string} level - Log level
 * @property {string} message - Log message
 * @property {Object} metadata - Additional metadata
 * @property {number} timestamp - Timestamp
 * @property {string} id - Unique log ID
 * @property {string} source - Log source
 * @property {Error} error - Error object (if applicable)
 */

/**
 * Log levels enumeration
 */
export const LogLevel = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5
};

/**
 * Log level names
 */
export const LogLevelNames = {
  0: 'TRACE',
  1: 'DEBUG',
  2: 'INFO',
  3: 'WARN',
  4: 'ERROR',
  5: 'FATAL'
};

export class Logger {
  constructor(namespace = 'App') {
    this.namespace = namespace;
    this.level = this.getLogLevel();
    this.transports = [];
    this.buffer = [];
    this.maxBufferSize = 1000;
    
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    
    this.setupDefaultTransports();
  }

  getLogLevel() {
    if (typeof window !== 'undefined') {
      return window.location.hostname === 'localhost' ? 'debug' : 'info';
    }
    return 'info';
  }

  setupDefaultTransports() {
    // Console transport
    this.addTransport({
      name: 'console',
      log: (level, message, data) => {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${this.namespace}] [${level.toUpperCase()}]`;
        
        if (data) {
          console[level](`${prefix} ${message}`, data);
        } else {
          console[level](`${prefix} ${message}`);
        }
      }
    });
  }

  addTransport(transport) {
    this.transports.push(transport);
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.level];
  }

  log(level, message, data = null) {
    if (!this.shouldLog(level)) return;

    const logEntry = {
      timestamp: Date.now(),
      level,
      message,
      data,
      namespace: this.namespace
    };

    // Add to buffer
    this.buffer.push(logEntry);
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }

    // Send to transports
    this.transports.forEach(transport => {
      try {
        transport.log(level, message, data);
      } catch (error) {
        console.error('Transport error:', error);
      }
    });
  }

  error(message, data) {
    this.log('error', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  info(message, data) {
    this.log('info', message, data);
  }

  debug(message, data) {
    this.log('debug', message, data);
  }

  createChild(namespace) {
    return new Logger(`${this.namespace}:${namespace}`);
  }

  getBuffer() {
    return [...this.buffer];
  }

  clearBuffer() {
    this.buffer = [];
  }
} 