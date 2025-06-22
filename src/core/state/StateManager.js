/**
 * @fileoverview State Manager
 * Simple state management for the application
 * 
 * @author RescuePC Engineering Team
 * @version 2.0.0
 */

export class StateManager {
  constructor() {
    this.state = {};
    this.subscribers = new Map();
  }

  async init() {
    // State manager is ready immediately
  }

  getState(path) {
    if (!path) return this.state;
    
    const keys = path.split('.');
    let current = this.state;
    
    for (const key of keys) {
      if (current[key] === undefined) return undefined;
      current = current[key];
    }
    
    return current;
  }

  setState(path, value) {
    const keys = path.split('.');
    let current = this.state;
    
    // Navigate to parent object
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    // Set the value
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
    
    // Notify subscribers
    this.notifySubscribers(path, value);
  }

  subscribe(path, callback) {
    if (!this.subscribers.has(path)) {
      this.subscribers.set(path, []);
    }
    
    this.subscribers.get(path).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(path);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  notifySubscribers(path, value) {
    const callbacks = this.subscribers.get(path);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(value, path);
        } catch (error) {
          console.error(`Error in state subscriber for ${path}:`, error);
        }
      });
    }
  }

  getMetrics() {
    return {
      stateKeys: Object.keys(this.state).length,
      subscribers: this.subscribers.size
    };
  }

  destroy() {
    this.state = {};
    this.subscribers.clear();
  }
} 