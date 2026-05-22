const whatsappBase = "https://wa.me/31612238051";

const internalLinks = [
  ["/huis-direct-verkopen", "Huis direct verkopen"],
  ["/huis-snel-verkopen", "Huis snel verkopen"],
  ["/woning-verkopen-zonder-makelaar", "Woning verkopen zonder makelaar"],
  ["/huis-verkopen-binnen-24-uur", "Huis verkopen binnen 24 uur"],
  ["/huis-verkopen-binnen-1-week", "Huis verkopen binnen 1 week"],
  ["/opknapwoning-verkopen", "Opknapwoning verkopen"],
  ["/huis-verkopen-bij-erfenis", "Huis verkopen bij erfenis"],
  ["/verhuurde-woning-verkopen", "Verhuurde woning verkopen"],
  ["/huis-verkopen-groningen", "Huis verkopen in Groningen"],
["/huis-verkopen-zonder-bezichtigingen", "Huis verkopen zonder bezichtigingen"],
["/huis-verkopen-bij-scheiding", "Huis verkopen bij scheiding"],
["/leegstaand-huis-verkopen", "Leegstaand huis verkopen"],
["/huis-verkopen-met-achterstallig-onderhoud", "Huis verkopen met achterstallig onderhoud"],
["/huis-verkopen-aan-opkoper", "Huis verkopen aan opkoper"],
["/huis-verkopen-groningen", "Huis verkopen in Groningen"],
["/woning-verkopen-friesland", "Woning verkopen in Friesland"],
["/woning-verkopen-drenthe", "Woning verkopen in Drenthe"],
["/woning-verkopen-overijssel", "Woning verkopen in Overijssel"],  
];

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    background: "#f7f5f0",
    color: "#0a2540",
  },
  container: {
    maxWidth: "980px",
    margin: "0 auto",
    padding: "70px 20px",
  },
  logo: {
    width: "230px",
    maxWidth: "100%",
    marginBottom: "38px",
  },
  eyebrow: {
    color: "#ff6a00",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "12px",
  },
  h1: {
    fontSize: "clamp(38px, 5vw, 56px)",
    lineHeight: "1.05",
    margin: "0 0 22px",
    letterSpacing: "-1px",
  },
  h2: {
    fontSize: "clamp(28px, 3.5vw, 38px)",
    lineHeight: "1.15",
    margin: "45px 0 16px",
  },
  h3: {
    fontSize: "22px",
    margin: "28px 0 10px",
  },
  lead: {
    fontSize: "20px",
    lineHeight: "1.75",
    color: "#536273",
    marginBottom: "28px",
  },
  p: {
    fontSize: "18px",
    lineHeight: "1.85",
    color: "#536273",
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "30px",
  },
  buttonOrange: {
    display: "inline-block",
    background: "#ff6a00",
    color: "white",
    padding: "16px 28px",
    borderRadius: "999px",
    fontWeight: "900",
    textDecoration: "none",
  },
  buttonBlue: {
    display: "inline-block",
    background: "#0a2540",
    color: "white",
    padding: "16px 28px",
    borderRadius: "999px",
    fontWeight: "900",
    textDecoration: "none",
  },
  buttonLight: {
    display: "inline-block",
    background: "white",
    color: "#0a2540",
    padding: "16px 28px",
    borderRadius: "999px",
    fontWeight: "900",
    textDecoration: "none",
    border: "1px solid #d8d4cc",
  },
  card: {
    background: "white",
    border: "1px solid #e6e2db",
    borderRadius: "28px",
    padding: "28px",
    marginTop: "30px",
  },
  darkCard: {
    background: "#0a2540",
    color: "white",
    borderRadius: "28px",
    padding: "32px",
    marginTop: "45px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginTop: "22px",
  },
  item: {
    background: "white",
    border: "1px solid #e6e2db",
    borderRadius: "20px",
    padding: "18px",
    fontWeight: "800",
  },
  list: {
    lineHeight: "2",
    fontSize: "18px",
    color: "#536273",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    fontSize: "16px",
    lineHeight: "1.5",
  },
  th: {
    background: "#0a2540",
    color: "white",
    padding: "14px",
    textAlign: "left",
    border: "1px solid #e6e2db",
  },
  td: {
    background: "white",
    padding: "14px",
    border: "1px solid #e6e2db",
    color: "#536273",
  },
};

