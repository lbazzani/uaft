import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Configurazione per Docker deployment
  output: 'standalone',
  // Ignora errori TypeScript durante il build (temporaneo)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignora errori ESLint durante il build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
