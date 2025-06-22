# 🚀 CLAUDE.MD - AGENTIC CODING FULL POWER GUIDE

## ⚡ **FULL POWER MODE ACTIVATED**

This document contains **COMPLETE** style rules, test guides, and development standards for **MAXIMUM PRODUCTIVITY** and **ZERO BULLSHIT** coding.

---

## 🎯 **CORE PRINCIPLES - NO COMPROMISE**

### **1. SPEED & EFFICIENCY**
- ⚡ **FAST DECISIONS** - No analysis paralysis
- 🎯 **DIRECT SOLUTIONS** - Shortest path to working code
- 🔥 **IMMEDIATE ACTION** - The Smartest Code first, best optimization always
- 💯 **RESULTS FOCUSED** - Working > Perfect

### **2. QUALITY STANDARDS**
- 🏗️ **ENTERPRISE ARCHITECTURE** - Scalable from day one
- 🔒 **SECURITY FIRST** - Military-grade protection
- ♿ **ACCESSIBILITY MANDATORY** - WCAG AAA compliance
- ⚡ **PERFORMANCE CRITICAL** - <3s load times

### **3. MAINTAINABILITY**
- 🧩 **MODULAR EVERYTHING** - Components, functions, styles
- 📝 **SELF-DOCUMENTING CODE** - Clear naming, inline docs
- 🔄 **DRY PRINCIPLE** - Zero code duplication
- 🎨 **CONSISTENT PATTERNS** - Predictable structure

---

## 📋 **STYLE RULES - ABSOLUTE STANDARDS**

### **🎨 CSS ARCHITECTURE RULES**

#### **Design Token System (MANDATORY)**
```css
/* ✅ CORRECT - Use design tokens */
.btn {
  padding: var(--space-4) var(--space-6);
  background: var(--brand-primary);
  border-radius: var(--radius-button);
  transition: var(--transition-all);
}

/* ❌ WRONG - Magic numbers */
.btn {
  padding: 16px 24px;
  background: #2563eb;
  border-radius: 8px;
  transition: all 0.3s ease;
}
```

#### **BEM Methodology (STRICT)**
```css
/* ✅ CORRECT - BEM naming */
.hero__title--large { }
.card__header--featured { }
.btn--primary--loading { }

/* ❌ WRONG - Random naming */
.big-title { }
.special-header { }
.blue-button { }
```

#### **Component Structure (ENFORCED)**
```css
/* ✅ CORRECT - Component organization */
/* =============================================================================
   COMPONENT NAME - DESCRIPTION
   ============================================================================= */

/* Base styles */
.component { }

/* Variants */
.component--variant { }

/* States */
.component.is-active { }

/* Responsive */
@media (max-width: 768px) {
  .component { }
}
```

### **🔧 JAVASCRIPT RULES**

#### **ES6+ MANDATORY**
```javascript
// ✅ CORRECT - Modern syntax
const handleClick = async (event) => {
  const { target } = event;
  const data = await fetchData();
  return data?.results ?? [];
};

// ❌ WRONG - Old syntax
function handleClick(event) {
  var target = event.target;
  // callback hell...
}
```

#### **Error Handling (REQUIRED)**
```javascript
// ✅ CORRECT - Comprehensive error handling
class ComponentLoader {
  async loadComponent(name, src) {
    try {
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`Failed to load ${name}: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Component loading error:`, error);
      this.handleError(error, 'component_loading', { name, src });
      return this.getFallbackContent(name);
    }
  }
}

// ❌ WRONG - No error handling
async function loadComponent(name, src) {
  const response = await fetch(src);
  return response.text();
}
```

#### **Documentation Standards**
```javascript
/**
 * Component loader with caching and error recovery
 * 
 * @class ComponentLoader
 * @param {EventBus} eventBus - Application event bus
 * @example
 * const loader = new ComponentLoader(eventBus);
 * await loader.loadComponent('header', '/components/header.html');
 */
class ComponentLoader {
  /**
   * Load and cache a component
   * @param {string} name - Component name
   * @param {string} src - Component source URL
   * @returns {Promise<string>} Component HTML content
   * @throws {Error} When component loading fails
   */
  async loadComponent(name, src) {
    // Implementation...
  }
}
```

