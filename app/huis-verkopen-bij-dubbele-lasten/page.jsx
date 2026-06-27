import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  "title": "Huis verkopen bij dubbele lasten",
  "description": "Dubbele woonlasten door een andere woning of verhuizing? Lees welke opties u heeft en wanneer directe verkoop rust kan geven.",
  "alternates": {
    "canonical": "https://www.vastgoeddirectnederland.nl/huis-verkopen-bij-dubbele-lasten"
  },
  "openGraph": {
    "title": "Huis verkopen bij dubbele lasten",
    "description": "Dubbele woonlasten door een andere woning of verhuizing? Lees welke opties u heeft en wanneer directe verkoop rust kan geven.",
    "url": "https://www.vastgoeddirectnederland.nl/huis-verkopen-bij-dubbele-lasten",
    "siteName": "Vastgoed Direct Nederland",
    "locale": "nl_NL",
    "type": "website"
  }
};

const page = {
  "slug": "/huis-verkopen-bij-dubbele-lasten",
  "breadcrumb": "Huis verkopen bij dubbele lasten",
  "eyebrow": "Dubbele lasten",
  "h1": "Huis verkopen bij dubbele lasten",
  "lead": "Dubbele lasten kunnen snel druk geven. Denk aan een nieuwe woning, verhuizing, leegstand of overbrugging. In zo'n situatie wilt u vooral weten waar u aan toe bent.",
  "shortAnswer": "Bij dubbele lasten kan het verstandig zijn snel duidelijkheid te krijgen over verkoopopties. Directe verkoop kan een alternatief zijn als rust, planning en zekerheid belangrijk zijn.",
  "benefits": [
    "Dubbele lasten beperken",
    "Snel duidelijkheid",
    "Geen open huis",
    "Niet eerst opknappen",
    "Vrijblijvend voorstel",
    "U beslist zelf"
  ],
  "exampleSituation": {
    "title": "Als maandlasten druk geven",
    "text": "Een veelvoorkomende situatie is dat iemand al een andere woning heeft gekocht of is verhuisd. De oude woning staat nog leeg en de lasten lopen door. Dan is snel weten wat verkoop kan betekenen vaak belangrijker dan maanden wachten."
  },
  "sections": [
    {
      "title": "Wanneer ontstaan dubbele lasten?",
      "paragraphs": [
        "Dubbele lasten ontstaan vaak bij aankoop van een andere woning, verhuizing, leegstand, relatiebreuk of een woning die langer te koop staat dan verwacht."
      ]
    },
    {
      "title": "Wat zijn de risico's?",
      "paragraphs": [
        "De maandlasten lopen door, onderhoud blijft nodig en de financiële ruimte kan onder druk komen te staan."
      ]
    },
    {
      "title": "Welke opties heeft u?",
      "bullets": [
        "Regulier verkopen",
        "Vraagprijs aanpassen",
        "Eerst opknappen",
        "Tijdelijk verhuren",
        "Vrijblijvend een direct voorstel aanvragen"
      ]
    },
    {
      "title": "Wanneer is snelheid belangrijker?",
      "paragraphs": [
        "Soms is maximale opbrengst niet het enige doel. Rust, zekerheid en het stoppen van dubbele lasten kunnen zwaarder wegen."
      ]
    },
    {
      "title": "Hoe werkt een voorstel?",
      "steps": [
        "U vult kort uw woning en situatie in.",
        "Op basis van de eerste gegevens ontvangt u een eerste vrijblijvend bod.",
        "We bespreken uw situatie en bekijken de woning eventueel in de huidige staat.",
        "Na beoordeling ontvangt u een definitief voorstel met het bod, de planning en duidelijke uitleg over het vervolg.",
        "Bij akkoord worden de afspraken vastgelegd in een koopovereenkomst en volgt de overdracht via de notaris."
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
      "question": "Wat kan ik doen bij dubbele woonlasten?",
      "answer": "U kunt regulier verkopen, tijdelijk verhuren of een direct verkoopvoorstel aanvragen. Welke optie past, hangt af van uw situatie."
    },
    {
      "question": "Kan ik mijn huis sneller verkopen?",
      "answer": "Ja, soms kan een directe verkoop sneller duidelijkheid geven dan een regulier traject."
    },
    {
      "question": "Moet ik altijd via een makelaar verkopen?",
      "answer": "Nee, dat hoeft niet altijd. Een directe verkooproute kan een alternatief zijn."
    },
    {
      "question": "Kan ik vrijblijvend weten wat mijn opties zijn?",
      "answer": "Ja. U kunt vrijblijvend een voorstel aanvragen en daarna zelf beslissen of u verder wilt."
    },
    {
      "question": "Zit ik ergens aan vast?",
      "answer": "Nee. Een aanvraag is gratis en vrijblijvend."
    }
  ],
  "relatedLinks": [
    [
      "/leegstaand-huis-verkopen-wat-zijn-de-opties",
      "Leegstaand huis verkopen: opties"
    ],
    [
      "/huis-snel-verkopen",
      "Huis snel verkopen"
    ],
    [
      "/leegstaand-huis-verkopen",
      "Leegstaand huis verkopen"
    ],
    [
      "/huis-direct-verkopen",
      "Huis direct verkopen"
    ],
    [
      "/huis-verkopen-zonder-bezichtigingen-uitleg",
      "Huis verkopen zonder bezichtigingen"
    ]
  ],
  "ctaTitle": "Dubbele lasten?",
  "ctaText": "Vraag vrijblijvend duidelijkheid aan over verkoop zonder verkoopdruk."
};

export default function HuisVerkopenBijDubbeleLastenPage() {
  return <SeoLandingPage page={page} />;
}
