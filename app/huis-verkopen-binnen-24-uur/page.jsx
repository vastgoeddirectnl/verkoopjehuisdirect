import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen binnen 24 uur",
  description: "Huis verkopen binnen 24 uur of snel duidelijkheid over uw mogelijkheden? Vraag vrijblijvend een helder verkoopvoorstel aan.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-binnen-24-uur",
  },
  openGraph: {
    title: "Huis verkopen binnen 24 uur",
    description: "Huis verkopen binnen 24 uur of snel duidelijkheid over uw mogelijkheden? Vraag vrijblijvend een helder verkoopvoorstel aan.",
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-binnen-24-uur",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  "slug": "/huis-verkopen-binnen-24-uur",
  "breadcrumb": "Huis verkopen binnen 24 uur",
  "eyebrow": "Huis verkopen binnen 24 uur",
  "h1": "Huis verkopen binnen 24 uur: snel duidelijkheid",
  "lead": "Wilt u snel weten wat er mogelijk is met uw woning? Wij bekijken uw aanvraag zorgvuldig en geven zo snel mogelijk duidelijkheid.",
  "shortAnswer": "Huis verkopen binnen 24 uur of snel duidelijkheid over uw mogelijkheden? U kunt vrijblijvend een helder verkoopvoorstel aan.",
  "benefits": [
    "Huis verkopen binnen 24 uur",
    "Geen makelaarskosten",
    "Geen open huis nodig",
    "Vrijblijvend verkoopvoorstel",
    "Duidelijke voorwaarden",
    "Notariële afwikkeling"
  ],
  "sections": [
    {
      "title": "Huis verkopen binnen 24 uur: wanneer is dit interessant?",
      "paragraphs": [
        "Wilt u snel weten wat er mogelijk is met uw woning? Wij bekijken uw aanvraag zorgvuldig en geven zo snel mogelijk duidelijkheid.",
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
        "Huis verkopen binnen 24 uur",
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
      "question": "Kan ik mijn huis verkopen binnen 24 uur zonder makelaar regelen?",
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
  "ctaTitle": "Wilt u huis verkopen binnen 24 uur?",
  "ctaText": "Vraag vrijblijvend een verkoopvoorstel aan en ontvang duidelijkheid over uw mogelijkheden.",
  "keywords": "huis verkopen binnen 24 uur, snel bod woning, snel duidelijkheid"
};

export default function HuisVerkopenBinnen24UurPage() {
  return <SeoLandingPage page={page} />;
}
