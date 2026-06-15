import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Opknapwoning verkopen",
  description:
    "Opknapwoning verkopen zonder eerst te renoveren, herstellen of leeg te halen? Vraag vrijblijvend een voorstel aan.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/opknapwoning-verkopen",
  },
  openGraph: {
    title: "Opknapwoning verkopen",
    description:
      "Opknapwoning verkopen zonder eerst te renoveren, herstellen of leeg te halen? Vraag vrijblijvend een voorstel aan.",
    url: "https://www.verkoopjehuisdirect.nl/opknapwoning-verkopen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  slug: "/opknapwoning-verkopen",
  breadcrumb: "Opknapwoning verkopen",
  eyebrow: "Opknapwoning verkopen",
  h1: "Opknapwoning verkopen zonder eerst op te knappen",
  lead:
    "Heeft de woning onderhoud nodig of is deze niet verkoopklaar? Vraag vrijblijvend een voorstel aan. U hoeft niet eerst te renoveren, herstellen of leeg te halen.",
  shortAnswer:
    "Een opknapwoning, klushuis of woning met achterstallig onderhoud kan vrijblijvend worden aangemeld. U hoeft de woning niet eerst te verbouwen, schilderen, herstellen of leeghalen.",
  benefits: [
    "Opknapwoning verkopen",
    "Niet eerst renoveren",
    "Niet leeghalen",
    "Ook bij achterstallig onderhoud",
    "Geen open huis nodig",
    "Vrijblijvend voorstel",
  ],
  sections: [
    {
      title: "Opknapwoning verkopen: wanneer is dit interessant?",
      paragraphs: [
        "Een opknapwoning verkopen via een normaal traject kan lastig zijn als er veel onderhoud is of als de woning niet netjes gepresenteerd kan worden.",
        "Bij Vastgoed Direct Nederland kunt u eerst rustig een voorstel aanvragen op basis van de woning zoals deze nu is.",
      ],
    },
    {
      title: "Niet eerst verbouwen, herstellen of leeghalen",
      paragraphs: [
        "U hoeft geen kosten te maken voor renovatie voordat u weet wat er mogelijk is. Ook opruimen of leeghalen hoeft niet vooraf.",
        "Dat maakt de aanvraag laagdrempelig, juist bij woningen met achterstallig onderhoud, schade of spullen in de woning.",
      ],
    },
    {
      title: "Voor welke situaties?",
      bullets: [
        "Opknapwoning verkopen",
        "Klushuis verkopen",
        "Achterstallig onderhoud",
        "Woning met schade",
        "Woning staat nog vol spullen",
        "Woning is niet verkoopklaar",
        "Leegstand",
        "Erfeniswoning",
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
        "Bij een passende verkoop worden afspraken over oplevering, eventuele spullen en overdracht vooraf duidelijk vastgelegd.",
      ],
    },
  ],
  comparisonRows: [
    ["Renovatie", "Vaak eerst nodig voor betere presentatie", "Niet eerst renoveren"],
    ["Leeghalen", "Vaak nodig voor foto's en bezichtigingen", "Niet vooraf nodig"],
    ["Bezichtigingen", "Vaak meerdere kijkers", "Geen open huis nodig"],
    ["Makelaarskosten", "Vaak courtage of vast tarief", "Geen makelaarskosten"],
    ["Onderhoud", "Kan verkoop lastiger maken", "Wordt meegenomen in het voorstel"],
    ["Afwikkeling", "Afhankelijk van afspraken", "Bij akkoord via de notaris"],
  ],
  faqs: [
    {
      question: "Kan ik een opknapwoning verkopen zonder eerst te renoveren?",
      answer:
        "Ja, u kunt vrijblijvend een voorstel aanvragen zonder eerst te renoveren, schilderen of herstellen.",
    },
    {
      question: "Moet de woning eerst leeg zijn?",
      answer:
        "Nee, niet vooraf. Ook als de woning nog vol spullen staat, kunt u een aanvraag doen.",
    },
    {
      question: "Kan ik ook een woning met achterstallig onderhoud aanmelden?",
      answer:
        "Ja, ook woningen met achterstallig onderhoud, schade of renovatiebehoefte kunnen worden aangemeld.",
    },
    {
      question: "Is de aanvraag vrijblijvend?",
      answer:
        "Ja, de aanvraag is gratis en vrijblijvend. U zit nergens aan vast.",
    },
  ],
  ctaTitle: "Wilt u een opknapwoning verkopen?",
  ctaText:
    "Vraag vrijblijvend een voorstel aan zonder eerst te renoveren, herstellen of leeghalen.",
  keywords: "opknapwoning verkopen, klushuis verkopen, woning verkopen zonder renovatie",
};

export default function OpknapwoningVerkopenPage() {
  return <SeoLandingPage page={page} />;
}
