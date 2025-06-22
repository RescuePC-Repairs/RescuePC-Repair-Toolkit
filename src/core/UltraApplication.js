/*!
 * ULTRA-APPLICATION CORE v3.0
 * Enterprise-Grade Application Architecture
 * 
 * Features:
 * - Dependency Injection Container
 * - Advanced State Management
 * - Event-Driven Architecture
 * - Performance Monitoring
 * - Error Recovery System
 * - Security Management
 * - Component Lifecycle
 * - Service Registry
 * 
 * @author RescuePC Ultra Engineering Team
 * @version 3.0.0
 * @license MIT
 */

/**
 * Ultra Application Core Class
 * Central orchestrator for the entire application
 */
export class UltraApplication {
  constructor(config = {}) {
    this.config = {
      debug: false,
      version: '3.0.0',
      environment: 'production',
      enablePerformanceMonitoring: true,
      enableErrorReporting: true,
      enableServiceWorker: true,
      enableAnalytics: true,
      ...config
    };

    // Core systems
    this.container = new Map();
    this.services = new Map();
    this.components = new Map();
    this.plugins = new Map();
    this.middleware = [];
    
    // State
    this.isInitialized = false;
    this.isDestroyed = false;
    this.startTime = performance.now();
    
    // Bind methods
    this.bindMethods();
    
    // Setup core systems
    this.setupCore();
  }

  /**
   * Bind all methods to maintain proper context
   */
  bindMethods() {
    this.initialize = this.initialize.bind(this);
    this.destroy = this.destroy.bind(this);
    this.register = this.register.bind(this);
    this.resolve = this.resolve.bind(this);
    this.emit = this.emit.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
  }

  /**
   * Setup core application systems
   */
  setupCore() {
    // Event system
    this.events = new Map();
    
    // Performance metrics
    this.metrics = {
      startTime: this.startTime,
      initTime: null,
      componentCount: 0,
      serviceCount: 0,
      errorCount: 0,
      memoryUsage: 0
    };
    
    // Error handling
    this.errors = [];
    this.errorHandlers = [];
    
    // Lifecycle hooks
    this.hooks = {
      beforeInit: [],
      afterInit: [],
      beforeDestroy: [],
      afterDestroy: []
    };
  }

  /**
   * Register a service or component in the container
   */
  register(name, factory, options = {}) {
    if (this.isDestroyed) {
      throw new Error('Cannot register on destroyed application');
    }

    const registration = {
      name,
      factory,
      instance: null,
      singleton: options.singleton !== false,
      lazy: options.lazy !== false,
      dependencies: options.dependencies || [],
      initialized: false,
      metadata: options.metadata || {}
    };

    this.container.set(name, registration);
    
    // Eager initialization if not lazy
    if (!registration.lazy) {
      this.resolve(name);
    }

    this.emit('service:registered', { name, options });
    return this;
  }

  /**
   * Resolve a service from the container
   */
  resolve(name) {
    if (this.isDestroyed) {
      throw new Error('Cannot resolve from destroyed application');
    }

    const registration = this.container.get(name);
    if (!registration) {
      throw new Error(`Service '${name}' not found`);
    }

    // Return existing instance if singleton
    if (registration.singleton && registration.instance) {
      return registration.instance;
    }

    try {
      // Resolve dependencies first
      const dependencies = registration.dependencies.map(dep => this.resolve(dep));
      
      // Create instance
      const instance = typeof registration.factory === 'function'
        ? registration.factory(...dependencies, this)
        : registration.factory;

      // Store instance if singleton
      if (registration.singleton) {
        registration.instance = instance;
      }

      registration.initialized = true;
      this.emit('service:resolved', { name, instance });
      
      return instance;
    } catch (error) {
      this.handleError(error, { context: 'service-resolution', service: name });
      throw error;
    }
  }

