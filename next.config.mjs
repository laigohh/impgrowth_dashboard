/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      unoptimized: true,
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '2mb'
      }
    },
    output: 'standalone',
    excludeRoute: (route) => route.startsWith('/api/')
};

export default nextConfig;