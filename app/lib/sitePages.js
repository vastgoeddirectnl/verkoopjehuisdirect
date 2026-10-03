// Centrale lijst van publieke pagina's (SEO-02).
//
// Voorheen stond de lijst los in app/sitemap.js en moest een nieuwe of
// verwijderde pagina op drie plekken worden bijgewerkt (pagina, sitemap,
// interne links). Nu lezen sitemap.js, next.config.mjs (redirects) en de
// interne links van de landingspagina's allemaal hieruit, en
// test/sitePages.test.js controleert dat deze lijst en de mappen in app/ met
// elkaar kloppen.

/**
 * Pagina's die zijn samengevoegd met een pagina met dezelfde zoekintentie.
 * Ze leverden geen aanvragen op en concurreerden in Google met de
 * doelpagina (keyword-kannibalisatie). Een 301 bewaart eventuele links en
 * opgebouwde waarde. Pagina's die wél aanvragen opleverden of een duidelijk
 * eigen zoekvraag hebben (binnen 24 uur, binnen 1 week, na overlijden, in
 * huidige staat) zijn bewust gebleven; samenvoegen daarvan pas na een blik in
 * Search Console.
 */
export const MERGED_PAGES = {
  "/huis-verkopen-zonder-verkoopklaar-maken": "/huis-verkopen-zonder-opknappen",
  "/opknapwoning-verkopen-zonder-makelaar": "/opknapwoning-verkopen",
  "/leegstaand-huis-verkopen-wat-zijn-de-opties": "/leegstaand-huis-verkopen",
  "/woning-verkopen-die-nog-vol-staat": "/huis-verkopen-zonder-leeghalen",
  "/geerfde-woning-verkopen-zonder-leeghalen": "/huis-verkopen-bij-erfenis",
  "/huis-verkopen-met-spoed": "/huis-snel-verkopen",
  "/woning-verkopen-zonder-open-huis": "/huis-verkopen-zonder-bezichtigingen",
};

/** Een interne link naar een samengevoegde pagina wijst naar de doelpagina. */
export function canonicalPath(path) {
  return MERGED_PAGES[path] || path;
}

export const KENNISBANK_ARTICLES = [
  {
    path: "/kennisbank/wat-kost-een-woningopkoper",
    title: "Wat kost een woningopkoper?",
    summary: "Waar het verschil tussen een directe verkoop en een makelaar echt zit, en hoe u een bod eerlijk vergelijkt.",
  },
  {
    path: "/kennisbank/stappenplan-erfhuis-verkopen",
    title: "Stappenplan bij een erfhuis",
    summary: "Van verklaring van erfrecht tot notaris: welke stappen erfgenamen doorlopen en wat u zelf moet regelen.",
  },
  {
    path: "/kennisbank/netto-opbrengst-berekenen",
    title: "Netto-opbrengst berekenen bij verkoop",
    summary: "Een rekenvoorbeeld: wat houdt u over bij verkoop via een makelaar en bij directe verkoop?",
  },
];

export const SITE_PAGES = [
  // Hoofdpagina's
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/situaties", priority: 0.82, changeFrequency: "monthly" },
  { path: "/regios", priority: 0.78, changeFrequency: "monthly" },

  // Belangrijkste commerciële landingspagina's
  { path: "/huis-direct-verkopen", priority: 0.95, changeFrequency: "monthly" },
  { path: "/huis-snel-verkopen", priority: 0.95, changeFrequency: "monthly" },
  { path: "/woning-verkopen-zonder-makelaar", priority: 0.9, changeFrequency: "monthly" },
  { path: "/opknapwoning-verkopen", priority: 0.9, changeFrequency: "monthly" },
  { path: "/leegstaand-huis-verkopen", priority: 0.9, changeFrequency: "monthly" },
  { path: "/huis-verkopen-aan-opkoper", priority: 0.9, changeFrequency: "monthly" },

  // Situatie- en doelgroeppagina's
  { path: "/huis-verkopen-binnen-24-uur", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-binnen-1-week", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-zonder-bezichtigingen", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-zonder-funda", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-bij-scheiding", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-bij-erfenis", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-na-overlijden", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-bij-dubbele-lasten", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-met-achterstallig-onderhoud", priority: 0.85, changeFrequency: "monthly" },
  { path: "/woning-verkopen-met-schade", priority: 0.85, changeFrequency: "monthly" },
  { path: "/verhuurde-woning-verkopen", priority: 0.85, changeFrequency: "monthly" },
  { path: "/huis-verkopen-zonder-leeghalen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/huis-verkopen-zonder-opknappen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/huis-verkopen-in-huidige-staat", priority: 0.85, changeFrequency: "monthly" },

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

  // Kennisbank
  { path: "/kennisbank", priority: 0.7, changeFrequency: "monthly" },
  ...KENNISBANK_ARTICLES.map(({ path }) => ({ path, priority: 0.65, changeFrequency: "yearly" })),

  { path: "/over-ons", priority: 0.6, changeFrequency: "yearly" },

  // Juridisch
  { path: "/privacyverklaring", priority: 0.3, changeFrequency: "yearly" },
];
