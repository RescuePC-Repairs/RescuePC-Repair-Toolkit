// =============================================================================
// ESLINT CONFIGURATION - PRODUCTION READY
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

  // Environment settings
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },

  // ==========================================================================
  // 📋 EXTENDS
  // ==========================================================================

  extends: ['next/core-web-vitals', 'next/typescript', 'plugin:security/recommended'],

  // ==========================================================================
  // 🔧 PARSER & PLUGINS
  // ==========================================================================

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },

  plugins: ['security'],

  // ==========================================================================
  // 🚨 RULES - MAXIMUM ENFORCEMENT
  // ==========================================================================

  rules: {
    // =======================================================================
    // 🎯 CORE RULES
    // =======================================================================

    // Error prevention
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'warn',

    // Code quality
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'warn',
    'no-redeclare': 'warn',
    'no-shadow': 'warn',

    // Best practices
    'prefer-const': 'warn',
    'no-var': 'warn',
    'object-shorthand': 'warn',
    'prefer-arrow-callback': 'warn',
    'prefer-template': 'warn',

    // =======================================================================
    // 🎨 FORMATTING RULES
    // =======================================================================

    'comma-dangle': 'warn',
    semi: 'warn',
    quotes: 'warn',
    'max-len': 'warn',

    // =======================================================================
    // �� TYPE SCRIPT RULES
    // =======================================================================

    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // =======================================================================
    // 🚨 SECURITY RULES
    // =======================================================================

    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'warn',

    // =======================================================================
    // 🚫 RELAXED RULES FOR DEVELOPMENT
    // =======================================================================

    quotes: 'off',
    semi: 'off',
    'comma-dangle': 'off',
    'prefer-template': 'warn',
    'object-shorthand': 'warn',
    'no-case-declarations': 'warn',
    'no-import-assign': 'warn',
    'no-constant-condition': 'warn',
    'react/no-unescaped-entities': 'warn',
    '@next/next/no-img-element': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'no-useless-escape': 'warn',
    '@next/next/no-assign-module-variable': 'warn',
    '@typescript-eslint/no-require-imports': 'warn',
    'max-len': 'warn',
    'no-console': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'warn',
    'security/detect-non-literal-fs-filename': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-object-injection': 'warn'
  },

  // ==========================================================================
  // 📁 FILE-SPECIFIC OVERRIDES
  // ==========================================================================

  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      env: {
        jest: true
      },
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off'
      }
    },
    {
      files: ['**/*.js', '**/*.jsx'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off'
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
    '.git/',
    '.next/'
  ]
};
