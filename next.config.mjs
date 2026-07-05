/**
 * Domeinmigratie Vastgoed Direct Nederland
 * Oude domeinen worden permanent doorgestuurd naar het nieuwe hoofddomein.
 */
const nextConfig = {
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
