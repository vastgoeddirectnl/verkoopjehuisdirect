const situationLinks = [
  ["/huis-verkopen-met-achterstallig-onderhoud", "Achterstallig onderhoud", "Voor woningen waar onderhoud of herstel een rol speelt."],
  ["/opknapwoning-verkopen", "Opknapwoning verkopen", "Als de woning niet verkoopklaar is of verbouwing nodig heeft."],
  ["/huis-verkopen-zonder-opknappen", "Zonder opknappen verkopen", "Bekijk mogelijkheden zonder eerst te verbouwen."],
  ["/huis-verkopen-zonder-leeghalen", "Zonder leeghalen verkopen", "Ook als de woning nog niet leeg is."],
  ["/woning-verkopen-die-nog-vol-staat", "Woning staat nog vol spullen", "Voor woningen met inboedel of achtergebleven spullen."],
  ["/leegstaand-huis-verkopen", "Leegstaande woning", "Bij leegstand, zorgen of doorlopende lasten."],
  ["/huis-verkopen-bij-dubbele-lasten", "Dubbele lasten", "Wanneer zekerheid en planning belangrijk zijn."],
  ["/huis-verkopen-bij-erfenis", "Erfenis of nalatenschap", "Rustig overzicht bij verkoop na overlijden."],
  ["/huis-verkopen-na-overlijden", "Huis verkopen na overlijden", "Voor erfgenamen die duidelijkheid willen."],
  ["/geerfde-woning-verkopen-zonder-leeghalen", "Geërfde woning zonder leeghalen", "Als opruimen of leeghalen nog niet mogelijk is."],
  ["/huis-verkopen-bij-scheiding", "Scheiding", "Duidelijkheid zonder onnodige verkoopdruk."],
  ["/verhuurde-woning-verkopen", "Verhuurde woning", "Als huur of gebruik een rol speelt."],
  ["/woning-verkopen-met-schade", "Woning met schade", "Ook bij schade of gebreken rustig laten meekijken."],
  ["/huis-verkopen-zonder-bezichtigingen", "Zonder bezichtigingen", "Geen open huis of reeks kijkers nodig."],
  ["/woning-verkopen-zonder-open-huis", "Zonder open huis", "Voor wie privacy en rust belangrijk vindt."],
  ["/huis-verkopen-zonder-funda", "Zonder Funda", "Verkoopmogelijkheden zonder openbare presentatie."],
  ["/huis-verkopen-met-spoed", "Met spoed verkopen", "Als snelheid en duidelijkheid belangrijk zijn."],
  ["/huis-snel-verkopen", "Huis snel verkopen", "Rustig starten met een eerste inschatting."],
  ["/huis-direct-verkopen", "Huis direct verkopen", "Voor wie snel duidelijkheid wil over de mogelijkheden."],
  ["/woning-verkopen-zonder-makelaar", "Zonder makelaar", "Geen traditioneel makelaarstraject nodig."],
];

export const metadata = {
  title: "Verkoopinformatie per situatie | Vastgoed Direct Nederland",
  description: "Bekijk verkoopmogelijkheden per situatie, zoals achterstallig onderhoud, leegstand, erfenis, scheiding, verhuur of verkoop zonder leeghalen.",
  alternates: { canonical: "/situaties" },
};

export default function SituatiesPage() {
  return (
    <main className="overview-page">
      <section className="overview-hero">
        <div className="overview-container">
          <a href="/" className="back-link">← Terug naar Vastgoed Direct Nederland</a>
          <p className="eyebrow">Situaties</p>
          <h1>Verkoopmogelijkheden per situatie</h1>
          <p>
            Niet iedere woning of verkoopreden is hetzelfde. Bekijk rustig welke situatie het meest herkenbaar is
            en welke route daarbij kan passen.
          </p>
        </div>
      </section>
      <section className="overview-list-section">
        <div className="overview-container overview-page-grid">
          {situationLinks.map(([href, title, text]) => (
            <a href={href} className="overview-page-card" key={href}>
              <strong>{title}</strong>
              <p>{text}</p>
              <span>Lees meer →</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
