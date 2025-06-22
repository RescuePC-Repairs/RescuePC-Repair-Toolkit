/**
 * Component Loader System
 * Handles loading and rendering of HTML components
 */

class ComponentLoader {
  constructor() {
    this.components = new Map();
    this.loadedComponents = new Set();
    this.cache = new Map();
    this.observers = new Set();
  }

  /**
   * Register a component for loading
   */
  register(name, path, options = {}) {
    this.components.set(name, {
      path,
      lazy: options.lazy || false,
      preload: options.preload || false,
      dependencies: options.dependencies || [],
      selector: options.selector || `[data-component="${name}"]`
    });

    if (options.preload) {
      this.preloadComponent(name);
    }

    return this;
  }

  /**
   * Load a component by name
   */
  async load(name, container = null) {
    try {
      const component = this.components.get(name);
      if (!component) {
        throw new Error(`Component "${name}" not registered`);
      }

      // Load dependencies first
      if (component.dependencies.length > 0) {
        await Promise.all(
          component.dependencies.map(dep => this.load(dep))
        );
      }

      // Get component HTML
      const html = await this.fetchComponent(component.path, component);
      
      // Find containers
      const containers = container 
        ? [container] 
        : Array.from(document.querySelectorAll(component.selector));

      if (containers.length === 0) {
        console.warn(`No containers found for component "${name}"`);
        return;
      }

      // Render component in each container
      const results = containers.map(container => 
        this.renderComponent(name, html, container)
      );

      this.loadedComponents.add(name);
      this.notifyObservers('componentLoaded', { name, containers });

      return results;
    } catch (error) {
      console.error(`Failed to load component "${name}":`, error);
      this.notifyObservers('componentError', { name, error });
      throw error;
    }
  }

  /**
   * Load all registered components
   */
  async loadAll() {
    const promises = Array.from(this.components.keys()).map(name => 
      this.load(name).catch(error => {
        console.error(`Failed to load component "${name}":`, error);
        return null;
      })
    );

    return Promise.all(promises);
  }

  /**
   * Fetch component HTML from server
   */
  async fetchComponent(path, component) {
    // Check cache first
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      
      // Cache the result
      this.cache.set(path, html);
      
      return html;
    } catch (error) {
      // Fallback for development or missing files
      console.warn(`Could not fetch component from ${path}:`, error);
      return this.generateFallback(component);
    }
  }

  /**
   * Generate fallback content for missing components
   */
  generateFallback(component) {
    return `
      <div class="component-fallback" role="alert">
        <p>Component could not be loaded</p>
        <details>
          <summary>Debug Info</summary>
          <pre>${JSON.stringify(component, null, 2)}</pre>
        </details>
      </div>
    `;
  }

  /**
   * Render component HTML into container
   */
  renderComponent(name, html, container) {
    try {
      // Store original content for potential rollback
      const originalContent = container.innerHTML;
      
      // Create temporary container for parsing
      const temp = document.createElement('div');
      temp.innerHTML = html;

      // Handle script tags
      this.executeScripts(temp);

      // Replace container content
      container.innerHTML = html;
      container.setAttribute('data-component-loaded', name);
      
      // Trigger custom event
      const event = new CustomEvent('componentRendered', {
        detail: { name, container, html }
      });
      container.dispatchEvent(event);

      return { success: true, container, name };
    } catch (error) {
      console.error(`Failed to render component "${name}":`, error);
      return { success: false, error, container, name };
    }
  }

  /**
   * Execute script tags in component HTML
   */
  executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src) {
        // External script
        this.loadExternalScript(script.src);
      } else if (script.textContent.trim()) {
        // Inline script
        try {
          new Function(script.textContent).call(window);
        } catch (error) {
          console.error('Error executing inline script:', error);
        }
      }
    });
  }

  /**
   * Load external script with caching
   */
  async loadExternalScript(src) {
    if (document.querySelector(`script[src="${src}"]`)) {
      return; // Already loaded
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Preload component for faster loading
   */
  async preloadComponent(name) {
    const component = this.components.get(name);
    if (component) {
      try {
        await this.fetchComponent(component.path, component);
        console.log(`Component "${name}" preloaded successfully`);
      } catch (error) {
        console.warn(`Failed to preload component "${name}":`, error);
      }
    }
  }

  /**
   * Check if component is loaded
   */
  isLoaded(name) {
    return this.loadedComponents.has(name);
  }

  /**
   * Reload a component
   */
  async reload(name) {
    const component = this.components.get(name);
    if (!component) {
      throw new Error(`Component "${name}" not registered`);
    }

    // Clear cache
    this.cache.delete(component.path);
    this.loadedComponents.delete(name);

    // Find and clear existing containers
    const containers = document.querySelectorAll(component.selector);
    containers.forEach(container => {
      container.innerHTML = '';
      container.removeAttribute('data-component-loaded');
    });

    // Reload component
    return this.load(name);
  }

  /**
   * Add observer for component events
   */
  addObserver(callback) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  /**
   * Notify observers of events
   */
  notifyObservers(event, data) {
    this.observers.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Observer error:', error);
      }
    });
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.cache.clear();
    console.log('Component cache cleared');
  }

  /**
   * Get debug information
   */
  getDebugInfo() {
    return {
      registeredComponents: Array.from(this.components.keys()),
      loadedComponents: Array.from(this.loadedComponents),
      cacheSize: this.cache.size,
      observerCount: this.observers.size
    };
  }
}

// Create global instance
const componentLoader = new ComponentLoader();

// Auto-initialize common components
document.addEventListener('DOMContentLoaded', () => {
  // Register core components
  componentLoader
    .register('header', '/src/components/Layout/Header.html', { 
      preload: true 
    })
    .register('hero', '/src/components/Sections/Hero.html', { 
      preload: true 
    })
    .register('features', '/src/components/Sections/Features.html')
    .register('pricing', '/src/components/Sections/Pricing.html')
    .register('footer', '/src/components/Layout/Footer.html');

  // Load components automatically
  componentLoader.loadAll().then(() => {
    console.log('All components loaded successfully');
    
    // Dispatch ready event
    document.dispatchEvent(new CustomEvent('componentsReady'));
  }).catch(error => {
    console.error('Failed to load some components:', error);
  });
});

export default componentLoader; 