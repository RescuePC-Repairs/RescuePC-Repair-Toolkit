/**
 * @fileoverview Component Loader Module
 * Handles dynamic loading and management of HTML components
 * 
 * @author Tyler - RescuePC Repairs
 * @version 1.0.0
 */

class ComponentLoader {
  constructor() {
    this.components = new Map();
    this.loadedComponents = new Set();
    this.loadingPromises = new Map();
    this.cache = new Map();
    this.config = {
      timeout: 5000,
      retries: 3,
      cacheEnabled: true
    };
  }
  
  /**
   * Register a component
   * @param {string} name - Component name
   * @param {string} src - Component source path
   * @param {Object} options - Component options
   */
  register(name, src, options = {}) {
    this.components.set(name, {
      name,
      src,
      preload: options.preload || false,
      lazy: options.lazy !== false,
      selector: options.selector || `[data-component="${name}"]`,
      ...options
    });
    
    return this; // For chaining
  }
  
  /**
   * Load a single component
   * @param {string} name - Component name
   */
  async load(name) {
    const component = this.components.get(name);
    if (!component) {
      throw new Error(`Component '${name}' not registered`);
    }
    
    // Check if already loaded
    if (this.loadedComponents.has(name)) {
      return true;
    }
    
    // Check if already loading
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name);
    }
    
    // Start loading
    const loadPromise = this._loadComponent(component);
    this.loadingPromises.set(name, loadPromise);
    
    try {
      await loadPromise;
      this.loadedComponents.add(name);
      this.loadingPromises.delete(name);
      return true;
    } catch (error) {
      this.loadingPromises.delete(name);
      throw error;
    }
  }
  
  /**
   * Load all registered components
   */
  async loadAll() {
    const loadPromises = Array.from(this.components.keys()).map(name => 
      this.load(name).catch(error => {
        console.error(`Failed to load component '${name}':`, error);
        return false;
      })
    );
    
    const results = await Promise.all(loadPromises);
    const successCount = results.filter(Boolean).length;
    
    console.log(`Loaded ${successCount}/${results.length} components`);
    return results;
  }
  
  /**
   * Load components that should be preloaded
   */
  async loadPreloadComponents() {
    const preloadComponents = Array.from(this.components.values())
      .filter(component => component.preload)
      .map(component => component.name);
    
    if (preloadComponents.length === 0) {
      return;
    }
    
    console.log('Loading preload components:', preloadComponents);
    
    const loadPromises = preloadComponents.map(name => 
      this.load(name).catch(error => {
        console.error(`Failed to load preload component '${name}':`, error);
        return false;
      })
    );
    
    await Promise.all(loadPromises);
  }
  
  /**
   * Actually load and inject component
   * @private
   */
  async _loadComponent(component) {
    try {
      // Check cache first
      let html;
      if (this.config.cacheEnabled && this.cache.has(component.src)) {
        html = this.cache.get(component.src);
      } else {
        html = await this._fetchComponent(component);
        if (this.config.cacheEnabled) {
          this.cache.set(component.src, html);
        }
      }
      
      // Find target elements
      const targets = document.querySelectorAll(component.selector);
      if (targets.length === 0) {
        console.warn(`No targets found for component '${component.name}' with selector '${component.selector}'`);
        return;
      }
      
      // Inject HTML into targets
      targets.forEach(target => {
        target.innerHTML = html;
        target.setAttribute('data-component-loaded', 'true');
        target.classList.add('component-loaded');
      });
      
      // Run post-load hooks
      await this._runPostLoadHooks(component, targets);
      
      console.log(`✅ Component '${component.name}' loaded successfully`);
      
    } catch (error) {
      console.error(`❌ Failed to load component '${component.name}':`, error);
      this._handleComponentError(component, error);
      throw error;
    }
  }
  
  /**
   * Fetch component HTML
   * @private
   */
  async _fetchComponent(component) {
    let attempt = 0;
    let lastError;
    
    while (attempt < this.config.retries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        
        const response = await fetch(component.src, {
          signal: controller.signal,
          headers: {
            'Accept': 'text/html',
            'Cache-Control': 'max-age=3600'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const html = await response.text();
        
        if (!html.trim()) {
          throw new Error('Component HTML is empty');
        }
        
        return html;
        
      } catch (error) {
        lastError = error;
        attempt++;
        
        if (attempt < this.config.retries) {
          console.warn(`Retry ${attempt}/${this.config.retries} for component '${component.name}'`);
          await this._delay(Math.pow(2, attempt) * 100); // Exponential backoff
        }
      }
    }
    
    throw lastError;
  }
  
  /**
   * Run post-load hooks
   * @private
   */
  async _runPostLoadHooks(component, targets) {
    // Initialize any JavaScript functionality
    if (component.init && typeof component.init === 'function') {
      await component.init(targets);
    }
    
    // Dispatch component loaded event
    targets.forEach(target => {
      target.dispatchEvent(new CustomEvent('component:loaded', {
        detail: { component: component.name }
      }));
    });
    
    // Global component loaded event
    document.dispatchEvent(new CustomEvent('component:loaded', {
      detail: { 
        component: component.name,
        targets: Array.from(targets)
      }
    }));
  }
  
  /**
   * Handle component loading errors
   * @private
   */
  _handleComponentError(component, error) {
    // Find target elements
    const targets = document.querySelectorAll(component.selector);
    
    // Show fallback content
    targets.forEach(target => {
      const fallbackHtml = `
        <div class="component-error" style="
          padding: 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          text-align: center;
        ">
          <p>⚠️ Failed to load ${component.name} component</p>
          <button onclick="window.location.reload()" style="
            margin-top: 0.5rem;
            padding: 0.25rem 0.5rem;
            background: #dc2626;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          ">
            Retry
          </button>
        </div>
      `;
      
      target.innerHTML = fallbackHtml;
      target.setAttribute('data-component-error', error.message);
      target.classList.add('component-error');
    });
  }
  
  /**
   * Delay utility
   * @private
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Check if component is loaded
   */
  isLoaded(name) {
    return this.loadedComponents.has(name);
  }
  
  /**
   * Get component info
   */
  getComponent(name) {
    return this.components.get(name);
  }
  
  /**
   * Get all registered components
   */
  getAllComponents() {
    return Array.from(this.components.values());
  }
  
  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log('Component cache cleared');
  }
  
  /**
   * Reload a component
   */
  async reload(name) {
    const component = this.components.get(name);
    if (!component) {
      throw new Error(`Component '${name}' not registered`);
    }
    
    // Clear from loaded set
    this.loadedComponents.delete(name);
    
    // Clear from cache
    this.cache.delete(component.src);
    
    // Reload
    return this.load(name);
  }
}

// Auto-initialize when DOM is ready
let componentLoaderInstance;

document.addEventListener('DOMContentLoaded', () => {
  componentLoaderInstance = new ComponentLoader();
  
  // Auto-register components from data attributes
  const componentElements = document.querySelectorAll('[data-component]');
  componentElements.forEach(el => {
    const name = el.getAttribute('data-component');
    const src = el.getAttribute('data-src');
    
    if (name && src) {
      componentLoaderInstance.register(name, src, {
        selector: `[data-component="${name}"]`
      });
    }
  });
  
  // Load preload components immediately
  componentLoaderInstance.loadPreloadComponents();
  
  // Load all components
  componentLoaderInstance.loadAll().then(() => {
    document.dispatchEvent(new CustomEvent('components:ready'));
  });
});

// Export for global access
if (typeof window !== 'undefined') {
  window.ComponentLoader = ComponentLoader;
  window.componentLoader = componentLoaderInstance;
}

export default ComponentLoader; 