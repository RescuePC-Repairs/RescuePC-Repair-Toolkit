import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  base: '/',
  build: {
    outDir: 'build',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
    open: true,
    cors: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@assets': resolve(__dirname, './assets'),
      '@styles': resolve(__dirname, './assets/styles'),
      '@scripts': resolve(__dirname, './assets/scripts')
    }
  },
  css: {
    devSourcemap: true
  },
  optimizeDeps: {
    exclude: []
  }
}) 