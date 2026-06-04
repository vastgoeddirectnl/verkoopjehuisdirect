import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis direct verkopen",
  description:
    "Huis direct verkopen zonder makelaar of verkoopstress? Vraag vrijblijvend een helder verkoopvoorstel aan via Vastgoed Direct Nederland.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/huis-direct-verkopen",
  },
  openGraph: {
    title: "Huis direct verkopen",
    description:
      "Huis direct verkopen zonder makelaar of verkoopstress? Vraag vrijblijvend een helder verkoopvoorstel aan via Vastgoed Direct Nederland.",
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
  h1: "Huis direct verkopen zonder makelaar of verkoopstress",
  lead:
    "Wilt u uw huis direct verkopen en snel duidelijkheid krijgen zonder open huis, makelaarskosten of lange verkoopperiode? Vastgoed Direct Nederland helpt woningeigenaren met een rustige en duidelijke verkoopoplossing.",
  shortAnswer:
    "U kunt vrijblijvend een verkoopvoorstel aanvragen wanneer u uw huis direct wilt verkopen. Wij bespreken uw situatie, de woning en de gewenste overdracht rustig en duidelijk.",
  benefits: [
    "Huis direct verkopen",
    "Geen makelaarskosten",
    "Geen open huis nodig",
    "Vrijblijvend verkoopvoorstel",
    "Duidelijke voorwaarden",
    "Notariële afwikkeling",
  ],
  sections: [
    {
      title: "Huis direct verkopen: wanneer is dit interessant?",
      paragraphs: [
        "Een directe verkoopoplossing kan interessant zijn wanneer u snel duidelijkheid wilt, geen lang verkooptraject wilt of de woning niet eerst verkoopklaar wilt maken.",
        "Dit kan bijvoorbeeld spelen bij leegstand, achterstallig onderhoud, verhuur, erfenis, scheiding of wanneer u vooral rust en zekerheid zoekt.",
      ],
    },
    {
      title: "Zonder traditioneel verkooptraject",
      paragraphs: [
        "U hoeft niet altijd te kiezen voor een verkooptraject met meerdere bezichtigingen, open huis of lange onderhandelingen.",
        "Bij Vastgoed Direct Nederland vraagt u vrijblijvend een helder verkoopvoorstel aan. Daarna beslist u rustig of het voorstel past bij uw situatie.",
      ],
    },
    {
      title: "Voor welke situaties?",
      bullets: [
        "Huis direct verkopen",
        "Leegstaande woning",
        "Opknapwoning",
        "Woning met achterstallig onderhoud",
        "Erfeniswoning",
        "Verhuurde woning",
        "Woning bij scheiding",
        "Snel duidelijkheid gewenst",
      ],
    },
    {
      title: "Hoe werkt het?",
      steps: [
        "U vult uw woninggegevens in.",
        "Wij bespreken uw situatie en gewenste snelheid.",
        "U ontvangt een vrijblijvend verkoopvoorstel.",
        "Bij akkoord wordt de overdracht via de notaris geregeld.",
      ],
    },
    {
      title: "Kosten en afwikkeling",
      paragraphs: [
        "U betaalt geen makelaarskosten voor een aanvraag via Vastgoed Direct Nederland. Bij een passende verkoop nemen wij de standaard notariskosten voor de levering voor onze rekening.",
        "Een aanbetaling of voorschot kan in sommige situaties bespreekbaar zijn, mits dit juridisch en notarieel goed wordt vastgelegd.",
      ],
    },
  ],
  comparisonRows: [
    ["Makelaarskosten", "Vaak courtage of vast tarief", "Geen makelaarskosten"],
    ["Bezichtigingen", "Vaak meerdere kijkers", "Niet standaard nodig"],
    ["Snelheid", "Kan weken of maanden duren", "Snelle duidelijkheid mogelijk"],
    ["Onderhoud", "Kan verkoop lastiger maken", "Ook deze woningen kunnen worden aangemeld"],
    ["Opleverdatum", "Afhankelijk van koper", "In overleg bespreekbaar"],
    ["Afwikkeling", "Afhankelijk van afspraken", "Bij akkoord via de notaris"],
  ],
  faqs: [
    {
      question: "Kan ik mijn huis direct verkopen zonder makelaar?",
      answer:
        "Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel makelaarstraject.",
    },
    {
      question: "Is de aanvraag vrijblijvend?",
      answer:
        "Ja, uw aanvraag is gratis en vrijblijvend. U zit nergens aan vast.",
    },
    {
      question: "Moet de woning verkoopklaar zijn?",
      answer:
        "Niet altijd. Ook woningen met onderhoud, leegstand of renovatiebehoefte kunnen worden aangemeld.",
    },
    {
      question: "Betaal ik makelaarskosten?",
      answer:
        "Nee, u betaalt geen makelaarskosten voor een vrijblijvende aanvraag via Vastgoed Direct Nederland.",
    },
  ],
  ctaTitle: "Wilt u uw huis direct verkopen?",
  ctaText:
    "Vraag vrijblijvend een verkoopvoorstel aan en ontvang duidelijkheid over uw mogelijkheden.",
  keywords: "huis direct verkopen, direct huis verkopen, woning direct verkopen",
};

export default function HuisDirectVerkopenPage() {
  return <SeoLandingPage page={page} />;
}
