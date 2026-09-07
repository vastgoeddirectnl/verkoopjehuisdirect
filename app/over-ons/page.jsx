import Link from "next/link";
import { MarketingFooter, MarketingHeader, ProofBar } from "../components/MarketingChrome";

export const metadata = {
  title: "Over Vastgoed Direct Nederland",
  description:
    "Wie er achter Vastgoed Direct Nederland zit, hoe wij werken en voor welke situaties directe verkoop wel en niet passend is.",
  alternates: { canonical: "/over-ons" },
  openGraph: {
    title: "Over Vastgoed Direct Nederland",
    description:
      "Wie er achter Vastgoed Direct Nederland zit, hoe wij werken en voor welke situaties directe verkoop wel en niet passend is.",
    url: "https://www.vastgoeddirectnederland.nl/over-ons",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

// Bewust zonder teamfoto's, namen of stockbeelden die een team suggereren dat
// er niet is. Zodra er echte foto's zijn, kunnen die in de sectie "Wat u van
// ons mag verwachten" worden opgenomen. Deze pagina gebruikt uitsluitend
// bestaande klassen uit app/globals.css, dus er is geen nieuwe styling nodig.

const werkwijze = [
  {
    title: "U vraagt vrijblijvend een beoordeling aan",
    text: "Adres, situatie en gewenste planning zijn genoeg voor een eerste beoordeling. U zit nergens aan vast.",
  },
  {
    title: "Wij beoordelen of directe verkoop past",
    text: "Wij kijken naar de woning of het object, de staat, het gebruik en uw planning. Past directe verkoop niet, dan zeggen wij dat.",
  },
  {
    title: "U ontvangt een schriftelijk voorstel",
    text: "Met bedrag, planning, oplevering en voorwaarden op papier, zodat u het rustig kunt nalezen en vergelijken.",
  },
  {
    title: "U beslist, daarna volgt de notaris",
    text: "Pas als u akkoord bent wordt de koopovereenkomst uitgewerkt. De overdracht loopt via de notaris.",
  },
];

const verwachting = [
  {
    title: "Eén vast contactpersoon",
    text: "Geen wisselende medewerkers en geen callcenter. Dezelfde persoon die uw situatie kent, voert ook het gesprek over het voorstel.",
  },
  {
    title: "Alles op papier",
    text: "Bedrag, planning, oplevering en voorwaarden staan in een schriftelijk voorstel. U kunt het rustig nalezen en met anderen bespreken.",
  },
  {
    title: "Geen verkoopdruk",
    text: "Een voorstel is vrijblijvend. U beslist zelf of en wanneer u verder wilt.",
  },
  {
    title: "Notariële afwikkeling",
    text: "De overdracht verloopt altijd via de notaris, met de gebruikelijke controles op eigendom, hypotheek en beslagen.",
  },
];

const passendWel = [
  "Woningen met achterstallig onderhoud, schade of een renovatiebehoefte",
  "Leegstand, dubbele lasten of een woning die nog vol staat",
  "Verkoop na een erfenis, scheiding of overlijden",
  "Verhuurde woningen, woon-winkelpanden en gemengde objecten",
  "Situaties waarin privacy of een voorspelbare planning zwaarder weegt dan de hoogste vraagprijs",
];

const passendNiet = [
  "U wilt de maximale opbrengst en hebt tijd voor een regulier verkooptraject",
  "De woning is verkoopklaar en verkoopt naar verwachting vlot via een makelaar",
  "U wilt eerst de markt op en pas daarna alternatieven bekijken",
];

export default function OverOnsPage() {
  return (
    <main className="seo-page">
      <MarketingHeader />

      <section className="seo-hero" id="hoofdinhoud">
        <div className="site-container">
          <nav className="seo-breadcrumbs" aria-label="Kruimelpad">
            <Link href="/">Home</Link><span>›</span><span>Over ons</span>
          </nav>

          <div className="seo-hero-grid">
            <div className="seo-hero-copy">
              <span className="eyebrow-pill">Over ons</span>
              <h1>Eén vast contactpersoon, een schriftelijk voorstel en geen verkoopdruk</h1>
              <p className="seo-lead">
                Vastgoed Direct Nederland koopt woningen en objecten rechtstreeks aan. Wij zijn geen makelaar
                en geen platform: u spreekt één persoon, en wat wij voorstellen zetten wij op papier voordat u
                iets hoeft te beslissen.
              </p>
              <div className="seo-hero-actions">
                <Link href="/#aanvraag" className="button button-primary">Vraag vrijblijvend een voorstel aan</Link>
                <a href="tel:0612238051" className="button button-secondary">06 12 23 80 51</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProofBar />

      <section className="section-shell">
        <div className="site-container">
          <div className="section-heading centered-heading">
            <p className="section-eyebrow">Hoe het werkt</p>
            <h2>Van eerste vraag tot overdracht bij de notaris.</h2>
          </div>
          <ol className="seo-process-grid">
            {werkwijze.map((stap) => (
              <li key={stap.title}>
                <strong>{stap.title}</strong>
                <small>{stap.text}</small>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-shell section-cream">
        <div className="site-container">
          <div className="section-heading centered-heading">
            <p className="section-eyebrow">Eerlijk over de route</p>
            <h2>Wanneer directe verkoop past, en wanneer niet.</h2>
          </div>
          <div className="comparison-two-col">
            <article className="compare-card">
              <h3>Vaak passend</h3>
              <ul className="plain-list">
                {passendWel.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
            <article className="compare-card">
              <h3>Meestal niet passend</h3>
              <ul className="plain-list">
                {passendNiet.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="site-container insight-grid">
          {verwachting.map((punt) => (
            <article className="insight-card" key={punt.title}>
              <h3>{punt.title}</h3>
              <p>{punt.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta-section">
        <div className="site-container final-cta-grid">
          <div>
            <p className="section-eyebrow">Vrijblijvend laten beoordelen</p>
            <h2>Liever eerst uw situatie bespreken?</h2>
            <p>
              Bellen of appen kan ook, voordat u iets invult. Dan hoort u meteen of directe verkoop in uw
              geval zinvol is om verder uit te zoeken.
            </p>
          </div>
          <div className="final-cta-actions">
            <Link href="/#aanvraag" className="button button-primary">Vraag een voorstel aan</Link>
            <a
              href="https://wa.me/31612238051?text=Hallo%2C%20ik%20wil%20graag%20mijn%20situatie%20bespreken."
              target="_blank"
              rel="noopener noreferrer"
              className="button button-on-dark"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
