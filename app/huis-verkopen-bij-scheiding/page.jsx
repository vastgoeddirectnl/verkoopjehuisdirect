import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen bij scheiding? Rustig en vrijblijvend",
  description: "Moet de woning verkocht worden bij scheiding of relatiebreuk? Vraag vrijblijvend een verkoopvoorstel aan met duidelijke voorwaarden.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/huis-verkopen-bij-scheiding",
  },
  openGraph: {
    title: "Huis verkopen bij scheiding? Rustig en vrijblijvend",
    description: "Bij scheiding of relatiebreuk kan snelle duidelijkheid belangrijk zijn. Vraag vrijblijvend een verkoopvoorstel aan.",
    url: "https://www.verkoopjehuisdirect.nl/huis-verkopen-bij-scheiding",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  "slug": "/huis-verkopen-bij-scheiding",
  "breadcrumb": "Huis verkopen bij scheiding",
  "eyebrow": "Huis verkopen bij scheiding",
  "h1": "Huis verkopen bij scheiding of relatiebreuk",
  "lead": "Bij een scheiding of relatiebreuk kan de verkoop van de woning gevoelig en ingewikkeld zijn. Vastgoed Direct Nederland helpt met een rustige, vrijblijvende aanpak en duidelijke voorwaarden.",
  "shortAnswer": "Een huis verkopen bij scheiding vraagt om duidelijkheid, zorgvuldige afspraken en rust. U kunt vrijblijvend bespreken wat mogelijk is, zonder direct een traditioneel verkooptraject met makelaar te starten.",
  "benefits": [
    "Rustige aanpak",
    "Vrijblijvend voorstel",
    "Geen makelaarskosten",
    "Duidelijke voorwaarden",
    "Opleverdatum in overleg",
    "Notariële afwikkeling"
  ],
  "sections": [
    {
      "title": "Waarom snel duidelijkheid belangrijk kan zijn",
      "paragraphs": [
        "Bij een scheiding of relatiebreuk spelen vaak meerdere belangen tegelijk. Denk aan dubbele lasten, afspraken over eigendom, woonruimte, emoties en de wens om een hoofdstuk goed af te sluiten.",
        "Een langdurig verkooptraject met bezichtigingen en onderhandelingen past dan niet altijd. Een vrijblijvend verkoopvoorstel kan helpen om overzicht te krijgen."
      ]
    },
    {
      "title": "Situaties waarin wij kunnen meedenken",
      "bullets": [
        "Woning verkopen na relatiebreuk",
        "Woning verkopen bij scheiding",
        "Een van beide partners wil niet blijven wonen",
        "Dubbele lasten of financiële druk",
        "Woning is nog bewoond",
        "Woning moet snel of juist in overleg worden overgedragen",
        "Er is behoefte aan rustige en duidelijke communicatie"
      ]
    },
    {
      "title": "Afspraken zorgvuldig vastleggen",
      "paragraphs": [
        "Bij een verkoop in verband met scheiding is het belangrijk dat afspraken helder zijn. Denk aan wie mag verkopen, welke documenten nodig zijn en hoe de overdracht juridisch en notarieel wordt geregeld.",
        "Wij doen geen juridisch advies, maar zorgen bij akkoord wel voor een duidelijke notariële route en transparante voorwaarden."
      ]
    },
    {
      "title": "Hoe werkt het?",
      "steps": [
        "U meldt de woning vrijblijvend aan.",
        "Wij bespreken de situatie, gewenste snelheid en praktische mogelijkheden.",
        "U ontvangt een verkoopvoorstel met duidelijke voorwaarden.",
        "Bij akkoord wordt de overdracht via de notaris geregeld."
      ]
    },
    {
      "title": "Kosten, notaris en aanbetaling",
      "paragraphs": [
        "U betaalt geen makelaarskosten voor een aanvraag via Vastgoed Direct Nederland. Bij een passende verkoop nemen wij de standaard notariskosten voor de levering voor onze rekening.",
        "In sommige situaties is een aanbetaling of voorschot bespreekbaar, mits dit juridisch en notarieel goed kan worden vastgelegd."
      ]
    }
  ],
  "comparisonRows": [
    [
      "Privacy",
      "Openbare verkoop kan nodig zijn",
      "Rustige en vertrouwelijke aanpak"
    ],
    [
      "Afspraken",
      "Afhankelijk van koper en traject",
      "Vooraf duidelijk bespreken"
    ],
    [
      "Makelaarskosten",
      "Vaak courtage of vast tarief",
      "Geen makelaarskosten"
    ],
    [
      "Bezichtigingen",
      "Vaak meerdere kijkers",
      "Niet standaard nodig"
    ],
    [
      "Snelheid",
      "Kan weken of maanden duren",
      "Snelle duidelijkheid mogelijk"
    ],
    [
      "Opleverdatum",
      "Afhankelijk van koper",
      "In overleg bespreekbaar"
    ],
    [
      "Notariële afwikkeling",
      "Afhankelijk van afspraken",
      "Bij akkoord via de notaris"
    ]
  ],
  "faqs": [
    {
      "question": "Kan ik mijn huis verkopen bij scheiding?",
      "answer": "Ja, u kunt vrijblijvend een verkoopvoorstel aanvragen. Het is wel belangrijk dat de juiste eigenaar(s) akkoord zijn en afspraken goed worden vastgelegd."
    },
    {
      "question": "Wat als één partner nog in de woning woont?",
      "answer": "Dan bespreken we rustig wat mogelijk is. De uiteindelijke afspraken moeten juridisch en notarieel goed kunnen worden vastgelegd."
    },
    {
      "question": "Is snelle duidelijkheid mogelijk?",
      "answer": "Wij proberen snel duidelijkheid te geven over de verkoopmogelijkheden. De exacte planning hangt af van de woning, documenten en afspraken."
    },
    {
      "question": "Kan dit zonder makelaar?",
      "answer": "Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel verkooptraject met een makelaar."
    },
    {
      "question": "Betaal ik makelaarskosten?",
      "answer": "Nee, u betaalt geen makelaarskosten voor een vrijblijvende aanvraag via Vastgoed Direct Nederland."
    },
    {
      "question": "Is de aanvraag vrijblijvend?",
      "answer": "Ja, uw aanvraag is gratis en vrijblijvend. U zit nergens aan vast."
    }
  ],
  "ctaTitle": "Wilt u een woning verkopen bij scheiding?",
  "ctaText": "Vraag vrijblijvend een verkoopvoorstel aan en bespreek rustig wat mogelijk is in uw situatie."
};

export default function HuisVerkopenBijScheiding() {
  return <SeoLandingPage page={page} />;
}
