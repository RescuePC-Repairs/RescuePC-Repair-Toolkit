/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  // Use standalone output for dynamic serverless deployment
  output: 'standalone',
  // Remove all static export/output/export-related config
  // trailingSlash, generateStaticParams, etc. are not needed for dynamic app
  swcMinify: true,
  async rewrites() {
    return [];
  },
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Disable static optimization for error pages
  generateStaticParams: async () => {
    return [];
  },
  // Force all pages to be dynamic
  experimental: {
    missingSuspenseWithCSRError: false
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