  /**
   * Initialize the application
   */
  async initialize() {
    if (this.isInitialized || this.isDestroyed) {
      return this;
    }

    try {
      performance.mark('ultra-app-init-start');
      
      // Execute before init hooks
      await this.executeHooks('beforeInit');
      
      // Initialize core services
      await this.initializeCore();
      
      // Initialize user services
      await this.initializeServices();
      
      // Initialize components
      await this.initializeComponents();
      
      // Execute after init hooks
      await this.executeHooks('afterInit');
      
      this.isInitialized = true;
      this.metrics.initTime = performance.now() - this.startTime;
      
      performance.mark('ultra-app-init-end');
      performance.measure('ultra-app-init', 'ultra-app-init-start', 'ultra-app-init-end');
      
      this.emit('app:initialized', {
        duration: this.metrics.initTime,
        version: this.config.version
      });
      
      this.log('Application initialized successfully', {
        duration: this.metrics.initTime,
        services: this.services.size,
        components: this.components.size
      });
      
    } catch (error) {
      this.handleError(error, { context: 'initialization' });
      throw error;
    }

    return this;
  }

  /**
   * Initialize core services
   */
  async initializeCore() {
    // Register core services
    this.register('logger', () => new UltraLogger(this.config.debug));
    this.register('eventBus', () => new UltraEventBus());
    this.register('stateManager', () => new UltraStateManager());
    this.register('performanceMonitor', () => new UltraPerformanceMonitor());
    this.register('securityManager', () => new UltraSecurityManager());
    
    // Initialize core services
    const coreServices = ['logger', 'eventBus', 'stateManager'];
    for (const serviceName of coreServices) {
      const service = this.resolve(serviceName);
      if (service.initialize) {
        await service.initialize();
      }
    }
  }

  /**
   * Initialize user services
   */
  async initializeServices() {
    const services = Array.from(this.container.values())
      .filter(reg => reg.metadata.type === 'service' && reg.initialized);
    
    for (const registration of services) {
      const service = registration.instance;
      if (service && service.initialize && !service.isInitialized) {
        await service.initialize();
      }
    }
  }

  /**
   * Initialize components
   */
  async initializeComponents() {
    const components = Array.from(this.container.values())
      .filter(reg => reg.metadata.type === 'component' && reg.initialized);
    
    // Initialize components in parallel where possible
    const initPromises = components.map(async registration => {
      const component = registration.instance;
      if (component && component.initialize && !component.isInitialized) {
        await component.initialize();
      }
    });
    
    await Promise.all(initPromises);
  }

  /**
   * Execute lifecycle hooks
   */
  async executeHooks(hookName) {
    const hooks = this.hooks[hookName] || [];
    for (const hook of hooks) {
      try {
        await hook(this);
      } catch (error) {
        this.handleError(error, { context: 'hook-execution', hook: hookName });
      }
    }
  }

  /**
   * Add lifecycle hook
   */
  addHook(hookName, callback) {
    if (!this.hooks[hookName]) {
      this.hooks[hookName] = [];
    }
    this.hooks[hookName].push(callback);
    return this;
  }

  /**
   * Add middleware
   */
  use(middleware) {
    this.middleware.push(middleware);
    return this;
  }

