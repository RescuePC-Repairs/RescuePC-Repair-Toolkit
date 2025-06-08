/**
 * Font Awesome Configuration
 * Centralized configuration for Font Awesome settings and optimizations
 */
const FontAwesomeConfig = {
  // Version and CDN settings
  version: '6.5.1',
  cdn: {
    primary: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome',
    fallback: 'https://use.fontawesome.com/releases/v6.5.1/css/all.css',
    integrity: 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==',
    fallbackIntegrity: 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=='
  },

  // Local paths
  local: {
    css: '/assets/css/fontawesome/fontawesome.css',
    fonts: '/assets/css/fontawesome/webfonts'
  },

  // Performance settings
  performance: {
    preload: true,
    preconnect: true,
    fetchPriority: 'high',
    checkDelay: 100,
    maxAttempts: 3,
    retryDelay: 1000
  },

  // Critical icons to preload
  criticalIcons: [
    'fa-solid',
    'fa-brands',
    'fa-regular'
  ],

  // Icon subsets to load
  subsets: {
    solid: true,
    brands: true,
    regular: true,
    light: false,
    thin: false,
    duotone: false
  },

  // Cache settings
  cache: {
    enabled: true,
    version: '1.0',
    maxAge: 31536000 // 1 year in seconds
  },

  // Debug settings
  debug: {
    enabled: false,
    logLevel: 'error' // 'error', 'warn', 'info', 'debug'
  }
};

// Export configuration
export default FontAwesomeConfig; 