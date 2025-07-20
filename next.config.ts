import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
  images: {
    domains: ['placehold.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ac.goit.global',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
