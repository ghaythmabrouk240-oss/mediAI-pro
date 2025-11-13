/** @type {import('next').NextConfig} */
const nextConfig = {
  // No output: 'export' since we have API routes
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
