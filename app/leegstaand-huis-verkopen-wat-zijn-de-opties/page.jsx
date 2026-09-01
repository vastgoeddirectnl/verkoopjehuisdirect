import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  "title": "Leegstaand huis verkopen: wat zijn de opties?",
  "description": "Een leegstaand huis verkopen? Lees welke verkoopmogelijkheden er zijn, wanneer directe verkoop logisch is en waar u op moet letten.",
  "alternates": {
    "canonical": "https://www.vastgoeddirectnederland.nl/leegstaand-huis-verkopen-wat-zijn-de-opties"
  },
  "openGraph": {
    "title": "Leegstaand huis verkopen: wat zijn de opties?",
    "description": "Een leegstaand huis verkopen? Lees welke verkoopmogelijkheden er zijn, wanneer directe verkoop logisch is en waar u op moet letten.",
    "url": "https://www.vastgoeddirectnederland.nl/leegstaand-huis-verkopen-wat-zijn-de-opties",
    "siteName": "Vastgoed Direct Nederland",
    "locale": "nl_NL",
    "type": "website",
    "images": [{ "url": "/og.png", "width": 1200, "height": 630, "alt": "Vastgoed Direct Nederland" }]
  }
};

const page = {
  "slug": "/leegstaand-huis-verkopen-wat-zijn-de-opties",
  "pageType": "situation",
  "breadcrumb": "Leegstaand huis verkopen: wat zijn de opties?",
  "eyebrow": "Leegstand",
  "h1": "Leegstaand huis verkopen: wat zijn de opties?",
  "lead": "Een leegstaand huis kan zorgen voor dubbele lasten, onderhoud en onzekerheid. Soms is reguliere verkoop een goede keuze, maar niet altijd. Het is verstandig om eerst helder te krijgen welke verkooproute past bij uw situatie.",
  "shortAnswer": "Bij een leegstaand huis heeft u meerdere opties: regulier verkopen, eerst opknappen, tijdelijk beheren of vrijblijvend een direct verkoopvoorstel aanvragen.",
  "benefits": [
    "Opties bij leegstand",
    "Dubbele lasten",
    "Niet eerst opknappen",
    "Niet eerst leeghalen",
    "Geen open huis",
    "Vrijblijvend"
  ],
  "exampleSituation": {
    "title": "Als leegstand blijft doorlopen",
    "text": "Een woning die leegstaat, blijft aandacht vragen. De kosten lopen door en onderhoud blijft nodig. Door eerst de opties naast elkaar te zetten, kunt u rustiger beslissen of regulier verkopen, opknappen of directe verkoop het beste past."
  },
  "sections": [
    {
      "title": "Waarom geeft leegstand druk?",
      "paragraphs": [
        "Bij leegstand lopen vaste lasten door. Ook kunnen onderhoud, beveiliging en achteruitgang van de woning zorgen geven."
      ]
    },
    {
      "title": "Optie 1: regulier verkopen",
      "paragraphs": [
        "Reguliere verkoop via een makelaar kan goed zijn als de woning toonbaar is en u tijd heeft voor bezichtigingen en onderhandelingen."
      ]
    },
    {
      "title": "Optie 2: eerst opknappen",
      "paragraphs": [
        "Opknappen kan de presentatie verbeteren, maar kost geld en tijd. Niet altijd is zeker dat deze investering volledig terugkomt."
      ]
    },
    {
      "title": "Optie 3: direct verkoopvoorstel aanvragen",
      "paragraphs": [
        "Een direct voorstel kan rust geven als u eerst duidelijkheid wilt zonder open huis, verkoopdruk of verkoopklaar maken."
      ]
    },
    {
      "title": "Waar moet u op letten?",
      "bullets": [
        "Dubbele lasten",
        "Verzekering bij leegstand",
        "Onderhoud en beveiliging",
        "Spullen in de woning",
        "Opleverdatum en afspraken"
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
      "Geen makelaarskosten bij directe aankoop"
    ],
    [
      "Planning",
      "Afhankelijk van koper en markt",
      "In overleg vast te leggen"
    ],
    [
      "Beslissing",
      "Vaak langer traject",
      "U beslist zelf na het voorstel"
    ]
  ],
  "faqs": [
    {
      "question": "Kan ik een leegstaand huis snel verkopen?",
      "answer": "Ja, dat kan in bepaalde situaties. U kunt vrijblijvend laten bekijken welke verkooproute past."
    },
    {
      "question": "Moet ik eerst onderhoud uitvoeren?",
      "answer": "Nee, dat hoeft niet altijd. Ook bij onderhoud of veroudering kunt u eerst duidelijkheid krijgen."
    },
    {
      "question": "Wat als ik dubbele lasten heb?",
      "answer": "Dan kan snel duidelijkheid belangrijk zijn. Een direct voorstel kan helpen om opties naast elkaar te zetten."
    },
    {
      "question": "Kan ik verkopen zonder open huis?",
      "answer": "Ja, bij directe verkoop is een open huis meestal niet nodig."
    },
    {
      "question": "Hoe snel krijg ik duidelijkheid?",
      "answer": "Na uw aanvraag nemen wij persoonlijk contact op om de woning en situatie te bespreken."
    }
  ],
  "relatedLinks": [
    [
      "/leegstaand-huis-verkopen",
      "Leegstaand huis verkopen"
    ],
    [
      "/huis-verkopen-bij-dubbele-lasten",
      "Huis verkopen bij dubbele lasten"
    ],
    [
      "/huis-verkopen-zonder-opknappen",
      "Huis verkopen zonder opknappen"
    ],
    [
      "/huis-verkopen-zonder-leeghalen",
      "Huis verkopen zonder leeghalen"
    ],
    [
      "/huis-snel-verkopen",
      "Huis snel verkopen"
    ]
  ],
  "ctaTitle": "Leegstaand huis verkopen?",
  "ctaText": "Bekijk vrijblijvend welke verkooproute past bij uw situatie."
};

export default function LeegstaandHuisVerkopenWatZijnDeOptiesPage() {
  return <SeoLandingPage page={page} />;
}
