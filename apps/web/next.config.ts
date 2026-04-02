import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@realworkstudio/ui', '@realworkstudio/config', '@realworkstudio/utils'],
};

export default nextConfig;
