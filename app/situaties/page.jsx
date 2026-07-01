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
      <style jsx global>{`
        .overview-page{background:#f7f2ec;min-height:100vh;color:#071f3a}
        .overview-container{width:min(1120px,calc(100% - 44px));margin:0 auto}
        .overview-hero{padding:54px 0 34px;background:linear-gradient(180deg,#fffdf9 0%,#f7f2ec 100%);border-bottom:1px solid #e8e3db}
        .back-link{display:inline-flex;margin-bottom:22px;color:#D96A1C;font-weight:900;font-size:14px}
        .eyebrow{color:#D96A1C;font-weight:900;text-transform:uppercase;letter-spacing:.08em;font-size:12px;margin:0 0 10px}
        .overview-hero h1{font-size:clamp(38px,4.5vw,58px);line-height:.98;letter-spacing:-2px;margin:0 0 18px;max-width:780px}
        .overview-hero p:not(.eyebrow){max-width:760px;color:#526274;line-height:1.65;font-size:18px;margin:0}
        .overview-list-section{padding:36px 0 70px}
        .overview-page-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
        .overview-page-card{background:#fff;border:1px solid #e8e3db;border-radius:22px;padding:20px;box-shadow:0 10px 28px rgba(7,31,58,.055);display:grid;gap:10px;min-height:166px;transition:.18s ease}
        .overview-page-card:hover{border-color:#F2B885;transform:translateY(-1px)}
        .overview-page-card strong{font-size:19px;line-height:1.18;color:#071f3a}
        .overview-page-card p{margin:0;color:#647386;line-height:1.5;font-size:14.5px}
        .overview-page-card span{margin-top:auto;color:#D96A1C;font-weight:900;font-size:14px}
        @media(max-width:900px){.overview-page-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:640px){.overview-container{width:min(100% - 28px,1120px)}.overview-page-grid{grid-template-columns:1fr}.overview-hero{padding-top:34px}.overview-page-card{min-height:0}}
      `}</style>
    </main>
  );
}
