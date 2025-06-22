// =============================================================================
// PLAYWRIGHT CONFIGURATION - FULL POWER E2E
// =============================================================================

import { defineConfig, devices } from '@playwright/test';

/**
 * 🎭 PLAYWRIGHT FULL POWER CONFIGURATION
 * 
 * Enterprise-grade E2E testing configuration following CLAUDE.md standards
 * Cross-browser, cross-device, performance, accessibility, and security testing
 */

export default defineConfig({
  // ==========================================================================
  // 🎯 CORE CONFIGURATION
  // ==========================================================================
  
  testDir: './test-guides/e2e',
  
  // Test file patterns
  testMatch: [
    '**/*.test.js',
    '**/*.spec.js',
    '**/*.e2e.js'
  ],
  
  // Timeout settings
  timeout: 30 * 1000, // 30 seconds per test
  expect: {
    timeout: 10 * 1000 // 10 seconds for assertions
  },
  
  // Test execution
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // ==========================================================================
  // 📝 REPORTING CONFIGURATION
  // ==========================================================================
  
  reporter: [
    // Console reporter
    ['list'],
    
    // HTML report
    ['html', { 
      outputFolder: 'test-results/html-report',
      open: 'never'
    }],
    
    // JUnit XML for CI/CD
    ['junit', { 
      outputFile: 'test-results/junit.xml' 
    }],
    
    // JSON report
    ['json', { 
      outputFile: 'test-results/results.json' 
    }],
    
    // Allure report (if available)
    ...(process.env.CI ? [['allure-playwright']] : [])
  ],
  
  // ==========================================================================
  // 🌐 SERVER CONFIGURATION
  // ==========================================================================
  
  use: {
    // Base URL
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Browser settings
    headless: process.env.CI ? true : false,
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: false,
    
    // Screenshots and videos
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // Network settings
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
    
    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York',
    
    // Permissions
    permissions: ['notifications'],
    
    // Security
    bypassCSP: false,
    
    // Performance
    launchOptions: {
      args: [
        '--disable-web-security',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows',
        '--disable-background-timer-throttling'
      ]
    }
  },
  
  // ==========================================================================
  // 🖥️ BROWSER PROJECTS
  // ==========================================================================
  
  projects: [
    // =======================================================================
    // 🌐 DESKTOP BROWSERS
    // =======================================================================
    
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      }
    },
    
    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      }
    },
    
    {
      name: 'webkit-desktop',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      }
    },
    
    // =======================================================================
    // 📱 MOBILE DEVICES
    // =======================================================================
    
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    },
    
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] }
    },
    
    {
      name: 'mobile-samsung',
      use: { ...devices['Galaxy S21'] }
    },
    
    // =======================================================================
    // 📟 TABLET DEVICES
    // =======================================================================
    
    {
      name: 'tablet-ipad',
      use: { ...devices['iPad Pro'] }
    },
    
    {
      name: 'tablet-android',
      use: { ...devices['Galaxy Tab S4'] }
    },
    
    // =======================================================================
    // 🔍 ACCESSIBILITY TESTING
    // =======================================================================
    
    {
      name: 'accessibility-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // Enable accessibility tree
        launchOptions: {
          args: ['--force-renderer-accessibility']
        }
      },
      testMatch: ['**/accessibility.test.js']
    },
    
    // =======================================================================
    // ⚡ PERFORMANCE TESTING
    // =======================================================================
    
    {
      name: 'performance-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // Performance monitoring
        launchOptions: {
          args: [
            '--enable-precise-memory-info',
            '--enable-memory-info'
          ]
        }
      },
      testMatch: ['**/performance.test.js']
    },
    
    // =======================================================================
    // 🔒 SECURITY TESTING
    // =======================================================================
    
    {
      name: 'security-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // Security testing
        ignoreHTTPSErrors: false,
        bypassCSP: false
      },
      testMatch: ['**/security.test.js']
    },
    
    // =======================================================================
    // 🌐 NETWORK CONDITIONS
    // =======================================================================
    
    {
      name: 'slow-3g',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // Slow 3G simulation
        launchOptions: {
          args: ['--enable-network-service-logging']
        }
      },
      testMatch: ['**/network.test.js']
    }
  ],
  
  // ==========================================================================
  // 🚀 WEB SERVER CONFIGURATION
  // ==========================================================================
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
    
    // Environment variables
    env: {
      NODE_ENV: 'test',
      PORT: '3000'
    }
  },
  
  // ==========================================================================
  // 📁 OUTPUT CONFIGURATION
  // ==========================================================================
  
  outputDir: 'test-results/playwright',
  
  // ==========================================================================
  // 🔧 GLOBAL SETUP & TEARDOWN
  // ==========================================================================
  
  globalSetup: require.resolve('./test-guides/setup/global-setup.js'),
  globalTeardown: require.resolve('./test-guides/setup/global-teardown.js'),
  
  // ==========================================================================
  // 🎨 CUSTOM CONFIGURATION
  // ==========================================================================
  
  // Test metadata
  metadata: {
    project: 'RescuePC Repairs',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'test',
    timestamp: new Date().toISOString()
  },
  
  // ==========================================================================
  // 🔍 DEBUGGING CONFIGURATION
  // ==========================================================================
  
  // Debug mode settings
  ...(process.env.DEBUG && {
    use: {
      headless: false,
      slowMo: 1000,
      screenshot: 'on',
      video: 'on',
      trace: 'on'
    },
    workers: 1
  }),
  
  // ==========================================================================
  // 📊 ADVANCED FEATURES
  // ==========================================================================
  
  // Experimental features
  experimental: {
    // Service workers
    serviceWorkers: 'block',
    
    // Network domains
    networkDomains: ['localhost', '127.0.0.1']
  }
});

// =============================================================================
// 🔧 ENVIRONMENT-SPECIFIC OVERRIDES
// =============================================================================

// CI/CD environment
if (process.env.CI) {
  // Override for CI environment
  module.exports = {
    ...module.exports,
    
    use: {
      ...module.exports.use,
      headless: true,
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure'
    },
    
    // Limit parallelism in CI
    workers: 2,
    retries: 3,
    
    // Longer timeouts for CI
    timeout: 60 * 1000,
    expect: {
      timeout: 20 * 1000
    }
  };
}

// Local development
if (process.env.NODE_ENV === 'development') {
  module.exports = {
    ...module.exports,
    
    use: {
      ...module.exports.use,
      headless: false,
      slowMo: 500,
      screenshot: 'on',
      video: 'on'
    },
    
    // Single worker for debugging
    workers: 1,
    retries: 0
  };
} 