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
    output: 'standalone'
};

export default nextConfig;