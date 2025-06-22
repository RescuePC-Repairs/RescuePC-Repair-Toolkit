// =============================================================================
// E2E TEST TEMPLATE - FULL POWER PLAYWRIGHT
// =============================================================================

import { test, expect, devices } from '@playwright/test';

/**
 * 🎭 E2E TEST TEMPLATE - FULL POWER
 * 
 * Complete end-to-end testing template following CLAUDE.md standards
 * Tests real user workflows across different devices and browsers
 */

// =============================================================================
// 🔧 TEST CONFIGURATION
// =============================================================================

const TEST_CONFIG = {
  baseURL: 'http://localhost:3000',
  timeout: 30000,
  retries: 2,
  viewport: { width: 1920, height: 1080 },
  screenshots: 'only-on-failure',
  video: 'retain-on-failure'
};

// =============================================================================
// 🚀 CORE USER JOURNEYS
// =============================================================================

test.describe('RescuePC Repairs - Complete User Journey', () => {
  
  test.beforeEach(async ({ page }) => {
    // 🎯 Setup before each test
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // ==========================================================================
  // 🏠 HOMEPAGE TESTS
  // ==========================================================================
  test('should load homepage with all critical elements', async ({ page }) => {
    // ✅ Hero section
    await expect(page.locator('h1')).toContainText('🚀 Instantly Repair Any Windows PC');
    await expect(page.locator('[data-testid="hero-cta"]')).toBeVisible();
    
    // ✅ Pricing section
    await expect(page.locator('[data-testid="price-display"]')).toContainText('$79.99');
    
    // ✅ Features section
    const features = page.locator('[data-testid="feature-item"]');
    await expect(features).toHaveCount(6);
    
    // ✅ Trust indicators
    await expect(page.locator('[data-testid="security-badge"]')).toBeVisible();
    await expect(page.locator('[data-testid="money-back-guarantee"]')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // ✅ Desktop navigation
    await page.click('[data-testid="nav-features"]');
    await expect(page.locator('#features')).toBeInViewport();
    
    await page.click('[data-testid="nav-pricing"]');
    await expect(page.locator('#pricing')).toBeInViewport();
    
    await page.click('[data-testid="nav-support"]');
    await expect(page.locator('#support')).toBeInViewport();
  });

  // ==========================================================================
  // 📱 MOBILE RESPONSIVENESS
  // ==========================================================================
  test('should work perfectly on mobile', async ({ page }) => {
    // 🔧 Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // ✅ Mobile menu toggle
    await page.click('[data-testid="mobile-menu-toggle"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // ✅ Mobile navigation
    await page.click('[data-testid="mobile-nav-features"]');
    await expect(page.locator('#features')).toBeInViewport();
    
    // ✅ Mobile CTA buttons
    await expect(page.locator('[data-testid="mobile-cta"]')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-cta"]')).toBeEnabled();
  });

  // ==========================================================================
  // 💳 PURCHASE FLOW
  // ==========================================================================
  test('should complete purchase flow', async ({ page }) => {
    // 🎯 Step 1: Click main CTA
    await page.click('[data-testid="hero-cta"]');
    await expect(page.locator('#pricing')).toBeInViewport();
    
    // 🎯 Step 2: Select license
    await page.click('[data-testid="select-license"]');
    await expect(page.locator('[data-testid="license-selected"]')).toBeVisible();
    
    // 🎯 Step 3: Proceed to checkout
    await page.click('[data-testid="proceed-checkout"]');
    
    // 🎯 Step 4: Fill checkout form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="name-input"]', 'John Doe');
    
    // 🎯 Step 5: Payment method selection
    await page.click('[data-testid="payment-method-card"]');
    
    // 🎯 Step 6: Complete purchase (mock)
    await page.click('[data-testid="complete-purchase"]');
    
    // ✅ Verify success page
    await expect(page.locator('[data-testid="purchase-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="download-link"]')).toBeVisible();
  });

  // ==========================================================================
  // 🔒 SECURITY TESTS
  // ==========================================================================
  test('should enforce security measures', async ({ page }) => {
    // ✅ HTTPS enforcement
    const response = await page.goto('http://localhost:3000');
    expect(response?.url()).toContain('https://');
    
    // ✅ Security headers
    const headers = response?.headers();
    expect(headers?.['x-frame-options']).toBe('DENY');
    expect(headers?.['x-xss-protection']).toBe('1; mode=block');
    expect(headers?.['x-content-type-options']).toBe('nosniff');
    
    // ✅ CSP header
    expect(headers?.['content-security-policy']).toBeTruthy();
  });

  test('should prevent XSS attacks', async ({ page }) => {
    // 🔒 Test XSS prevention in forms
    const xssPayload = '<script>alert("XSS")</script>';
    
    await page.fill('[data-testid="contact-form-message"]', xssPayload);
    await page.click('[data-testid="submit-contact"]');
    
    // ✅ Verify XSS payload is sanitized
    const submittedContent = await page.locator('[data-testid="submitted-message"]').textContent();
    expect(submittedContent).not.toContain('<script>');
    expect(submittedContent).toContain('&lt;script&gt;');
  });

  // ==========================================================================
  // ⚡ PERFORMANCE TESTS
  // ==========================================================================
  test('should meet performance benchmarks', async ({ page }) => {
    // 🎯 Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.LCP = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              vitals.FID = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              vitals.CLS = (vitals.CLS || 0) + entry.value;
            }
          });
          
          if (Object.keys(vitals).length >= 2) {
            resolve(vitals);
          }
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // Timeout after 10 seconds
        setTimeout(() => resolve({}), 10000);
      });
    });
    
    // ✅ Assert performance thresholds
    if (metrics.LCP) expect(metrics.LCP).toBeLessThan(2500); // < 2.5s
    if (metrics.FID) expect(metrics.FID).toBeLessThan(100);  // < 100ms
    if (metrics.CLS) expect(metrics.CLS).toBeLessThan(0.1);  // < 0.1
  });

  test('should load within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // < 3 seconds
  });

  // ==========================================================================
  // ♿ ACCESSIBILITY TESTS
  // ==========================================================================
  test('should be fully accessible', async ({ page }) => {
    // 🎯 Inject axe-core for accessibility testing
    await page.addScriptTag({ url: 'https://unpkg.com/axe-core@4.4.1/axe.min.js' });
    
    // ✅ Run accessibility audit
    const violations = await page.evaluate(() => {
      return new Promise((resolve) => {
        axe.run(document, (err, results) => {
          resolve(results.violations);
        });
      });
    });
    
    // ✅ Assert no accessibility violations
    expect(violations).toHaveLength(0);
  });

  test('should support keyboard navigation', async ({ page }) => {
    // ✅ Tab through all interactive elements
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // ✅ Navigate to main CTA
    let focusedElement = await page.locator(':focus');
    while (!(await focusedElement.getAttribute('data-testid'))?.includes('hero-cta')) {
      await page.keyboard.press('Tab');
      focusedElement = await page.locator(':focus');
    }
    
    // ✅ Activate with Enter key
    await page.keyboard.press('Enter');
    await expect(page.locator('#pricing')).toBeInViewport();
  });

  test('should support screen readers', async ({ page }) => {
    // ✅ Check ARIA labels
    const ctaButton = page.locator('[data-testid="hero-cta"]');
    await expect(ctaButton).toHaveAttribute('aria-label');
    
    // ✅ Check heading structure
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    const h2s = page.locator('h2');
    expect(await h2s.count()).toBeGreaterThan(0);
    
    // ✅ Check alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt.length).toBeGreaterThan(0);
    }
  });

  // ==========================================================================
  // 🌐 CROSS-BROWSER TESTS
  // ==========================================================================
  test('should work in Chrome', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // Test Chrome-specific features
    const userAgent = await page.evaluate(() => navigator.userAgent);
    expect(userAgent).toContain('Chrome');
  });

  test('should work in Firefox', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // Test Firefox-specific features
    const userAgent = await page.evaluate(() => navigator.userAgent);
    expect(userAgent).toContain('Firefox');
  });

  test('should work in Safari', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // Test Safari-specific features
    const userAgent = await page.evaluate(() => navigator.userAgent);
    expect(userAgent).toContain('Safari');
  });

  // ==========================================================================
  // 📊 ANALYTICS TESTS
  // ==========================================================================
  test('should track user interactions', async ({ page }) => {
    // 🎯 Mock analytics
    await page.addInitScript(() => {
      window.gtag = (command, ...args) => {
        window.gtagCalls = window.gtagCalls || [];
        window.gtagCalls.push({ command, args });
      };
    });
    
    await page.goto('/');
    
    // ✅ Click CTA and verify tracking
    await page.click('[data-testid="hero-cta"]');
    
    const gtagCalls = await page.evaluate(() => window.gtagCalls);
    expect(gtagCalls).toContainEqual({
      command: 'event',
      args: ['click', { event_category: 'engagement', event_label: 'hero_cta' }]
    });
  });

  // ==========================================================================
  // 🔄 ERROR HANDLING TESTS
  // ==========================================================================
  test('should handle network failures gracefully', async ({ page }) => {
    // 🔧 Simulate network failure
    await page.route('**/api/**', route => route.abort());
    
    await page.goto('/');
    
    // ✅ Verify error handling
    await page.click('[data-testid="hero-cta"]');
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
  });

  test('should handle JavaScript errors gracefully', async ({ page }) => {
    // 🔧 Inject JavaScript error
    await page.addInitScript(() => {
      window.addEventListener('load', () => {
        throw new Error('Simulated JS error');
      });
    });
    
    await page.goto('/');
    
    // ✅ Verify page still functions
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="hero-cta"]')).toBeEnabled();
  });

  // ==========================================================================
  // 🎨 VISUAL REGRESSION TESTS
  // ==========================================================================
  test('should match visual baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // ✅ Full page screenshot
    await expect(page).toHaveScreenshot('homepage-full.png');
    
    // ✅ Hero section screenshot
    await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot('hero-section.png');
    
    // ✅ Pricing section screenshot
    await expect(page.locator('[data-testid="pricing-section"]')).toHaveScreenshot('pricing-section.png');
  });

  test('should handle different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`);
    }
  });
});

