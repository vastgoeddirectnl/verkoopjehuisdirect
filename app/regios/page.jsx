const regionLinks = [
  ["/huis-verkopen-groningen", "Groningen", "Voor woningen in Groningen en omliggende plaatsen."],
  ["/woning-verkopen-drenthe", "Drenthe", "Voor woningen in Drenthe, waaronder Assen, Emmen, Borger en Gieten."],
  ["/woning-verkopen-friesland", "Friesland", "Voor woningeigenaren in Friesland die rustig duidelijkheid willen."],
  ["/woning-verkopen-overijssel", "Overijssel", "Voor situaties waarin snelheid, zekerheid of privacy belangrijk zijn."],
  ["/huis-verkopen-stadskanaal", "Stadskanaal", "Lokale pagina voor verkoopmogelijkheden in en rond Stadskanaal."],
  ["/huis-verkopen-veendam", "Veendam", "Voor woningeigenaren die alternatieven voor reguliere verkoop willen bekijken."],
  ["/huis-verkopen-winschoten", "Winschoten", "Rustig inzicht krijgen in de verkoopmogelijkheden."],
  ["/huis-verkopen-assen", "Assen", "Voor verkoopvragen in Assen en omgeving."],
  ["/huis-verkopen-emmen", "Emmen", "Voor woningen in Emmen en omliggende dorpen."],
  ["/huis-verkopen-borger", "Borger", "Voor woningeigenaren in Borger en de Hondsrug-regio."],
  ["/huis-verkopen-gieten", "Gieten", "Voor verkoopvragen in Gieten en omgeving."],
];

export const metadata = {
  title: "Verkoopinformatie per regio | Vastgoed Direct Nederland",
  description: "Bekijk verkoopmogelijkheden per regio, waaronder Groningen, Drenthe, Friesland, Overijssel en verschillende plaatsen in Noord- en Oost-Nederland.",
  alternates: { canonical: "/regios" },
};

export default function RegiosPage() {
  return (
    <main className="overview-page">
      <section className="overview-hero">
        <div className="overview-container">
          <a href="/" className="back-link">← Terug naar Vastgoed Direct Nederland</a>
          <p className="eyebrow">Regio’s</p>
          <h1>Verkoopmogelijkheden per regio</h1>
          <p>
            Vastgoed Direct Nederland is actief in meerdere regio’s in Noord- en Oost-Nederland.
            Bekijk rustig welke regiopagina het beste aansluit.
          </p>
        </div>
      </section>
      <section className="overview-list-section">
        <div className="overview-container overview-page-grid">
          {regionLinks.map(([href, title, text]) => (
            <a href={href} className="overview-page-card" key={href}>
              <strong>{title}</strong>
              <p>{text}</p>
              <span>Bekijk regio →</span>
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
