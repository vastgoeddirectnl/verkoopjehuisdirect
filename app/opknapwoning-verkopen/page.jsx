import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Opknapwoning verkopen? Zonder renovatie of makelaar",
  description: "Opknapwoning, klushuis of woning met achterstallig onderhoud verkopen zonder eerst te renoveren? Vraag vrijblijvend een verkoopvoorstel aan.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/opknapwoning-verkopen",
  },
  openGraph: {
    title: "Opknapwoning verkopen? Zonder renovatie of makelaar",
    description: "Opknapwoning, klushuis of woning met achterstallig onderhoud verkopen zonder eerst te renoveren? Vraag vrijblijvend een verkoopvoorstel aan.",
    url: "https://www.verkoopjehuisdirect.nl/opknapwoning-verkopen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  "slug": "/opknapwoning-verkopen",
  "breadcrumb": "Opknapwoning verkopen",
  "eyebrow": "Opknapwoning verkopen",
  "h1": "Opknapwoning verkopen zonder renovatie of verkoopstress",
  "lead": "Wilt u een opknapwoning, klushuis of woning met achterstallig onderhoud verkopen zonder eerst te verbouwen, herstellen of verkoopklaar te maken? Vastgoed Direct Nederland helpt met een directe verkoopoplossing en duidelijke voorwaarden.",
  "shortAnswer": "U hoeft een opknapwoning niet eerst te renoveren voordat u een verkoopvoorstel aanvraagt. Ook een klushuis, verouderd huis of woning met schade en achterstallig onderhoud kan vrijblijvend worden aangemeld.",
  "benefits": [
    "Opknapwoning verkopen",
    "Klushuis verkopen",
    "Geen renovatie vooraf nodig",
    "Geen makelaarskosten",
    "Geen open huis nodig",
    "Oplevering in overleg"
  ],
  "sections": [
    {
      "title": "Opknapwoning of klushuis verkopen",
      "paragraphs": [
        "Een opknapwoning verkoopklaar maken kan veel tijd en geld kosten. Denk aan schilderwerk, herstel van schade, opruimen, verouderde installaties of andere verbeteringen.",
        "Als u die kosten of inspanning niet wilt maken, kan een directe verkoopoplossing interessant zijn."
      ]
    },
    {
      "title": "Woning verkopen zonder renovatie",
      "paragraphs": [
        "Veel verkopers willen weten of ze een woning kunnen verkopen zonder renovatie. In veel situaties is dat bespreekbaar.",
        "Wij kijken naar de huidige staat van de woning, uw gewenste snelheid en voorwaarden die juridisch en notarieel goed kunnen worden vastgelegd."
      ]
    },
    {
      "title": "Welke woningen kunnen worden aangemeld?",
      "bullets": [
        "Opknapwoningen",
        "Klushuizen",
        "Woningen met achterstallig onderhoud",
        "Woningen met schade",
        "Verouderde woningen",
        "Erfeniswoningen die opgeknapt moeten worden"
      ]
    },
    {
      "title": "Oplevering in huidige staat",
      "paragraphs": [
        "In veel situaties kan oplevering in huidige staat bespreekbaar zijn. Dat betekent dat u niet altijd hoeft te verbouwen, leeg te halen of perfect te presenteren.",
        "De exacte afspraken hangen af van de woning, de staat, uw wensen en wat juridisch en notarieel goed kan worden vastgelegd."
      ]
    },
    {
      "title": "Hoe werkt het?",
      "steps": [
        "U meldt de opknapwoning vrijblijvend aan.",
        "Wij bespreken de staat van de woning en uw gewenste snelheid.",
        "U ontvangt een verkoopvoorstel met duidelijke voorwaarden.",
        "Bij akkoord wordt de overdracht via de notaris geregeld."
      ]
    },
    {
      "title": "Kosten, notariskosten en aanbetaling",
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
      "question": "Kan ik een opknapwoning verkopen zonder renovatie?",
      "answer": "Ja, u hoeft uw woning niet eerst te renoveren. Ook woningen met achterstallig onderhoud, schade of renovatiebehoefte kunnen worden aangemeld."
    },
    {
      "question": "Kan ik een klushuis verkopen?",
      "answer": "Ja, een klushuis of verouderde woning kan vrijblijvend worden aangemeld voor een verkoopvoorstel."
    },
    {
      "question": "Kan ik verkopen zonder makelaar?",
      "answer": "Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel verkooptraject met een makelaar."
    },
    {
      "question": "Is oplevering in huidige staat mogelijk?",
      "answer": "In veel situaties is oplevering in huidige staat bespreekbaar, afhankelijk van de woning en gemaakte afspraken."
    },
    {
      "question": "Is de aanvraag vrijblijvend?",
      "answer": "Ja, uw aanvraag is gratis en vrijblijvend. U zit nergens aan vast."
    }
  ],
  "ctaTitle": "Wilt u uw opknapwoning verkopen?",
  "ctaText": "Vraag vrijblijvend een verkoopvoorstel aan zonder eerst te renoveren of verkoopklaar te maken."
};

export default function OpknapwoningVerkopen() {
  return <SeoLandingPage page={page} />;
}
