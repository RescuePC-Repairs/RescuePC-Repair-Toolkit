/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'rescuepcrepairs.com']
    },
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  // Completely disable static generation
  trailingSlash: false,
  async rewrites() {
    return [];
  },
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
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
  compress: true,
  poweredByHeader: false,
  // Force dynamic rendering for all pages
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'x-force-dynamic',
            value: 'true'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
