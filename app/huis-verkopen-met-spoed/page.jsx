import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen met spoed",
  description:
    "Huis verkopen met spoed? Vraag vrijblijvend een persoonlijk verkoopvoorstel aan zonder open huis of makelaarskosten.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/huis-verkopen-met-spoed",
  },
  openGraph: {
    title: "Huis verkopen met spoed",
    description:
      "Huis verkopen met spoed? Vraag vrijblijvend een persoonlijk verkoopvoorstel aan zonder open huis of makelaarskosten.",
    url: "https://www.verkoopjehuisdirect.nl/huis-verkopen-met-spoed",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  "slug": "/huis-verkopen-met-spoed",
  "breadcrumb": "Huis verkopen met spoed",
  "eyebrow": "Huis verkopen met spoed",
  "h1": "Huis verkopen met spoed en snel duidelijkheid krijgen",
  "lead": "Moet of wilt u uw woning snel verkopen? Vraag vrijblijvend een persoonlijk verkoopvoorstel aan zonder open huis, makelaarskosten of langdurige onzekerheid.",
  "shortAnswer": "Bij spoed is vooral duidelijkheid belangrijk. Wij bespreken uw situatie, gewenste planning en mogelijkheden voor een directe verkooproute.",
  "benefits": [
    "Snel duidelijkheid",
    "Geen open huis",
    "Geen makelaarskosten",
    "Persoonlijk contact",
    "Duidelijke voorwaarden",
    "Overdracht in overleg"
  ],
  "sections": [
    {
      "title": "Wanneer is spoedverkoop interessant?",
      "paragraphs": [
        "Soms is een lange verkoopperiode niet wenselijk. Bijvoorbeeld door dubbele lasten, leegstand, verhuizing, financiële druk, scheiding of een andere persoonlijke situatie.",
        "Een direct verkoopvoorstel kan helpen om snel overzicht te krijgen."
      ]
    },
    {
      "title": "Wat kunt u verwachten?",
      "bullets": [
        "Persoonlijk contact",
        "Duidelijke bespreking van uw situatie",
        "Een voorstel met voorwaarden",
        "Geen standaard open huis",
        "Geen verplichting om akkoord te gaan"
      ]
    },
    {
      "title": "Hoe werkt het?",
      "steps": [
        "U vult uw woninggegevens in.",
        "Wij nemen persoonlijk contact op.",
        "Wij bekijken welke snelheid haalbaar is.",
        "U ontvangt een vrijblijvend verkoopvoorstel."
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
      "question": "Kan ik mijn huis snel verkopen?",
      "answer": "U kunt vrijblijvend een voorstel aanvragen als u snel duidelijkheid wilt. De haalbaarheid hangt af van de woning en situatie."
    },
    {
      "question": "Is een snelle overdracht altijd mogelijk?",
      "answer": "Niet altijd. De overdracht moet juridisch en notarieel verantwoord worden geregeld."
    },
    {
      "question": "Betaal ik makelaarskosten?",
      "answer": "Nee, voor deze aanvraag betaalt u geen makelaarskosten."
    },
    {
      "question": "Kan ik eerst bellen of WhatsAppen?",
      "answer": "Ja, u kunt eerst vrijblijvend overleggen via telefoon of WhatsApp."
    }
  ],
  "ctaTitle": "Wilt u uw huis met spoed verkopen?",
  "ctaText": "Vraag gratis een persoonlijk verkoopvoorstel aan en ontvang snel duidelijkheid over uw mogelijkheden.",
  "keywords": "huis verkopen met spoed, woning snel verkopen, spoedverkoop huis"
};

export default function Page() {
  return <SeoLandingPage page={page} />;
}