  /**
   * Event system methods
   */
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(callback);
    return this;
  }

  off(event, callback) {
    if (this.events.has(event)) {
      this.events.get(event).delete(callback);
    }
    return this;
  }

  emit(event, data = {}) {
    if (this.events.has(event)) {
      const callbacks = this.events.get(event);
      callbacks.forEach(callback => {
        try {
          callback(data, event);
        } catch (error) {
          this.handleError(error, { context: 'event-emission', event });
        }
      });
    }
    return this;
  }

  /**
   * Error handling
   */
  handleError(error, context = {}) {
    this.metrics.errorCount++;
    
    const errorInfo = {
      error,
      context,
      timestamp: Date.now(),
      stack: error.stack,
      message: error.message
    };
    
    this.errors.push(errorInfo);
    
    // Execute error handlers
    this.errorHandlers.forEach(handler => {
      try {
        handler(errorInfo);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    });
    
    this.emit('app:error', errorInfo);
    
    if (this.config.debug) {
      console.error('Application Error:', error, context);
    }
  }

  /**
   * Add error handler
   */
  onError(handler) {
    this.errorHandlers.push(handler);
    return this;
  }

  /**
   * Get application metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      uptime: performance.now() - this.startTime,
      memoryUsage: this.getMemoryUsage(),
      isInitialized: this.isInitialized,
      isDestroyed: this.isDestroyed
    };
  }

  /**
   * Get memory usage (if available)
   */
  getMemoryUsage() {
    if ('memory' in performance) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  /**
   * Logging utility
   */
  log(message, data = {}) {
    if (this.config.debug) {
      console.log(`[UltraApp] ${message}`, data);
    }
    
    this.emit('app:log', { message, data, timestamp: Date.now() });
  }

  /**
   * Destroy the application
   */
  async destroy() {
    if (this.isDestroyed) {
      return;
    }

    try {
      // Execute before destroy hooks
      await this.executeHooks('beforeDestroy');
      
      // Destroy components
      for (const [name, component] of this.components) {
        if (component.destroy) {
          await component.destroy();
        }
      }
      
      // Destroy services
      for (const [name, service] of this.services) {
        if (service.destroy) {
          await service.destroy();
        }
      }
      
      // Clear containers
      this.container.clear();
      this.services.clear();
      this.components.clear();
      this.events.clear();
      
      // Execute after destroy hooks
      await this.executeHooks('afterDestroy');
      
      this.isDestroyed = true;
      
      this.log('Application destroyed successfully');
      
    } catch (error) {
      this.handleError(error, { context: 'destruction' });
    }
  }

  /**
   * Get application status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      destroyed: this.isDestroyed,
      version: this.config.version,
      environment: this.config.environment,
      metrics: this.getMetrics(),
      services: Array.from(this.services.keys()),
      components: Array.from(this.components.keys()),
      errors: this.errors.length
    };
  }
}

/**
 * Ultra Logger Class
 */
class UltraLogger {
  constructor(debug = false) {
    this.debug = debug;
    this.logs = [];
    this.maxLogs = 1000;
  }

  log(level, message, data = {}) {
    const logEntry = {
      level,
      message,
      data,
      timestamp: Date.now(),
      stack: new Error().stack
    };
    
    this.logs.push(logEntry);
    
    // Limit log size
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    if (this.debug) {
      console[level](message, data);
    }
  }

  info(message, data) { this.log('info', message, data); }
  warn(message, data) { this.log('warn', message, data); }
  error(message, data) { this.log('error', message, data); }
  debug(message, data) { this.log('debug', message, data); }
}

/**
 * Ultra Event Bus Class
 */
class UltraEventBus {
  constructor() {
    this.events = new Map();
    this.onceEvents = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(callback);
    return this;
  }

  once(event, callback) {
    if (!this.onceEvents.has(event)) {
      this.onceEvents.set(event, new Set());
    }
    this.onceEvents.get(event).add(callback);
    return this;
  }

  off(event, callback) {
    if (this.events.has(event)) {
      this.events.get(event).delete(callback);
    }
    if (this.onceEvents.has(event)) {
      this.onceEvents.get(event).delete(callback);
    }
    return this;
  }

  emit(event, data = {}) {
    // Regular events
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => callback(data, event));
    }
    
    // Once events
    if (this.onceEvents.has(event)) {
      const callbacks = this.onceEvents.get(event);
      callbacks.forEach(callback => callback(data, event));
      this.onceEvents.delete(event);
    }
    
    return this;
  }

  clear() {
    this.events.clear();
    this.onceEvents.clear();
  }
}

/**
 * Ultra State Manager Class
 */
class UltraStateManager {
  constructor() {
    this.state = new Map();
    this.subscribers = new Map();
    this.history = [];
    this.maxHistory = 50;
  }

  get(key) {
    return this.state.get(key);
  }

  set(key, value) {
    const oldValue = this.state.get(key);
    this.state.set(key, value);
    
    // Add to history
    this.history.push({
      action: 'set',
      key,
      oldValue,
      newValue: value,
      timestamp: Date.now()
    });
    
    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    
    // Notify subscribers
    this.notifySubscribers(key, value, oldValue);
    
    return this;
  }

  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);
    return this;
  }

  unsubscribe(key, callback) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).delete(callback);
    }
    return this;
  }

  notifySubscribers(key, newValue, oldValue) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach(callback => {
        try {
          callback(newValue, oldValue, key);
        } catch (error) {
          console.error('Error in state subscriber:', error);
        }
      });
    }
  }

  clear() {
    this.state.clear();
    this.subscribers.clear();
    this.history.length = 0;
  }
}

export { UltraLogger, UltraEventBus, UltraStateManager }; 