import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen zonder uitgebreide bezichtigingsrondes",
  description: "Verkoop zonder uitgebreide bezichtigingen kan via een directe verkooproute bespreekbaar zijn. U vraagt eerst vrijblijvend een voorstel aan.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-zonder-bezichtigingen",
  },
  openGraph: {
    title: "Huis verkopen zonder uitgebreide bezichtigingsrondes",
    description: "Verkoop zonder uitgebreide bezichtigingen kan via een directe verkooproute bespreekbaar zijn. U vraagt eerst vrijblijvend een voorstel aan.",
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-zonder-bezichtigingen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  "slug": "/huis-verkopen-zonder-bezichtigingen",
  "breadcrumb": "Huis verkopen zonder bezichtigingen",
  "eyebrow": "Discreet verkopen",
  "h1": "Huis verkopen zonder uitgebreide bezichtigingsrondes",
  "lead": "Wilt u geen open huis of telkens onbekende kijkers over de vloer? Bij directe verkoop kan een rustiger traject mogelijk zijn met duidelijke afspraken vooraf.",
  "heroNote": "Discreet verkopen betekent niet dat informatie wordt overgeslagen. Relevante gegevens en bijzonderheden moeten helder zijn.",
  "heroBenefits": [
    "Geen open huis nodig",
    "Privacyvriendelijke route",
    "Vrijblijvend voorstel",
    "Schriftelijke afspraken"
  ],
  "benefits": [
    "Minder onrust in huis",
    "Geen verkoopcampagne nodig",
    "Ook bij volle of bewoonde woning",
    "Notariële overdracht"
  ],
  "shortAnswer": "Verkoop zonder uitgebreide bezichtigingen kan via een directe verkooproute bespreekbaar zijn. U vraagt eerst vrijblijvend een voorstel aan.",
  "pageType": "high-intent",
  "concernCards": [
    "Ik wil privacy houden",
    "Ik wil geen open huis",
    "De woning is bewoond of staat vol",
    "Ik wil minder onrust tijdens verkoop"
  ],
  "solutionCards": [
    "Beperkte beoordeling op basis van gegevens",
    "Gerichte afspraak als dat nodig is",
    "Geen reeks openbare bezichtigingen",
    "Duidelijke afspraken over oplevering"
  ],
  "vdnTasks": [
    "Woninginformatie beoordelen",
    "Alleen noodzakelijke vragen stellen",
    "Voorstel en voorwaarden duidelijk maken",
    "Afwikkeling voorbereiden bij akkoord"
  ],
  "ownerTasks": [
    "Eerlijke informatie over woning geven",
    "Beschikbare gegevens delen",
    "Toegang bespreken als beoordeling nodig is",
    "Voorstel rustig beoordelen"
  ],
  "sections": [
    {
      "title": "Waarom verkopen zonder bezichtigingen?",
      "paragraphs": [
        "Niet iedere eigenaar wil een traditioneel traject met kijkers en open huis. Soms gaat het om privacy, rust, een volle woning of praktische omstandigheden.",
        "Bij Vastgoed Direct Nederland bespreken we of een directe verkooproute past bij uw situatie."
      ]
    },
    {
      "title": "Wat blijft belangrijk?",
      "bullets": [
        "gebreken en bijzonderheden melden",
        "afspraken schriftelijk vastleggen",
        "realistische beoordeling van de woning",
        "notariële uitvoering bij akkoord"
      ]
    }
  ],
  "processTitle": "Rustig traject zonder open huis",
  "processSteps": [
    "U stuurt de woninggegevens en situatie.",
    "Wij beoordelen of aanvullende informatie nodig is.",
    "U ontvangt waar mogelijk een vrijblijvend voorstel.",
    "Bij akkoord worden afspraken schriftelijk en notarieel vastgelegd."
  ],
  "practiceExample": {
    "situation": "Geen kijkers in huis gewenst",
    "propertyType": "Bewoonde woning",
    "region": "Noord-Nederland",
    "mainProblem": "De eigenaar wilde privacy behouden en geen bezichtigingsrondes.",
    "solution": "De woning is eerst op basis van gegevens en toelichting beoordeeld.",
    "delivery": "Een gerichte afspraak bleef alleen nodig als informatie ontbrak.",
    "result": "De eigenaar kreeg duidelijkheid zonder open verkooptraject."
  },
  "comparisonRows": [
    [
      "Bezichtigingen",
      "Vaak meerdere kijkers",
      "Geen open huis standaard nodig"
    ],
    [
      "Privacy",
      "Woning komt breed in beeld",
      "Discretere route mogelijk"
    ],
    [
      "Voorbereiding",
      "Opruimen en presenteren",
      "Huidige staat bespreekbaar"
    ],
    [
      "Beslissing",
      "Afhankelijk van kijkers en biedingen",
      "Eerst vrijblijvend voorstel"
    ]
  ],
  "faqs": [
    {
      "question": "Kan ik mijn huis verkopen zonder bezichtigingen?",
      "answer": "Een traject zonder uitgebreide bezichtigingsrondes kan bespreekbaar zijn. Soms is aanvullende informatie of een gerichte afspraak nodig."
    },
    {
      "question": "Moet mijn woning op Funda?",
      "answer": "Nee, bij directe verkoop is een openbare Funda-campagne niet standaard nodig."
    },
    {
      "question": "Kan dit als de woning nog vol staat?",
      "answer": "Ja, dat kan bespreekbaar zijn. Geef wel duidelijk aan wat er achterblijft."
    },
    {
      "question": "Is de aanvraag vrijblijvend?",
      "answer": "Ja. U beslist pas nadat u het voorstel heeft bekeken."
    }
  ],
  "ctaTitle": "Wilt u verkopen zonder open huis?",
  "ctaText": "Vraag vrijblijvend uw verkoopmogelijkheden aan."
};

export default function HuisVerkopenZonderBezichtigingenPage() {
  return <SeoLandingPage page={page} />;
}
