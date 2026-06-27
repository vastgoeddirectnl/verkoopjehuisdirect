import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen zonder Funda",
  description:
    "Huis verkopen zonder Funda, open huis of openbaar verkooptraject? Vraag vrijblijvend een discreet verkoopvoorstel aan via Vastgoed Direct Nederland.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-zonder-funda",
  },
  openGraph: {
    title: "Huis verkopen zonder Funda",
    description:
      "Huis verkopen zonder Funda, open huis of openbaar verkooptraject? Vraag vrijblijvend een discreet verkoopvoorstel aan via Vastgoed Direct Nederland.",
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-zonder-funda",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  "slug": "/huis-verkopen-zonder-funda",
  "breadcrumb": "Huis verkopen zonder Funda",
  "eyebrow": "Huis verkopen zonder Funda",
  "h1": "Huis verkopen zonder Funda of openbaar verkooptraject",
  "lead": "Wilt u uw woning verkopen zonder plaatsing op Funda, open huis of veel zichtbaarheid? Vastgoed Direct Nederland biedt een discreet alternatief met een vrijblijvend verkoopvoorstel.",
  "shortAnswer": "U kunt uw huis verkopen zonder Funda wanneer u vooral privacy, rust en duidelijkheid wilt. Wij bespreken de mogelijkheden zonder dat uw woning direct openbaar op de markt hoeft.",
  "benefits": [
    "Geen Funda-publicatie nodig",
    "Discreet contact",
    "Geen open huis",
    "Geen makelaarskosten",
    "Vrijblijvend voorstel",
    "Notariële afwikkeling"
  ],
  "sections": [
    {
      "title": "Waarom verkopen zonder Funda?",
      "paragraphs": [
        "Niet iedereen wil de woning openbaar te koop zetten. Soms speelt privacy mee, soms de staat van de woning of een persoonlijke situatie zoals scheiding, erfenis of financiële druk.",
        "Een directe verkooproute kan dan rust geven. U hoeft niet eerst een verkoopcampagne te starten om te weten wat er mogelijk is."
      ]
    },
    {
      "title": "Voor welke situaties?",
      "bullets": [
        "Privacy is belangrijk",
        "U wilt geen buren/kijkers over de vloer",
        "De woning is verhuurd of leegstaand",
        "Er is sprake van onderhoud of schade",
        "U wilt eerst weten wat een directe verkoop kan opleveren"
      ]
    },
    {
      "title": "Hoe werkt het?",
      "steps": [
        "U vraagt vrijblijvend een voorstel aan.",
        "Wij bespreken uw situatie discreet.",
        "U ontvangt een helder verkoopvoorstel.",
        "Bij akkoord verloopt de overdracht via de notaris."
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
      "question": "Kan ik mijn huis verkopen zonder Funda?",
      "answer": "Ja, u kunt vrijblijvend een verkoopvoorstel aanvragen zonder dat uw woning openbaar op Funda hoeft te staan."
    },
    {
      "question": "Is dit geschikt bij privacygevoelige situaties?",
      "answer": "Ja, juist wanneer privacy belangrijk is kan een direct en discreet traject passend zijn."
    },
    {
      "question": "Moet ik alsnog een makelaar inschakelen?",
      "answer": "Nee, voor een aanvraag via Vastgoed Direct Nederland betaalt u geen makelaarskosten."
    },
    {
      "question": "Is de aanvraag vrijblijvend?",
      "answer": "Ja, de aanvraag is gratis en verplicht u tot niets."
    }
  ],
  "ctaTitle": "Wilt u verkopen zonder Funda?",
  "ctaText": "Vraag gratis een discreet verkoopvoorstel aan en ontdek wat er mogelijk is zonder openbaar verkooptraject.",
  "keywords": "huis verkopen zonder funda, woning verkopen zonder funda, discreet huis verkopen"
};

export default function Page() {
  return <SeoLandingPage page={page} />;
}
