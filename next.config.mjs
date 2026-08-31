/**
 * Domeinmigratie Vastgoed Direct Nederland
 * Oude domeinen worden permanent doorgestuurd naar het nieuwe hoofddomein.
 */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/huis-verkopen-zonder-bezichtigingen-uitleg",
        destination: "/huis-verkopen-zonder-bezichtigingen",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "verkoopjehuisdirect.nl" }],
        destination: "https://www.vastgoeddirectnederland.nl/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.verkoopjehuisdirect.nl" }],
        destination: "https://www.vastgoeddirectnederland.nl/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
