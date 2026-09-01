import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen zonder uitgebreide bezichtigingsrondes",
  description: "Wilt u verkopen zonder uitgebreide bezichtigingsrondes? Laat vrijblijvend beoordelen of een directe verkooproute bij uw woning en situatie past.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-zonder-bezichtigingen",
  },
  openGraph: {
    title: "Huis verkopen zonder uitgebreide bezichtigingsrondes",
    description: "Wilt u verkopen zonder uitgebreide bezichtigingsrondes? Laat vrijblijvend beoordelen of een directe verkooproute bij uw woning en situatie past.",
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-zonder-bezichtigingen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
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
  "shortAnswer": "Bij directe verkoop is een openbare bezichtigingsronde meestal niet nodig. Soms is wel aanvullende informatie of één gerichte woningopname nodig voordat een voorstel kan worden uitgewerkt.",
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
        "Bij Vastgoed Direct Nederland bespreken wij of een directe verkooproute past bij uw situatie."
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
    "Als directe verkoop passend is, ontvangt u een vrijblijvend verkoopvoorstel.",
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
      "Geen open huis nodig"
    ],
    [
      "Privacy",
      "Woning komt breed in beeld",
      "Discretere route mogelijk"
    ],
    [
      "Voorbereiding",
      "Opruimen en presenteren",
      "De huidige staat is bespreekbaar"
    ],
    [
      "Beslissing",
      "Afhankelijk van kijkers en biedingen",
      "Eerst een vrijblijvend voorstel"
    ]
  ],
  "faqs": [
    {
      "question": "Kan ik mijn huis verkopen zonder bezichtigingen?",
      "answer": "Ja. Een openbare bezichtigingsronde is meestal niet nodig. Soms is aanvullende informatie of één gerichte woningopname nodig."
    },
    {
      "question": "Moet mijn woning op Funda?",
      "answer": "Nee, bij directe verkoop is een openbare Funda-campagne niet standaard nodig."
    },
    {
      "question": "Kan dit als de woning nog vol staat?",
      "answer": "Ja, dat kan worden besproken. Geef wel duidelijk aan wat er achterblijft."
    },
    {
      "question": "Is de aanvraag vrijblijvend?",
      "answer": "Ja. U beslist pas nadat u het voorstel heeft bekeken."
    }
  ],
  "ctaTitle": "Wilt u verkopen zonder uitgebreide bezichtigingsrondes?",
  "ctaText": "Vraag vrijblijvend uw verkoopmogelijkheden aan."
};

export default function HuisVerkopenZonderBezichtigingenPage() {
  return <SeoLandingPage page={page} />;
}
