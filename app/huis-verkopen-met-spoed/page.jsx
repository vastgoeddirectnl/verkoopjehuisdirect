import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen met spoed zonder overhaaste beslissing",
  description: "Bij spoed kunt u snel een vrijblijvende beoordeling aanvragen. De haalbare verkooptermijn hangt af van woning, gegevens en juridische uitvoerbaarheid.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-met-spoed",
  },
  openGraph: {
    title: "Huis verkopen met spoed zonder overhaaste beslissing",
    description: "Bij spoed kunt u snel een vrijblijvende beoordeling aanvragen. De haalbare verkooptermijn hangt af van woning, gegevens en juridische uitvoerbaarheid.",
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-met-spoed",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

const page = {
  "slug": "/huis-verkopen-met-spoed",
  "breadcrumb": "Huis verkopen met spoed",
  "eyebrow": "Spoed en rust combineren",
  "h1": "Huis verkopen met spoed zonder overhaaste beslissing",
  "lead": "Bij spoed wilt u vooral snel duidelijkheid. Wij kijken mee naar de woning, de situatie en de gewenste planning, zonder druk om direct te tekenen.",
  "heroNote": "Spoed vraagt om duidelijke afspraken, niet om overhaaste beslissingen.",
  "heroBenefits": [
    "Snel contact mogelijk",
    "Vrijblijvend voorstel",
    "Geen verkoopcampagne nodig",
    "Schriftelijke afspraken"
  ],
  "benefits": [
    "Geschikt bij dubbele lasten",
    "Ook bij leegstand",
    "Privacy en beperkte bezichtigingen",
    "Notariële afwikkeling"
  ],
  "shortAnswer": "Bij spoed kunt u snel een vrijblijvende beoordeling aanvragen. De haalbare verkooptermijn hangt af van woning, gegevens en juridische uitvoerbaarheid.",
  "pageType": "high-intent",
  "concernCards": [
    "Ik heb snel duidelijkheid nodig",
    "Ik wil financiële druk beperken",
    "Ik wil geen lange reeks bezichtigingen",
    "Ik wil weten wat praktisch haalbaar is"
  ],
  "solutionCards": [
    "Rustige beoordeling ondanks spoed",
    "Duidelijke uitleg over planning en voorwaarden",
    "Directe verkooproute als alternatief",
    "Afwikkeling via notaris bij akkoord"
  ],
  "vdnTasks": [
    "Snel reageren op uw aanvraag",
    "Situatie en woning beoordelen",
    "Voorstel of indicatie bespreken",
    "Vervolgstappen schriftelijk maken"
  ],
  "ownerTasks": [
    "Belangrijke documenten verzamelen waar mogelijk",
    "Bijzonderheden direct melden",
    "Voorstel rustig vergelijken",
    "Akkoord pas geven na duidelijke voorwaarden"
  ],
  "sections": [
    {
      "title": "Spoed door verkoopdruk, verhuizing of dubbele lasten",
      "paragraphs": [
        "Een spoedsituatie kan verschillende oorzaken hebben. Juist dan is het belangrijk dat het voorstel helder en controleerbaar blijft.",
        "Wij geven geen overdreven garanties, maar bespreken realistisch wat er mogelijk is."
      ]
    },
    {
      "title": "Wat hoeft meestal niet vooraf?",
      "bullets": [
        "niet eerst een verkoopcampagne opstarten",
        "niet per se een open huis organiseren",
        "niet altijd eerst opknappen",
        "niet direct beslissen zonder schriftelijk voorstel"
      ]
    }
  ],
  "processTitle": "Spoedaanvraag in vier stappen",
  "processSteps": [
    "U legt kort uit waarom er spoed is.",
    "Wij beoordelen woning en planning.",
    "U ontvangt waar mogelijk een vrijblijvende inschatting of voorstel.",
    "Bij akkoord volgt schriftelijke uitwerking en notariële overdracht."
  ],
  "practiceExample": {
    "situation": "Spoed door dubbele lasten",
    "propertyType": "Woning met onderhoud",
    "region": "Noord-Nederland",
    "mainProblem": "De eigenaar wilde snel weten of een directe verkoop de lasten kon beperken.",
    "solution": "Een directe verkooproute is besproken naast de reguliere markt.",
    "delivery": "Levering is afgestemd op praktische en notariële haalbaarheid.",
    "result": "Er kwam snel duidelijkheid zonder verkoopdruk."
  },
  "comparisonRows": [
    [
      "Spoed",
      "Regulier traject kan tijd vragen",
      "Snelle beoordeling mogelijk"
    ],
    [
      "Verkoopdruk",
      "Afhankelijk van kopersproces",
      "U beslist pas na voorstel"
    ],
    [
      "Woningstaat",
      "Kan invloed hebben op presentatie",
      "Ook huidige staat bespreekbaar"
    ],
    [
      "Afspraken",
      "Na onderhandeling",
      "Vooraf schriftelijk vastleggen"
    ]
  ],
  "faqs": [
    {
      "question": "Kan ik met spoed een huis verkopen?",
      "answer": "U kunt met spoed een vrijblijvende beoordeling aanvragen. Of snelle verkoop mogelijk is, hangt af van de concrete situatie."
    },
    {
      "question": "Moet ik meteen akkoord geven?",
      "answer": "Nee. U ontvangt eerst duidelijkheid en beslist daarna zelf."
    },
    {
      "question": "Kan dit zonder open huis?",
      "answer": "Ja, een directe verkooproute kan vaak zonder open huis of uitgebreide bezichtigingsrondes worden besproken."
    },
    {
      "question": "Blijft de notaris betrokken?",
      "answer": "Ja, definitieve levering verloopt via de notaris."
    }
  ],
  "ctaTitle": "Heeft u spoed met verkoop?",
  "ctaText": "Vraag vrijblijvend duidelijkheid aan."
};

export default function HuisVerkopenMetSpoedPage() {
  return <SeoLandingPage page={page} />;
}
