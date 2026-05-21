import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen aan opkoper? Vrijblijvend voorstel",
  description: "Wilt u uw huis verkopen aan een opkoper of directe koper? Vraag vrijblijvend een verkoopvoorstel aan zonder makelaar.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/huis-verkopen-aan-opkoper",
  },
  openGraph: {
    title: "Huis verkopen aan opkoper? Vrijblijvend voorstel",
    description: "Vraag vrijblijvend een verkoopvoorstel aan als u uw woning zonder traditioneel verkooptraject wilt verkopen.",
    url: "https://www.verkoopjehuisdirect.nl/huis-verkopen-aan-opkoper",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  "slug": "/huis-verkopen-aan-opkoper",
  "breadcrumb": "Huis verkopen aan opkoper",
  "eyebrow": "Huis verkopen aan opkoper",
  "h1": "Huis verkopen aan een opkoper of directe koper",
  "lead": "Wilt u uw huis verkopen aan een opkoper of directe koper zonder traditioneel verkooptraject? Vastgoed Direct Nederland helpt met een vrijblijvende verkoopoplossing, heldere voorwaarden en notariële afwikkeling.",
  "shortAnswer": "Een huis verkopen aan een opkoper betekent dat u niet het volledige traject met makelaar, open huis en particuliere bezichtigingen hoeft te doorlopen. U vraagt vrijblijvend een verkoopvoorstel aan en bespreekt wat mogelijk is.",
  "benefits": [
    "Vrijblijvend verkoopvoorstel",
    "Geen makelaarskosten",
    "Geen open huis nodig",
    "Duidelijke voorwaarden",
    "Opleverdatum in overleg",
    "Notariële afwikkeling"
  ],
  "sections": [
    {
      "title": "Waarom verkopen aan een opkoper?",
      "paragraphs": [
        "Sommige verkopers willen geen maandenlang verkooptraject met bezichtigingen, onderhandelingen en financieringsonzekerheid. Een directe verkoopoplossing kan dan meer rust en snelheid geven.",
        "Dit kan interessant zijn bij leegstand, achterstallig onderhoud, verhuur, erfenis, scheiding of wanneer u vooral snel duidelijkheid wilt."
      ]
    },
    {
      "title": "Let niet alleen op het bod",
      "paragraphs": [
        "Bij verkoop aan een opkoper of directe koper is het belangrijk om niet alleen naar het bedrag te kijken. Ook voorwaarden, kosten, opleverdatum, privacy en notariële afwikkeling tellen mee.",
        "Daarom werken wij met heldere voorwaarden en een vrijblijvend voorstel, zodat u rustig kunt beoordelen of het past."
      ]
    },
    {
      "title": "Voor welke situaties?",
      "bullets": [
        "Huis snel verkopen",
        "Woning verkopen zonder makelaar",
        "Opknapwoning verkopen",
        "Leegstaand huis verkopen",
        "Verhuurde woning verkopen",
        "Geërfd huis verkopen",
        "Woning verkopen zonder bezichtigingen"
      ]
    },
    {
      "title": "Hoe werkt het?",
      "steps": [
        "U vult uw woninggegevens in via het formulier.",
        "Wij bespreken uw situatie, woning en gewenste snelheid.",
        "U ontvangt een vrijblijvend verkoopvoorstel met duidelijke voorwaarden.",
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
      "Verkooproute",
      "Traditioneel via makelaar",
      "Rechtstreeks verkoopvoorstel"
    ],
    [
      "Voorwaarden",
      "Afhankelijk van koper",
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
      "question": "Kan ik mijn huis verkopen aan een opkoper?",
      "answer": "U kunt vrijblijvend een verkoopvoorstel aanvragen als u uw woning zonder traditioneel verkooptraject wilt verkopen."
    },
    {
      "question": "Is verkopen aan een opkoper altijd sneller?",
      "answer": "Snel duidelijkheid is vaak mogelijk, maar de exacte planning hangt af van de woning, documenten, afspraken en notariële mogelijkheden."
    },
    {
      "question": "Moet mijn woning verkoopklaar zijn?",
      "answer": "Nee, ook woningen met achterstallig onderhoud, schade, leegstand of renovatiebehoefte kunnen worden aangemeld."
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
  "ctaTitle": "Wilt u uw huis verkopen aan een opkoper?",
  "ctaText": "Vraag vrijblijvend een verkoopvoorstel aan en vergelijk rustig de voorwaarden, kosten en mogelijkheden."
};

export default function HuisVerkopenAanOpkoper() {
  return <SeoLandingPage page={page} />;
}
