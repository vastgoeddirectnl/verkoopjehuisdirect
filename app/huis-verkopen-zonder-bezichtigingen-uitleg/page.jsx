import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  "title": "Huis verkopen zonder bezichtigingen",
  "description": "Wilt u uw huis verkopen zonder reeks bezichtigingen of open huis? Lees hoe dit werkt en wanneer het passend kan zijn.",
  "alternates": {
    "canonical": "https://www.verkoopjehuisdirect.nl/huis-verkopen-zonder-bezichtigingen-uitleg"
  },
  "openGraph": {
    "title": "Huis verkopen zonder bezichtigingen",
    "description": "Wilt u uw huis verkopen zonder reeks bezichtigingen of open huis? Lees hoe dit werkt en wanneer het passend kan zijn.",
    "url": "https://www.verkoopjehuisdirect.nl/huis-verkopen-zonder-bezichtigingen-uitleg",
    "siteName": "Vastgoed Direct Nederland",
    "locale": "nl_NL",
    "type": "website"
  }
};

const page = {
  "slug": "/huis-verkopen-zonder-bezichtigingen-uitleg",
  "breadcrumb": "Huis verkopen zonder bezichtigingen",
  "eyebrow": "Zonder bezichtigingen",
  "h1": "Huis verkopen zonder bezichtigingen",
  "lead": "Niet iedereen wil onbekenden door de woning laten lopen. Soms is er behoefte aan privacy, rust of snelheid. Dan kan verkoop zonder open huis of reeks bezichtigingen een alternatief zijn.",
  "shortAnswer": "Ja, een huis verkopen zonder bezichtigingen kan in bepaalde situaties. Bij directe verkoop is een open huis meestal niet nodig en krijgt u eerst rustig duidelijkheid.",
  "benefits": [
    "Geen open huis",
    "Meer privacy",
    "Geen reeks kijkers",
    "Niet eerst styling",
    "Vrijblijvend voorstel",
    "Persoonlijk contact"
  ],
  "exampleSituation": {
    "title": "Als privacy belangrijk is",
    "text": "Een veelvoorkomende situatie is dat een eigenaar geen onbekenden door de woning wil laten lopen. Bijvoorbeeld omdat de woning nog bewoond is, vol spullen staat of omdat de verkoop gevoelig ligt. Dan kan een directe verkooproute rustiger zijn."
  },
  "sections": [
    {
      "title": "Waarom bezichtigingen vermijden?",
      "paragraphs": [
        "Sommige eigenaren willen privacy, hebben een volle woning of vinden kijkers belastend. Ook bij erfenis, scheiding of verhuur kan discretie belangrijk zijn."
      ]
    },
    {
      "title": "Welke opties heeft u?",
      "bullets": [
        "Regulier verkopen met bezichtigingen",
        "Stille verkoop",
        "Zelf verkopen",
        "Directe verkoop zonder open huis onderzoeken"
      ]
    },
    {
      "title": "Nadelen van regulier verkopen",
      "paragraphs": [
        "Bij reguliere verkoop zijn foto's, bezichtigingen en onderhandelingen vaak onderdeel van het proces. Dat kan onrust geven als de woning nog bewoond is of niet verkoopklaar is."
      ]
    },
    {
      "title": "Wanneer is directe verkoop logisch?",
      "paragraphs": [
        "Directe verkoop kan logisch zijn als privacy, rust en duidelijke afspraken belangrijk zijn."
      ]
    },
    {
      "title": "Hoe werkt het proces?",
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
      "question": "Kan ik mijn huis verkopen zonder bezichtigingen?",
      "answer": "Ja, dat kan in bepaalde situaties. Bij directe verkoop is een open huis of reeks bezichtigingen meestal niet nodig."
    },
    {
      "question": "Is een open huis verplicht?",
      "answer": "Nee, een open huis is niet verplicht. Er zijn verkooproutes zonder open huis."
    },
    {
      "question": "Kan dit ook als de woning nog bewoond is?",
      "answer": "Ja, dat kan worden besproken. Juist dan kan minder gedoe en meer privacy prettig zijn."
    },
    {
      "question": "Is dit geschikt bij privacygevoelige situaties?",
      "answer": "Ja, bijvoorbeeld bij scheiding, erfenis, verhuur of wanneer u niet wilt dat de woning openbaar wordt bezocht."
    },
    {
      "question": "Hoe vraag ik vrijblijvend duidelijkheid aan?",
      "answer": "U vult kort uw adres en situatie in. Daarna nemen wij persoonlijk contact met u op."
    }
  ],
  "relatedLinks": [
    [
      "/woning-verkopen-zonder-makelaar",
      "Woning verkopen zonder makelaar"
    ],
    [
      "/huis-verkopen-zonder-leeghalen",
      "Huis verkopen zonder leeghalen"
    ],
    [
      "/woning-verkopen-die-nog-vol-staat",
      "Woning verkopen die nog vol staat"
    ],
    [
      "/huis-direct-verkopen",
      "Huis direct verkopen"
    ],
    [
      "/huis-snel-verkopen",
      "Huis snel verkopen"
    ]
  ],
  "ctaTitle": "Zonder bezichtigingen verkopen?",
  "ctaText": "Vraag vrijblijvend duidelijkheid aan zonder open huis of verkoopdruk."
};

export default function HuisVerkopenZonderBezichtigingenUitlegPage() {
  return <SeoLandingPage page={page} />;
}
