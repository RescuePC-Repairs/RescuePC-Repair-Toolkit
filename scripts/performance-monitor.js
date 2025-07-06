#!/usr/bin/env node

/**
 * 🚀 ENHANCED PERFORMANCE MONITORING SCRIPT
 * 
 * Tracks React performance optimizations and provides detailed metrics
 * Based on the React Performance Optimization Guide from dev.to
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      timestamp: new Date().toISOString(),
      bundleSize: {},
      lighthouse: {},
      reactOptimizations: {
        memoizedComponents: 0,
        useCallbackUsage: 0,
        useMemoUsage: 0,
        lazyLoadedComponents: 0,
        virtualizedLists: 0
      },
      coreWebVitals: {
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        firstInputDelay: 0,
        cumulativeLayoutShift: 0
      }
    };
  }

  /**
   * Analyze bundle size
   */
  analyzeBundleSize() {
    try {
      console.log('📦 Analyzing bundle size...');
      
      const buildPath = path.join(process.cwd(), '.next');
      if (!fs.existsSync(buildPath)) {
        console.log('⚠️  Build directory not found. Run "pnpm build" first.');
        return;
      }

      const staticPath = path.join(buildPath, 'static');
      if (fs.existsSync(staticPath)) {
        const files = fs.readdirSync(staticPath);
        files.forEach(file => {
          const filePath = path.join(staticPath, file);
          const stats = fs.statSync(filePath);
          this.metrics.bundleSize[file] = {
            size: stats.size,
            sizeInKB: Math.round(stats.size / 1024),
            sizeInMB: Math.round(stats.size / (1024 * 1024) * 100) / 100
          };
        });
      }

      console.log('📊 Bundle Analysis:');
      Object.entries(this.metrics.bundleSize).forEach(([file, data]) => {
        console.log(`  ${file}: ${data.sizeInKB} KB (${data.sizeInMB} MB)`);
      });
    } catch (error) {
      console.error('❌ Bundle analysis failed:', error.message);
    }
  }

  /**
   * Count React optimizations in codebase
   */
  countReactOptimizations() {
    try {
      console.log('⚛️  Analyzing React optimizations...');
      
      const srcPath = path.join(process.cwd(), 'components');
      if (!fs.existsSync(srcPath)) {
        console.log('⚠️  Components directory not found.');
        return;
      }

      let memoizedComponents = 0;
      let useCallbackUsage = 0;
      let useMemoUsage = 0;
      let lazyLoadedComponents = 0;
      let virtualizedLists = 0;

      const walkDir = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            walkDir(filePath);
          } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Count React.memo usage
            if (content.includes('React.memo') || content.includes('memo(')) {
              memoizedComponents++;
            }
            
            // Count useCallback usage
            if (content.includes('useCallback')) {
              useCallbackUsage++;
            }
            
            // Count useMemo usage
            if (content.includes('useMemo')) {
              useMemoUsage++;
            }
            
            // Count lazy loading
            if (content.includes('React.lazy') || content.includes('lazy(')) {
              lazyLoadedComponents++;
            }
            
            // Count virtualized lists
            if (content.includes('react-window') || content.includes('react-virtualized')) {
              virtualizedLists++;
            }
          }
        });
      };

      walkDir(srcPath);

      this.metrics.reactOptimizations = {
        memoizedComponents,
        useCallbackUsage,
        useMemoUsage,
        lazyLoadedComponents,
        virtualizedLists
      };

      console.log('⚛️  React Optimizations Found:');
      console.log(`  Memoized Components: ${memoizedComponents}`);
      console.log(`  useCallback Usage: ${useCallbackUsage}`);
      console.log(`  useMemo Usage: ${useMemoUsage}`);
      console.log(`  Lazy Loaded Components: ${lazyLoadedComponents}`);
      console.log(`  Virtualized Lists: ${virtualizedLists}`);
    } catch (error) {
      console.error('❌ React optimization analysis failed:', error.message);
    }
  }

  /**
   * Run Lighthouse audit
   */
  async runLighthouse() {
    try {
      console.log('🔍 Running Lighthouse audit...');
      
      const command = 'npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless"';
      
      execSync(command, { stdio: 'inherit' });
      
      if (fs.existsSync('./lighthouse-report.json')) {
        const report = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'));
        
        this.metrics.lighthouse = {
          performance: report.lhr.categories.performance.score * 100,
          accessibility: report.lhr.categories.accessibility.score * 100,
          bestPractices: report.lhr.categories['best-practices'].score * 100,
          seo: report.lhr.categories.seo.score * 100,
          firstContentfulPaint: report.lhr.audits['first-contentful-paint'].numericValue,
          largestContentfulPaint: report.lhr.audits['largest-contentful-paint'].numericValue,
          firstInputDelay: report.lhr.audits['max-potential-fid'].numericValue,
          cumulativeLayoutShift: report.lhr.audits['cumulative-layout-shift'].numericValue
        };

        console.log('📈 Lighthouse Results:');
        console.log(`  Performance: ${this.metrics.lighthouse.performance.toFixed(1)}%`);
        console.log(`  Accessibility: ${this.metrics.lighthouse.accessibility.toFixed(1)}%`);
        console.log(`  Best Practices: ${this.metrics.lighthouse.bestPractices.toFixed(1)}%`);
        console.log(`  SEO: ${this.metrics.lighthouse.seo.toFixed(1)}%`);
        console.log(`  First Contentful Paint: ${(this.metrics.lighthouse.firstContentfulPaint / 1000).toFixed(2)}s`);
        console.log(`  Largest Contentful Paint: ${(this.metrics.lighthouse.largestContentfulPaint / 1000).toFixed(2)}s`);
        console.log(`  First Input Delay: ${(this.metrics.lighthouse.firstInputDelay / 1000).toFixed(2)}s`);
        console.log(`  Cumulative Layout Shift: ${this.metrics.lighthouse.cumulativeLayoutShift.toFixed(3)}`);
      }
    } catch (error) {
      console.error('❌ Lighthouse audit failed:', error.message);
    }
  }

  /**
   * Check Core Web Vitals thresholds
   */
  checkCoreWebVitals() {
    const { lighthouse } = this.metrics;
    
    if (!lighthouse.performance) return;

    const thresholds = {
      fcp: 1800, // 1.8s
      lcp: 2500, // 2.5s
      fid: 100,  // 100ms
      cls: 0.1   // 0.1
    };

    console.log('🎯 Core Web Vitals Check:');
    
    const fcpPass = lighthouse.firstContentfulPaint <= thresholds.fcp;
    const lcpPass = lighthouse.largestContentfulPaint <= thresholds.lcp;
    const fidPass = lighthouse.firstInputDelay <= thresholds.fid;
    const clsPass = lighthouse.cumulativeLayoutShift <= thresholds.cls;

    console.log(`  First Contentful Paint: ${fcpPass ? '✅' : '❌'} ${(lighthouse.firstContentfulPaint / 1000).toFixed(2)}s (target: ≤1.8s)`);
    console.log(`  Largest Contentful Paint: ${lcpPass ? '✅' : '❌'} ${(lighthouse.largestContentfulPaint / 1000).toFixed(2)}s (target: ≤2.5s)`);
    console.log(`  First Input Delay: ${fidPass ? '✅' : '❌'} ${(lighthouse.firstInputDelay / 1000).toFixed(2)}s (target: ≤100ms)`);
    console.log(`  Cumulative Layout Shift: ${clsPass ? '✅' : '❌'} ${lighthouse.cumulativeLayoutShift.toFixed(3)} (target: ≤0.1)`);

    return fcpPass && lcpPass && fidPass && clsPass;
  }

  /**
   * Generate performance report
   */
  generateReport() {
    const report = {
      timestamp: this.metrics.timestamp,
      summary: {
        totalBundleSize: Object.values(this.metrics.bundleSize).reduce((sum, file) => sum + file.size, 0),
        averageBundleSize: Object.values(this.metrics.bundleSize).reduce((sum, file) => sum + file.size, 0) / Object.keys(this.metrics.bundleSize).length,
        lighthouseScore: this.metrics.lighthouse.performance || 0,
        coreWebVitalsPass: this.checkCoreWebVitals(),
        reactOptimizations: this.metrics.reactOptimizations
      },
      details: this.metrics
    };

    const reportPath = path.join(process.cwd(), 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📋 Performance Report Generated:');
    console.log(`  Total Bundle Size: ${(report.summary.totalBundleSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`  Average Bundle Size: ${(report.summary.averageBundleSize / 1024).toFixed(2)} KB`);
    console.log(`  Lighthouse Score: ${report.summary.lighthouseScore.toFixed(1)}%`);
    console.log(`  Core Web Vitals: ${report.summary.coreWebVitalsPass ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  React Optimizations: ${Object.values(this.metrics.reactOptimizations).reduce((sum, count) => sum + count, 0)} total`);
    console.log(`  Report saved to: ${reportPath}`);

    return report;
  }

  /**
   * Run complete performance analysis
   */
  async run() {
    console.log('🚀 Starting Enhanced Performance Analysis...\n');
    
    this.analyzeBundleSize();
    console.log('');
    
    this.countReactOptimizations();
    console.log('');
    
    await this.runLighthouse();
    console.log('');
    
    this.generateReport();
    
    console.log('\n✅ Performance analysis complete!');
  }
}

// Run the performance monitor
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.run().catch(console.error);
}

module.exports = PerformanceMonitor; 