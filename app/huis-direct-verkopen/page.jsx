 export const metadata = {
  title: "Huis direct verkopen",
  description:
    "Huis direct verkopen zonder makelaar of verkoopstress? Vraag vrijblijvend een helder verkoopvoorstel aan via Vastgoed Direct Nederland.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/huis-direct-verkopen",
  },
  },
  openGraph: {
    title: "Huis direct verkopen? Vrijblijvend voorstel zonder makelaar",
    description:
      "Ontvang snel duidelijkheid over een directe verkoopoplossing voor uw woning. Zonder makelaar, zonder open huis en met heldere afspraken.",
    url: "https://www.verkoopjehuisdirect.nl/huis-direct-verkopen",
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
      name: "Wat betekent direct huis verkopen?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Direct huis verkopen betekent dat u zonder traditioneel makelaarstraject een vrijblijvend verkoopvoorstel aanvraagt. U krijgt duidelijkheid over de mogelijkheden, voorwaarden en vervolgstappen.",
      },
    },
    {
      "@type": "Question",
      name: "Kan ik mijn huis direct verkopen zonder makelaar?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel verkooptraject met een makelaar.",
      },
    },
    {
      "@type": "Question",
      name: "Kan ik direct mijn woning verkopen zonder bezichtigingen?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "In veel situaties is een traditioneel bezichtigingstraject of open huis niet nodig. Wij bespreken de woning en uw situatie rechtstreeks met u.",
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
      name: "Betaal ik makelaarskosten?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Nee, u betaalt geen makelaarskosten voor een vrijblijvende aanvraag via Vastgoed Direct Nederland.",
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
    {
      "@type": "Question",
      name: "Is een aanbetaling mogelijk?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "In sommige situaties is een aanbetaling of voorschot bespreekbaar, mits dit juridisch en notarieel goed kan worden vastgelegd.",
      },
    },
    {
      "@type": "Question",
      name: "Is direct verkopen geschikt bij een opknapwoning?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ja, ook woningen met achterstallig onderhoud, schade of renovatiebehoefte kunnen worden aangemeld.",
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
      name: "Huis direct verkopen",
      item: "https://www.verkoopjehuisdirect.nl/huis-direct-verkopen",
    },
  ],
};

const whatsappLink =
  "https://wa.me/31612238051?text=Hallo%2C%20ik%20wil%20graag%20mijn%20woning%20direct%20verkopen.%20Kunt%20u%20contact%20met%20mij%20opnemen%3F";

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

