export const metadata = {
  title: "Huis verkopen in Groningen? Snel verkoopvoorstel | Vastgoed Direct Nederland",
  description:
    "Wilt u uw huis verkopen in Groningen zonder makelaar of verkoopstress? Vraag vrijblijvend een helder verkoopvoorstel aan.",
};

export default function HuisVerkopenGroningen() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Kan ik mijn huis in Groningen verkopen zonder makelaar?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel verkooptraject met een makelaar.",
        },
      },
      {
        "@type": "Question",
        name: "Kan ik ook een opknapwoning in Groningen aanmelden?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Ja, ook woningen met achterstallig onderhoud, schade, leegstand of renovatiebehoefte kunnen worden aangemeld.",
        },
      },
      {
        "@type": "Question",
        name: "Is een snelle overdracht mogelijk?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Een snelle overdracht is in overleg mogelijk. De exacte planning hangt af van de woning, afspraken en notariële mogelijkheden.",
        },
      },
    ],
  };

  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#f7f5f0", color: "#0a2540" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section style={{ maxWidth: "920px", margin: "0 auto", padding: "70px 20px" }}>
        <a href="/">
          <img
            src="/logo.png"
            alt="Vastgoed Direct Nederland"
            style={{ width: "230px", maxWidth: "100%", marginBottom: "40px" }}
          />
        </a>

        <p style={{ color: "#ff6a00", fontWeight: "900", textTransform: "uppercase" }}>
          Huis verkopen Groningen
        </p>

        <h1 style={{ fontSize: "46px", lineHeight: "1.05", marginBottom: "22px" }}>
          Huis verkopen in Groningen zonder makelaar of verkoopstress
        </h1>

        <p style={{ fontSize: "20px", lineHeight: "1.7", color: "#536273" }}>
          Wilt u uw woning in Groningen snel verkopen en duidelijkheid krijgen zonder traditioneel
          verkooptraject? Vastgoed Direct Nederland helpt woningeigenaren met een directe
          verkoopoplossing, heldere afspraken en notariële afwikkeling.
        </p>

        <a
          href="/#aanvraag"
          style={{
            display: "inline-block",
            marginTop: "30px",
            background: "#ff6a00",
            color: "white",
            padding: "16px 28px",
            borderRadius: "999px",
            fontWeight: "900",
            textDecoration: "none",
          }}
        >
          Vraag gratis verkoopvoorstel aan
        </a>

        <hr style={{ margin: "55px 0", border: "none", borderTop: "1px solid #ddd" }} />

        <h2>Wanneer is direct verkopen in Groningen interessant?</h2>
        <p style={{ lineHeight: "1.8", fontSize: "18px" }}>
          Een woning verkopen via de traditionele route kan tijd kosten. In sommige situaties wilt u
          liever snel duidelijkheid, zonder open huis, makelaarskosten of lange onderhandelingen.
          Dat kan bijvoorbeeld spelen bij leegstand, achterstallig onderhoud, een erfeniswoning,
          verhuur, scheiding of financiële druk.
        </p>

        <h2>Voor welke woningen in Groningen?</h2>
        <ul style={{ lineHeight: "2", fontSize: "18px" }}>
          <li>Rijtjeshuizen en eengezinswoningen</li>
          <li>Appartementen</li>
          <li>Opknapwoningen</li>
          <li>Verhuurde woningen</li>
          <li>Erfeniswoningen</li>
          <li>Leegstaande woningen</li>
          <li>Woningen met achterstallig onderhoud</li>
        </ul>

        <h2>Voordelen van een directe verkoopoplossing</h2>
        <ul style={{ lineHeight: "2", fontSize: "18px" }}>
          <li>Geen makelaarskosten</li>
          <li>Geen open huis of tientallen bezichtigingen</li>
          <li>Vrijblijvend verkoopvoorstel</li>
          <li>Notariële afwikkeling met duidelijke afspraken</li>
          <li>Standaard notariskosten voor levering voor onze rekening bij passende verkoop</li>
          <li>Opleverdatum in overleg bespreekbaar</li>
        </ul>

        <h2>Hoe werkt het?</h2>
        <ol style={{ lineHeight: "2", fontSize: "18px" }}>
          <li>U vult uw woninggegevens in via het formulier.</li>
          <li>Wij nemen contact met u op om uw situatie te bespreken.</li>
          <li>U ontvangt een vrijblijvend verkoopvoorstel met duidelijke voorwaarden.</li>
          <li>Bij akkoord wordt de overdracht via de notaris geregeld.</li>
        </ol>

        <h2>Veelgestelde vragen over huis verkopen in Groningen</h2>

        <h3>Kan ik mijn huis in Groningen verkopen zonder makelaar?</h3>
        <p style={{ lineHeight: "1.8", fontSize: "18px" }}>
          Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel
          verkooptraject met een makelaar.
        </p>

        <h3>Kan ik ook een opknapwoning in Groningen aanmelden?</h3>
        <p style={{ lineHeight: "1.8", fontSize: "18px" }}>
          Ja, ook woningen met achterstallig onderhoud, schade, leegstand of renovatiebehoefte
          kunnen worden aangemeld.
        </p>

        <h3>Is een snelle overdracht mogelijk?</h3>
        <p style={{ lineHeight: "1.8", fontSize: "18px" }}>
          Een snelle overdracht is in overleg mogelijk. De exacte planning hangt af van de woning,
          afspraken en notariële mogelijkheden.
        </p>

        <h2>Meer informatie</h2>
        <ul style={{ lineHeight: "2", fontSize: "18px" }}>
          <li><a href="/huis-direct-verkopen">Huis direct verkopen</a></li>
          <li><a href="/huis-snel-verkopen">Huis snel verkopen</a></li>
          <li><a href="/woning-verkopen-zonder-makelaar">Woning verkopen zonder makelaar</a></li>
          <li><a href="/opknapwoning-verkopen">Opknapwoning verkopen</a></li>
          <li><a href="/huis-verkopen-bij-erfenis">Huis verkopen bij erfenis</a></li>
          <li><a href="/verhuurde-woning-verkopen">Verhuurde woning verkopen</a></li>
        </ul>

        <div
          style={{
            marginTop: "45px",
            padding: "32px",
            background: "#0a2540",
            color: "white",
            borderRadius: "28px",
          }}
        >
          <h2 style={{ color: "white", marginTop: 0 }}>Wilt u uw huis in Groningen verkopen?</h2>
          <p style={{ fontSize: "18px", lineHeight: "1.7" }}>
            Vraag vrijblijvend een verkoopvoorstel aan en ontvang snel duidelijkheid over uw mogelijkheden.
          </p>

          <a
            href="/#aanvraag"
            style={{
              display: "inline-block",
              marginTop: "15px",
              background: "#ff6a00",
              color: "white",
              padding: "16px 28px",
              borderRadius: "999px",
              fontWeight: "900",
              textDecoration: "none",
            }}
          >
            Start gratis aanvraag
          </a>
        </div>
      </section>
    </main>
  );
}
