/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
    deviceSizes: [640, 1080, 1920],
    imageSizes: [128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 2678400,
  },
};
export default nextConfig;