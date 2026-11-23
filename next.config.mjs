/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Host canonico: www. Redirect permanente dall'apex (se non gia' gestito da Vercel).
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "giustiziainvolo.it" }],
        destination: "https://www.giustiziainvolo.it/:path*",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
