/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration
  swcMinify: true,

  // Disable static generation for error pages
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },

  // Basic webpack config
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }
    return config;
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false
};

module.exports = nextConfig;
