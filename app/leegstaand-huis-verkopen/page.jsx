import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Leegstaand huis verkopen",
  description:
    "Leegstaand huis verkopen zonder open huis, makelaarstraject of verkoopstress? Ook als de woning nog spullen bevat of onderhoud nodig heeft.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/leegstaand-huis-verkopen",
  },
  openGraph: {
    title: "Leegstaand huis verkopen",
    description:
      "Leegstaand huis verkopen zonder open huis, makelaarstraject of verkoopstress? Ook als de woning nog spullen bevat of onderhoud nodig heeft.",
    url: "https://www.verkoopjehuisdirect.nl/leegstaand-huis-verkopen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  slug: "/leegstaand-huis-verkopen",
  breadcrumb: "Leegstaand huis verkopen",
  eyebrow: "Leegstaand huis verkopen",
  h1: "Leegstaand huis verkopen zonder gedoe",
  lead:
    "Staat de woning leeg of kost deze u elke maand geld? Vraag vrijblijvend een voorstel aan. Ook als de woning nog spullen bevat, onderhoud nodig heeft of niet verkoopklaar is.",
  shortAnswer:
    "Een leegstaand huis kan vrijblijvend worden aangemeld voor een voorstel. De woning hoeft niet eerst opgeknapt, leeggehaald of volledig verkoopklaar gemaakt te worden.",
  benefits: [
    "Leegstaand huis verkopen",
    "Ook bij dubbele lasten",
    "Niet eerst opknappen",
    "Niet leeghalen",
    "Geen open huis nodig",
    "Vrijblijvend voorstel",
  ],
  sections: [
    {
      title: "Leegstaand huis verkopen: wanneer is dit interessant?",
      paragraphs: [
        "Een leegstaande woning kan zorgen geven door kosten, onderhoud, verzekeringen, toezicht of risico op achteruitgang.",
        "Als een normaal verkooptraject niet goed past, kunt u eerst vrijblijvend laten beoordelen wat er mogelijk is.",
      ],
    },
    {
      title: "Ook als de woning nog niet klaar is voor verkoop",
      paragraphs: [
        "Een leegstaande woning is niet altijd automatisch verkoopklaar. Soms staan er nog spullen, is er onderhoud nodig of moet er nog veel geregeld worden.",
        "U hoeft dit niet allemaal vooraf op te lossen om een voorstel aan te vragen.",
      ],
    },
    {
      title: "Voor welke situaties?",
      bullets: [
        "Leegstaand huis verkopen",
        "Leegstaande woning met spullen",
        "Dubbele lasten",
        "Achterstallig onderhoud",
        "Woning is niet verkoopklaar",
        "Erfeniswoning",
        "Geen open huis gewenst",
        "Snel duidelijkheid gewenst",
      ],
    },
    {
      title: "Hoe werkt het?",
      steps: [
        "U vult kort uw adres en situatie in.",
        "Wij nemen persoonlijk contact met u op.",
        "U ontvangt een vrijblijvend voorstel met voorwaarden en planning.",
        "U beslist zelf of u verder wilt.",
      ],
    },
    {
      title: "Kosten en afwikkeling",
      paragraphs: [
        "De aanvraag is gratis en vrijblijvend. U betaalt geen makelaarskosten voor een aanvraag via Vastgoed Direct Nederland.",
        "Als het voorstel past, worden afspraken over oplevering, overdracht en eventuele achtergebleven spullen duidelijk vastgelegd.",
      ],
    },
  ],
  comparisonRows: [
    ["Makelaarskosten", "Vaak courtage of vast tarief", "Geen makelaarskosten"],
    ["Bezichtigingen", "Vaak meerdere kijkers", "Geen open huis nodig"],
    ["Leegstand", "Kosten lopen vaak door", "Snelle duidelijkheid mogelijk"],
    ["Spullen in de woning", "Moeten vaak eerst weg", "Bespreekbaar binnen het voorstel"],
    ["Onderhoud", "Kan verkoop lastiger maken", "Wordt meegenomen in het voorstel"],
    ["Afwikkeling", "Afhankelijk van afspraken", "Bij akkoord via de notaris"],
  ],
  faqs: [
    {
      question: "Kan ik een leegstaand huis verkopen zonder makelaar?",
      answer:
        "Ja, u kunt rechtstreeks een vrijblijvend voorstel aanvragen zonder traditioneel makelaarstraject.",
    },
    {
      question: "Moet de woning eerst leeggehaald worden?",
      answer:
        "Nee, niet vooraf. Ook als er nog spullen in de woning staan, kunt u een aanvraag doen.",
    },
    {
      question: "Kan ik ook een leegstaande woning met onderhoud aanmelden?",
      answer:
        "Ja, ook bij achterstallig onderhoud of een woning die niet verkoopklaar is, kunt u vrijblijvend contact opnemen.",
    },
    {
      question: "Is de aanvraag vrijblijvend?",
      answer:
        "Ja, de aanvraag is gratis en vrijblijvend. U beslist zelf of u verder wilt.",
    },
  ],
  ctaTitle: "Wilt u een leegstaand huis verkopen?",
  ctaText:
    "Vraag vrijblijvend een voorstel aan. Ook als de woning nog spullen bevat, onderhoud nodig heeft of niet verkoopklaar is.",
  keywords: "leegstaand huis verkopen, leegstaande woning verkopen, woning leegstand verkopen",
};

export default function LeegstaandHuisVerkopenPage() {
  return <SeoLandingPage page={page} />;
}
