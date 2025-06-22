// =============================================================================
// JEST SETUP - FULL POWER CONFIGURATION
// =============================================================================

/**
 * 🔧 JEST SETUP FILE
 * 
 * Global setup for all Jest tests following CLAUDE.md standards
 * Runs once before all test suites
 */

// =============================================================================
// 🌐 GLOBAL POLYFILLS & SHIMS
// =============================================================================

// Polyfill for TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill for fetch
import fetch, { Headers, Request, Response } from 'node-fetch';
global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

// Polyfill for URL
import { URL, URLSearchParams } from 'url';
global.URL = URL;
global.URLSearchParams = URLSearchParams;

// =============================================================================
// 🎭 JSDOM ENHANCEMENTS
// =============================================================================

// Enhanced window object
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn()
  },
  writable: true
});

// Enhanced navigator object
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    platform: 'Win32',
    language: 'en-US',
    languages: ['en-US', 'en'],
    onLine: true,
    cookieEnabled: true,
    doNotTrack: null,
    geolocation: {
      getCurrentPosition: jest.fn(),
      watchPosition: jest.fn(),
      clearWatch: jest.fn()
    },
    permissions: {
      query: jest.fn().mockResolvedValue({ state: 'granted' })
    },
    serviceWorker: {
      register: jest.fn().mockResolvedValue({}),
      ready: Promise.resolve({})
    }
  },
  writable: true
});

// Screen object
Object.defineProperty(window, 'screen', {
  value: {
    width: 1920,
    height: 1080,
    availWidth: 1920,
    availHeight: 1040,
    colorDepth: 24,
    pixelDepth: 24,
    orientation: {
      angle: 0,
      type: 'landscape-primary'
    }
  },
  writable: true
});

// =============================================================================
// 🎨 WEB APIs MOCKS
// =============================================================================

// ResizeObserver mock
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// IntersectionObserver mock
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: []
}));

// MutationObserver mock
global.MutationObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn().mockReturnValue([])
}));

// PerformanceObserver mock
global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn().mockReturnValue([]),
  supportedEntryTypes: ['navigation', 'resource', 'measure', 'mark']
}));

// Performance API mock
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn().mockReturnValue([]),
    getEntriesByType: jest.fn().mockReturnValue([]),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn(),
    navigation: {
      type: 'navigate',
      redirectCount: 0
    },
    timing: {
      navigationStart: Date.now() - 1000,
      loadEventEnd: Date.now()
    },
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000
    }
  },
  writable: true
});

// =============================================================================
// 🎵 MEDIA & GRAPHICS MOCKS
// =============================================================================

// Canvas mock
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => ({ data: new Array(4) })),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn()
}));

// Audio mock
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  load: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  currentTime: 0,
  duration: 0,
  paused: true,
  volume: 1,
  muted: false
}));

// Video mock
HTMLVideoElement.prototype.play = jest.fn().mockResolvedValue(undefined);
HTMLVideoElement.prototype.pause = jest.fn();
HTMLVideoElement.prototype.load = jest.fn();

// =============================================================================
// 🔧 DOM ENHANCEMENTS
// =============================================================================

// Element.scrollIntoView mock
Element.prototype.scrollIntoView = jest.fn();

// Element.animate mock
Element.prototype.animate = jest.fn(() => ({
  finished: Promise.resolve(),
  cancel: jest.fn(),
  pause: jest.fn(),
  play: jest.fn(),
  reverse: jest.fn(),
  finish: jest.fn()
}));

// getBoundingClientRect mock
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: 0,
  height: 0,
  x: 0,
  y: 0
}));

// getComputedStyle mock
window.getComputedStyle = jest.fn(() => ({
  getPropertyValue: jest.fn(() => ''),
  setProperty: jest.fn(),
  removeProperty: jest.fn()
}));

// =============================================================================
// 🔐 STORAGE MOCKS
// =============================================================================

