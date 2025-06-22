// =============================================================================
// JEST CONFIGURATION - FULL POWER
// =============================================================================

/**
 * 🧪 JEST FULL POWER CONFIGURATION
 * 
 * Enterprise-grade Jest configuration following CLAUDE.md standards
 * Maximum coverage, performance, and reliability
 */

module.exports = {
  // ==========================================================================
  // 🎯 CORE CONFIGURATION
  // ==========================================================================
  
  displayName: 'RescuePC Repairs - Full Power Tests',
  
  // Test environment
  testEnvironment: 'jsdom',
  
  // Root directories
  roots: ['<rootDir>/src', '<rootDir>/test-guides'],
  
  // Module paths
  modulePaths: ['<rootDir>/src', '<rootDir>/node_modules'],
  
  // File extensions
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  
  // ==========================================================================
  // 📁 FILE PATTERNS
  // ==========================================================================
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)',
    '**/test-guides/**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  
  // Files to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/backups/',
    '/.git/'
  ],
  
  // ==========================================================================
  // 🔧 MODULE RESOLUTION
  // ==========================================================================
  
  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@scripts/(.*)$': '<rootDir>/src/scripts/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
    '^@test/(.*)$': '<rootDir>/test-guides/$1'
  },
  
  // Transform files
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.css$': 'jest-css-modules-transform',
    '^.+\\.(png|jpg|jpeg|gif|webp|svg)$': 'jest-transform-stub'
  },
  
  // Files to not transform
  transformIgnorePatterns: [
    'node_modules/(?!(lit|lit-html|@lit)/)'
  ],
  
  // ==========================================================================
  // 🎨 SETUP & TEARDOWN
  // ==========================================================================
  
  // Setup files (run once)
  setupFiles: [
    '<rootDir>/test-guides/setup/jest.setup.js'
  ],
  
  // Setup files after environment (run before each test file)
  setupFilesAfterEnv: [
    '<rootDir>/test-guides/setup/jest.afterEnv.js',
    '@testing-library/jest-dom'
  ],
  
  // Global setup
  globalSetup: '<rootDir>/test-guides/setup/globalSetup.js',
  
  // Global teardown
  globalTeardown: '<rootDir>/test-guides/setup/globalTeardown.js',
  
  // ==========================================================================
  // 📊 COVERAGE CONFIGURATION
  // ==========================================================================
  
  // Collect coverage
  collectCoverage: true,
  
  // Coverage directory
  coverageDirectory: '<rootDir>/coverage',
  
  // Coverage files to collect from
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.config.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  
  // Coverage thresholds (ENFORCED)
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    // Per-directory thresholds
    './src/scripts/core/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    },
    './src/scripts/modules/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  
  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
    'clover'
  ],
  
  // Files to ignore for coverage
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test-guides/',
    '/coverage/',
    '\\.config\\.(js|ts)$',
    '\\.stories\\.(js|jsx|ts|tsx)$'
  ],
  
  // ==========================================================================
  // ⚡ PERFORMANCE CONFIGURATION
  // ==========================================================================
  
  // Maximum worker processes
  maxWorkers: '50%',
  
  // Cache directory
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // Clear cache between runs
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  
  // Timeout settings
  testTimeout: 10000, // 10 seconds default
  
  // ==========================================================================
  // 📝 REPORTING CONFIGURATION
  // ==========================================================================
  
  // Test reporters
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './coverage/html-report',
        filename: 'jest-report.html',
        expand: true,
        hideIcon: false,
        pageTitle: 'RescuePC Repairs - Test Results'
      }
    ],
    [
      'jest-junit',
      {
        outputDirectory: './coverage',
        outputName: 'junit.xml',
        ancestorSeparator: ' › ',
        uniqueOutputName: 'false',
        suiteNameTemplate: '{filepath}',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}'
      }
    ]
  ],
  
  // Verbose output
  verbose: true,
  
  // ==========================================================================
  // 🔧 ADVANCED CONFIGURATION
  // ==========================================================================
  
  // Globals available in tests
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    },
    __DEV__: true,
    __TEST__: true,
    __VERSION__: '1.0.0'
  },
  
  // Mock configuration
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Error handling
  errorOnDeprecated: true,
  
  // Watch mode configuration
  watchman: true,
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/'
  ],
  
  // ==========================================================================
  // 🎭 JSDOM CONFIGURATION
  // ==========================================================================
  
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    resources: 'usable',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    includeNodeLocations: true
  },
  
  // ==========================================================================
  // 🔍 DEBUGGING CONFIGURATION
  // ==========================================================================
  
  // Detect open handles
  detectOpenHandles: true,
  
  // Detect leaks
  detectLeaks: true,
  
  // Force exit after tests
  forceExit: false,
  
  // Log heap usage
  logHeapUsage: true,
  
  // ==========================================================================
  // 📦 PROJECT CONFIGURATION (for monorepos)
  // ==========================================================================
  
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/src/**/*.test.(js|jsx|ts|tsx)']
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/test-guides/integration/**/*.test.(js|jsx|ts|tsx)']
    },
    {
      displayName: 'e2e',
      runner: '@playwright/test',
      testMatch: ['<rootDir>/test-guides/e2e/**/*.test.(js|jsx|ts|tsx)']
    }
  ],
  
  // ==========================================================================
  // 🚀 CUSTOM MATCHERS & EXTENSIONS
  // ==========================================================================
  
  // Custom matchers
  setupFilesAfterEnv: [
    '<rootDir>/test-guides/matchers/customMatchers.js'
  ],
  
  // Snapshot serializers
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ],
  
  // ==========================================================================
  // 🔒 SECURITY CONFIGURATION
  // ==========================================================================
  
  // Sandbox mode
  sandboxInjectedGlobals: ['Math'],
  
  // ==========================================================================
  // 📈 PERFORMANCE MONITORING
  // ==========================================================================
  
  // Slow test threshold
  slowTestThreshold: 5000, // 5 seconds
  
  // Notify on slow tests
  notify: true,
  notifyMode: 'failure-change',
  
  // ==========================================================================
  // 🎨 CUSTOM CONFIGURATION
  // ==========================================================================
  
  // Custom test sequencer
  testSequencer: '<rootDir>/test-guides/utils/testSequencer.js',
  
  // Custom resolver
  resolver: '<rootDir>/test-guides/utils/customResolver.js'
};

// =============================================================================
// 🔧 ENVIRONMENT-SPECIFIC OVERRIDES
// =============================================================================

// CI/CD environment overrides
if (process.env.CI) {
  module.exports = {
    ...module.exports,
    
    // CI-specific settings
    maxWorkers: 2,
    ci: true,
    
    // Disable watch mode
    watchman: false,
    
    // Stricter timeouts
    testTimeout: 30000,
    
    // More detailed reporting
    verbose: true,
    
    // Coverage enforcement
    coverageThreshold: {
      global: {
        branches: 95,
        functions: 95,
        lines: 95,
        statements: 95
      }
    }
  };
}

// Development environment overrides
if (process.env.NODE_ENV === 'development') {
  module.exports = {
    ...module.exports,
    
    // Development-specific settings
    watchAll: true,
    collectCoverage: false,
    verbose: false,
    
    // Faster feedback
    maxWorkers: '75%',
    testTimeout: 5000
  };
} 