/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SWC minifier temporarily to avoid Html import issues
  swcMinify: false,

  // Disable static optimization to prevent prerendering errors
  experimental: {
    forceSwcTransforms: false
  },

  // Force all pages to be dynamic to prevent static generation errors
  experimental: {
    forceSwcTransforms: false,
  },
  
  // Disable static generation completely
  output: 'standalone',

  // Configure webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }

    // Exclude Jest files from build
    config.module.rules.push({
      test: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
      use: 'ignore-loader'
    });

    // Exclude test directories
    config.externals = config.externals || [];
    config.externals.push({
      'test/**': 'commonjs test/**'
    });

    return config;
  },

  // Note: headers() is disabled for static export
  // Headers are handled by deployment platform instead
};

module.exports = nextConfig;
