export const metadata = {
  title: "Huis snel verkopen? Binnen 24 uur bod | Vastgoed Direct Nederland",
  description:
    "Wilt u uw huis snel verkopen zonder makelaar? Vastgoed Direct Nederland koopt woningen direct, ook bij schade, verhuur of achterstallig onderhoud.",
};

export default function HuisSnelVerkopen() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#f7f5f0", color: "#0a2540" }}>
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "70px 20px" }}>
        <img
          src="/logo.png"
          alt="Vastgoed Direct Nederland"
          style={{ width: "240px", marginBottom: "40px" }}
        />

        <h1 style={{ fontSize: "48px", lineHeight: "1.05", marginBottom: "20px" }}>
          Huis snel verkopen zonder makelaar
        </h1>

        <p style={{ fontSize: "20px", lineHeight: "1.7", color: "#536273" }}>
          Wilt u uw huis snel verkopen zonder lange wachttijd, makelaarskosten of bezichtigingen?
          Vastgoed Direct Nederland helpt woningeigenaren die snel duidelijkheid willen.
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
          Vraag gratis bod aan
        </a>

        <hr style={{ margin: "50px 0", border: "none", borderTop: "1px solid #ddd" }} />

        <h2>Waarom uw huis direct verkopen?</h2>
        <p>
          Soms wilt u niet maanden wachten op een koper. Bijvoorbeeld bij een erfenis, scheiding,
          financiële situatie, verhuurde woning of woning met achterstallig onderhoud.
        </p>

        <h2>Voordelen van direct verkopen</h2>
        <ul style={{ lineHeight: "2" }}>
          <li>Binnen 24 uur reactie</li>
          <li>Geen makelaar nodig</li>
          <li>Geen bezichtigingen met tientallen kijkers</li>
          <li>Ook woningen in slechte staat</li>
          <li>Vrijblijvend voorstel</li>
        </ul>

        <h2>Ook bij schade of renovatie</h2>
        <p>
          Wij kijken ook naar woningen die niet verkoopklaar zijn. Denk aan opknapwoningen,
          leegstaande huizen, verhuurde woningen of woningen met schade.
        </p>

        <h2>Gratis bod aanvragen</h2>
        <p>
          Vul het formulier in en wij nemen zo snel mogelijk contact met u op voor een vrijblijvend
          verkoopvoorstel.
        </p>

        <a
          href="/#aanvraag"
          style={{
            display: "inline-block",
            marginTop: "20px",
            background: "#0a2540",
            color: "white",
            padding: "16px 28px",
            borderRadius: "999px",
            fontWeight: "900",
            textDecoration: "none",
          }}
        >
          Start aanvraag
        </a>
      </section>
    </main>
  );
}
