import FontAwesomeConfig from './fontawesome-config.js';
import performanceMonitor from './performance-monitor.js';
import resourcePreloader from './resource-preloader.js';
import serviceRegistry from './service-registry.js';

class FontAwesomeLoader {
  constructor() {
    this.config = FontAwesomeConfig;
    this.loadAttempts = 0;
    this.loaded = false;
    this.observer = null;
    this.styleElement = null;
    
    // Register services
    serviceRegistry.register('performance', performanceMonitor);
    serviceRegistry.register('preloader', resourcePreloader, ['performance']);
  }

  async init() {
    const startTime = performance.now();

    // Get services from registry
    this.performance = serviceRegistry.get('performance');
    this.preloader = serviceRegistry.get('preloader');

    // Initialize resource preloader
    this.preloader.optimizeResourceLoading();

    if (this.config.performance.preconnect) {
      this.addPreconnectLinks();
    }

    if (this.config.performance.preload) {
      this.preloadCriticalResources();
    }

    await this.loadFontAwesome();
    this.initIconObserver();

    // Report initial load time
    this.performance.metrics.fontAwesome.initialLoadTime = performance.now() - startTime;
  }

  addPreconnectLinks() {
    const domains = [
      this.config.cdn.primary,
      'https://use.fontawesome.com'
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  preloadCriticalResources() {
    // Preload critical CSS
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.as = 'style';
    criticalCSS.href = `${this.config.cdn.primary}/${this.config.version}/css/all.min.css`;
    criticalCSS.setAttribute('fetchpriority', this.config.performance.fetchPriority);
    document.head.appendChild(criticalCSS);

    // Preload critical fonts
    this.config.criticalIcons.forEach(iconType => {
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.as = 'font';
      fontLink.href = `${this.config.cdn.primary}/${this.config.version}/webfonts/${iconType}-900.woff2`;
      fontLink.type = 'font/woff2';
      fontLink.crossOrigin = 'anonymous';
      document.head.appendChild(fontLink);
    });
  }

  async loadFontAwesome() {
    if (this.loaded) return;

    const startTime = performance.now();

    try {
      // Use resource preloader for optimized loading
      const response = await this.preloader.preloadResource({
        href: `${this.config.cdn.primary}/${this.config.version}/css/all.min.css`,
        type: 'text/css'
      });

      if (!response.ok) throw new Error('Failed to load Font Awesome');

      const css = await response.text();
      this.injectStyles(css);
      this.loaded = true;

      // Report successful load time
      this.performance.metrics.fontAwesome.loadTime = performance.now() - startTime;

      if (this.config.debug.enabled) {
        console.info('Font Awesome loaded successfully');
      }
    } catch (error) {
      if (this.config.debug.enabled) {
        console.error('Error loading Font Awesome:', error);
      }
      this.loadFallback();
    }
  }

  injectStyles(css) {
    if (this.styleElement) {
      this.styleElement.remove();
    }

    this.styleElement = document.createElement('style');
    this.styleElement.textContent = css;
    this.styleElement.setAttribute('data-fontawesome', this.config.version);
    
    if (this.config.cache.enabled) {
      this.styleElement.setAttribute('data-cache', this.config.cache.version);
    }

    document.head.appendChild(this.styleElement);
  }

  loadFallback() {
    if (this.loadAttempts >= this.config.performance.maxAttempts) {
      if (this.config.debug.enabled) {
        console.error('Failed to load Font Awesome after multiple attempts');
      }
      this.loadLocalFallback();
      return;
    }

    this.loadAttempts++;
    const fallbackLink = document.createElement('link');
    fallbackLink.rel = 'stylesheet';
    fallbackLink.href = this.config.cdn.fallback;
    fallbackLink.integrity = this.config.cdn.fallbackIntegrity;
    fallbackLink.crossOrigin = 'anonymous';
    fallbackLink.setAttribute('fetchpriority', this.config.performance.fetchPriority);

    const startTime = performance.now();

    fallbackLink.onload = () => {
      this.loaded = true;
      this.performance.metrics.fontAwesome.fallbackLoadTime = performance.now() - startTime;
      
      if (this.config.debug.enabled) {
        console.info('Font Awesome fallback loaded successfully');
      }
    };

    fallbackLink.onerror = () => {
      if (this.config.debug.enabled) {
        console.warn(`Fallback attempt ${this.loadAttempts} failed`);
      }
      setTimeout(() => this.loadFallback(), this.config.performance.retryDelay);
    };

    document.head.appendChild(fallbackLink);
  }

  loadLocalFallback() {
    const localLink = document.createElement('link');
    localLink.rel = 'stylesheet';
    localLink.href = this.config.local.css;
    localLink.setAttribute('fetchpriority', this.config.performance.fetchPriority);
    
    const startTime = performance.now();

    localLink.onload = () => {
      this.loaded = true;
      this.performance.metrics.fontAwesome.localLoadTime = performance.now() - startTime;
      
      if (this.config.debug.enabled) {
        console.info('Local Font Awesome fallback loaded successfully');
      }
    };

    document.head.appendChild(localLink);
  }

  initIconObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          this.checkForIcons(mutation.addedNodes);
        }
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initial check for existing icons
    this.checkForIcons([document.body]);
  }

  checkForIcons(nodes) {
    nodes.forEach((node) => {
      if (node.nodeType === 1) { // Element node
        if (this.isIconElement(node)) {
          this.ensureIconLoaded(node);
        }
        if (node.children) {
          this.checkForIcons(Array.from(node.children));
        }
      }
    });
  }

  isIconElement(element) {
    return element.classList && (
      element.classList.contains('fa') ||
      element.classList.contains('fas') ||
      element.classList.contains('fab') ||
      element.classList.contains('far') ||
      element.classList.contains('fal') ||
      element.classList.contains('fat') ||
      element.classList.contains('fad')
    );
  }

  ensureIconLoaded(iconElement) {
    if (!this.loaded) {
      this.loadFontAwesome();
    }
  }
}

// Register Font Awesome loader as a service
serviceRegistry.register('fontAwesome', new FontAwesomeLoader(), ['performance', 'preloader']);

// Initialize Font Awesome loader
const faLoader = serviceRegistry.get('fontAwesome');
faLoader.init(); 