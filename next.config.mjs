/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports
  output: 'standalone',
  
  // Enable strict mode in development
  reactStrictMode: true,
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Configure image domains if you're using next/image
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google OAuth profile pictures
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Enable experimental features if needed
  experimental: {
    // Enable server actions
    serverActions: true,
  },
};

export default nextConfig; 