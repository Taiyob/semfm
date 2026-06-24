import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'semfm-images-bucket.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '',
      },
    ],
  },

  async rewrites() {
    // Determine the backend URL based on the environment
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.hofmanhorizon.com/api';
    // const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;