// LocalStorage mock
const localStorageMock = {
  getItem: jest.fn((key) => localStorageMock.store[key] || null),
  setItem: jest.fn((key, value) => {
    localStorageMock.store[key] = String(value);
  }),
  removeItem: jest.fn((key) => {
    delete localStorageMock.store[key];
  }),
  clear: jest.fn(() => {
    localStorageMock.store = {};
  }),
  store: {},
  get length() {
    return Object.keys(this.store).length;
  },
  key: jest.fn((index) => Object.keys(localStorageMock.store)[index] || null)
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// SessionStorage mock
const sessionStorageMock = {
  getItem: jest.fn((key) => sessionStorageMock.store[key] || null),
  setItem: jest.fn((key, value) => {
    sessionStorageMock.store[key] = String(value);
  }),
  removeItem: jest.fn((key) => {
    delete sessionStorageMock.store[key];
  }),
  clear: jest.fn(() => {
    sessionStorageMock.store = {};
  }),
  store: {},
  get length() {
    return Object.keys(this.store).length;
  },
  key: jest.fn((index) => Object.keys(sessionStorageMock.store)[index] || null)
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
});

// =============================================================================
// 🌐 NETWORK MOCKS
// =============================================================================

// XMLHttpRequest mock
global.XMLHttpRequest = jest.fn(() => ({
  open: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  abort: jest.fn(),
  readyState: 4,
  status: 200,
  statusText: 'OK',
  response: '',
  responseText: '',
  responseXML: null
}));

// WebSocket mock
global.WebSocket = jest.fn().mockImplementation(() => ({
  send: jest.fn(),
  close: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  readyState: 1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
}));

// =============================================================================
// 🎯 CUSTOM MATCHERS
// =============================================================================

// Custom Jest matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false
      };
    }
  },

  toHaveValidCSS(received) {
    const hasValidCSS = received && typeof received.style === 'object';
    if (hasValidCSS) {
      return {
        message: () => `expected element not to have valid CSS`,
        pass: true
      };
    } else {
      return {
        message: () => `expected element to have valid CSS`,
        pass: false
      };
    }
  },

  toBeAccessible(received) {
    // Basic accessibility checks
    const hasAriaLabel = received.getAttribute('aria-label');
    const hasRole = received.getAttribute('role');
    const hasTabIndex = received.hasAttribute('tabindex');
    
    const isAccessible = hasAriaLabel || hasRole || hasTabIndex;
    
    if (isAccessible) {
      return {
        message: () => `expected element not to be accessible`,
        pass: true
      };
    } else {
      return {
        message: () => `expected element to be accessible (missing aria-label, role, or tabindex)`,
        pass: false
      };
    }
  }
});

// =============================================================================
// 🔧 GLOBAL TEST UTILITIES
// =============================================================================

// Global test utilities
global.testUtils = {
  // Create mock element
  createMockElement: (tag = 'div', attributes = {}) => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  },

  // Wait for async operations
  waitForAsync: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),

  // Mock API responses
  mockApiResponse: (data, options = {}) => ({
    ok: options.ok !== false,
    status: options.status || 200,
    statusText: options.statusText || 'OK',
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    headers: new Headers(options.headers || {})
  }),

  // Performance testing helper
  measurePerformance: async (fn) => {
    const start = performance.now();
    await fn();
    const end = performance.now();
    return end - start;
  },

  // Memory usage helper
  getMemoryUsage: () => {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }
};

// =============================================================================
// 🎨 CONSOLE ENHANCEMENTS
// =============================================================================

// Console spy setup
const originalConsole = { ...console };

// Track console calls for testing
global.consoleSpy = {
  log: jest.spyOn(console, 'log').mockImplementation(() => {}),
  warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
  error: jest.spyOn(console, 'error').mockImplementation(() => {}),
  info: jest.spyOn(console, 'info').mockImplementation(() => {}),
  debug: jest.spyOn(console, 'debug').mockImplementation(() => {}),
  
  // Restore original console
  restore: () => {
    Object.assign(console, originalConsole);
  },
  
  // Clear all mocks
  clear: () => {
    global.consoleSpy.log.mockClear();
    global.consoleSpy.warn.mockClear();
    global.consoleSpy.error.mockClear();
    global.consoleSpy.info.mockClear();
    global.consoleSpy.debug.mockClear();
  }
};

// =============================================================================
// 🚀 INITIALIZATION
// =============================================================================

// Global setup complete
console.log('🚀 Jest Full Power Setup Complete!');
console.log('✅ All mocks and utilities loaded');
console.log('⚡ Ready for maximum testing power!');

// Export setup utilities
export {
  localStorageMock,
  sessionStorageMock,
  global.testUtils as testUtils,
  global.consoleSpy as consoleSpy
}; 