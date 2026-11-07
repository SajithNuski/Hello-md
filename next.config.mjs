/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Avoid blocking production deployments on minor linter warnings
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
