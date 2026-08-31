import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen binnen één week? Eerst duidelijkheid over de haalba",
  description: "Binnen één week verkopen is afhankelijk van woning, gegevens en notariële planning. U kunt wel snel een vrijblijvende beoordeling aanvragen.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-binnen-1-week",
  },
  openGraph: {
    title: "Huis verkopen binnen één week? Eerst duidelijkheid over de haalba",
    description: "Binnen één week verkopen is afhankelijk van woning, gegevens en notariële planning. U kunt wel snel een vrijblijvende beoordeling aanvragen.",
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-binnen-1-week",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

const page = {
  "slug": "/huis-verkopen-binnen-1-week",
  "breadcrumb": "Huis verkopen binnen 1 week",
  "eyebrow": "Snel verkooptraject",
  "h1": "Huis verkopen binnen één week? Eerst duidelijkheid over de haalbare route",
  "lead": "Wanneer u binnen korte tijd duidelijkheid nodig heeft, kan directe verkoop een alternatief zijn. We bekijken de woning en bespreken realistisch welke planning mogelijk is.",
  "heroNote": "Een snelle route betekent niet dat afspraken vluchtig worden gemaakt. Definitieve afspraken worden schriftelijk vastgelegd.",
  "heroBenefits": [
    "Korte route naar duidelijkheid",
    "Geen open huis nodig",
    "Flexibele overdracht bespreekbaar",
    "Vrijblijvend en schriftelijk"
  ],
  "benefits": [
    "Snel inzicht in mogelijkheden",
    "Geen lange campagne",
    "Ook bij leegstand of onderhoud",
    "Afwikkeling via de notaris"
  ],
  "shortAnswer": "Binnen één week verkopen is afhankelijk van woning, gegevens en notariële planning. U kunt wel snel een vrijblijvende beoordeling aanvragen.",
  "pageType": "high-intent",
  "concernCards": [
    "Ik wil niet maanden wachten",
    "Ik wil onzekerheid over verkoop beperken",
    "Ik wil weten of directe verkoop past",
    "Ik wil duidelijke afspraken over levering"
  ],
  "solutionCards": [
    "Eerste beoordeling van woning en situatie",
    "Bespreking van gewenste planning",
    "Schriftelijk voorstel indien passend",
    "Duidelijke vervolgstappen richting notaris"
  ],
  "vdnTasks": [
    "Aanvraag beoordelen",
    "Planning en voorwaarden bespreken",
    "Voorstel uitwerken",
    "Overdracht voorbereiden bij akkoord"
  ],
  "ownerTasks": [
    "Woninginformatie delen",
    "Eigendomssituatie toelichten",
    "Voorstel controleren",
    "Pas tekenen na akkoord op alle voorwaarden"
  ],
  "sections": [
    {
      "title": "Wanneer is één week als planning bespreekbaar?",
      "paragraphs": [
        "Een korte termijn kan soms bespreekbaar zijn als woninggegevens, eigendomssituatie en notariële afwikkeling duidelijk zijn.",
        "We beloven geen vaste termijn, maar geven wel snel inzicht in wat realistisch is."
      ]
    },
    {
      "title": "Voor welke situaties?",
      "bullets": [
        "verhuisplanning of dubbele lasten",
        "leegstaande woning",
        "woning met onderhoud",
        "erfenis of scheiding waarbij duidelijkheid nodig is"
      ]
    }
  ],
  "processTitle": "Vier stappen naar duidelijkheid",
  "processSteps": [
    "U vult de aanvraag in.",
    "Wij bespreken de woning en gewenste planning.",
    "U ontvangt waar mogelijk een vrijblijvend voorstel.",
    "Bij akkoord leggen we voorwaarden schriftelijk vast en plant de notaris de overdracht."
  ],
  "practiceExample": {
    "situation": "Korte verkooptermijn gewenst",
    "propertyType": "Leegstaande woning",
    "region": "Groningen/Drenthe",
    "mainProblem": "De eigenaar wilde voorkomen dat lasten lang doorliepen.",
    "solution": "Directe verkoop werd naast reguliere verkoopmogelijkheden besproken.",
    "delivery": "De overdrachtsdatum bleef afhankelijk van notaris en stukken.",
    "result": "De eigenaar kreeg snel een concreet beslismoment."
  },
  "comparisonRows": [
    [
      "Verkooptermijn",
      "Vaak afhankelijk van markt en koper",
      "Sneller inzicht mogelijk"
    ],
    [
      "Bezichtigingen",
      "Meerdere rondes mogelijk",
      "Niet standaard nodig"
    ],
    [
      "Voorwaarden",
      "Onderhandeling met koper",
      "Vooraf duidelijk bespreken"
    ],
    [
      "Notaris",
      "Na verkoop plannen",
      "Ook bij directe verkoop noodzakelijk"
    ]
  ],
  "faqs": [
    {
      "question": "Kan verkoop binnen één week altijd?",
      "answer": "Nee. Dat hangt af van de woning, juridische situatie, beschikbare gegevens en planning van partijen en notaris."
    },
    {
      "question": "Is de aanvraag vrijblijvend?",
      "answer": "Ja. U zit nergens aan vast."
    },
    {
      "question": "Moet ik de woning leegmaken?",
      "answer": "Niet altijd. Oplevering in huidige staat of met spullen kan bespreekbaar zijn."
    },
    {
      "question": "Kan ik eerst overleggen?",
      "answer": "Ja. U kunt bellen of WhatsApp sturen om uw situatie eerst te bespreken."
    }
  ],
  "ctaTitle": "Wilt u snel duidelijkheid over verkoop?",
  "ctaText": "Vraag vrijblijvend uw mogelijkheden op."
};

export default function HuisVerkopenBinnen1WeekPage() {
  return <SeoLandingPage page={page} />;
}