### **📁 FILE ORGANIZATION RULES**

#### **Directory Structure (ENFORCED)**
```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── sections/       # Page sections (Hero, Features)
│   └── ui/             # Basic UI elements (Button, Card)
├── styles/             # CSS architecture
│   ├── design-tokens/  # Design system variables
│   ├── base/          # Reset, typography, layout
│   ├── components/    # Component-specific styles
│   └── utilities/     # Utility classes
├── scripts/           # JavaScript modules
│   ├── core/         # Application core (App, EventBus)
│   ├── modules/      # Feature modules (Performance, Security)
│   └── utils/        # Utility functions
└── assets/           # Static assets (images, fonts)
```

#### **Naming Conventions (STRICT)**
```
✅ CORRECT:
- hero-section.html
- button-component.css
- performance-monitor.js
- user-authentication.service.js

❌ WRONG:
- HeroSection.html
- ButtonStyles.css
- perfMon.js
- auth.js
```

---

## 🧪 **TESTING GUIDES - COMPREHENSIVE**

### **🔬 UNIT TESTING STANDARDS**

#### **Test Structure (MANDATORY)**
```javascript
// ✅ CORRECT - Comprehensive test structure
describe('ComponentLoader', () => {
  let componentLoader;
  let mockEventBus;
  let mockFetch;

  beforeEach(() => {
    mockEventBus = {
      emit: jest.fn(),
      on: jest.fn()
    };
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    componentLoader = new ComponentLoader(mockEventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadComponent', () => {
    it('should load and return component content', async () => {
      // Arrange
      const mockContent = '<div>Test Component</div>';
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockContent)
      });

      // Act
      const result = await componentLoader.loadComponent('test', '/test.html');

      // Assert
      expect(result).toBe(mockContent);
      expect(mockFetch).toHaveBeenCalledWith('/test.html');
    });

    it('should handle fetch errors gracefully', async () => {
      // Arrange
      mockFetch.mockRejectedValue(new Error('Network error'));

      // Act
      const result = await componentLoader.loadComponent('test', '/test.html');

      // Assert
      expect(result).toContain('fallback');
      expect(mockEventBus.emit).toHaveBeenCalledWith('error', expect.any(Object));
    });
  });
});
```

#### **Coverage Requirements (ENFORCED)**
```bash
# Minimum coverage thresholds
jest --coverage --coverageThreshold='{
  "global": {
    "branches": 90,
    "functions": 90,
    "lines": 90,
    "statements": 90
  }
}'
```

### **🌐 INTEGRATION TESTING**

#### **Component Integration Tests**
```javascript
// ✅ CORRECT - Integration test example
describe('Header Component Integration', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should render header with navigation', async () => {
    // Arrange
    const app = new RescuePCApplication();
    
    // Act
    await app.init();
    const header = container.querySelector('.header');
    
    // Assert
    expect(header).toBeTruthy();
    expect(header.querySelector('.navbar')).toBeTruthy();
    expect(header.querySelectorAll('.nav-link')).toHaveLength(5);
  });

  it('should handle mobile menu toggle', async () => {
    // Arrange
    const app = new RescuePCApplication();
    await app.init();
    
    // Act
    const toggleButton = container.querySelector('.navbar__toggle');
    toggleButton.click();
    
    // Assert
    expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('.navbar__overlay--active')).toBeTruthy();
  });
});
```

### **🎭 E2E TESTING WITH PLAYWRIGHT**

