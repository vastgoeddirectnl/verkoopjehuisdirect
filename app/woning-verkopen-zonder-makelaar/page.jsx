export const metadata = {
  title: "Huis verkopen zonder makelaar? Vrijblijvend voorstel | Vastgoed Direct Nederland",
  description:
    "Wilt u uw huis verkopen zonder makelaar, courtage of verkoopstress? Vraag vrijblijvend een verkoopvoorstel aan bij Vastgoed Direct Nederland.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/woning-verkopen-zonder-makelaar",
  },
  openGraph: {
    title: "Huis verkopen zonder makelaar? Vrijblijvend verkoopvoorstel",
    description:
      "Verkoop uw woning zonder makelaar, zonder open huis en zonder courtage. Ontvang een helder en vrijblijvend verkoopvoorstel.",
    url: "https://www.verkoopjehuisdirect.nl/woning-verkopen-zonder-makelaar",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Kan ik mijn huis verkopen zonder makelaar?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ja, u kunt uw huis verkopen zonder makelaar door rechtstreeks een vrijblijvend verkoopvoorstel aan te vragen bij Vastgoed Direct Nederland.",
      },
    },
    {
      "@type": "Question",
      name: "Betaal ik courtage als ik zonder makelaar verkoop?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Nee, bij een aanvraag via Vastgoed Direct Nederland betaalt u geen makelaarscourtage of makelaarskosten.",
      },
    },
    {
      "@type": "Question",
      name: "Moet ik zelf bezichtigingen regelen?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "In veel situaties is een traditioneel bezichtigingstraject niet nodig. Wij bespreken uw woning en situatie rechtstreeks met u.",
      },
    },
    {
      "@type": "Question",
      name: "Moet mijn woning verkoopklaar zijn?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Nee, uw woning hoeft niet verkoopklaar te zijn. Ook woningen met achterstallig onderhoud, schade, leegstand of renovatiebehoefte kunnen worden aangemeld.",
      },
    },
    {
      "@type": "Question",
      name: "Hoe werkt de notariële afwikkeling?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Bij akkoord worden de afspraken schriftelijk vastgelegd en wordt de overdracht via de notaris geregeld.",
      },
    },
    {
      "@type": "Question",
      name: "Betaal ik notariskosten?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Bij een passende verkoop nemen wij de standaard notariskosten voor de levering voor onze rekening. Eventuele afwijkende kosten of bijzondere afspraken bespreken we vooraf duidelijk.",
      },
    },
  ],
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
      name: "Woning verkopen zonder makelaar",
      item: "https://www.verkoopjehuisdirect.nl/woning-verkopen-zonder-makelaar",
    },
  ],
};

const whatsappLink =
  "https://wa.me/31612238051?text=Hallo%2C%20ik%20wil%20graag%20mijn%20woning%20zonder%20makelaar%20verkopen.%20Kunt%20u%20contact%20met%20mij%20opnemen%3F";

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