export default function SeoLandingPage({ page }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.verkoopjehuisdirect.nl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.breadcrumb,
        item: `https://www.verkoopjehuisdirect.nl${page.slug}`,
      },
    ],
  };

  const whatsappText = encodeURIComponent(
    `Hallo, ik wil graag meer informatie over: ${page.breadcrumb}. Kunt u contact met mij opnemen?`
  );
  const whatsappLink = `${whatsappBase}?text=${whatsappText}`;

  return (
    <main style={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section style={styles.container}>
        <a href="/" aria-label="Terug naar homepage">
          <img src="/logo.png" alt="Vastgoed Direct Nederland" style={styles.logo} />
        </a>

        <p style={styles.eyebrow}>{page.eyebrow}</p>
        <h1 style={styles.h1}>{page.h1}</h1>
        <p style={styles.lead}>{page.lead}</p>

        <div style={styles.buttonRow}>
          <a href="/#aanvraag" style={styles.buttonOrange}>Vraag gratis verkoopvoorstel aan</a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={styles.buttonLight}>WhatsApp direct</a>
          <a href="tel:0612238051" style={styles.buttonBlue}>Bel 06 12 23 80 51</a>
        </div>

        <div style={styles.card}>
          <h2 style={{ ...styles.h2, marginTop: 0 }}>Kort antwoord</h2>
          <p style={styles.p}>{page.shortAnswer}</p>
        </div>

        {page.benefits?.length > 0 && (
          <div style={styles.grid}>
            {page.benefits.map((item) => (
              <div key={item} style={styles.item}>✓ {item}</div>
            ))}
          </div>
        )}

        {page.sections.map((section) => (
          <section key={section.title}>
            <h2 style={styles.h2}>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} style={styles.p}>{paragraph}</p>
            ))}
            {section.bullets?.length > 0 && (
              <ul style={styles.list}>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
            {section.steps?.length > 0 && (
              <ol style={styles.list}>
                {section.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            )}
          </section>
        ))}

        {page.comparisonRows?.length > 0 && (
          <>
            <h2 style={styles.h2}>Vergelijk niet alleen het bod, maar vooral de voorwaarden</h2>
            <p style={styles.p}>
              Bij verkoop gaat het niet alleen om het hoogste bod. Ook kosten, snelheid, privacy, zekerheid en de gewenste oplevering zijn belangrijk om mee te nemen.
            </p>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Onderdeel</th>
                  <th style={styles.th}>Traditionele verkoop</th>
                  <th style={styles.th}>Vastgoed Direct Nederland</th>
                </tr>
              </thead>
              <tbody>
                {page.comparisonRows.map((row) => (
                  <tr key={row[0]}>
                    <td style={styles.td}>{row[0]}</td>
                    <td style={styles.td}>{row[1]}</td>
                    <td style={styles.td}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <h2 style={styles.h2}>Veelgestelde vragen</h2>
        {page.faqs.map((faq) => (
          <div key={faq.question}>
            <h3 style={styles.h3}>{faq.question}</h3>
            <p style={styles.p}>{faq.answer}</p>
          </div>
        ))}

        <h2 style={styles.h2}>Meer informatie</h2>
        <ul style={styles.list}>
          {internalLinks
            .filter(([href]) => href !== page.slug)
            .map(([href, label]) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
        </ul>

        <div style={styles.darkCard}>
          <h2 style={{ ...styles.h2, color: "white", marginTop: 0 }}>{page.ctaTitle}</h2>
          <p style={{ ...styles.p, color: "#d7e1ec" }}>{page.ctaText}</p>
          <div style={styles.buttonRow}>
            <a href="/#aanvraag" style={styles.buttonOrange}>Start gratis aanvraag</a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={styles.buttonLight}>WhatsApp direct</a>
          </div>
        </div>
      </section>
    </main>
  );
}
