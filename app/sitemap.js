const baseUrl = "https://www.verkoopjehuisdirect.nl";

const routes = [
  ["/", 1],
  ["/huis-direct-verkopen", 0.86],
  ["/huis-snel-verkopen", 0.9],
  ["/woning-verkopen-zonder-makelaar", 0.85],
  ["/huis-verkopen-binnen-24-uur", 0.85],
  ["/huis-verkopen-binnen-1-week", 0.84],
  ["/huis-verkopen-zonder-bezichtigingen", 0.82],
  ["/huis-verkopen-bij-scheiding", 0.82],
  ["/huis-verkopen-aan-opkoper", 0.82],
  ["/huis-verkopen-bij-erfenis", 0.82],
  ["/opknapwoning-verkopen", 0.82],
  ["/leegstaand-huis-verkopen", 0.82],
  ["/huis-verkopen-met-achterstallig-onderhoud", 0.82],
  ["/verhuurde-woning-verkopen", 0.82],
  ["/huis-verkopen-groningen", 0.82],
  ["/woning-verkopen-friesland", 0.78],
  ["/woning-verkopen-drenthe", 0.78],
  ["/woning-verkopen-overijssel", 0.78],
  ["/privacyverklaring", 0.3],
];

export default function sitemap() {
  return routes.map(([path, priority]) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
  }));
}
