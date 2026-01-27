/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [100, 75], // Added to support quality={100}
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: "https",
        hostname: "ecommarce-backend-dsoe.onrender.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  async headers() {
    return [
      // {
      //   source: '/:path*',
      //   headers: [
      //     {
      //       key: 'X-DNS-Prefetch-Control',
      //       value: 'on'
      //     },
      //     {
      //       key: 'Strict-Transport-Security',
      //       value: 'max-age=63072000; includeSubDomains; preload'
      //     },
      //     {
      //       key: 'X-XSS-Protection',
      //       value: '1; mode=block'
      //     },
      //     {
      //       key: 'X-Frame-Options',
      //       value: 'SAMEORIGIN'
      //     },
      //     {
      //       key: 'X-Content-Type-Options',
      //       value: 'nosniff'
      //     },
      //     {
      //       key: 'Referrer-Policy',
      //       value: 'origin-when-cross-origin'
      //     },
      //     {
      //       key: 'Permissions-Policy',
      //       value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
      //     },
      //     {
      //       key: 'Content-Security-Policy',
      //       value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://images.unsplash.com https://res.cloudinary.com https://ecommarce-backend-dsoe.onrender.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://ecommarce-bw0p.onrender.com https://ecommarce-backend-dsoe.onrender.com https://vercel.live https://*.trycloudflare.com; frame-src 'self' https://vercel.live;"
      //     },
      //     {
      //       key: 'Cross-Origin-Opener-Policy',
      //       value: 'same-origin'
      //     },
      //     {
      //       key: 'X-DNS-Prefetch-Control',
      //       value: 'on'
      //     }
      //   ]
      // }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://ecommarce-backend-dsoe.onrender.com/api/v1/:path*',
      },
    ]
  },
}


module.exports = nextConfig
