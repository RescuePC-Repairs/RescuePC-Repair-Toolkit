/**
 * @fileoverview Dependency Injection Container
 * Simple DI container for service management
 * 
 * @author RescuePC Engineering Team
 * @version 2.0.0
 */

export class DIContainer {
  constructor() {
    this.services = new Map();
    this.instances = new Map();
  }

  register(name, factory, options = {}) {
    this.services.set(name, {
      factory,
      singleton: options.singleton || false,
      dependencies: options.dependencies || []
    });
  }

  resolve(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service '${name}' not found`);
    }

    // Return existing instance for singletons
    if (service.singleton && this.instances.has(name)) {
      return this.instances.get(name);
    }

    // Resolve dependencies
    const dependencies = service.dependencies.map(dep => this.resolve(dep));

    // Create instance
    const instance = typeof service.factory === 'function' 
      ? service.factory(...dependencies)
      : service.factory;

    // Store singleton instances
    if (service.singleton) {
      this.instances.set(name, instance);
    }

    return instance;
  }

  has(name) {
    return this.services.has(name);
  }

  destroy() {
    this.services.clear();
    this.instances.clear();
  }
} 