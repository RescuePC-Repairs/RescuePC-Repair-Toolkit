/**
 * Performance Monitor Module
 * Tracks Web Vitals and performance metrics
 */
class PerformanceMonitor {
  constructor() {
    this.isEnabled = true;
    this.metrics = new Map();
    this.observers = [];
    
    this.init();
  }
  
  /**
   * Initialize performance monitoring
   */
  init() {
    if (!this.isEnabled || typeof PerformanceObserver === 'undefined') {
      console.warn('Performance monitoring not available');
      return;
    }
    
    this.setupWebVitalsMonitoring();
    this.setupResourceMonitoring();
    
    console.log('✅ Performance monitoring initialized');
  }
  
  /**
   * Setup Web Vitals monitoring (LCP, FID, CLS)
   */
  setupWebVitalsMonitoring() {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({entryTypes: ['largest-contentful-paint']});
      this.observers.push(lcpObserver);
      
      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          const fid = entry.processingStart - entry.startTime;
          this.recordMetric('FID', fid);
        });
      });
      fidObserver.observe({entryTypes: ['first-input']});
      this.observers.push(fidObserver);
      
      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.recordMetric('CLS', clsValue);
      });
      clsObserver.observe({entryTypes: ['layout-shift']});
      this.observers.push(clsObserver);
      
    } catch (error) {
      console.warn('Web Vitals monitoring setup failed:', error);
    }
  }
  
  /**
   * Setup resource monitoring
   */
  setupResourceMonitoring() {
    try {
      const resourceObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 1000) {
            console.warn(`Slow resource: ${entry.name} (${entry.duration}ms)`);
          }
        });
      });
      resourceObserver.observe({entryTypes: ['resource']});
      this.observers.push(resourceObserver);
      
    } catch (error) {
      console.warn('Resource monitoring setup failed:', error);
    }
  }
  
  /**
   * Record a performance metric
   */
  recordMetric(name, value) {
    this.metrics.set(name, value);
    console.log(`📊 ${name}: ${Math.round(value)}ms`);
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        name: name,
        value: Math.round(value),
        event_category: 'performance'
      });
    }
    
    // Warn about poor performance
    this.checkPerformanceThresholds(name, value);
  }
  
  /**
   * Check performance thresholds and warn if needed
   */
  checkPerformanceThresholds(name, value) {
    const thresholds = {
      LCP: 2500,  // Good: < 2.5s
      FID: 100,   // Good: < 100ms
      CLS: 0.1    // Good: < 0.1
    };
    
    if (thresholds[name] && value > thresholds[name]) {
      console.warn(`⚠️ Poor ${name}: ${Math.round(value)}${name === 'CLS' ? '' : 'ms'} (threshold: ${thresholds[name]}${name === 'CLS' ? '' : 'ms'})`);
    }
  }
  
  /**
   * Get all recorded metrics
   */
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
  
  /**
   * Get specific metric
   */
  getMetric(name) {
    return this.metrics.get(name);
  }
  
  /**
   * Cleanup observers
   */
  destroy() {
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('Failed to disconnect observer:', error);
      }
    });
    this.observers = [];
    this.metrics.clear();
  }
}

// Export
export default PerformanceMonitor; 