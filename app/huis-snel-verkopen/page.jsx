export const metadata = {
  title: "Huis snel verkopen? Vrijblijvend voorstel zonder makelaar",
  description:
    "Wilt u uw huis snel verkopen zonder makelaar, bezichtigingen of verkoopstress? Ontvang snel duidelijkheid met een vrijblijvend verkoopvoorstel.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/huis-snel-verkopen",
  },
  openGraph: {
    title: "Huis snel verkopen? Vrijblijvend verkoopvoorstel",
    description:
      "Snel duidelijkheid over de verkoop van uw woning. Zonder makelaar, zonder open huis en met heldere notariële afwikkeling.",
    url: "https://www.verkoopjehuisdirect.nl/huis-snel-verkopen",
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
      name: "Hoe kan ik mijn huis snel verkopen?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "U kunt uw huis snel verkopen door vrijblijvend een verkoopvoorstel aan te vragen. Vastgoed Direct Nederland bespreekt uw situatie en geeft duidelijkheid over een mogelijke directe verkoopoplossing.",
      },
    },
    {
      "@type": "Question",
      name: "Kan ik mijn huis snel verkopen zonder makelaar?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ja, u kunt rechtstreeks een aanvraag doen zonder traditioneel verkooptraject met een makelaar. U betaalt geen makelaarskosten voor uw aanvraag via Vastgoed Direct Nederland.",
      },
    },
    {
      "@type": "Question",
      name: "Kan ik verkopen zonder bezichtigingen?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ja, in veel situaties is een traditioneel bezichtigingstraject of open huis niet nodig. Wij bespreken de mogelijkheden rechtstreeks met u.",
      },
    },
    {
      "@type": "Question",
      name: "Moet mijn woning verkoopklaar zijn?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Nee, uw woning hoeft niet verkoopklaar te zijn. Ook woningen met schade, achterstallig onderhoud, leegstand of renovatiebehoefte kunnen worden aangemeld.",
      },
    },
    {
      "@type": "Question",
      name: "Hoe snel kan de overdracht plaatsvinden?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Een snelle overdracht is in overleg mogelijk. De exacte planning hangt af van de woning, gemaakte afspraken en notariële mogelijkheden.",
      },
    },
    {
      "@type": "Question",
      name: "Is de aanvraag vrijblijvend?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ja, uw aanvraag is gratis en vrijblijvend. U zit nergens aan vast na het aanvragen van een verkoopvoorstel.",
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
      name: "Huis snel verkopen",
      item: "https://www.verkoopjehuisdirect.nl/huis-snel-verkopen",
    },
  ],
};

const whatsappLink =
  "https://wa.me/31612238051?text=Hallo%2C%20ik%20wil%20graag%20mijn%20huis%20snel%20verkopen.%20Kunt%20u%20contact%20met%20mij%20opnemen%3F";

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

