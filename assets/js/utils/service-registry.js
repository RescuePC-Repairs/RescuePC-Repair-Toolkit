/**
 * Service Registry
 * Centralized service management for better maintainability and scalability
 */
class ServiceRegistry {
  constructor() {
    this.services = new Map();
    this.dependencies = new Map();
    this.initialized = new Set();
  }

  /**
   * Register a service with its dependencies
   * @param {string} name - Service name
   * @param {Object} service - Service instance
   * @param {Array} dependencies - Array of dependency names
   */
  register(name, service, dependencies = []) {
    this.services.set(name, service);
    this.dependencies.set(name, dependencies);
  }

  /**
   * Get a service instance
   * @param {string} name - Service name
   * @returns {Object} Service instance
   */
  get(name) {
    if (!this.services.has(name)) {
      throw new Error(`Service ${name} not found`);
    }

    if (!this.initialized.has(name)) {
      this.initializeService(name);
    }

    return this.services.get(name);
  }

  /**
   * Initialize a service and its dependencies
   * @param {string} name - Service name
   */
  initializeService(name) {
    const dependencies = this.dependencies.get(name);
    
    // Initialize dependencies first
    dependencies.forEach(dep => {
      if (!this.initialized.has(dep)) {
        this.initializeService(dep);
      }
    });

    const service = this.services.get(name);
    
    // Initialize service if it has an init method
    if (typeof service.init === 'function') {
      service.init();
    }

    this.initialized.add(name);
  }

  /**
   * Check if a service is initialized
   * @param {string} name - Service name
   * @returns {boolean} Whether the service is initialized
   */
  isInitialized(name) {
    return this.initialized.has(name);
  }

  /**
   * Get all registered services
   * @returns {Map} Map of all services
   */
  getAllServices() {
    return this.services;
  }

  /**
   * Get service dependencies
   * @param {string} name - Service name
   * @returns {Array} Array of dependency names
   */
  getDependencies(name) {
    return this.dependencies.get(name) || [];
  }
}

// Create and export singleton instance
const serviceRegistry = new ServiceRegistry();
export default serviceRegistry; 