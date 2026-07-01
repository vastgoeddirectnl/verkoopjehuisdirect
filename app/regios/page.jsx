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
    </main>
  );
}
