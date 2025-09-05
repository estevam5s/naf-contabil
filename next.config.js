/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  },
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
};

module.exports = nextConfig;

module.exports = nextConfig;