#### **E2E Test Structure**
```javascript
// ✅ CORRECT - E2E test example
import { test, expect } from '@playwright/test';

test.describe('RescuePC Repairs - Full User Journey', () => {
  test('should complete purchase flow', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Verify page loads correctly
    await expect(page.locator('h1')).toContainText('Instantly Repair Any Windows PC');
    
    // Click download button
    await page.click('[data-testid="download-btn"]');
    
    // Verify pricing section is visible
    await expect(page.locator('#pricing')).toBeVisible();
    
    // Complete purchase
    await page.click('[data-testid="purchase-btn"]');
    
    // Verify purchase confirmation
    await expect(page.locator('[data-testid="purchase-success"]')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check for accessibility violations
    const violations = await page.evaluate(() => {
      return new Promise((resolve) => {
        axe.run(document, (err, results) => {
          resolve(results.violations);
        });
      });
    });
    
    expect(violations).toHaveLength(0);
  });

  test('should perform well', async ({ page }) => {
    await page.goto('/');
    
    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          resolve(entries.map(entry => ({
            name: entry.name,
            value: entry.startTime
          })));
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    const lcp = metrics.find(m => m.name === 'largest-contentful-paint');
    expect(lcp.value).toBeLessThan(2500); // LCP < 2.5s
  });
});
```

---

## ⚡ **PERFORMANCE STANDARDS - NON-NEGOTIABLE**

### **🎯 CORE WEB VITALS REQUIREMENTS**

```javascript
// Performance thresholds (MANDATORY)
const PERFORMANCE_THRESHOLDS = {
  LCP: 2500,    // Largest Contentful Paint < 2.5s
  FID: 100,     // First Input Delay < 100ms
  CLS: 0.1,     // Cumulative Layout Shift < 0.1
  TTFB: 800,    // Time to First Byte < 800ms
  FCP: 1800     // First Contentful Paint < 1.8s
};

// Automated performance testing
class PerformanceMonitor {
  trackWebVitals() {
    // LCP tracking
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.reportMetric('LCP', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID tracking
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        this.reportMetric('FID', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS tracking
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.reportMetric('CLS', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  reportMetric(name, value) {
    const threshold = PERFORMANCE_THRESHOLDS[name];
    const status = value <= threshold ? 'PASS' : 'FAIL';
    
    console.log(`${name}: ${value}ms (${status})`);
    
    if (status === 'FAIL') {
      this.alertPerformanceIssue(name, value, threshold);
    }
  }
}
```

### **📊 BUNDLE SIZE LIMITS**

```javascript
// Bundle size limits (ENFORCED)
const BUNDLE_LIMITS = {
  'main.js': 250,      // KB
  'vendor.js': 500,    // KB
  'main.css': 100,     // KB
  'total': 1000        // KB
};

// Webpack bundle analyzer configuration
module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      defaultSizes: 'gzip',
      generateStatsFile: true,
      statsFilename: 'bundle-stats.json'
    })
  ]
};
```

---

## 🔒 **SECURITY STANDARDS - MILITARY GRADE**

### **🛡️ SECURITY HEADERS (MANDATORY)**

```javascript
// Security headers configuration
const SECURITY_HEADERS = {
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
    img-src 'self' data: https:;
    font-src 'self' https://cdnjs.cloudflare.com;
    connect-src 'self' https://www.google-analytics.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `,
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};
```

### **🔐 INPUT SANITIZATION**

```javascript
// XSS Prevention (REQUIRED)
class SecurityManager {
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  validateCSRFToken(token) {
    const storedToken = sessionStorage.getItem('csrf_token');
    return token === storedToken;
  }

  enforceRateLimit(identifier, limit = 100, window = 60000) {
    const key = `rate_limit_${identifier}`;
    const requests = JSON.parse(localStorage.getItem(key) || '[]');
    const now = Date.now();
    
    // Clean old requests
    const validRequests = requests.filter(time => now - time < window);
    
    if (validRequests.length >= limit) {
      throw new Error('Rate limit exceeded');
    }
    
    validRequests.push(now);
    localStorage.setItem(key, JSON.stringify(validRequests));
  }
}
```

---

## 🚀 **BUILD SYSTEM - PRODUCTION READY**

### **⚙️ VITE CONFIGURATION (OPTIMIZED)**

```javascript
// vite.config.js - FULL POWER CONFIGURATION
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['lit', 'lit-html'],
          core: ['src/scripts/core/Application.js'],
          components: ['src/scripts/modules/PerformanceMonitor.js']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    }
  },
  
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ]
});
```

### **📦 PACKAGE.JSON SCRIPTS (COMPLETE)**

```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 3000",
    "build": "npm run lint && npm run test && vite build",
    "build:prod": "npm run build && npm run optimize",
    "preview": "vite preview --port 4173",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "lint": "eslint src/**/*.js --fix",
    "lint:css": "stylelint src/**/*.css --fix",
    "format": "prettier --write src/**/*.{js,css,html}",
    "analyze": "npm run build && npx vite-bundle-analyzer",
    "optimize": "npm run optimize:images && npm run compress",
    "optimize:images": "imagemin src/assets/images/* --out-dir=dist/assets/images",
    "compress": "gzip-all dist/",
    "security:audit": "npm audit && snyk test",
    "performance:test": "lighthouse --view --output=html",
    "deploy": "npm run build:prod && vercel --prod"
  }
}
```

---

## 🎯 **QUALITY GATES - AUTOMATED**

### **🔍 PRE-COMMIT HOOKS**

```javascript
// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running quality checks..."

