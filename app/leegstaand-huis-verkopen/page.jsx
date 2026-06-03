import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Leegstaand huis verkopen? Snel duidelijkheid",
  description: "Leegstaand huis of leegstaande woning verkopen zonder makelaar, open huis of verkoopstress? Vraag vrijblijvend een verkoopvoorstel aan.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/leegstaand-huis-verkopen",
  },
  openGraph: {
    title: "Leegstaand huis verkopen? Snel duidelijkheid",
    description: "Leegstaand huis of leegstaande woning verkopen zonder makelaar, open huis of verkoopstress? Vraag vrijblijvend een verkoopvoorstel aan.",
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
    "Leegstaand huis verkopen",
    "Leegstaande woning verkopen",
    "Snel duidelijkheid",
    "Geen open huis nodig",
    "Geen makelaarskosten",
    "Oplevering in overleg"
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
      "title": "Leegstaande woning verkopen zonder open huis",
      "paragraphs": [
        "Bij een leegstaande woning kan een traditioneel traject met styling, foto’s en bezichtigingen veel tijd kosten.",
        "Wij kijken naar de woning en uw situatie en bespreken rechtstreeks een mogelijke verkoopoplossing."
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
        "Woning die niet verkoopklaar is"
      ]
    },
    {
      "title": "Interne link met andere situaties",
      "paragraphs": [
        "Leegstand komt vaak voor bij een erfeniswoning, scheiding, verhuizing of woning met achterstallig onderhoud.",
        "Daarom kan deze verkooproute goed passen wanneer u geen tijd of budget wilt besteden aan verkoopstyling, renovatie of meerdere bezichtigingen."
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
      "title": "Kosten, notaris en oplevering",
      "paragraphs": [
        "U betaalt geen makelaarskosten voor een aanvraag via Vastgoed Direct Nederland. Bij een passende verkoop nemen wij de standaard notariskosten voor de levering voor onze rekening.",
        "Oplevering in huidige staat of op een afgesproken datum kan bespreekbaar zijn."
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
      "Opleverdatum",
      "Afhankelijk van koper",
      "In overleg bespreekbaar"
    ],
    [
      "Notariële afwikkeling",
      "Afhankelijk van afspraken",
      "Bij akkoord via notaris"
    ]
  ],
  "faqs": [
    {
      "question": "Kan ik een leegstaand huis verkopen zonder makelaar?",
      "answer": "Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel verkooptraject met een makelaar."
    },
    {
      "question": "Moet de woning eerst worden opgeruimd?",
      "answer": "Niet altijd. Oplevering in huidige staat of in overleg kan bespreekbaar zijn."
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