export default function HuisDirectVerkopen() {
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

        <p style={styles.eyebrow}>Huis direct verkopen</p>
        <h1 style={styles.h1}>Huis direct verkopen zonder makelaar of verkoopstress</h1>

        <p style={styles.lead}>
          Wilt u uw huis direct verkopen en snel duidelijkheid over uw mogelijkheden? Vastgoed Direct Nederland helpt woningeigenaren met een directe verkoopoplossing, zonder traditioneel verkooptraject met makelaar, open huis of lange onzekerheid.
        </p>

        <div style={styles.buttonRow}>
          <a href="/#aanvraag" style={styles.buttonOrange}>Vraag gratis verkoopvoorstel aan</a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={styles.buttonLight}>WhatsApp direct</a>
          <a href="tel:0612238051" style={styles.buttonBlue}>Bel 06 12 23 80 51</a>
        </div>

        <div style={styles.card}>
          <h2 style={{ ...styles.h2, marginTop: 0 }}>Kort antwoord</h2>
          <p style={styles.p}>
            U kunt uw huis direct verkopen door vrijblijvend een verkoopvoorstel aan te vragen. Vastgoed Direct Nederland bespreekt uw situatie, kijkt naar de woning en geeft duidelijkheid over een mogelijke verkoopoplossing met notariële afwikkeling. U zit nergens aan vast.
          </p>
        </div>

        <h2 style={styles.h2}>Direct huis verkopen: wanneer is dat interessant?</h2>
        <p style={styles.p}>
          Direct huis verkopen is vooral interessant wanneer u snel duidelijkheid wilt, geen makelaar wilt inschakelen en geen langdurig traject met bezichtigingen, onderhandelingen en verkoopvoorbereiding wilt doorlopen.
        </p>
        <p style={styles.p}>
          Dit kan bijvoorbeeld spelen bij leegstand, een erfeniswoning, scheiding, financiële druk, verhuur of een woning met achterstallig onderhoud. Ook als u nog twijfelt, kunt u vrijblijvend bespreken wat mogelijk is.
        </p>

        <div style={styles.grid}>
          <div style={styles.item}>✓ Geen makelaarskosten</div>
          <div style={styles.item}>✓ Geen open huis nodig</div>
          <div style={styles.item}>✓ Notariële afwikkeling</div>
          <div style={styles.item}>✓ Verkoopoplossing op maat</div>
          <div style={styles.item}>✓ Ook bij schade of onderhoud</div>
          <div style={styles.item}>✓ Vrijblijvend voorstel</div>
        </div>

        <h2 style={styles.h2}>Direct woning verkopen zonder traditioneel verkooptraject</h2>
        <p style={styles.p}>
          Bij een traditionele verkoop wordt een woning vaak eerst verkoopklaar gemaakt. Daarna volgen foto&apos;s, bezichtigingen, onderhandelingen en wachttijd. Als u vooral rust en duidelijkheid wilt, kan een directe verkoopoplossing beter passen.
        </p>
        <p style={styles.p}>
          Bij Vastgoed Direct Nederland vraagt u rechtstreeks een verkoopvoorstel aan. U hoeft geen open huis te organiseren en u betaalt geen makelaarscourtage. De afspraken worden bij akkoord helder vastgelegd en via de notaris afgehandeld.
        </p>

        <h2 style={styles.h2}>Direct uw huis verkopen met duidelijke voorwaarden</h2>
        <p style={styles.p}>
          Wij kijken niet alleen naar het bodbedrag, maar ook naar de gewenste snelheid, oplevering, notariële afwikkeling en eventuele bijzondere afspraken. Zo weet u vooraf waar u aan toe bent.
        </p>

        <ul style={styles.list}>
          <li>Huis verkopen zonder makelaar</li>
          <li>Huis verkopen zonder bezichtigingen</li>
          <li>Opknapwoning of woning met schade verkopen</li>
          <li>Geërfd huis verkopen</li>
          <li>Verhuurde woning verkopen</li>
          <li>Leegstaande woning verkopen</li>
          <li>Snel duidelijkheid over verkoopmogelijkheden</li>
        </ul>

        <h2 style={styles.h2}>Vergelijk niet alleen het bod, maar vooral de voorwaarden</h2>
        <p style={styles.p}>
          Bij een verkoop gaat het niet alleen om het hoogste bedrag. Voor veel verkopers zijn ook netto-opbrengst, kosten, snelheid, privacy en zekerheid belangrijk. Daarom kijken wij naar het totaalplaatje.
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
              <td style={styles.td}>Woning verkoopklaar maken</td>
              <td style={styles.td}>Vaak gewenst voor presentatie</td>
              <td style={styles.td}>Niet noodzakelijk vooraf</td>
            </tr>
            <tr>
              <td style={styles.td}>Notariskosten</td>
              <td style={styles.td}>Afhankelijk van afspraken</td>
              <td style={styles.td}>Standaard levering voor onze rekening bij passende verkoop</td>
            </tr>
            <tr>
              <td style={styles.td}>Opleverdatum</td>
              <td style={styles.td}>Afhankelijk van koper</td>
              <td style={styles.td}>In overleg bespreekbaar</td>
            </tr>
            <tr>
              <td style={styles.td}>Rust en privacy</td>
              <td style={styles.td}>Openbare presentatie kan nodig zijn</td>
              <td style={styles.td}>Rustige, vertrouwelijke behandeling</td>
            </tr>
          </tbody>
        </table>

        <h2 style={styles.h2}>Ook als uw woning niet verkoopklaar is</h2>
        <p style={styles.p}>
          Uw woning hoeft niet perfect te zijn. Ook woningen met achterstallig onderhoud, verouderde installaties, schade, leegstand of renovatiebehoefte kunnen worden aangemeld. U hoeft dus niet eerst te verbouwen of kosten te maken voordat u weet wat er mogelijk is.
        </p>

        <h2 style={styles.h2}>Hoe werkt huis direct verkopen?</h2>
        <ol style={styles.list}>
          <li>U vult uw woninggegevens in via het formulier.</li>
          <li>Wij nemen contact met u op om uw situatie, gewenste snelheid en verkoopmogelijkheden te bespreken.</li>
          <li>U ontvangt een vrijblijvend verkoopvoorstel met duidelijke voorwaarden.</li>
          <li>Bij akkoord wordt de overdracht via de notaris geregeld.</li>
        </ol>

        <h2 style={styles.h2}>Kosten, notariskosten en aanbetaling</h2>
        <p style={styles.p}>
          U betaalt geen makelaarskosten voor een aanvraag via Vastgoed Direct Nederland. Bij een passende verkoop nemen wij de standaard notariskosten voor de levering voor onze rekening. Eventuele afwijkende kosten of bijzondere afspraken bespreken we vooraf duidelijk.
        </p>
        <p style={styles.p}>
          In sommige situaties is een aanbetaling of voorschot bespreekbaar, mits dit juridisch en notarieel goed kan worden vastgelegd. Dit is afhankelijk van de woning, de afspraken en de notariële mogelijkheden.
        </p>

        <h2 style={styles.h2}>Veelgestelde vragen over huis direct verkopen</h2>

        <h3 style={styles.h3}>Wat betekent direct huis verkopen?</h3>
        <p style={styles.p}>
          Direct huis verkopen betekent dat u zonder traditioneel makelaarstraject een verkoopvoorstel aanvraagt. U krijgt duidelijkheid over de mogelijkheden, voorwaarden en vervolgstappen.
        </p>

        <h3 style={styles.h3}>Kan ik mijn huis direct verkopen zonder makelaar?</h3>
        <p style={styles.p}>
          Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel verkooptraject met een makelaar.
        </p>

        <h3 style={styles.h3}>Kan ik direct mijn woning verkopen zonder bezichtigingen?</h3>
        <p style={styles.p}>
          In veel situaties is een traditioneel bezichtigingstraject niet nodig. Wij bespreken de woning en uw situatie rechtstreeks met u.
        </p>

        <h3 style={styles.h3}>Moet mijn woning verkoopklaar zijn?</h3>
        <p style={styles.p}>
          Nee, uw woning hoeft niet verkoopklaar te zijn. Ook woningen met schade, achterstallig onderhoud of renovatiebehoefte kunnen worden aangemeld.
        </p>

        <h3 style={styles.h3}>Betaal ik makelaarskosten?</h3>
        <p style={styles.p}>
          Nee, u betaalt geen makelaarskosten voor een vrijblijvende aanvraag via Vastgoed Direct Nederland.
        </p>

        <h3 style={styles.h3}>Betaal ik notariskosten?</h3>
        <p style={styles.p}>
          Bij een passende verkoop nemen wij de standaard notariskosten voor de levering voor onze rekening. Eventuele afwijkende kosten of bijzondere afspraken bespreken we vooraf duidelijk.
        </p>

        <h3 style={styles.h3}>Is een aanbetaling mogelijk?</h3>
        <p style={styles.p}>
          In sommige situaties is een aanbetaling of voorschot bespreekbaar, mits dit juridisch en notarieel goed kan worden vastgelegd.
        </p>

        <h3 style={styles.h3}>Is direct verkopen geschikt bij een opknapwoning?</h3>
        <p style={styles.p}>
          Ja, ook woningen met achterstallig onderhoud, schade of renovatiebehoefte kunnen worden aangemeld.
        </p>

        <h2 style={styles.h2}>Meer informatie</h2>
        <ul style={styles.list}>
          <li><a href="/huis-snel-verkopen">Huis snel verkopen</a></li>
          <li><a href="/woning-verkopen-zonder-makelaar">Woning verkopen zonder makelaar</a></li>
          <li><a href="/huis-verkopen-binnen-24-uur">Huis verkopen binnen 24 uur</a></li>
          <li><a href="/opknapwoning-verkopen">Opknapwoning verkopen</a></li>
          <li><a href="/huis-verkopen-bij-erfenis">Huis verkopen bij erfenis</a></li>
          <li><a href="/verhuurde-woning-verkopen">Verhuurde woning verkopen</a></li>
          <li><a href="/huis-verkopen-groningen">Huis verkopen in Groningen</a></li>
        </ul>

        <div style={styles.darkCard}>
          <h2 style={{ ...styles.h2, color: "white", marginTop: 0 }}>Wilt u uw huis direct verkopen?</h2>
          <p style={{ ...styles.p, color: "#d7e1ec" }}>
            Vraag vrijblijvend een verkoopvoorstel aan en ontvang snel duidelijkheid over uw mogelijkheden. U zit nergens aan vast.
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
