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
    generateStaticParams: async () => {
        return {
            excludeRoute: (route) => route.startsWith('/api/')
        }
    }
};

export default nextConfig;