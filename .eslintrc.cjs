/** @type {import('eslint').Linter.Config} */
module.exports = {
  // =============================================================================
  // 🎯 CORE CONFIGURATION
  // =============================================================================

  root: true,

  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },

  // ==========================================================================
  // 📋 EXTENDS
  // ==========================================================================

  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'next/core-web-vitals'],

  // ==========================================================================
  // 🔧 PARSER & PLUGINS
  // ==========================================================================

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },

  plugins: ['@typescript-eslint'],

  // ==========================================================================
  // 🚨 RULES - MAXIMUM ENFORCEMENT
  // ==========================================================================

  rules: {
    'no-console': 'off',
    'no-debugger': 'warn',
    'no-alert': 'warn',
    'no-eval': 'error',
    'no-implied-eval': 'warn',
    'no-new-func': 'warn',

    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-redeclare': 'warn',
    'no-shadow': 'warn',

    'prefer-const': 'warn',
    'no-var': 'warn',
    'object-shorthand': 'warn',
    'prefer-arrow-callback': 'warn',
    'prefer-template': 'warn',

    'comma-dangle': 'off',
    semi: 'off',
    quotes: 'off',
    'max-len': 'off',

    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',

    '@next/next/no-img-element': 'off',
    '@next/next/no-html-link-for-pages': 'off',

    'no-case-declarations': 'warn',
    'no-import-assign': 'warn',
    'no-constant-condition': 'warn',
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-useless-escape': 'off',
    '@next/next/no-assign-module-variable': 'off',
    'react/display-name': 'off'
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
