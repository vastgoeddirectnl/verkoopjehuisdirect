import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Woning verkopen zonder makelaar",
  description: "Woning verkopen zonder makelaar, courtage of verkoopstress? Vraag vrijblijvend een helder verkoopvoorstel aan.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/woning-verkopen-zonder-makelaar",
  },
  openGraph: {
    title: "Woning verkopen zonder makelaar",
    description: "Woning verkopen zonder makelaar, courtage of verkoopstress? Vraag vrijblijvend een helder verkoopvoorstel aan.",
    url: "https://www.verkoopjehuisdirect.nl/woning-verkopen-zonder-makelaar",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  "slug": "/woning-verkopen-zonder-makelaar",
  "breadcrumb": "Woning verkopen zonder makelaar",
  "eyebrow": "Woning verkopen zonder makelaar",
  "h1": "Woning verkopen zonder makelaar of courtage",
  "lead": "Wilt u uw woning verkopen zonder makelaar, courtage of traditioneel verkooptraject? Dan kunt u rechtstreeks een vrijblijvend verkoopvoorstel aanvragen.",
  "shortAnswer": "Woning verkopen zonder makelaar, courtage of verkoopstress? U kunt vrijblijvend een helder verkoopvoorstel aan.",
  "benefits": [
    "Woning verkopen zonder makelaar",
    "Geen makelaarskosten",
    "Geen open huis nodig",
    "Vrijblijvend verkoopvoorstel",
    "Duidelijke voorwaarden",
    "Notariële afwikkeling"
  ],
  "sections": [
    {
      "title": "Woning verkopen zonder makelaar: wanneer is dit interessant?",
      "paragraphs": [
        "Wilt u uw woning verkopen zonder makelaar, courtage of traditioneel verkooptraject? Dan kunt u rechtstreeks een vrijblijvend verkoopvoorstel aanvragen.",
        "Een directe verkoopoplossing kan passend zijn wanneer u snel duidelijkheid wilt, geen lang verkooptraject wilt of de woning niet eerst verkoopklaar wilt maken."
      ]
    },
    {
      "title": "Zonder traditioneel verkooptraject",
      "paragraphs": [
        "U hoeft niet altijd te kiezen voor een verkooptraject met meerdere bezichtigingen, open huis of lange onderhandelingen.",
        "Bij Vastgoed Direct Nederland vraagt u vrijblijvend een helder verkoopvoorstel aan. Daarna beslist u rustig of het voorstel bij uw situatie past."
      ]
    },
    {
      "title": "Voor welke situaties?",
      "bullets": [
        "Woning verkopen zonder makelaar",
        "Leegstand",
        "Achterstallig onderhoud",
        "Opknapwoning",
        "Erfenis",
        "Scheiding",
        "Verhuur",
        "Snel duidelijkheid gewenst"
      ]
    },
    {
      "title": "Hoe werkt het?",
      "steps": [
        "U vult uw woninggegevens in.",
        "Wij bespreken uw situatie en gewenste snelheid.",
        "U ontvangt een vrijblijvend verkoopvoorstel.",
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
      "question": "Kan ik mijn woning verkopen zonder een makelaar in te schakelen?",
      "answer": "Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel makelaarstraject."
    },
    {
      "question": "Is de aanvraag vrijblijvend?",
      "answer": "Ja, uw aanvraag is gratis en vrijblijvend. U zit nergens aan vast."
    },
    {
      "question": "Moet de woning verkoopklaar zijn?",
      "answer": "Niet altijd. Ook woningen met onderhoud, leegstand of renovatiebehoefte kunnen worden aangemeld."
    },
    {
      "question": "Betaal ik makelaarskosten?",
      "answer": "Nee, u betaalt geen makelaarskosten voor een vrijblijvende aanvraag via Vastgoed Direct Nederland."
    }
  ],
  "ctaTitle": "Wilt u woning verkopen zonder makelaar?",
  "ctaText": "Vraag vrijblijvend een verkoopvoorstel aan en ontvang duidelijkheid over uw mogelijkheden.",
  "keywords": "woning verkopen zonder makelaar, huis verkopen zonder makelaar, zonder courtage"
};

export default function WoningVerkopenZonderMakelaarPage() {
  return <SeoLandingPage page={page} />;
}
