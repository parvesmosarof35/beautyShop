/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'], // Add any image domains you need
  },
  experimental: {
    // Enable the new app directory
    appDir: true,
  },
}

module.exports = nextConfig
