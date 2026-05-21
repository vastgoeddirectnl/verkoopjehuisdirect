import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Leegstaand huis verkopen? Snel duidelijkheid",
  description: "Wilt u een leegstaand huis verkopen zonder makelaar, open huis of verkoopstress? Vraag vrijblijvend een verkoopvoorstel aan.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/leegstaand-huis-verkopen",
  },
  openGraph: {
    title: "Leegstaand huis verkopen? Snel duidelijkheid",
    description: "Een leegstaand huis brengt kosten en zorgen met zich mee. Vraag vrijblijvend een verkoopvoorstel aan.",
    url: "https://www.verkoopjehuisdirect.nl/leegstaand-huis-verkopen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  "slug": "/leegstaand-huis-verkopen",
  "breadcrumb": "Leegstaand huis verkopen",
  "eyebrow": "Leegstaand huis verkopen",
  "h1": "Leegstaand huis verkopen zonder langdurig verkooptraject",
  "lead": "Een leegstaand huis kan zorgen geven: dubbele lasten, onderhoud, verzekering, veiligheid en onzekerheid. Vastgoed Direct Nederland helpt met een vrijblijvende verkoopoplossing en duidelijke voorwaarden.",
  "shortAnswer": "Een leegstaand huis verkopen kan ook zonder traditioneel verkooptraject met makelaar, open huis of langdurige bezichtigingen. U vraagt vrijblijvend een verkoopvoorstel aan en bespreekt wat mogelijk is.",
  "benefits": [
    "Snel duidelijkheid",
    "Geen open huis nodig",
    "Geen makelaarskosten",
    "Ook bij onderhoud",
    "Oplevering in overleg",
    "Vrijblijvend voorstel"
  ],
  "sections": [
    {
      "title": "Waarom een leegstaand huis verkopen?",
      "paragraphs": [
        "Een leegstaande woning brengt vaak kosten en risico’s met zich mee. Denk aan hypotheeklasten, energie, verzekering, gemeentelijke lasten, onderhoud en beveiliging.",
        "Als u geen lang verkooptraject wilt doorlopen, kan een directe verkoopoplossing rust en duidelijkheid geven."
      ]
    },
    {
      "title": "Voor welke situaties?",
      "bullets": [
        "Leegstaande woning door verhuizing",
        "Erfeniswoning die leegstaat",
        "Woning met dubbele lasten",
        "Woning die onderhoud nodig heeft",
        "Leegstaand appartement",
        "Woning die niet verkoopklaar is",
        "Woning waarbij snelle duidelijkheid gewenst is"
      ]
    },
    {
      "title": "Geen open huis nodig",
      "paragraphs": [
        "Bij een leegstaande woning kan een traditioneel traject met styling, foto’s en bezichtigingen veel tijd kosten. Soms moet de woning eerst worden opgeruimd of opgeknapt.",
        "Wij kijken naar de woning en uw situatie en bespreken rechtstreeks een mogelijke verkoopoplossing."
      ]
    },
    {
      "title": "Hoe werkt het?",
      "steps": [
        "U meldt de leegstaande woning vrijblijvend aan.",
        "Wij bespreken de staat, situatie en gewenste snelheid.",
        "U ontvangt een verkoopvoorstel met duidelijke voorwaarden.",
        "Bij akkoord wordt de overdracht via de notaris geregeld."
      ]
    },
    {
      "title": "Kosten, notaris en aanbetaling",
      "paragraphs": [
        "U betaalt geen makelaarskosten voor een aanvraag via Vastgoed Direct Nederland. Bij een passende verkoop nemen wij de standaard notariskosten voor de levering voor onze rekening.",
        "In sommige situaties is een aanbetaling of voorschot bespreekbaar, mits dit juridisch en notarieel goed kan worden vastgelegd."
      ]
    }
  ],
  "comparisonRows": [
    [
      "Leegstandskosten",
      "Lopen vaak door",
      "Sneller duidelijkheid over verkoop"
    ],
    [
      "Voorbereiding",
      "Vaak opruimen en verkoopklaar maken",
      "Niet altijd noodzakelijk"
    ],
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
      "Opleverdatum",
      "Afhankelijk van koper",
      "In overleg bespreekbaar"
    ],
    [
      "Notariële afwikkeling",
      "Afhankelijk van afspraken",
      "Bij akkoord via de notaris"
    ]
  ],
  "faqs": [
    {
      "question": "Kan ik een leegstaand huis verkopen zonder makelaar?",
      "answer": "Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel verkooptraject met een makelaar."
    },
    {
      "question": "Moet de woning eerst worden opgeruimd?",
      "answer": "Niet altijd. Oplevering in huidige staat of in overleg kan bespreekbaar zijn, afhankelijk van de woning en afspraken."
    },
    {
      "question": "Kan een leegstaande woning met onderhoud worden aangemeld?",
      "answer": "Ja, ook woningen met achterstallig onderhoud, schade of renovatiebehoefte kunnen worden aangemeld."
    },
    {
      "question": "Is snelle overdracht mogelijk?",
      "answer": "Een snelle overdracht is in overleg mogelijk. De exacte planning hangt af van documenten, afspraken en notariële mogelijkheden."
    },
    {
      "question": "Kan dit zonder makelaar?",
      "answer": "Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel verkooptraject met een makelaar."
    },
    {
      "question": "Betaal ik makelaarskosten?",
      "answer": "Nee, u betaalt geen makelaarskosten voor een vrijblijvende aanvraag via Vastgoed Direct Nederland."
    },
    {
      "question": "Is de aanvraag vrijblijvend?",
      "answer": "Ja, uw aanvraag is gratis en vrijblijvend. U zit nergens aan vast."
    }
  ],
  "ctaTitle": "Wilt u een leegstaand huis verkopen?",
  "ctaText": "Vraag vrijblijvend een verkoopvoorstel aan en ontvang duidelijkheid over uw mogelijkheden."
};

export default function LeegstaandHuisVerkopen() {
  return <SeoLandingPage page={page} />;
}
