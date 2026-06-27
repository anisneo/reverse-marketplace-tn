/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["bcryptjs"],
  },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
