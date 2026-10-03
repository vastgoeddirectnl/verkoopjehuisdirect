import { MarketingHeader, MarketingFooter } from "../components/MarketingChrome";
import { KENNISBANK_ARTICLES } from "../lib/sitePages.js";

export const metadata = {
  title: "Kennisbank woningverkoop",
  description: "Uitleg over directe verkoop, kosten, netto-opbrengst en verkopen na een erfenis. Eerlijke antwoorden, zonder verkooppraatje.",
  alternates: { canonical: "/kennisbank" },
  openGraph: {
    title: "Kennisbank woningverkoop | Vastgoed Direct Nederland",
    description: "Uitleg over directe verkoop, kosten, netto-opbrengst en verkopen na een erfenis.",
    url: "https://www.vastgoeddirectnederland.nl/kennisbank",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

export default function KennisbankPage() {
  return (
    <main className="overview-page">
      <MarketingHeader requestHref="/#aanvraag" />
      <section className="overview-hero" id="hoofdinhoud">
        <div className="overview-container">
          <p className="eyebrow">Kennisbank</p>
          <h1>Eerlijke uitleg over uw woning verkopen</h1>
          <p>
            Wat kost directe verkoop eigenlijk, wat houdt u netto over, en welke stappen horen bij een erfhuis?
            Hier vindt u de antwoorden, ook als die niet in ons voordeel uitvallen.
          </p>
        </div>
      </section>
      <section className="overview-list-section">
        <div className="overview-container overview-page-grid">
          {KENNISBANK_ARTICLES.map((article) => (
            <a href={article.path} className="overview-page-card" key={article.path}>
              <strong>{article.title}</strong>
              <p>{article.summary}</p>
              <span>Lees het artikel →</span>
            </a>
          ))}
        </div>
      </section>
      <MarketingFooter requestHref="/#aanvraag" />
    </main>
  );
}
