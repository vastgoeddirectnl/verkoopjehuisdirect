export default function robots() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.vastgoeddirectnederland.nl").replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
