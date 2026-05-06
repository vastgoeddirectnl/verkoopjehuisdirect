export const metadata = {
  title: "Privacyverklaring | Vastgoed Direct Nederland",
  description:
    "Lees hoe Vastgoed Direct Nederland omgaat met persoonsgegevens die via de website, telefoon, e-mail of WhatsApp worden gedeeld.",
};

export default function Privacyverklaring() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#f7f5f0", color: "#0a2540" }}>
      <section style={{ maxWidth: "920px", margin: "0 auto", padding: "70px 20px" }}>
        <a href="/">
          <img
            src="/logo.png"
            alt="Vastgoed Direct Nederland"
            style={{ width: "240px", maxWidth: "100%", marginBottom: "40px" }}
          />
        </a>

        <p style={{ color: "#ff6a00", fontWeight: "900", textTransform: "uppercase" }}>
          Privacy
        </p>

        <h1 style={{ fontSize: "48px", lineHeight: "1.05", marginBottom: "18px" }}>
          Privacyverklaring
        </h1>

        <p style={{ color: "#647386", fontSize: "16px" }}>
          Laatst bijgewerkt: 5 mei 2026
        </p>

        <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#536273" }}>
          Vastgoed Direct Nederland hecht veel waarde aan de bescherming van uw persoonsgegevens.
          In deze privacyverklaring leggen wij uit welke gegevens wij verzamelen, waarom wij dit
          doen en hoe wij hiermee omgaan.
        </p>

        <hr style={{ margin: "45px 0", border: "none", borderTop: "1px solid #ddd" }} />

        <h2>1. Wie zijn wij?</h2>
        <p style={{ lineHeight: "1.8", fontSize: "18px" }}>
          Vastgoed Direct Nederland is verantwoordelijk voor de verwerking van persoonsgegevens
          zoals weergegeven in deze privacyverklaring.
        </p>

        <h2>2. Welke gegevens verzamelen wij?</h2>
        <p style={{ lineHeight: "1.8", fontSize: "18px" }}>
          Wanneer u gebruikmaakt van onze website, een aanvraag indient of contact met ons opneemt,
          kunnen wij de volgende gegevens verwerken:
        </p>

        <ul style={{ lineHeight: "2", fontSize: "18px" }}>
          <li>Naam</li>
          <li>E-mailadres</li>
          <li>Telefoonnummer</li>
          <li>Postcode en huisnummer</li>
          <li>Informatie over uw woning en situatie</li>
          <li>Overige gegevens die u zelf met ons deelt via formulier, e-mail, telefoon of WhatsApp</li>
        </ul>

        <h2>3. Waarom verwerken wij deze gegevens?</h2>
        <p style={{ lineHeight: "1.8", fontSize: "18px" }}>
          Wij gebruiken uw gegevens om:
        </p>

        <ul style={{ lineHeight: "2", fontSize: "18px" }}>
          <li>contact met u op te nemen over uw aanvraag;</li>
          <li>uw woning en situatie te beoordelen;</li>
          <li>een vrijblijvend verkoopvoorstel te bespreken;</li>
          <li>afspraken te maken en uit te voeren;</li>
          <li>onze dienstverlening en website te verbeteren.</li>
        </ul>

        <h2>4. Grondslag van verwerking</h2>
        <p style={{ lineHeight: "1.8", fontSize: "18px" }}>
          Wij verwerken persoonsgegevens op basis van uw toestemming, de voorbereiding of uitvoering
          van een overeenkomst, wettelijke verplichtingen en ons gerechtvaardigd belang om onze
          dienstverlening goed uit te voeren.
        </p>

        <h2>5. Delen van gegevens met derden</h2>
        <p style={{ lineHeight: "1.8", fontSize: "18px" }}>
          Wij delen uw gegevens alleen met derden wanneer dit noodzakelijk is voor onze dienstverlening,
          bijvoorbeeld met notarissen, adviseurs, technische dienstverleners of betrokken partijen bij
          een mogelijke verkoopoplossing. Wij verkopen uw persoonsgegevens niet aan derden.
        </p>

        <h2>6. Bewaartermijn</h2>
        <p style={{ lineHeight: "1.8", fontSize: "18px" }}>
          Wij bewaren uw persoonsgegevens niet langer dan noodzakelijk voor de doeleinden waarvoor
          ze zijn verzameld, tenzij wij wettelijk verplicht zijn gegevens langer te bewaren.
        </p>

        <h2>7. Beveiliging</h2>
        <p style={{ lineHeight: "1.8", fontSize: "18px" }}>
          Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te
          beschermen tegen verlies, misbruik, onbevoegde toegang en ongeoorloofde wijziging.
        </p>

        <h2>8. Cookies</h2>
        <p style={{ lineHeight: "1.8", fontSize: "18px" }}>
          Onze website kan gebruikmaken van functionele en analytische cookies om de website goed
          te laten werken en inzicht te krijgen in het gebruik ervan.
        </p>

        <h2>9. Uw rechten</h2>
        <p style={{ lineHeight: "1.8", fontSize: "18px" }}>
          U heeft het recht om uw persoonsgegevens in te zien, te corrigeren, te laten verwijderen,
          bezwaar te maken tegen verwerking of uw toestemming in te trekken. Neem hiervoor contact
          met ons op via onderstaande contactgegevens.
        </p>

        <h2>10. Contact</h2>
        <p style={{ lineHeight: "1.8", fontSize: "18px" }}>
          Heeft u vragen over deze privacyverklaring of over de verwerking van uw persoonsgegevens?
          Neem dan contact met ons op:
        </p>

        <div
          style={{
            marginTop: "25px",
            padding: "28px",
            background: "#fff",
            border: "1px solid #e6e2db",
            borderRadius: "24px",
          }}
        >
          <p><strong>Vastgoed Direct Nederland</strong></p>
          <p>E-mail: info@verkoopjehuisdirect.nl</p>
          <p>Telefoon: 06 12 23 80 51</p>
          <p>Website: www.verkoopjehuisdirect.nl</p>
        </div>

        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: "35px",
            background: "#0a2540",
            color: "white",
            padding: "16px 28px",
            borderRadius: "999px",
            fontWeight: "900",
            textDecoration: "none",
          }}
        >
          Terug naar homepage
        </a>
      </section>
    </main>
  );
}
