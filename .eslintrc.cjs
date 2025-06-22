// =============================================================================
// ESLINT CONFIGURATION - FULL POWER (WORKING)
// =============================================================================

/**
 * 🔍 ESLINT FULL POWER CONFIGURATION
 * 
 * Enterprise-grade ESLint configuration following CLAUDE.md standards
 * Maximum code quality, security, and maintainability
 */

module.exports = {
  // ==========================================================================
  // 🎯 CORE CONFIGURATION
  // ==========================================================================
  
  root: true,
  
  // Parser configuration
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module'
  },
  
  // Environment settings
  env: {
    browser: true,
    es2023: true,
    node: true,
    jest: true
  },
  
  // ==========================================================================
  // 📋 EXTENDS
  // ==========================================================================
  
  extends: [
    'eslint:recommended'
  ],
  
  // ==========================================================================
  // 🚨 RULES - MAXIMUM ENFORCEMENT
  // ==========================================================================
  
  rules: {
    // =======================================================================
    // 🎯 CORE RULES
    // =======================================================================
    
    // Error prevention
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    
    // Code quality
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true 
    }],
    'no-undef': 'error',
    'no-redeclare': 'error',
    'no-shadow': 'error',
    
    // Best practices
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    
    // =======================================================================
    // 🎨 FORMATTING RULES
    // =======================================================================
    
    'comma-dangle': ['error', 'never'],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'max-len': ['error', { 
      code: 120, 
      ignoreUrls: true, 
      ignoreStrings: true, 
      ignoreTemplateLiterals: true 
    }]
  },
  
  // ==========================================================================
  // 📁 FILE-SPECIFIC OVERRIDES
  // ==========================================================================
  
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js', '**/test-guides/**/*.js'],
      env: {
        jest: true
      },
      rules: {
        'no-console': 'off'
      }
    }
  ],
  
  // ==========================================================================
  // 🚫 IGNORE PATTERNS
  // ==========================================================================
  
  ignorePatterns: [
    'dist/',
    'build/',
    'coverage/',
    'node_modules/',
    '*.min.js',
    'backups/',
    '.git/'
  ]
}; 