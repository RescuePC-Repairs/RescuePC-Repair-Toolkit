/**
 * Performance Monitor
 * Tracks and reports on application performance metrics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Set();
    this.config = {
      enableWebVitals: true,
      enableResourceTiming: true,
      enableUserTiming: true,
      reportingInterval: 30000, // 30 seconds
      maxEntries: 1000
    };
    
    this.init();
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    if (!this.isPerformanceAPISupported()) {
      console.warn('Performance API not supported');
      return;
    }

    this.setupPerformanceObserver();
    this.trackPageLoad();
    this.trackWebVitals();
    this.startPeriodicReporting();
    
    console.log('Performance monitoring initialized');
  }

  /**
   * Check if Performance API is supported
   */
  isPerformanceAPISupported() {
    return 'performance' in window && 'PerformanceObserver' in window;
  }

  /**
   * Setup Performance Observer
   */
  setupPerformanceObserver() {
    try {
      // Navigation timing
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'navigation') {
            this.recordNavigationTiming(entry);
          }
        });
      });
      navObserver.observe({ entryTypes: ['navigation'] });

      // Resource timing
      if (this.config.enableResourceTiming) {
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach(entry => {
            this.recordResourceTiming(entry);
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
      }

      // User timing
      if (this.config.enableUserTiming) {
        const userTimingObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach(entry => {
            this.recordUserTiming(entry);
          });
        });
        userTimingObserver.observe({ entryTypes: ['mark', 'measure'] });
      }

      // Paint timing
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.recordPaintTiming(entry);
        });
      });
      paintObserver.observe({ entryTypes: ['paint'] });

    } catch (error) {
      console.error('Failed to setup performance observer:', error);
    }
  }

  /**
   * Track page load metrics
   */
  trackPageLoad() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          this.recordMetric('pageLoad', {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            totalTime: navigation.loadEventEnd - navigation.fetchStart,
            dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcpConnect: navigation.connectEnd - navigation.connectStart,
            serverResponse: navigation.responseEnd - navigation.requestStart,
            domProcessing: navigation.domComplete - navigation.responseEnd
          });
        }
      }, 0);
    });
  }

  /**
   * Track Web Vitals (CLS, FID, LCP)
   */
  trackWebVitals() {
    if (!this.config.enableWebVitals) return;

    // Largest Contentful Paint
    this.observeLCP();
    
    // First Input Delay
    this.observeFID();
    
    // Cumulative Layout Shift
    this.observeCLS();
  }

  /**
   * Observe Largest Contentful Paint
   */
  observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', {
          value: lastEntry.startTime,
          element: lastEntry.element?.tagName || 'unknown',
          url: lastEntry.url || window.location.href,
          timestamp: Date.now()
        });
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('LCP observation not supported:', error);
    }
  }

  /**
   * Observe First Input Delay
   */
  observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.recordMetric('FID', {
            value: entry.processingStart - entry.startTime,
            timestamp: Date.now()
          });
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('FID observation not supported:', error);
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  observeCLS() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.recordMetric('CLS', {
              value: clsValue,
              timestamp: Date.now()
            });
          }
        });
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('CLS observation not supported:', error);
    }
  }

  /**
   * Record navigation timing
   */
  recordNavigationTiming(entry) {
    this.recordMetric('navigation', {
      type: entry.type,
      redirectCount: entry.redirectCount,
      transferSize: entry.transferSize,
      domainLookupTime: entry.domainLookupEnd - entry.domainLookupStart,
      connectTime: entry.connectEnd - entry.connectStart,
      requestTime: entry.responseStart - entry.requestStart,
      responseTime: entry.responseEnd - entry.responseStart,
      domParseTime: entry.domContentLoadedEventStart - entry.responseEnd,
      timestamp: Date.now()
    });
  }

  /**
   * Record resource timing
   */
  recordResourceTiming(entry) {
    const resourceData = {
      name: entry.name,
      type: this.getResourceType(entry.name),
      duration: entry.duration,
      transferSize: entry.transferSize || 0,
      encodedBodySize: entry.encodedBodySize || 0,
      decodedBodySize: entry.decodedBodySize || 0,
      timestamp: Date.now()
    };

    this.recordMetric('resource', resourceData);

    // Track slow resources
    if (entry.duration > 1000) {
      this.recordMetric('slowResource', resourceData);
    }
  }

  /**
   * Record user timing marks and measures
   */
  recordUserTiming(entry) {
    this.recordMetric('userTiming', {
      name: entry.name,
      type: entry.entryType,
      duration: entry.duration || 0,
      startTime: entry.startTime,
      timestamp: Date.now()
    });
  }

  /**
   * Record paint timing
   */
  recordPaintTiming(entry) {
    this.recordMetric('paint', {
      name: entry.name,
      startTime: entry.startTime,
      timestamp: Date.now()
    });
  }

  /**
   * Get resource type from URL
   */
  getResourceType(url) {
    if (url.match(/\.(css)$/i)) return 'stylesheet';
    if (url.match(/\.(js)$/i)) return 'script';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
    if (url.includes('api/') || url.includes('.json')) return 'api';
    return 'other';
  }

  /**
   * Record a metric
   */
  recordMetric(category, data) {
    if (!this.metrics.has(category)) {
      this.metrics.set(category, []);
    }

    const entries = this.metrics.get(category);
    entries.push(data);

    // Limit entries to prevent memory issues
    if (entries.length > this.config.maxEntries) {
      entries.splice(0, entries.length - this.config.maxEntries);
    }

    // Notify observers
    this.notifyObservers(category, data);
  }

  /**
   * Start a performance timer
   */
  startTimer(name) {
    if (performance.mark) {
      performance.mark(`${name}-start`);
    }
    return Date.now();
  }

  /**
   * End a performance timer
   */
  endTimer(name, startTime = null) {
    const endTime = Date.now();
    
    if (performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      try {
        performance.measure(name, `${name}-start`, `${name}-end`);
      } catch (error) {
        console.warn('Failed to create performance measure:', error);
      }
    }

    const duration = startTime ? endTime - startTime : 0;
    
    this.recordMetric('customTimer', {
      name,
      duration,
      timestamp: endTime
    });

    return duration;
  }

  /**
   * Get performance summary
   */
  getSummary() {
    const summary = {};
    
    this.metrics.forEach((entries, category) => {
      summary[category] = {
        count: entries.length,
        latest: entries[entries.length - 1],
        average: this.calculateAverage(entries)
      };
    });

    return summary;
  }

  /**
   * Calculate average for numeric metrics
   */
  calculateAverage(entries) {
    if (entries.length === 0) return 0;
    
    const numericEntries = entries.filter(entry => 
      typeof entry.value === 'number' || typeof entry.duration === 'number'
    );
    
    if (numericEntries.length === 0) return 0;
    
    const sum = numericEntries.reduce((acc, entry) => 
      acc + (entry.value || entry.duration || 0), 0
    );
    
    return sum / numericEntries.length;
  }

  /**
   * Get detailed metrics
   */
  getMetrics(category = null) {
    if (category) {
      return this.metrics.get(category) || [];
    }
    
    const result = {};
    this.metrics.forEach((entries, cat) => {
      result[cat] = entries;
    });
    return result;
  }

  /**
   * Clear metrics
   */
  clearMetrics(category = null) {
    if (category) {
      this.metrics.delete(category);
    } else {
      this.metrics.clear();
    }
  }

  /**
   * Add observer for performance events
   */
  addObserver(callback) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  /**
   * Notify observers
   */
  notifyObservers(category, data) {
    this.observers.forEach(callback => {
      try {
        callback(category, data);
      } catch (error) {
        console.error('Performance observer error:', error);
      }
    });
  }

  /**
   * Start periodic reporting
   */
  startPeriodicReporting() {
    setInterval(() => {
      const summary = this.getSummary();
      console.log('Performance Summary:', summary);
      
      // Emit event for external listeners
      document.dispatchEvent(new CustomEvent('performanceReport', {
        detail: summary
      }));
    }, this.config.reportingInterval);
  }

  /**
   * Generate performance report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null,
      summary: this.getSummary(),
      recommendations: this.getRecommendations()
    };

    return report;
  }

  /**
   * Get performance recommendations
   */
  getRecommendations() {
    const recommendations = [];
    const metrics = this.getMetrics();

    // Check LCP
    const lcpMetrics = metrics['LCP'] || [];
    const latestLCP = lcpMetrics[lcpMetrics.length - 1];
    if (latestLCP && latestLCP.value > 2500) {
      recommendations.push({
        type: 'LCP',
        severity: latestLCP.value > 4000 ? 'high' : 'medium',
        message: 'Largest Contentful Paint is slow. Consider optimizing images and critical resources.'
      });
    }

    // Check slow resources
    const slowResources = metrics['slowResource'] || [];
    if (slowResources.length > 0) {
      recommendations.push({
        type: 'Resources',
        severity: 'medium',
        message: `${slowResources.length} slow resources detected. Consider optimizing or lazy loading.`
      });
    }

    return recommendations;
  }
}

// Create global instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor; 