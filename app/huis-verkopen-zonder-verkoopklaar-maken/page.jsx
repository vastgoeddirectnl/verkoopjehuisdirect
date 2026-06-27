import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen zonder verkoopklaar maken",
  description:
    "Huis verkopen zonder eerst opknappen, verkoopstyling of verkoopklaar maken? Vraag gratis een persoonlijk voorstel aan.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-zonder-verkoopklaar-maken",
  },
  openGraph: {
    title: "Huis verkopen zonder verkoopklaar maken",
    description:
      "Huis verkopen zonder eerst opknappen, verkoopstyling of verkoopklaar maken? Vraag gratis een persoonlijk voorstel aan.",
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-zonder-verkoopklaar-maken",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  "slug": "/huis-verkopen-zonder-verkoopklaar-maken",
  "breadcrumb": "Huis verkopen zonder verkoopklaar maken",
  "eyebrow": "Zonder verkoopklaar maken",
  "h1": "Huis verkopen zonder eerst alles verkoopklaar te maken",
  "lead": "Wilt u uw woning verkopen zonder eerst te schilderen, op te ruimen, te herstellen of te renoveren? Vraag vrijblijvend een voorstel aan en ontdek wat er mogelijk is.",
  "shortAnswer": "Een woning hoeft niet altijd perfect verkoopklaar te zijn. Ook als er onderhoud, spullen, schade of achterstallige klussen zijn, kunt u een vrijblijvend verkoopvoorstel aanvragen.",
  "benefits": [
    "Niet eerst opknappen",
    "Geen verkoopstyling nodig",
    "Geen open huis",
    "Geen makelaarskosten",
    "Rustige beoordeling",
    "Duidelijke voorwaarden"
  ],
  "sections": [
    {
      "title": "Waarom niet eerst verkoopklaar maken?",
      "paragraphs": [
        "Verkoopklaar maken kost tijd, geld en energie. Zeker bij een woning met onderhoud, leegstand of een persoonlijke situatie is dat niet altijd wenselijk.",
        "Vastgoed Direct Nederland kijkt naar de woning zoals deze is en bespreekt vervolgens welke verkooproute mogelijk is."
      ]
    },
    {
      "title": "Voorbeelden van situaties",
      "bullets": [
        "Achterstallig onderhoud",
        "Veel spullen in de woning",
        "Schade of renovatiebehoefte",
        "Leegstand",
        "Erfeniswoning",
        "Woning die snel verkocht moet worden"
      ]
    },
    {
      "title": "Hoe werkt het?",
      "steps": [
        "U meldt de woning aan.",
        "Wij bespreken de huidige staat van de woning.",
        "U ontvangt een vrijblijvend voorstel.",
        "U beslist zelf of het voorstel passend is."
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
      "question": "Kan ik verkopen zonder eerst op te knappen?",
      "answer": "Ja, in veel situaties kunt u een woning aanmelden zonder dat deze eerst volledig verkoopklaar is."
    },
    {
      "question": "Maakt achterstallig onderhoud uit?",
      "answer": "Achterstallig onderhoud hoeft geen belemmering te zijn om vrijblijvend een voorstel aan te vragen."
    },
    {
      "question": "Moet de woning leeg zijn?",
      "answer": "Niet altijd. De oplevering en eventuele roerende zaken bespreken we vooraf duidelijk."
    },
    {
      "question": "Is de aanvraag gratis?",
      "answer": "Ja, de aanvraag is gratis en vrijblijvend."
    }
  ],
  "ctaTitle": "Wilt u verkopen zonder verkoopklaar maken?",
  "ctaText": "Vraag vrijblijvend een voorstel aan en ontdek wat er mogelijk is voor uw woning in de huidige staat.",
  "keywords": "huis verkopen zonder verkoopklaar maken, woning verkopen zonder opknappen"
};

export default function Page() {
  return <SeoLandingPage page={page} />;
}
