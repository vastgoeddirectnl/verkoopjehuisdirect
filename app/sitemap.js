const baseUrl = "https://www.verkoopjehuisdirect.nl";

const pages = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/huis-direct-verkopen", priority: 0.9, changeFrequency: "monthly" },
  { path: "/huis-snel-verkopen", priority: 0.9, changeFrequency: "monthly" },
  { path: "/woning-verkopen-zonder-makelaar", priority: 0.9, changeFrequency: "monthly" },
  { path: "/huis-verkopen-binnen-24-uur", priority: 0.8, changeFrequency: "monthly" },
  { path: "/huis-verkopen-binnen-1-week", priority: 0.8, changeFrequency: "monthly" },
  { path: "/huis-verkopen-zonder-bezichtigingen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/huis-verkopen-bij-scheiding", priority: 0.8, changeFrequency: "monthly" },
  { path: "/huis-verkopen-aan-opkoper", priority: 0.8, changeFrequency: "monthly" },
  { path: "/huis-verkopen-bij-erfenis", priority: 0.8, changeFrequency: "monthly" },
  { path: "/opknapwoning-verkopen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/leegstaand-huis-verkopen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/huis-verkopen-met-achterstallig-onderhoud", priority: 0.8, changeFrequency: "monthly" },
  { path: "/verhuurde-woning-verkopen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/huis-verkopen-groningen", priority: 0.75, changeFrequency: "monthly" },
  { path: "/woning-verkopen-friesland", priority: 0.75, changeFrequency: "monthly" },
  { path: "/woning-verkopen-drenthe", priority: 0.75, changeFrequency: "monthly" },
  { path: "/woning-verkopen-overijssel", priority: 0.75, changeFrequency: "monthly" },
  { path: "/privacyverklaring", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap() {
  const lastModified = new Date();

  return pages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