# Lint staged files
npx lint-staged

# Run tests
npm run test

# Check bundle size
npm run analyze

# Security audit
npm run security:audit

echo "✅ All quality checks passed!"
```

### **📊 CI/CD PIPELINE**

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint code
        run: npm run lint
      
      - name: Run tests
        run: npm run test
      
      - name: E2E tests
        run: npm run test:e2e
      
      - name: Build project
        run: npm run build
      
      - name: Performance audit
        run: npm run performance:test
      
      - name: Security audit
        run: npm run security:audit

  deploy:
    needs: quality
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: npm run deploy
```

---

## 📋 **CHECKLIST - BEFORE EVERY COMMIT**

### **✅ CODE QUALITY CHECKLIST**

```markdown
- [ ] All functions have JSDoc comments
- [ ] No console.log statements in production code
- [ ] Error handling implemented for all async operations
- [ ] Components follow BEM naming convention
- [ ] CSS uses design tokens (no magic numbers)
- [ ] All images have alt text
- [ ] ARIA labels on interactive elements
- [ ] Responsive design tested on mobile
- [ ] Performance budget under limits
- [ ] Security headers configured
- [ ] Tests written and passing
- [ ] Bundle size under 1MB
- [ ] Lighthouse score > 90
- [ ] No accessibility violations
- [ ] Cross-browser compatibility verified
```

### **🚀 DEPLOYMENT CHECKLIST**

```markdown
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] CDN configured
- [ ] Monitoring tools setup
- [ ] Error tracking enabled
- [ ] Analytics implemented
- [ ] Backup strategy in place
- [ ] Rollback plan prepared
- [ ] Performance monitoring active
- [ ] Security scanning completed
```

---

## 🔥 **EMERGENCY PROCEDURES**

### **🚨 PRODUCTION ISSUES**

```javascript
// Emergency rollback procedure
const EMERGENCY_PROCEDURES = {
  rollback: {
    command: 'git revert HEAD --no-edit && npm run deploy',
    description: 'Immediate rollback to previous version'
  },
  
  hotfix: {
    branch: 'hotfix/emergency-fix',
    process: [
      'git checkout main',
      'git pull origin main',
      'git checkout -b hotfix/emergency-fix',
      '// Make minimal fix',
      'npm run test',
      'git commit -m "hotfix: emergency fix"',
      'git push origin hotfix/emergency-fix',
      '// Create PR and merge immediately'
    ]
  },
  
  monitoring: {
    errors: 'Check error tracking dashboard',
    performance: 'Monitor Core Web Vitals',
    uptime: 'Verify service availability'
  }
};
```

---

## 🎉 **FULL POWER ACTIVATED**

This guide contains **EVERYTHING** you need for **MAXIMUM PRODUCTIVITY**:

- ⚡ **SPEED**: Fast decisions, immediate action
- 🏗️ **QUALITY**: Enterprise-grade standards
- 🔒 **SECURITY**: Military-grade protection
- ♿ **ACCESSIBILITY**: WCAG AAA compliance
- ⚡ **PERFORMANCE**: <3s load times
- 🧪 **TESTING**: Comprehensive coverage
- 🚀 **DEPLOYMENT**: Production-ready CI/CD

**NO MORE BULLSHIT. JUST RESULTS.** 💯

---

*Last updated: January 2024*
*Status: FULL POWER MODE ACTIVATED* 🔥
