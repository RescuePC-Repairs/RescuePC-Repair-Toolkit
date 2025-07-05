/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },

  // Disable static generation completely
  output: 'export',
  trailingSlash: true,
  
  // Force dynamic rendering for error pages
  async rewrites() {
    return [];
  },
  // Disable static optimization for error pages
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Basic configuration
  swcMinify: true,

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
