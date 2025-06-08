/**
 * Advanced Resource Preloader
 * Optimizes resource loading with predictive preloading
 */
class ResourcePreloader {
  constructor() {
    this.config = {
      preloadThreshold: 0.8, // Preload when viewport is 80% scrolled
      preloadDistance: 1000, // Preload resources 1000px ahead
      maxConcurrent: 3, // Maximum concurrent preloads
      retryAttempts: 3,
      retryDelay: 1000
    };

    this.queue = new Map();
    this.active = new Set();
    this.observer = null;
    this.intersectionObserver = null;
  }

  init() {
    this.initIntersectionObserver();
    this.initResourceObserver();
    this.startPreloading();
  }

  initIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.preloadResource(entry.target);
          }
        });
      },
      {
        rootMargin: `${this.config.preloadDistance}px`,
        threshold: this.config.preloadThreshold
      }
    );
  }

  initResourceObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.initiatorType === 'link' || entry.initiatorType === 'script') {
            this.trackResource(entry);
          }
        });
      });

      this.observer.observe({ entryTypes: ['resource'] });
    }
  }

  trackResource(entry) {
    const resource = {
      name: entry.name,
      duration: entry.duration,
      size: entry.transferSize,
      type: entry.initiatorType,
      startTime: entry.startTime
    };

    this.queue.set(entry.name, resource);
  }

  async preloadResource(element) {
    if (this.active.size >= this.config.maxConcurrent) {
      return;
    }

    const resourceUrl = element.href || element.src;
    if (!resourceUrl || this.active.has(resourceUrl)) {
      return;
    }

    this.active.add(resourceUrl);

    try {
      const response = await fetch(resourceUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'force-cache'
      });

      if (response.ok) {
        this.preloadElement(element);
      }
    } catch (error) {
      console.warn(`Failed to preload ${resourceUrl}:`, error);
    } finally {
      this.active.delete(resourceUrl);
    }
  }

  preloadElement(element) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = this.getResourceType(element);
    link.href = element.href || element.src;
    link.crossOrigin = 'anonymous';
    
    if (element.integrity) {
      link.integrity = element.integrity;
    }

    document.head.appendChild(link);
  }

  getResourceType(element) {
    const tagName = element.tagName.toLowerCase();
    const type = element.type || '';

    switch (tagName) {
      case 'link':
        return type.includes('css') ? 'style' : 'fetch';
      case 'script':
        return 'script';
      case 'img':
        return 'image';
      case 'video':
        return 'video';
      case 'audio':
        return 'audio';
      default:
        return 'fetch';
    }
  }

  startPreloading() {
    // Preload critical resources
    document.querySelectorAll('link[rel="stylesheet"], script[src], img[src]').forEach(element => {
      this.intersectionObserver.observe(element);
    });

    // Watch for dynamically added resources
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.matches('link[rel="stylesheet"], script[src], img[src]')) {
              this.intersectionObserver.observe(node);
            }
            node.querySelectorAll('link[rel="stylesheet"], script[src], img[src]').forEach(element => {
              this.intersectionObserver.observe(element);
            });
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // Performance optimization methods
  optimizeResourceLoading() {
    // Implement resource hints
    this.addResourceHints();
    
    // Optimize loading order
    this.optimizeLoadingOrder();
    
    // Implement connection-aware loading
    this.implementConnectionAwareLoading();
  }

  addResourceHints() {
    const domains = new Set([
      'https://cdnjs.cloudflare.com',
      'https://use.fontawesome.com'
    ]);

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);

      const dnsLink = document.createElement('link');
      dnsLink.rel = 'dns-prefetch';
      dnsLink.href = domain;
      document.head.appendChild(dnsLink);
    });
  }

  optimizeLoadingOrder() {
    const resources = Array.from(this.queue.values())
      .sort((a, b) => a.startTime - b.startTime);

    resources.forEach(resource => {
      if (resource.type === 'link' && resource.name.includes('font-awesome')) {
        this.prioritizeResource(resource);
      }
    });
  }

  prioritizeResource(resource) {
    const element = document.querySelector(`[href="${resource.name}"]`);
    if (element) {
      element.setAttribute('fetchpriority', 'high');
    }
  }

  implementConnectionAwareLoading() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      if (connection.saveData) {
        this.config.preloadDistance = 500; // Reduce preload distance for data saving
      }

      if (connection.effectiveType === '4g') {
        this.config.maxConcurrent = 5; // Increase concurrent preloads for fast connections
      }
    }
  }
}

// Initialize resource preloader
const resourcePreloader = new ResourcePreloader();
resourcePreloader.init();
export default resourcePreloader; 