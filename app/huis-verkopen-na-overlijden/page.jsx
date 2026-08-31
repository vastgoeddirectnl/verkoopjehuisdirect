import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen na overlijden",
  description:
    "Huis verkopen na overlijden of erfenis? Vraag vrijblijvend een verkoopvoorstel aan met duidelijke afspraken en notariële afwikkeling.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-na-overlijden",
  },
  openGraph: {
    title: "Huis verkopen na overlijden",
    description:
      "Huis verkopen na overlijden of erfenis? Vraag vrijblijvend een verkoopvoorstel aan met duidelijke afspraken en notariële afwikkeling.",
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-na-overlijden",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

const page = {
  "slug": "/huis-verkopen-na-overlijden",
  "breadcrumb": "Huis verkopen na overlijden",
  "eyebrow": "Huis verkopen na overlijden",
  "h1": "Huis verkopen na overlijden met rust en duidelijke afspraken",
  "lead": "Na een overlijden komt er vaak veel tegelijk op u af. Vastgoed Direct Nederland helpt erfgenamen die rustig willen bekijken welke verkoopmogelijkheden er zijn.",
  "shortAnswer": "U kunt vrijblijvend een verkoopvoorstel aanvragen voor een woning na overlijden. Wij houden rekening met rust, overleg tussen betrokkenen en duidelijke notariële afwikkeling.",
  "benefits": [
    "Rustige verkooproute",
    "Duidelijke voorwaarden",
    "Geen open huis nodig",
    "Geen makelaarskosten",
    "Geschikt bij erfenis",
    "Notariële afwikkeling"
  ],
  "sections": [
    {
      "title": "Woning verkopen na overlijden",
      "paragraphs": [
        "Na een overlijden kan een woning leeg komen te staan of moeten erfgenamen samen beslissen wat er met de woning gebeurt.",
        "Een directe verkooproute kan rust geven wanneer u geen lang traditioneel verkooptraject wilt."
      ]
    },
    {
      "title": "Waar moet u aan denken?",
      "bullets": [
        "Wie zijn de erfgenamen?",
        "Is er een verklaring van erfrecht nodig?",
        "Is de woning leeg of nog bewoond?",
        "Zijn er onderhoudspunten?",
        "Welke overdrachtsdatum is wenselijk?"
      ]
    },
    {
      "title": "Hoe werkt het?",
      "steps": [
        "U meldt de woning vrijblijvend aan.",
        "Wij bespreken de situatie en betrokkenen.",
        "U ontvangt een duidelijk voorstel.",
        "Bij akkoord loopt de overdracht via de notaris."
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
      "question": "Kan ik een geërfde woning direct verkopen?",
      "answer": "Ja, u kunt vrijblijvend een voorstel aanvragen. Wel moeten juridische en notariële zaken goed gecontroleerd worden."
    },
    {
      "question": "Moeten alle erfgenamen akkoord zijn?",
      "answer": "Bij verkoop moeten de bevoegde partijen uiteindelijk akkoord zijn. Dit wordt notarieel gecontroleerd."
    },
    {
      "question": "Kan de woning leeg of in oude staat worden verkocht?",
      "answer": "In veel situaties kan dat bespreekbaar zijn. Wij bekijken de woning en situatie."
    },
    {
      "question": "Is het voorstel verplichtend?",
      "answer": "Nee, de aanvraag is gratis en vrijblijvend."
    }
  ],
  "ctaTitle": "Wilt u een huis verkopen na overlijden?",
  "ctaText": "Vraag vrijblijvend een voorstel aan en bespreek rustig wat er mogelijk is.",
  "keywords": "huis verkopen na overlijden, woning verkopen na overlijden, erfenis woning verkopen"
};

export default function Page() {
  return <SeoLandingPage page={page} />;
}
