import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen Groningen",
  description: "Huis of woning verkopen in Groningen zonder makelaar, open huis of verkoopstress? Vraag vrijblijvend een helder verkoopvoorstel aan.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-groningen",
  },
  openGraph: {
    title: "Huis verkopen Groningen",
    description: "Huis of woning verkopen in Groningen zonder makelaar, open huis of verkoopstress? Vraag vrijblijvend een helder verkoopvoorstel aan.",
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-groningen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  "slug": "/huis-verkopen-groningen",
  "breadcrumb": "Huis verkopen Groningen",
  "eyebrow": "Huis verkopen Groningen",
  "h1": "Huis verkopen in Groningen zonder makelaar of verkoopstress",
  "lead": "Wilt u uw huis of woning in Groningen verkopen en snel duidelijkheid krijgen zonder lang traditioneel verkooptraject?",
  "shortAnswer": "Vraag vrijblijvend een verkoopvoorstel aan voor uw woning in Groningen. Ook bij leegstand, onderhoud, verhuur, erfenis of scheiding kunt u rustig bespreken wat mogelijk is.",
  "benefits": [
    "Huis verkopen Groningen",
    "Huis verkopen Groningen",
    "Geen makelaarskosten",
    "Geen open huis nodig",
    "Vrijblijvend verkoopvoorstel",
    "Notariële afwikkeling"
  ],
  "sections": [
    {
      "title": "Huis verkopen Groningen: snel duidelijkheid",
      "paragraphs": [
        "Wilt u uw woning of huis in Groningen verkopen zonder lang traditioneel verkooptraject? Vastgoed Direct Nederland helpt woningeigenaren met een rustige en duidelijke verkoopoplossing.",
        "U vraagt vrijblijvend een verkoopvoorstel aan. Daarna bespreken wij uw situatie, de woning en de gewenste overdracht."
      ]
    },
    {
      "title": "Verkopen zonder makelaar in Groningen",
      "paragraphs": [
        "Een woning verkopen in Groningen hoeft niet altijd via een traditioneel makelaarstraject. Als u geen open huis, bezichtigingsrondes of makelaarskosten wilt, kunt u rechtstreeks een voorstel aanvragen.",
        "De aanvraag is vrijblijvend. U bepaalt zelf of het voorstel past bij uw situatie."
      ]
    },
    {
      "title": "Ook bij bijzondere situaties in Groningen",
      "bullets": [
        "Leegstaande woning",
        "Opknapwoning",
        "Woning met achterstallig onderhoud",
        "Erfeniswoning",
        "Verhuurde woning",
        "Woning bij scheiding",
        "Woning waarbij snel duidelijkheid gewenst is"
      ]
    },
    {
      "title": "Hoe werkt het?",
      "steps": [
        "U vult de woninggegevens in.",
        "Wij nemen contact met u op om de situatie rustig te bespreken.",
        "U ontvangt een vrijblijvend verkoopvoorstel met duidelijke voorwaarden.",
        "Bij akkoord wordt de overdracht via de notaris geregeld."
      ]
    },
    {
      "title": "Kosten en afwikkeling",
      "paragraphs": [
        "U betaalt geen makelaarskosten voor een aanvraag via Vastgoed Direct Nederland. Bij een passende verkoop nemen wij de standaard notariskosten voor de levering voor onze rekening.",
        "Een aanbetaling of voorschot kan in sommige situaties bespreekbaar zijn, mits dit juridisch en notarieel goed wordt vastgelegd."
      ]
    }
  ],
  "comparisonRows": [
    [
      "Makelaarskosten",
      "Vaak courtage of vast tarief",
      "Geen makelaarskosten"
    ],
    [
      "Bezichtigingen",
      "Vaak meerdere kijkers",
      "Niet standaard nodig"
    ],
    [
      "Snelheid",
      "Kan weken of maanden duren",
      "Snelle duidelijkheid mogelijk"
    ],
    [
      "Onderhoud",
      "Kan verkoop lastiger maken",
      "Ook deze woningen kunnen worden aangemeld"
    ],
    [
      "Opleverdatum",
      "Afhankelijk van koper",
      "In overleg bespreekbaar"
    ],
    [
      "Afwikkeling",
      "Afhankelijk van afspraken",
      "Bij akkoord via de notaris"
    ]
  ],
  "faqs": [
    {
      "question": "Kan ik mijn woning in Groningen verkopen zonder makelaar?",
      "answer": "Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel makelaarstraject."
    },
    {
      "question": "Kan ik mijn huis in Groningen snel verkopen?",
      "answer": "Snelle duidelijkheid is vaak mogelijk. De exacte planning hangt af van de woning, documenten, afspraken en notariële mogelijkheden."
    },
    {
      "question": "Is de aanvraag vrijblijvend?",
      "answer": "Ja, uw aanvraag is gratis en vrijblijvend. U zit nergens aan vast."
    },
    {
      "question": "Betaal ik makelaarskosten?",
      "answer": "Nee, u betaalt geen makelaarskosten voor een vrijblijvende aanvraag via Vastgoed Direct Nederland."
    }
  ],
  "ctaTitle": "Wilt u huis verkopen groningen?",
  "ctaText": "Vraag vrijblijvend een verkoopvoorstel aan en ontvang duidelijkheid over uw mogelijkheden.",
  "keywords": "huis verkopen Groningen, woning verkopen Groningen, huis snel verkopen Groningen"
};

export default function HuisVerkopenGroningenPage() {
  return <SeoLandingPage page={page} />;
}
