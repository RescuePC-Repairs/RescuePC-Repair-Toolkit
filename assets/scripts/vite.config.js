/**
 * @fileoverview RescuePC Repairs - World-Class Vite Configuration
 * Ultra-optimized build system with HTTPS enforcement
 * Built for millions of users with cutting-edge performance
 * 
 * @author Tyler - RescuePC Repairs
 * @version 1.0.0
 */

import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDev = command === 'serve';
  const isProd = command === 'build';
  
  return {
    // Server configuration with HTTPS enforcement
    server: {
      port: 3000,
      host: true,
      strictPort: true,
      https: isProd ? true : false, // Force HTTPS in production
      headers: {
        // Security headers
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        // HTTPS enforcement
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
      }
    },
    
    // Base configuration
    base: '/',
    publicDir: 'public',
    
    // Path resolution
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@styles': resolve(__dirname, 'src/styles'),
        '@modules': resolve(__dirname, 'src/modules'),
        '@core': resolve(__dirname, 'src/core'),
        '@assets': resolve(__dirname, 'assets')
      }
    },
    
    // CSS configuration
    css: {
      devSourcemap: isDev,
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@styles/design-tokens/variables.css";
          `
        }
      }
    },
    
    // Build configuration
    build: {
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isDev ? 'inline' : false,
      minify: isProd ? 'terser' : false,
      
      // Performance optimizations
      chunkSizeWarningLimit: 500,
      assetsInlineLimit: 4096,
      
      // Rollup options
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          support: resolve(__dirname, 'support.html'),
          privacy: resolve(__dirname, 'PrivacyPolicy.html'),
          terms: resolve(__dirname, 'TermOfService.html'),
          refund: resolve(__dirname, 'RefundPolicy.html'),
          license: resolve(__dirname, 'License.html'),
          knowledgeBase: resolve(__dirname, 'Knowledge-Base.html'),
          cookiePolicy: resolve(__dirname, 'CookiePolicy.html'),
          gdpr: resolve(__dirname, 'GDPR.html')
        },
        
        output: {
          // Advanced code splitting
          manualChunks: {
            // Vendor chunks
            'vendor-core': ['core-js'],
            'vendor-web': ['intersection-observer', 'web-vitals'],
            
            // Application chunks
            'app-core': [
              'src/core/Application.js'
            ],
            'app-modules': [
              'src/modules/ComponentLoader.js',
              'src/modules/PerformanceMonitor.js',
              'src/modules/AccessibilityManager.js',
              'src/modules/SecurityManager.js'
            ],
            'app-main': [
              'src/main.js'
            ]
          },
          
          // Asset naming for optimal caching
          chunkFileNames: isProd ? 'js/[name]-[hash].js' : 'js/[name].js',
          entryFileNames: isProd ? 'js/[name]-[hash].js' : 'js/[name].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const extType = info[info.length - 1];
            
            // Organize assets by type
            if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(extType)) {
              return `images/[name]-[hash][extname]`;
            }
            if (/css/i.test(extType)) {
              return `css/[name]-[hash][extname]`;
            }
            if (/woff2?|eot|ttf|otf/i.test(extType)) {
              return `fonts/[name]-[hash][extname]`;
            }
            if (/mp4|webm|ogg|mp3|wav|flac|aac/i.test(extType)) {
              return `media/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          }
        }
      },
      
      // Terser options for production
      terserOptions: isProd ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.debug', 'console.info']
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: false
        }
      } : {},
      
      // Report compressed size
      reportCompressedSize: true,
      
      // CSS code splitting
      cssCodeSplit: true,
      
      // Generate manifest for PWA
      manifest: true
    },
    
    // Plugins
    plugins: [
      // PWA Plugin
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'cdnjs-cache',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-stylesheets'
              }
            }
          ]
        },
        manifest: {
          name: 'RescuePC Repairs - Professional Windows Repair Toolkit',
          short_name: 'RescuePC',
          description: 'Professional Windows repair toolkit with military-grade security',
          theme_color: '#2563eb',
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'assets/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'assets/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      }),
      
      // Bundle analyzer (only in production)
      isProd && visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true
      })
    ].filter(Boolean),
    
    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
      __DEV__: isDev,
      __PROD__: isProd
    },
    
    // Dependency optimization
    optimizeDeps: {
      include: [
        'intersection-observer',
        'web-vitals'
      ],
      exclude: []
    },
    
    // Preview configuration (for production preview)
    preview: {
      port: 4173,
      host: true,
      strictPort: true,
      https: true, // Force HTTPS for preview
      headers: {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block'
      }
    },
    
    // Environment variables
    envPrefix: 'VITE_',
    
    // Worker configuration
    worker: {
      format: 'es'
    }
  };
}); 