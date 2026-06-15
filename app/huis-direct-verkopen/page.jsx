import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis direct verkopen",
  description:
    "Huis direct verkopen zonder gedoe? Ook als de woning nog vol staat, onderhoud nodig heeft of niet verkoopklaar is. Vraag vrijblijvend een voorstel aan.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/huis-direct-verkopen",
  },
  openGraph: {
    title: "Huis direct verkopen",
    description:
      "Huis direct verkopen zonder gedoe? Ook als de woning nog vol staat, onderhoud nodig heeft of niet verkoopklaar is. Vraag vrijblijvend een voorstel aan.",
    url: "https://www.verkoopjehuisdirect.nl/huis-direct-verkopen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  slug: "/huis-direct-verkopen",
  breadcrumb: "Huis direct verkopen",
  eyebrow: "Huis direct verkopen",
  h1: "Huis direct verkopen zonder gedoe",
  lead:
    "Wilt u weten wat er mogelijk is met uw woning? Vraag vrijblijvend een voorstel aan. Ook als de woning onderhoud nodig heeft, nog vol spullen staat of niet verkoopklaar is.",
  shortAnswer:
    "U kunt vrijblijvend een voorstel aanvragen wanneer u uw huis direct wilt verkopen. De woning hoeft niet eerst opgeknapt, leeggehaald of verkoopklaar gemaakt te worden voordat u contact opneemt.",
  benefits: [
    "Huis direct verkopen",
    "Niet eerst opknappen",
    "Niet leeghalen",
    "Geen open huis nodig",
    "Vrijblijvend voorstel",
    "Persoonlijk contact",
  ],
  sections: [
    {
      title: "Huis direct verkopen: wanneer is dit interessant?",
      paragraphs: [
        "Een directe verkoopoplossing kan interessant zijn wanneer u geen lang verkooptraject wilt of eerst gewoon wilt weten waar u aan toe bent.",
        "Dit kan bijvoorbeeld spelen bij leegstand, achterstallig onderhoud, een woning die nog vol spullen staat, verhuur, erfenis, scheiding of dubbele lasten.",
      ],
    },
    {
      title: "De woning hoeft niet verkoopklaar te zijn",
      paragraphs: [
        "U hoeft de woning niet eerst te schilderen, op te ruimen, leeg te halen of verkoopklaar te maken om een voorstel aan te vragen.",
        "Wij kijken naar de woning zoals deze nu is en bespreken daarna rustig welke mogelijkheden er zijn.",
      ],
    },
    {
      title: "Voor welke situaties?",
      bullets: [
        "Huis direct verkopen",
        "Woning staat nog vol spullen",
        "Achterstallig onderhoud",
        "Opknapwoning of klushuis",
        "Leegstaande woning",
        "Erfeniswoning",
        "Verhuurde woning",
        "Snel duidelijkheid gewenst",
      ],
    },
    {
      title: "Hoe werkt het?",
      steps: [
        "U vult kort uw adres en situatie in.",
        "Wij nemen persoonlijk contact met u op.",
        "U ontvangt een vrijblijvend voorstel met voorwaarden en planning.",
        "Als het past, wordt de overdracht via de notaris geregeld.",
      ],
    },
    {
      title: "Kosten en afwikkeling",
      paragraphs: [
        "De aanvraag is gratis en vrijblijvend. U betaalt geen makelaarskosten voor een aanvraag via Vastgoed Direct Nederland.",
        "Bij een passende verkoop worden afspraken over levering, oplevering en eventuele spullen in de woning vooraf duidelijk vastgelegd.",
      ],
    },
  ],
  comparisonRows: [
    ["Makelaarskosten", "Vaak courtage of vast tarief", "Geen makelaarskosten"],
    ["Bezichtigingen", "Vaak meerdere kijkers", "Geen open huis nodig"],
    ["Verkoopklaar maken", "Vaak opruimen, schoonmaken en herstellen", "Niet eerst opknappen of leeghalen"],
    ["Woning staat vol", "Kan verkoop lastiger maken", "Bespreekbaar binnen het voorstel"],
    ["Opleverdatum", "Afhankelijk van koper", "In overleg bespreekbaar"],
    ["Afwikkeling", "Afhankelijk van afspraken", "Bij akkoord via de notaris"],
  ],
  faqs: [
    {
      question: "Kan ik mijn huis direct verkopen zonder makelaar?",
      answer:
        "Ja, u kunt rechtstreeks een vrijblijvend voorstel aanvragen zonder traditioneel makelaarstraject.",
    },
    {
      question: "Moet mijn woning leeg of verkoopklaar zijn?",
      answer:
        "Nee, dat hoeft niet vooraf. Ook als de woning nog vol spullen staat, onderhoud nodig heeft of niet verkoopklaar is, kunt u een aanvraag doen.",
    },
    {
      question: "Zit ik ergens aan vast na de aanvraag?",
      answer:
        "Nee, de aanvraag is gratis en vrijblijvend. U beslist zelf of u verder wilt.",
    },
    {
      question: "Betaal ik makelaarskosten?",
      answer:
        "Nee, u betaalt geen makelaarskosten voor een vrijblijvende aanvraag via Vastgoed Direct Nederland.",
    },
  ],
  ctaTitle: "Wilt u weten wat er mogelijk is met uw woning?",
  ctaText:
    "Vraag vrijblijvend een voorstel aan. Ook als de woning nog niet verkoopklaar is of nog vol spullen staat.",
  keywords: "huis direct verkopen, direct huis verkopen, woning direct verkopen",
};

export default function HuisDirectVerkopenPage() {
  return <SeoLandingPage page={page} />;
}
