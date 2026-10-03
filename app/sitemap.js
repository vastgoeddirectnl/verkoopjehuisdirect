import { SITE_PAGES } from "./lib/sitePages.js";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.vastgoeddirectnederland.nl").replace(/\/$/, "");

// De lijst zelf staat in app/lib/sitePages.js (SEO-02).
export default function sitemap() {
  const lastModified = new Date();

  return SITE_PAGES.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
