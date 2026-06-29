const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.vastgoeddirectnederland.nl").replace(/\/$/, "");

const pages = [
  // Hoofdpagina
  { path: "/", priority: 1.0, changeFrequency: "weekly" },

  // Belangrijkste commerciële landingspagina's
  { path: "/huis-direct-verkopen", priority: 0.95, changeFrequency: "monthly" },
  { path: "/huis-snel-verkopen", priority: 0.95, changeFrequency: "monthly" },
  { path: "/woning-verkopen-zonder-makelaar", priority: 0.9, changeFrequency: "monthly" },
  { path: "/opknapwoning-verkopen", priority: 0.9, changeFrequency: "monthly" },
  { path: "/leegstaand-huis-verkopen", priority: 0.9, changeFrequency: "monthly" },
  { path: "/huis-verkopen-aan-opkoper", priority: 0.9, changeFrequency: "monthly" },

  // Situatie- en doelgroep pagina's
  { path: "/huis-verkopen-binnen-24-uur", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-binnen-1-week", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-met-spoed", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-zonder-bezichtigingen", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-zonder-funda", priority: 0.85, changeFrequency: "monthly" },
  { path: "/woning-verkopen-zonder-open-huis", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-bij-scheiding", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-bij-erfenis", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-na-overlijden", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-bij-dubbele-lasten", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-met-achterstallig-onderhoud", priority: 0.85, changeFrequency: "monthly" },
  { path: "/woning-verkopen-met-schade", priority: 0.85, changeFrequency: "monthly" },
  { path: "/verhuurde-woning-verkopen", priority: 0.85, changeFrequency: "monthly" },

  // Kennisbank / ondersteunende SEO-pagina's
  { path: "/huis-verkopen-zonder-leeghalen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/huis-verkopen-zonder-opknappen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/huis-verkopen-zonder-verkoopklaar-maken", priority: 0.8, changeFrequency: "monthly" },
  { path: "/woning-verkopen-die-nog-vol-staat", priority: 0.8, changeFrequency: "monthly" },
  { path: "/geerfde-woning-verkopen-zonder-leeghalen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/opknapwoning-verkopen-zonder-makelaar", priority: 0.8, changeFrequency: "monthly" },
  { path: "/leegstaand-huis-verkopen-wat-zijn-de-opties", priority: 0.8, changeFrequency: "monthly" },
  { path: "/huis-verkopen-zonder-bezichtigingen-uitleg", priority: 0.8, changeFrequency: "monthly" },

  // Regiopagina's
  { path: "/huis-verkopen-groningen", priority: 0.75, changeFrequency: "monthly" },
  { path: "/woning-verkopen-friesland", priority: 0.75, changeFrequency: "monthly" },
  { path: "/woning-verkopen-drenthe", priority: 0.75, changeFrequency: "monthly" },
  { path: "/woning-verkopen-overijssel", priority: 0.75, changeFrequency: "monthly" },
  { path: "/huis-verkopen-assen", priority: 0.7, changeFrequency: "monthly" },
  { path: "/huis-verkopen-borger", priority: 0.7, changeFrequency: "monthly" },
  { path: "/huis-verkopen-emmen", priority: 0.7, changeFrequency: "monthly" },
  { path: "/huis-verkopen-gieten", priority: 0.7, changeFrequency: "monthly" },
  { path: "/huis-verkopen-stadskanaal", priority: 0.7, changeFrequency: "monthly" },
  { path: "/huis-verkopen-veendam", priority: 0.7, changeFrequency: "monthly" },
  { path: "/huis-verkopen-winschoten", priority: 0.7, changeFrequency: "monthly" },

  // Juridisch
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
