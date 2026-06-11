/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        // Static brand/UI images are immutable once deployed — let browsers
        // and the CDN keep them for a year instead of revalidating per page.
        source: "/:path*.(png|jpg|jpeg|webp|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: "/news/spectrum",
        destination: "/news",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
