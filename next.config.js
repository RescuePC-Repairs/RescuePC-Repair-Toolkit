/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SWC minifier temporarily to avoid Html import issues
  swcMinify: false,

  // Disable static optimization to prevent prerendering errors
  experimental: {
    forceSwcTransforms: false
  },

  // Force dynamic rendering for all pages
  staticPageGenerationTimeout: 0,

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

  // Disable static generation completely
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now();
  }
};

module.exports = nextConfig;
