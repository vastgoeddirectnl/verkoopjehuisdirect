import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen zonder Funda-campagne of open huis",
  description: "U kunt uw woning zonder Funda-campagne rechtstreeks laten beoordelen. Directe verkoop kan rust en privacy bieden, maar de afspraken worden altijd schriftel",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-zonder-funda",
  },
  openGraph: {
    title: "Huis verkopen zonder Funda-campagne of open huis",
    description: "U kunt uw woning zonder Funda-campagne rechtstreeks laten beoordelen. Directe verkoop kan rust en privacy bieden, maar de afspraken worden altijd schriftel",
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-zonder-funda",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

const page = {
  "slug": "/huis-verkopen-zonder-funda",
  "breadcrumb": "Huis verkopen zonder Funda",
  "eyebrow": "Zonder openbare campagne",
  "h1": "Huis verkopen zonder Funda-campagne of open huis",
  "lead": "Niet iedere verkoop hoeft via een openbare presentatie op Funda te lopen. Als u rust, privacy of snelheid belangrijk vindt, kan directe verkoop een alternatief zijn.",
  "heroNote": "Zonder Funda betekent niet zonder duidelijke afspraken. U ontvangt eerst een vrijblijvend voorstel en beslist daarna zelf.",
  "heroBenefits": [
    "Geen openbare Funda-campagne",
    "Meer privacy",
    "Geen open huis nodig",
    "Vrijblijvend voorstel"
  ],
  "benefits": [
    "Geschikt bij privacywens",
    "Ook bij onderhoud of leegstand",
    "Geen makelaarskosten bij directe aankoop",
    "Notariële afwikkeling"
  ],
  "shortAnswer": "U kunt uw woning zonder Funda-campagne rechtstreeks laten beoordelen. Directe verkoop kan rust en privacy bieden, maar de afspraken worden altijd schriftelijk vastgelegd.",
  "pageType": "high-intent",
  "concernCards": [
    "Ik wil niet openbaar adverteren",
    "Ik wil geen verkoopbord of open huis",
    "Ik wil snel weten wat mogelijk is",
    "Ik wil niet alles zelf regelen"
  ],
  "solutionCards": [
    "Directe beoordeling van uw situatie",
    "Geen brede online verkoopcampagne nodig",
    "Voorstel met uitgangspunten en voorwaarden",
    "Vervolg via koopovereenkomst en notaris bij akkoord"
  ],
  "vdnTasks": [
    "Uw aanvraag beoordelen",
    "Privacywensen bespreken",
    "Voorstel schriftelijk uitwerken",
    "Afwikkeling voorbereiden"
  ],
  "ownerTasks": [
    "Woninggegevens delen",
    "Bijzonderheden melden",
    "Voorstel controleren",
    "Akkoord pas geven na definitieve voorwaarden"
  ],
  "sections": [
    {
      "title": "Waarom zonder Funda verkopen?",
      "paragraphs": [
        "Soms wilt u niet dat de woning breed online zichtbaar is. Bijvoorbeeld door privacy, familieomstandigheden, huur, leegstand of onderhoud.",
        "Een directe verkooproute kan dan overzichtelijker zijn dan een volledige openbare verkoopcampagne."
      ]
    },
    {
      "title": "Geen zelfverkoopplatform",
      "paragraphs": [
        "Vastgoed Direct Nederland is geen platform om zelf een woning op Funda te plaatsen. U vraagt juist een directe, vrijblijvende beoordeling van uw verkoopmogelijkheden aan."
      ]
    }
  ],
  "processTitle": "Zonder Funda in vier stappen",
  "processSteps": [
    "U vult de aanvraag in.",
    "Wij bekijken woning en situatie zonder openbare campagne.",
    "U ontvangt waar mogelijk een vrijblijvend voorstel.",
    "Bij akkoord worden afspraken schriftelijk en notarieel vastgelegd."
  ],
  "practiceExample": {
    "situation": "Privacy belangrijk",
    "propertyType": "Woning met onderhoud",
    "region": "Noord-Nederland",
    "mainProblem": "De eigenaar wilde geen openbare advertentiecampagne vanwege persoonlijke omstandigheden.",
    "solution": "Een directe verkooproute werd besproken zonder Funda-traject.",
    "delivery": "Oplevering en voorwaarden zijn pas bij akkoord definitief gemaakt.",
    "result": "De eigenaar kon rustig beoordelen of de oplossing paste."
  },
  "comparisonRows": [
    [
      "Online zichtbaarheid",
      "Vaak Funda en woningplatforms",
      "Geen openbare campagne standaard nodig"
    ],
    [
      "Makelaarsproces",
      "Presentatie, foto’s en kijkers",
      "Directe beoordeling mogelijk"
    ],
    [
      "Privacy",
      "Woning breed zichtbaar",
      "Discretere route"
    ],
    [
      "Afspraken",
      "Na biedingsproces",
      "Vooraf helder in voorstel"
    ]
  ],
  "faqs": [
    {
      "question": "Kan ik mijn huis verkopen zonder Funda?",
      "answer": "Ja, bij directe verkoop is een openbare Funda-campagne niet standaard nodig."
    },
    {
      "question": "Is dit hetzelfde als zelf verkopen?",
      "answer": "Nee. U vraagt een vrijblijvende beoordeling aan; u hoeft niet zelf een platform of campagne te regelen."
    },
    {
      "question": "Betaal ik makelaarskosten?",
      "answer": "Bij directe aankoop via Vastgoed Direct Nederland betaalt u geen makelaarskosten aan ons."
    },
    {
      "question": "Wordt alles schriftelijk vastgelegd?",
      "answer": "Ja, definitieve afspraken worden pas in een koopovereenkomst vastgelegd."
    }
  ],
  "ctaTitle": "Wilt u verkopen zonder Funda-campagne?",
  "ctaText": "Vraag vrijblijvend een voorstel aan."
};

export default function HuisVerkopenZonderFundaPage() {
  return <SeoLandingPage page={page} />;
}
