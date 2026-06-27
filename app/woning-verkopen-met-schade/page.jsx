import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Woning verkopen met schade",
  description:
    "Woning verkopen met schade, achterstallig onderhoud of renovatiebehoefte? Vraag vrijblijvend een verkoopvoorstel aan.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/woning-verkopen-met-schade",
  },
  openGraph: {
    title: "Woning verkopen met schade",
    description:
      "Woning verkopen met schade, achterstallig onderhoud of renovatiebehoefte? Vraag vrijblijvend een verkoopvoorstel aan.",
    url: "https://www.vastgoeddirectnederland.nl/woning-verkopen-met-schade",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  "slug": "/woning-verkopen-met-schade",
  "breadcrumb": "Woning verkopen met schade",
  "eyebrow": "Woning met schade verkopen",
  "h1": "Woning verkopen met schade zonder lang verkooptraject",
  "lead": "Heeft uw woning schade, achterstallig onderhoud of renovatiebehoefte? Vraag vrijblijvend een verkoopvoorstel aan zonder eerst alles te herstellen.",
  "shortAnswer": "Ook een woning met schade kan worden aangemeld. Wij kijken naar de situatie en bespreken of een directe verkoopoplossing passend kan zijn.",
  "benefits": [
    "Ook bij schade aanmelden",
    "Niet eerst herstellen",
    "Geen open huis nodig",
    "Geen makelaarskosten",
    "Duidelijke voorwaarden",
    "Notariële afwikkeling"
  ],
  "sections": [
    {
      "title": "Woning met schade verkopen: wanneer interessant?",
      "paragraphs": [
        "Schade kan een traditioneel verkooptraject lastiger maken. Denk aan bouwkundige schade, achterstallig onderhoud, lekkage, brandschade of andere herstelpunten.",
        "Een direct verkoopvoorstel kan interessant zijn als u niet eerst wilt investeren in herstel of renovatie."
      ]
    },
    {
      "title": "Welke schade kan meespelen?",
      "bullets": [
        "Achterstallig onderhoud",
        "Lekkage of vochtschade",
        "Brandschade of stormschade",
        "Schade aan kozijnen, dak of gevel",
        "Woning die renovatie nodig heeft",
        "Woning met verouderde installaties"
      ]
    },
    {
      "title": "Hoe werkt de beoordeling?",
      "steps": [
        "U geeft aan om welke woning en schade het gaat.",
        "Wij bespreken de beschikbare informatie.",
        "U ontvangt een voorstel met duidelijke voorbehouden.",
        "Bij akkoord worden afspraken notarieel vastgelegd."
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
      "Vaak meerdere kijkers of open huis",
      "Geen open huis nodig"
    ],
    [
      "Verkoopklaar maken",
      "Vaak gewenst voor presentatie",
      "Niet altijd nodig"
    ],
    [
      "Snelheid",
      "Afhankelijk van markt en kopers",
      "Snel duidelijkheid mogelijk"
    ],
    [
      "Afwikkeling",
      "Afhankelijk van koper en voorwaarden",
      "Bij akkoord via de notaris"
    ]
  ],
  "faqs": [
    {
      "question": "Kan ik een woning met schade verkopen?",
      "answer": "Ja, u kunt vrijblijvend een verkoopvoorstel aanvragen voor een woning met schade of onderhoud."
    },
    {
      "question": "Moet de schade eerst hersteld worden?",
      "answer": "Niet altijd. Wij bespreken wat in uw situatie mogelijk is."
    },
    {
      "question": "Krijg ik meteen een definitief bod?",
      "answer": "Het voorstel is onder voorbehoud van controle van de woninginformatie en eventuele bijzonderheden."
    },
    {
      "question": "Betaal ik makelaarskosten?",
      "answer": "Nee, u betaalt geen makelaarskosten voor de aanvraag via Vastgoed Direct Nederland."
    }
  ],
  "ctaTitle": "Wilt u een woning met schade verkopen?",
  "ctaText": "Vraag gratis en vrijblijvend een verkoopvoorstel aan en ontdek uw mogelijkheden.",
  "keywords": "woning verkopen met schade, huis verkopen met schade, beschadigde woning verkopen"
};

export default function Page() {
  return <SeoLandingPage page={page} />;
}
