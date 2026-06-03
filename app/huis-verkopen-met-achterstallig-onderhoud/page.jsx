import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen met achterstallig onderhoud?",
  description: "Huis verkopen met achterstallig onderhoud, schade of verouderde staat zonder eerst te renoveren? Vraag vrijblijvend een verkoopvoorstel aan.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/huis-verkopen-met-achterstallig-onderhoud",
  },
  openGraph: {
    title: "Huis verkopen met achterstallig onderhoud?",
    description: "Huis verkopen met achterstallig onderhoud, schade of verouderde staat zonder eerst te renoveren? Vraag vrijblijvend een verkoopvoorstel aan.",
    url: "https://www.verkoopjehuisdirect.nl/huis-verkopen-met-achterstallig-onderhoud",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  "slug": "/huis-verkopen-met-achterstallig-onderhoud",
  "breadcrumb": "Huis verkopen met achterstallig onderhoud",
  "eyebrow": "Achterstallig onderhoud",
  "h1": "Huis verkopen met achterstallig onderhoud zonder eerst te renoveren",
  "lead": "Wilt u een woning verkopen met achterstallig onderhoud, verouderde installaties, schade of renovatiebehoefte? Vastgoed Direct Nederland helpt met een vrijblijvende verkoopoplossing zonder dat u eerst grote kosten hoeft te maken.",
  "shortAnswer": "U hoeft een huis met achterstallig onderhoud niet altijd eerst te renoveren voordat u duidelijkheid krijgt. Ook een verouderd huis, beschadigde woning of opknapwoning kan vrijblijvend worden aangemeld.",
  "benefits": [
    "Achterstallig onderhoud",
    "Geen renovatie vooraf nodig",
    "Ook bij slechte staat",
    "Geen makelaarskosten",
    "Geen open huis nodig",
    "Oplevering in overleg"
  ],
  "sections": [
    {
      "title": "Huis verkopen met achterstallig onderhoud",
      "paragraphs": [
        "Achterstallig onderhoud kan een traditionele verkoop lastiger maken. Kopers kunnen afhaken of extra onderhandelen, terwijl u eerst kosten moet maken voor herstel, presentatie of verkoopstyling.",
        "Als u niet wilt investeren in renovatie of herstelwerk, kan een directe verkoopoplossing interessant zijn."
      ]
    },
    {
      "title": "Verouderd huis verkopen zonder renovatie",
      "paragraphs": [
        "Een verouderd huis verkopen zonder renovatie is in veel situaties bespreekbaar. Denk aan een woning met oude keuken, badkamer, installaties, schilderwerk of onderhoudspunten.",
        "Wij kijken naar de huidige staat en bespreken welke verkoopoplossing past zonder dat u vooraf grote kosten hoeft te maken."
      ]
    },
    {
      "title": "Voor welke woningen?",
      "bullets": [
        "Woningen met achterstallig schilderwerk",
        "Woningen met verouderde keuken of badkamer",
        "Woningen met lekkage of schade",
        "Woningen met verouderde installaties",
        "Opknapwoningen",
        "Erfeniswoningen met onderhoud"
      ]
    },
    {
      "title": "Oplevering in huidige staat",
      "paragraphs": [
        "In veel situaties kan oplevering in huidige staat bespreekbaar zijn. Dat betekent dat u niet altijd eerst hoeft te herstellen, verbouwen of verkoopklaar te maken.",
        "De exacte afspraken hangen af van de woning, de staat en wat juridisch en notarieel goed kan worden vastgelegd."
      ]
    },
    {
      "title": "Hoe werkt het?",
      "steps": [
        "U meldt de woning vrijblijvend aan.",
        "Wij bespreken de staat van de woning en uw gewenste snelheid.",
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
      "question": "Kan ik een huis met achterstallig onderhoud verkopen?",
      "answer": "Ja, ook woningen met achterstallig onderhoud, schade of renovatiebehoefte kunnen worden aangemeld."
    },
    {
      "question": "Kan ik een verouderd huis verkopen zonder renovatie?",
      "answer": "Ja, dat kan in veel situaties bespreekbaar zijn. U hoeft niet altijd eerst te renoveren om een voorstel aan te vragen."
    },
    {
      "question": "Kan ik verkopen zonder makelaar?",
      "answer": "Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel verkooptraject met een makelaar."
    },
    {
      "question": "Is oplevering in huidige staat mogelijk?",
      "answer": "In veel situaties is oplevering in huidige staat bespreekbaar, afhankelijk van de woning en de gemaakte afspraken."
    },
    {
      "question": "Is de aanvraag vrijblijvend?",
      "answer": "Ja, uw aanvraag is gratis en vrijblijvend. U zit nergens aan vast."
    }
  ],
  "ctaTitle": "Wilt u een huis met achterstallig onderhoud verkopen?",
  "ctaText": "Vraag vrijblijvend een verkoopvoorstel aan zonder eerst te renoveren of verkoopklaar te maken."
};

export default function HuisVerkopenMetAchterstalligOnderhoud() {
  return <SeoLandingPage page={page} />;
}
