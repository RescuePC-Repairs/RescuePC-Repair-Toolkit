/**
 * Performance Monitoring System
 * Tracks and optimizes performance metrics
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fontAwesome: {
        loadTime: 0,
        firstPaint: 0,
        firstContentfulPaint: 0
      },
      resources: new Map(),
      errors: []
    };

    this.observers = {
      performance: null,
      resource: null,
      error: null
    };

    this.init();
  }

  init() {
    // Initialize Performance Observer
    if ('PerformanceObserver' in window) {
      this.observers.performance = new PerformanceObserver(this.handlePerformanceEntries.bind(this));
      this.observers.performance.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input'] });

      this.observers.resource = new PerformanceObserver(this.handleResourceEntries.bind(this));
      this.observers.resource.observe({ entryTypes: ['resource'] });
    }

    // Initialize Error Observer
    this.observers.error = new PerformanceObserver(this.handleErrorEntries.bind(this));
    this.observers.error.observe({ entryTypes: ['error'] });

    // Track Font Awesome specific metrics
    this.trackFontAwesomeMetrics();
  }

  trackFontAwesomeMetrics() {
    const startTime = performance.now();
    
    // Track Font Awesome load time
    window.addEventListener('load', () => {
      this.metrics.fontAwesome.loadTime = performance.now() - startTime;
      this.reportMetrics();
    });

    // Track first paint
    if ('PerformanceObserver' in window) {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-paint') {
            this.metrics.fontAwesome.firstPaint = entry.startTime;
          }
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fontAwesome.firstContentfulPaint = entry.startTime;
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
    }
  }

  handlePerformanceEntries(entries) {
    entries.getEntries().forEach(entry => {
      if (entry.entryType === 'paint') {
        this.metrics.fontAwesome[entry.name] = entry.startTime;
      }
    });
  }

  handleResourceEntries(entries) {
    entries.getEntries().forEach(entry => {
      if (entry.name.includes('font-awesome')) {
        this.metrics.resources.set(entry.name, {
          duration: entry.duration,
          size: entry.transferSize,
          type: entry.initiatorType
        });
      }
    });
  }

  handleErrorEntries(entries) {
    entries.getEntries().forEach(entry => {
      this.metrics.errors.push({
        type: entry.name,
        message: entry.message,
        timestamp: performance.now()
      });
    });
  }

  reportMetrics() {
    // Send metrics to analytics
    if (window.gtag) {
      gtag('event', 'performance_metrics', {
        font_awesome_load_time: this.metrics.fontAwesome.loadTime,
        first_paint: this.metrics.fontAwesome.firstPaint,
        first_contentful_paint: this.metrics.fontAwesome.firstContentfulPaint,
        resource_count: this.metrics.resources.size,
        error_count: this.metrics.errors.length
      });
    }

    // Log metrics for debugging
    if (window.FontAwesomeConfig?.debug?.enabled) {
      console.group('Font Awesome Performance Metrics');
      console.table(this.metrics.fontAwesome);
      console.table(Array.from(this.metrics.resources.entries()));
      if (this.metrics.errors.length > 0) {
        console.warn('Errors:', this.metrics.errors);
      }
      console.groupEnd();
    }
  }

  getMetrics() {
    return this.metrics;
  }
}

// Initialize performance monitor
const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor; 