export default function WoningVerkopenZonderMakelaar() {
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

        <p style={styles.eyebrow}>Huis verkopen zonder makelaar</p>
        <h1 style={styles.h1}>Huis verkopen zonder makelaar, courtage of verkoopstress</h1>

        <p style={styles.lead}>
          Wilt u uw huis verkopen zonder makelaar en zonder traditioneel verkooptraject? Vastgoed Direct Nederland helpt woningeigenaren met een directe verkoopoplossing, heldere afspraken en notariële afwikkeling.
        </p>

        <div style={styles.buttonRow}>
          <a href="/#aanvraag" style={styles.buttonOrange}>Vraag gratis verkoopvoorstel aan</a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={styles.buttonLight}>WhatsApp direct</a>
          <a href="tel:0612238051" style={styles.buttonBlue}>Bel 06 12 23 80 51</a>
        </div>

        <div style={styles.card}>
          <h2 style={{ ...styles.h2, marginTop: 0 }}>Kort antwoord</h2>
          <p style={styles.p}>
            U kunt uw huis verkopen zonder makelaar door rechtstreeks een vrijblijvend verkoopvoorstel aan te vragen. U betaalt geen makelaarscourtage, hoeft geen open huis te organiseren en krijgt duidelijkheid over een mogelijke verkoopoplossing met notariële afwikkeling.
          </p>
        </div>

        <h2 style={styles.h2}>Waarom uw huis verkopen zonder makelaar?</h2>
        <p style={styles.p}>
          Een makelaar inschakelen is niet altijd nodig. Soms wilt u geen verkoopfoto&apos;s, geen open huis, geen reeks bezichtigingen en geen courtage betalen. Zeker bij een woning die snel verkocht moet worden, verhuurd is, leegstaat of onderhoud nodig heeft, kan een directe verkoopoplossing beter passen.
        </p>
        <p style={styles.p}>
          Bij Vastgoed Direct Nederland vraagt u rechtstreeks een vrijblijvend verkoopvoorstel aan. Wij bespreken uw situatie, uw woning en uw gewenste snelheid. Daarna krijgt u duidelijkheid over de mogelijkheden.
        </p>

        <div style={styles.grid}>
          <div style={styles.item}>✓ Geen makelaarskosten</div>
          <div style={styles.item}>✓ Geen courtage</div>
          <div style={styles.item}>✓ Geen open huis nodig</div>
          <div style={styles.item}>✓ Geen verkoopstyling verplicht</div>
          <div style={styles.item}>✓ Notariële afwikkeling</div>
          <div style={styles.item}>✓ Vrijblijvend voorstel</div>
        </div>

        <h2 style={styles.h2}>Voor welke situaties is dit geschikt?</h2>
        <p style={styles.p}>
          Een woning verkopen zonder makelaar is vooral interessant als u snel duidelijkheid wilt en geen traditioneel verkooptraject wilt doorlopen. Dit kan spelen bij persoonlijke omstandigheden, praktische redenen of een woning die lastig verkoopklaar te maken is.
        </p>

        <ul style={styles.list}>
          <li>U wilt uw huis direct of snel verkopen</li>
          <li>U wilt geen makelaarskosten of courtage betalen</li>
          <li>U wilt geen open huis of veel bezichtigingen</li>
          <li>De woning heeft achterstallig onderhoud of schade</li>
          <li>De woning staat leeg of is onderdeel van een erfenis</li>
          <li>De woning is verhuurd</li>
          <li>U wilt rust, privacy en duidelijke afspraken</li>
        </ul>

        <h2 style={styles.h2}>Wat bespaart u zonder makelaar?</h2>
        <p style={styles.p}>
          Bij een traditionele verkoop betaalt u vaak courtage of een vast makelaarstarief. Daarnaast kunnen kosten ontstaan voor verkoopstyling, fotografie, onderhoud, herstelwerk en voorbereiding van bezichtigingen. Zonder makelaar voorkomt u een groot deel van deze kosten en blijft het traject overzichtelijker.
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
            <tr>
              <td style={styles.td}>Makelaarskosten</td>
              <td style={styles.td}>Vaak courtage of vast tarief</td>
              <td style={styles.td}>Geen makelaarskosten</td>
            </tr>
            <tr>
              <td style={styles.td}>Bezichtigingen</td>
              <td style={styles.td}>Vaak meerdere kijkers of open huis</td>
              <td style={styles.td}>Niet standaard nodig</td>
            </tr>
            <tr>
              <td style={styles.td}>Verkoopstyling</td>
              <td style={styles.td}>Vaak gewenst voor presentatie</td>
              <td style={styles.td}>Niet noodzakelijk vooraf</td>
            </tr>
            <tr>
              <td style={styles.td}>Onderhandelingen</td>
              <td style={styles.td}>Vaak via makelaar en koper</td>
              <td style={styles.td}>Rechtstreeks duidelijke voorwaarden bespreken</td>
            </tr>
            <tr>
              <td style={styles.td}>Notariële afwikkeling</td>
              <td style={styles.td}>Afhankelijk van koper en afspraken</td>
              <td style={styles.td}>Bij akkoord via de notaris geregeld</td>
            </tr>
            <tr>
              <td style={styles.td}>Rust en privacy</td>
              <td style={styles.td}>Openbare presentatie kan nodig zijn</td>
              <td style={styles.td}>Rustige en vertrouwelijke behandeling</td>
            </tr>
          </tbody>
        </table>

        <h2 style={styles.h2}>Uw woning hoeft niet perfect te zijn</h2>
        <p style={styles.p}>
          Een makelaar zal vaak adviseren om een woning verkoopklaar te maken. Bij een directe verkoopoplossing is dat niet altijd nodig. Ook woningen met achterstallig onderhoud, schade, verouderde installaties, leegstand of renovatiebehoefte kunnen worden aangemeld.
        </p>

        <h2 style={styles.h2}>Hoe werkt verkopen zonder makelaar?</h2>
        <ol style={styles.list}>
          <li>U vult uw woninggegevens in via het formulier.</li>
          <li>Wij nemen contact met u op om uw situatie, woning en gewenste snelheid te bespreken.</li>
          <li>U ontvangt een vrijblijvend verkoopvoorstel met duidelijke voorwaarden.</li>
          <li>Bij akkoord wordt de overdracht via de notaris geregeld.</li>
        </ol>

        <h2 style={styles.h2}>Kosten, notariskosten en voorwaarden</h2>
        <p style={styles.p}>
          U betaalt geen makelaarskosten voor een aanvraag via Vastgoed Direct Nederland. Bij een passende verkoop nemen wij de standaard notariskosten voor de levering voor onze rekening. Eventuele afwijkende kosten of bijzondere afspraken bespreken we vooraf duidelijk.
        </p>
        <p style={styles.p}>
          In sommige situaties is een aanbetaling of voorschot bespreekbaar, mits dit juridisch en notarieel goed kan worden vastgelegd. Een definitieve overeenkomst komt uitsluitend tot stand na schriftelijke bevestiging en notariële vastlegging.
        </p>

        <h2 style={styles.h2}>Veelgestelde vragen over huis verkopen zonder makelaar</h2>

        <h3 style={styles.h3}>Kan ik mijn huis verkopen zonder makelaar?</h3>
        <p style={styles.p}>
          Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel verkooptraject met een makelaar.
        </p>

        <h3 style={styles.h3}>Betaal ik courtage als ik zonder makelaar verkoop?</h3>
        <p style={styles.p}>
          Nee, bij een aanvraag via Vastgoed Direct Nederland betaalt u geen makelaarscourtage of makelaarskosten.
        </p>

        <h3 style={styles.h3}>Moet ik zelf bezichtigingen regelen?</h3>
        <p style={styles.p}>
          In veel situaties is een traditioneel bezichtigingstraject niet nodig. Wij bespreken uw woning en situatie rechtstreeks met u.
        </p>

        <h3 style={styles.h3}>Moet mijn woning verkoopklaar zijn?</h3>
        <p style={styles.p}>
          Nee, uw woning hoeft niet verkoopklaar te zijn. Ook woningen met schade, achterstallig onderhoud of renovatiebehoefte kunnen worden aangemeld.
        </p>

        <h3 style={styles.h3}>Hoe werkt de notariële afwikkeling?</h3>
        <p style={styles.p}>
          Bij akkoord worden de afspraken schriftelijk vastgelegd en wordt de overdracht via de notaris geregeld.
        </p>

        <h3 style={styles.h3}>Betaal ik notariskosten?</h3>
        <p style={styles.p}>
          Bij een passende verkoop nemen wij de standaard notariskosten voor de levering voor onze rekening. Eventuele afwijkende kosten of bijzondere afspraken bespreken we vooraf duidelijk.
        </p>

        <h2 style={styles.h2}>Meer informatie</h2>
        <ul style={styles.list}>
          <li><a href="/huis-direct-verkopen">Huis direct verkopen</a></li>
          <li><a href="/huis-snel-verkopen">Huis snel verkopen</a></li>
          <li><a href="/huis-verkopen-binnen-24-uur">Huis verkopen binnen 24 uur</a></li>
          <li><a href="/opknapwoning-verkopen">Opknapwoning verkopen</a></li>
          <li><a href="/huis-verkopen-bij-erfenis">Huis verkopen bij erfenis</a></li>
          <li><a href="/verhuurde-woning-verkopen">Verhuurde woning verkopen</a></li>
          <li><a href="/huis-verkopen-groningen">Huis verkopen in Groningen</a></li>
        </ul>

        <div style={styles.darkCard}>
          <h2 style={{ ...styles.h2, color: "white", marginTop: 0 }}>Wilt u uw huis verkopen zonder makelaar?</h2>
          <p style={{ ...styles.p, color: "#d7e1ec" }}>
            Vraag vrijblijvend een verkoopvoorstel aan en ontvang duidelijkheid zonder makelaarskosten of traditioneel verkooptraject.
          </p>
          <div style={styles.buttonRow}>
            <a href="/#aanvraag" style={styles.buttonOrange}>Start gratis aanvraag</a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={styles.buttonLight}>WhatsApp direct</a>
          </div>
        </div>
      </section>
    </main>
  );
}
