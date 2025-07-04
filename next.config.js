/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minifier for faster builds
  swcMinify: true,

  // Optimize for production
  experimental: {
    forceSwcTransforms: true,
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@stripe/stripe-js']
  },

  // Optimize build performance
  staticPageGenerationTimeout: 60,

  // Configure webpack for faster builds
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }

    // Exclude test files from build
    config.module.rules.push({
      test: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
      use: 'ignore-loader'
    });

    // Exclude test directories
    config.externals = config.externals || [];
    config.externals.push({
      'test/**': 'commonjs test/**'
    });

    // Optimize bundle size
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all'
            }
          }
        }
      };
    }

    return config;
  },

  // Optimize for production
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },

  // Reduce build time
  compress: true,
  poweredByHeader: false
};

module.exports = nextConfig;
