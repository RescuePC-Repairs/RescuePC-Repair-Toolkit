/**
 * @fileoverview Component Registry
 * Simple registry for managing UI components
 * 
 * @author RescuePC Engineering Team
 * @version 2.0.0
 */

export class ComponentRegistry {
  constructor() {
    this.components = new Map();
    this.instances = new Map();
  }

  async init() {
    // Component registry is ready immediately
  }

  register(name, componentClass, options = {}) {
    this.components.set(name, {
      componentClass,
      options
    });
  }

  async load(name, element, options = {}) {
    const component = this.components.get(name);
    if (!component) {
      throw new Error(`Component '${name}' not found`);
    }

    // Create instance
    const instance = new component.componentClass(element, {
      ...component.options,
      ...options
    });

    // Initialize if method exists
    if (typeof instance.init === 'function') {
      await instance.init();
    }

    // Store instance
    this.instances.set(element, instance);

    return instance;
  }

  unload(element) {
    const instance = this.instances.get(element);
    if (instance) {
      if (typeof instance.destroy === 'function') {
        instance.destroy();
      }
      this.instances.delete(element);
    }
  }

  destroy() {
    // Destroy all instances
    for (const [element, instance] of this.instances) {
      if (typeof instance.destroy === 'function') {
        instance.destroy();
      }
    }
    
    this.components.clear();
    this.instances.clear();
  }
} 