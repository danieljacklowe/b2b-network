/** @type {import('next').NextConfig} */
const nextConfig = {
  // In Next.js 14, this setting lives inside 'experimental'
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
};

export default nextConfig;