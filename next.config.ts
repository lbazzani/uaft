import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Configurazione per Docker deployment
  output: 'standalone',
};

export default nextConfig;