export default function HuisSnelVerkopen() {
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

        <p style={styles.eyebrow}>Huis snel verkopen</p>
        <h1 style={styles.h1}>Huis snel verkopen zonder makelaar of verkoopstress</h1>

        <p style={styles.lead}>
          Wilt u uw huis snel verkopen en duidelijkheid krijgen zonder lang verkooptraject? Vastgoed Direct Nederland helpt woningeigenaren met een directe verkoopoplossing, heldere afspraken en notariële afwikkeling.
        </p>

        <div style={styles.buttonRow}>
          <a href="/#aanvraag" style={styles.buttonOrange}>Vraag gratis verkoopvoorstel aan</a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={styles.buttonLight}>WhatsApp direct</a>
          <a href="tel:0612238051" style={styles.buttonBlue}>Bel 06 12 23 80 51</a>
        </div>

        <div style={styles.card}>
          <h2 style={{ ...styles.h2, marginTop: 0 }}>Kort antwoord</h2>
          <p style={styles.p}>
            U kunt uw huis snel verkopen door vrijblijvend een verkoopvoorstel aan te vragen. Wij bespreken uw woning, uw gewenste snelheid en uw situatie. Daarna krijgt u duidelijkheid over een mogelijke verkoopoplossing. De aanvraag is gratis en verplicht u tot niets.
          </p>
        </div>

        <h2 style={styles.h2}>Waarom uw huis snel verkopen?</h2>
        <p style={styles.p}>
          Een traditionele verkoop kan weken of maanden duren. U krijgt te maken met verkoopfoto&apos;s, bezichtigingen, onderhandelingen, makelaarskosten en soms onzekerheid over de financiering van een koper. Dat past niet bij iedere situatie.
        </p>
        <p style={styles.p}>
          Soms wilt u juist snel weten waar u aan toe bent. Bijvoorbeeld omdat de woning leegstaat, onderhoud nodig heeft, onderdeel is van een erfenis, verhuurd is of omdat u persoonlijke of financiële rust zoekt.
        </p>

        <h2 style={styles.h2}>Snel huis verkopen zonder makelaar</h2>
        <p style={styles.p}>
          Wanneer u uw huis snel wilt verkopen, kan een makelaarstraject te lang of te onzeker voelen. Bij Vastgoed Direct Nederland kunt u rechtstreeks een aanvraag doen. U hoeft geen open huis te organiseren, geen verkoopstyling te regelen en geen courtage te betalen. U ontvangt duidelijkheid over een mogelijke verkoopoplossing die past bij uw situatie.
        </p>

        <h2 style={styles.h2}>Huis verkopen binnen 1 week: wat is realistisch?</h2>
        <p style={styles.p}>
          Soms zoeken woningeigenaren naar een verkoop binnen 1 week. In de praktijk hangt de snelheid altijd af van de woning, eigendomssituatie, documenten, afspraken en notariële planning. Wel kunnen wij vaak snel duidelijkheid geven over de mogelijkheden en de stappen die nodig zijn voor een passende verkoop.
        </p>

        <div style={styles.grid}>
          <div style={styles.item}>✓ Snel duidelijkheid</div>
          <div style={styles.item}>✓ Geen makelaarskosten</div>
          <div style={styles.item}>✓ Geen open huis nodig</div>
          <div style={styles.item}>✓ Notariële afwikkeling</div>
          <div style={styles.item}>✓ Ook bij achterstallig onderhoud</div>
          <div style={styles.item}>✓ Vrijblijvend verkoopvoorstel</div>
        </div>

        <h2 style={styles.h2}>Voor wie is snel verkopen geschikt?</h2>
        <p style={styles.p}>
          Snel verkopen is vooral interessant wanneer u rust, privacy en duidelijkheid belangrijker vindt dan een lang traditioneel verkooptraject. Dit kan gaan om praktische, financiële of persoonlijke redenen.
        </p>

        <ul style={styles.list}>
          <li>U wilt snel duidelijkheid over de verkoopmogelijkheden</li>
          <li>U wilt verkopen zonder makelaar</li>
          <li>U wilt geen open huis of veel bezichtigingen</li>
          <li>De woning staat leeg</li>
          <li>De woning heeft achterstallig onderhoud of schade</li>
          <li>De woning is onderdeel van een erfenis</li>
          <li>De woning is verhuurd</li>
          <li>U wilt een flexibele overdrachtsdatum bespreken</li>
        </ul>

        <h2 style={styles.h2}>Snel woning verkopen in huidige staat</h2>
        <p style={styles.p}>
          Bij een reguliere verkoop wordt vaak verwacht dat een woning netjes, opgeruimd en verkoopklaar is. Dat kan tijd en geld kosten. Bij een directe verkoopoplossing hoeft dat niet altijd. Ook woningen in huidige staat, met schade of renovatiebehoefte kunnen worden aangemeld.
        </p>

        <h2 style={styles.h2}>Wat is het verschil met traditioneel verkopen?</h2>
        <p style={styles.p}>
          Bij snel verkopen gaat het niet alleen om het bodbedrag. De netto-opbrengst, kosten, voorwaarden, snelheid en zekerheid zijn minstens zo belangrijk. Daarom is het verstandig om het totaalplaatje te vergelijken.
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
              <td style={styles.td}>Snelheid</td>
              <td style={styles.td}>Kan weken of maanden duren</td>
              <td style={styles.td}>Snelle duidelijkheid mogelijk</td>
            </tr>
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
              <td style={styles.td}>Notariële afwikkeling</td>
              <td style={styles.td}>Afhankelijk van koper en afspraken</td>
              <td style={styles.td}>Bij akkoord via de notaris geregeld</td>
            </tr>
            <tr>
              <td style={styles.td}>Rust en privacy</td>
              <td style={styles.td}>Openbare presentatie kan nodig zijn</td>
              <td style={styles.td}>Rustige, vertrouwelijke behandeling</td>
            </tr>
          </tbody>
        </table>

        <h2 style={styles.h2}>Hoe werkt huis snel verkopen?</h2>
        <ol style={styles.list}>
          <li>U vult uw woninggegevens in via het formulier.</li>
          <li>Wij nemen contact met u op om uw situatie, woning en gewenste snelheid te bespreken.</li>
          <li>U ontvangt een vrijblijvend verkoopvoorstel met duidelijke voorwaarden.</li>
          <li>Bij akkoord wordt de overdracht via de notaris geregeld.</li>
        </ol>

        <h2 style={styles.h2}>Kosten, notariskosten en aanbetaling</h2>
        <p style={styles.p}>
          U betaalt geen makelaarskosten voor een aanvraag via Vastgoed Direct Nederland. Bij een passende verkoop nemen wij de standaard notariskosten voor de levering voor onze rekening. Eventuele afwijkende kosten of bijzondere afspraken bespreken we vooraf duidelijk.
        </p>
        <p style={styles.p}>
          In sommige situaties is een aanbetaling of voorschot bespreekbaar, mits dit juridisch en notarieel goed kan worden vastgelegd. De exacte mogelijkheden hangen af van de woning, afspraken en notariële beoordeling.
        </p>

        <h2 style={styles.h2}>Veelgestelde vragen over huis snel verkopen</h2>

        <h3 style={styles.h3}>Hoe kan ik mijn huis snel verkopen?</h3>
        <p style={styles.p}>
          U kunt vrijblijvend een verkoopvoorstel aanvragen. Wij bespreken uw situatie en geven duidelijkheid over een mogelijke directe verkoopoplossing.
        </p>

        <h3 style={styles.h3}>Kan ik mijn huis snel verkopen zonder makelaar?</h3>
        <p style={styles.p}>
          Ja, u kunt rechtstreeks een aanvraag doen zonder traditioneel verkooptraject met een makelaar. U betaalt geen makelaarskosten voor uw aanvraag via Vastgoed Direct Nederland.
        </p>

        <h3 style={styles.h3}>Kan ik verkopen zonder bezichtigingen?</h3>
        <p style={styles.p}>
          Ja, in veel situaties is een traditioneel bezichtigingstraject of open huis niet nodig. Wij bespreken de mogelijkheden rechtstreeks met u.
        </p>

        <h3 style={styles.h3}>Moet mijn woning verkoopklaar zijn?</h3>
        <p style={styles.p}>
          Nee, uw woning hoeft niet verkoopklaar te zijn. Ook woningen met schade, achterstallig onderhoud of renovatiebehoefte kunnen worden aangemeld.
        </p>

        <h3 style={styles.h3}>Hoe snel kan de overdracht plaatsvinden?</h3>
        <p style={styles.p}>
          Een snelle overdracht is in overleg mogelijk. De exacte planning hangt af van de woning, gemaakte afspraken en notariële mogelijkheden.
        </p>

        <h3 style={styles.h3}>Kan ik mijn huis verkopen binnen 1 week?</h3>
        <p style={styles.p}>
          In sommige situaties kan snel schakelen mogelijk zijn, maar een definitieve overdracht hangt altijd af van de afspraken, documenten en notariële planning. Wij geven u eerst duidelijkheid over wat realistisch is.
        </p>

        <h3 style={styles.h3}>Kan ik snel verkopen bij leegstand, erfenis of onderhoud?</h3>
        <p style={styles.p}>
          Ja, juist in situaties zoals leegstand, erfenis, achterstallig onderhoud of verhuur kan een directe verkoopoplossing interessant zijn.
        </p>

        <h3 style={styles.h3}>Is de aanvraag vrijblijvend?</h3>
        <p style={styles.p}>
          Ja, uw aanvraag is gratis en vrijblijvend. U zit nergens aan vast na het aanvragen van een verkoopvoorstel.
        </p>

        <h3 style={styles.h3}>Betaal ik notariskosten?</h3>
        <p style={styles.p}>
          Bij een passende verkoop nemen wij de standaard notariskosten voor de levering voor onze rekening. Eventuele afwijkende kosten of bijzondere afspraken bespreken we vooraf duidelijk.
        </p>

        <h2 style={styles.h2}>Meer informatie</h2>
        <ul style={styles.list}>
          <li><a href="/huis-direct-verkopen">Huis direct verkopen</a></li>
          <li><a href="/woning-verkopen-zonder-makelaar">Woning verkopen zonder makelaar</a></li>
          <li><a href="/huis-verkopen-binnen-24-uur">Huis verkopen binnen 24 uur</a></li>
          <li><a href="/opknapwoning-verkopen">Opknapwoning verkopen</a></li>
          <li><a href="/huis-verkopen-bij-erfenis">Huis verkopen bij erfenis</a></li>
          <li><a href="/verhuurde-woning-verkopen">Verhuurde woning verkopen</a></li>
          <li><a href="/huis-verkopen-groningen">Huis verkopen in Groningen</a></li>
        </ul>

        <div style={styles.darkCard}>
          <h2 style={{ ...styles.h2, color: "white", marginTop: 0 }}>Wilt u uw huis snel verkopen?</h2>
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
