/**
 * @fileoverview Event Bus
 * Simple event system for component communication
 * 
 * @author RescuePC Engineering Team
 * @version 2.0.0
 */

export class EventBus {
  constructor() {
    this.events = new Map();
    this.maxListeners = 10;
  }

  async init() {
    // Event bus is ready immediately
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    const listeners = this.events.get(event);
    if (listeners.length >= this.maxListeners) {
      console.warn(`Maximum listeners (${this.maxListeners}) exceeded for event: ${event}`);
    }
    
    listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  emit(event, data) {
    const listeners = this.events.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  off(event, callback) {
    const listeners = this.events.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  getMetrics() {
    return {
      totalEvents: this.events.size,
      totalListeners: Array.from(this.events.values()).reduce((sum, listeners) => sum + listeners.length, 0)
    };
  }

  destroy() {
    this.events.clear();
  }
} 