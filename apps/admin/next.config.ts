import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@realworkstudio/config', '@realworkstudio/utils'],
};

export default nextConfig;