// =============================================================================
// 🔧 DEVICE-SPECIFIC TESTS
// =============================================================================

test.describe('Device-Specific Tests', () => {
  
  test('should work on iPhone', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12']
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // ✅ Touch interactions
    await page.tap('[data-testid="hero-cta"]');
    await expect(page.locator('#pricing')).toBeInViewport();
    
    await context.close();
  });

  test('should work on Android', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['Pixel 5']
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // ✅ Android-specific features
    await page.tap('[data-testid="mobile-menu-toggle"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    await context.close();
  });

  test('should work on iPad', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad Pro']
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // ✅ Tablet-specific layout
    await expect(page.locator('[data-testid="tablet-layout"]')).toBeVisible();
    
    await context.close();
  });
});

// =============================================================================
// 🎯 LOAD TESTING
// =============================================================================

test.describe('Load Testing', () => {
  
  test('should handle concurrent users', async ({ browser }) => {
    const contexts = await Promise.all(
      Array.from({ length: 10 }, () => browser.newContext())
    );
    
    const pages = await Promise.all(
      contexts.map(context => context.newPage())
    );
    
    // ✅ Simulate 10 concurrent users
    const startTime = Date.now();
    
    await Promise.all(
      pages.map(async (page, index) => {
        await page.goto('/');
        await page.click('[data-testid="hero-cta"]');
        await page.waitForSelector('[data-testid="pricing-section"]');
      })
    );
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // ✅ Should handle load within reasonable time
    expect(totalTime).toBeLessThan(10000); // < 10 seconds
    
    // ✅ Cleanup
    await Promise.all(contexts.map(context => context.close()));
  });
});

// =============================================================================
// 🔧 HELPER FUNCTIONS
// =============================================================================

/**
 * Wait for element to be stable (no movement)
 */
async function waitForStable(page, selector, timeout = 5000) {
  const element = page.locator(selector);
  let previousBox = await element.boundingBox();
  
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    await page.waitForTimeout(100);
    const currentBox = await element.boundingBox();
    
    if (JSON.stringify(previousBox) === JSON.stringify(currentBox)) {
      return; // Element is stable
    }
    
    previousBox = currentBox;
  }
  
  throw new Error(`Element ${selector} did not stabilize within ${timeout}ms`);
}

/**
 * Simulate slow network conditions
 */
async function simulateSlowNetwork(page) {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 1000 * 1024 / 8, // 1 Mbps
    uploadThroughput: 500 * 1024 / 8,    // 500 Kbps
    latency: 100 // 100ms
  });
}

/**
 * Check for console errors
 */
async function checkConsoleErrors(page) {
  const errors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  return errors;
}

export {
  waitForStable,
  simulateSlowNetwork,
  checkConsoleErrors
}; 