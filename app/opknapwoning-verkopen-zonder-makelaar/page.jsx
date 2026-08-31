import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  "title": "Opknapwoning verkopen zonder makelaar",
  "description": "Een opknapwoning verkopen zonder makelaar? Lees wanneer directe verkoop een alternatief kan zijn en waar u op moet letten.",
  "alternates": {
    "canonical": "https://www.vastgoeddirectnederland.nl/opknapwoning-verkopen-zonder-makelaar"
  },
  "openGraph": {
    "title": "Opknapwoning verkopen zonder makelaar",
    "description": "Een opknapwoning verkopen zonder makelaar? Lees wanneer directe verkoop een alternatief kan zijn en waar u op moet letten.",
    "url": "https://www.vastgoeddirectnederland.nl/opknapwoning-verkopen-zonder-makelaar",
    "siteName": "Vastgoed Direct Nederland",
    "locale": "nl_NL",
    "type": "website",
    "images": [{ "url": "/og.png", "width": 1200, "height": 630, "alt": "Vastgoed Direct Nederland" }]
  }
};

const page = {
  "slug": "/opknapwoning-verkopen-zonder-makelaar",
  "breadcrumb": "Opknapwoning verkopen zonder makelaar",
  "eyebrow": "Opknapwoning zonder makelaar",
  "h1": "Opknapwoning verkopen zonder makelaar",
  "lead": "Een opknapwoning verkopen via de reguliere markt kan extra vragen oproepen. Kopers letten op onderhoud, financiering, risico's en verbouwkosten. Een directe verkoop kan dan een alternatief zijn.",
  "shortAnswer": "Ja, een opknapwoning kan soms zonder makelaar worden verkocht. Vooral als u geen open huis, verkoopklaar maken of makelaarskosten wilt, kan een directe verkooproute interessant zijn.",
  "benefits": [
    "Geen makelaar nodig",
    "Niet eerst opknappen",
    "Ook bij gebreken",
    "Geen open huis",
    "Vrijblijvend",
    "Duidelijke afspraken"
  ],
  "exampleSituation": {
    "title": "Als onderhoud het reguliere traject lastig maakt",
    "text": "Een woning met achterstallig onderhoud kan via een makelaar worden verkocht, maar soms levert dat veel vragen, onderhandelingen en onzekerheid op. Dan kan een directe verkooproute rustiger zijn, vooral als u de woning niet eerst wilt opknappen."
  },
  "sections": [
    {
      "title": "Wat maakt een woning een opknapwoning?",
      "paragraphs": [
        "Een opknapwoning is een woning waarbij onderhoud, veroudering, schade of achterstallige werkzaamheden zichtbaar zijn. Dat hoeft verkoop niet onmogelijk te maken, maar kan het traject wel beïnvloeden."
      ]
    },
    {
      "title": "Waarom kunnen kopers afhaken?",
      "paragraphs": [
        "Kopers kunnen afhaken door onzekerheid over kosten, bouwkundige staat, financiering of de hoeveelheid werk die nodig is."
      ]
    },
    {
      "title": "Welke opties heeft u?",
      "bullets": [
        "Verkopen via makelaar als kluswoning",
        "Eerst opknappen en daarna verkopen",
        "Zelf een koper zoeken",
        "Vrijblijvend direct voorstel aanvragen"
      ]
    },
    {
      "title": "Wanneer is directe verkoop logisch?",
      "paragraphs": [
        "Directe verkoop kan logisch zijn als u niet eerst wilt investeren in herstel of als u geen reeks bezichtigingen door een woning met gebreken wilt."
      ]
    },
    {
      "title": "Waar moet u op letten?",
      "paragraphs": [
        "Wees open over bekende gebreken en zorg dat afspraken over oplevering, spullen en planning duidelijk worden vastgelegd."
      ]
    }
  ],
  "comparisonRows": [
    [
      "Opknappen",
      "Vaak eerst nodig voor presentatie",
      "Niet vooraf nodig voor een eerste voorstel"
    ],
    [
      "Leeghalen",
      "Vaak nodig voor foto's en bezichtigingen",
      "Kan worden meegenomen in het voorstel"
    ],
    [
      "Bezichtigingen",
      "Vaak meerdere kijkers",
      "Geen open huis nodig"
    ],
    [
      "Kosten",
      "Mogelijk courtage, styling of herstel",
      "Geen makelaarskosten voor de aanvraag"
    ],
    [
      "Planning",
      "Afhankelijk van koper en markt",
      "In overleg duidelijk af te spreken"
    ],
    [
      "Beslissing",
      "Vaak langer traject",
      "U beslist zelf na het voorstel"
    ]
  ],
  "faqs": [
    {
      "question": "Kan ik een opknapwoning zonder makelaar verkopen?",
      "answer": "Ja, dat kan in bepaalde situaties. Een directe verkoop kan een alternatief zijn als u geen makelaarstraject wilt starten."
    },
    {
      "question": "Moet ik gebreken eerst herstellen?",
      "answer": "Nee, dat hoeft niet altijd. Ook met gebreken kunt u vrijblijvend laten bekijken wat er mogelijk is."
    },
    {
      "question": "Is een bouwkundige keuring nodig?",
      "answer": "Dat hangt af van de situatie. Bij een woning met onderhoud kan het wel verstandig zijn om duidelijkheid te geven over de staat."
    },
    {
      "question": "Kan ik verkopen zonder bezichtigingen?",
      "answer": "Ja, verkoop zonder open huis of reeks bezichtigingen kan een reden zijn om directe verkoop te onderzoeken."
    },
    {
      "question": "Wanneer is directe verkoop logisch?",
      "answer": "Dat kan logisch zijn als u geen geld, tijd of energie wilt steken in opknappen en verkoopklaar maken."
    }
  ],
  "relatedLinks": [
    [
      "/opknapwoning-verkopen",
      "Opknapwoning verkopen"
    ],
    [
      "/huis-verkopen-zonder-opknappen",
      "Huis verkopen zonder opknappen"
    ],
    [
      "/woning-verkopen-zonder-makelaar",
      "Woning verkopen zonder makelaar"
    ],
    [
      "/huis-verkopen-zonder-bezichtigingen",
      "Huis verkopen zonder bezichtigingen"
    ],
    [
      "/huis-verkopen-zonder-leeghalen",
      "Huis verkopen zonder leeghalen"
    ]
  ],
  "ctaTitle": "Opknapwoning zonder makelaar verkopen?",
  "ctaText": "Vraag vrijblijvend duidelijkheid aan zonder eerst op te knappen of verkoopklaar te maken."
};

export default function OpknapwoningVerkopenZonderMakelaarPage() {
  return <SeoLandingPage page={page} />;
}
