import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Leegstaand huis verkopen",
  description: "Leegstaand huis of leegstaande woning verkopen zonder makelaar, open huis of verkoopstress? Vraag vrijblijvend een voorstel aan.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/leegstaand-huis-verkopen",
  },
  openGraph: {
    title: "Leegstaand huis verkopen",
    description: "Leegstaand huis of leegstaande woning verkopen zonder makelaar, open huis of verkoopstress? Vraag vrijblijvend een voorstel aan.",
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
  "lead": "Een leegstaand huis kan zorgen en kosten geven. Wij helpen met een vrijblijvende verkoopoplossing en duidelijke voorwaarden.",
  "shortAnswer": "Leegstaand huis of leegstaande woning verkopen zonder makelaar, open huis of verkoopstress? U kunt vrijblijvend een voorstel aan.",
  "benefits": [
    "Leegstaand huis verkopen",
    "Geen makelaarskosten",
    "Geen open huis nodig",
    "Vrijblijvend verkoopvoorstel",
    "Duidelijke voorwaarden",
    "Notariële afwikkeling"
  ],
  "sections": [
    {
      "title": "Leegstaand huis verkopen: wanneer is dit interessant?",
      "paragraphs": [
        "Een leegstaand huis kan zorgen en kosten geven. Wij helpen met een vrijblijvende verkoopoplossing en duidelijke voorwaarden.",
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
        "Leegstaand huis verkopen",
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
      "question": "Kan ik mijn leegstaand huis verkopen zonder makelaar regelen?",
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
  "ctaTitle": "Wilt u leegstaand huis verkopen?",
  "ctaText": "Vraag vrijblijvend een verkoopvoorstel aan en ontvang duidelijkheid over uw mogelijkheden.",
  "keywords": "leegstaand huis verkopen, leegstaande woning verkopen, woning leegstand verkopen"
};

export default function LeegstaandHuisVerkopenPage() {
  return <SeoLandingPage page={page} />;
}
