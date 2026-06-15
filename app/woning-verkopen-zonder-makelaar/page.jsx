import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Woning verkopen zonder makelaar",
  description:
    "Woning verkopen zonder makelaar, open huis of gedoe? Ook als de woning nog vol staat of onderhoud nodig heeft. Vraag vrijblijvend een voorstel aan.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/woning-verkopen-zonder-makelaar",
  },
  openGraph: {
    title: "Woning verkopen zonder makelaar",
    description:
      "Woning verkopen zonder makelaar, open huis of gedoe? Ook als de woning nog vol staat of onderhoud nodig heeft. Vraag vrijblijvend een voorstel aan.",
    url: "https://www.verkoopjehuisdirect.nl/woning-verkopen-zonder-makelaar",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  slug: "/woning-verkopen-zonder-makelaar",
  breadcrumb: "Woning verkopen zonder makelaar",
  eyebrow: "Woning verkopen zonder makelaar",
  h1: "Woning verkopen zonder makelaar of gedoe",
  lead:
    "Wilt u uw woning verkopen zonder makelaar, open huis of lange reeks bezichtigingen? Vraag vrijblijvend een voorstel aan. Ook als de woning nog niet verkoopklaar is.",
  shortAnswer:
    "U kunt uw woning zonder makelaar aanmelden voor een vrijblijvend voorstel. De woning hoeft niet eerst leeg, opgeknapt of volledig verkoopklaar te zijn.",
  benefits: [
    "Zonder makelaar verkopen",
    "Geen makelaarskosten",
    "Geen open huis nodig",
    "Niet eerst opknappen",
    "Niet leeghalen",
    "Vrijblijvend voorstel",
  ],
  sections: [
    {
      title: "Woning verkopen zonder makelaar: wanneer past dit?",
      paragraphs: [
        "Niet iedere verkoper wil een standaard verkooptraject met foto's, Funda, open huis en meerdere bezichtigingen.",
        "Soms wilt u vooral weten wat er mogelijk is, zonder dat u de woning eerst helemaal netjes of leeg hoeft te maken.",
      ],
    },
    {
      title: "Geen open huis en geen verkoopdruk",
      paragraphs: [
        "U vraagt vrijblijvend een voorstel aan en beslist daarna zelf of u verder wilt. Er is geen verplichting en geen druk om te verkopen.",
        "Dat kan prettig zijn als privacy belangrijk is of als de woning niet geschikt is voor een normaal bezichtigingstraject.",
      ],
    },
    {
      title: "Voor welke situaties?",
      bullets: [
        "Woning verkopen zonder makelaar",
        "Geen open huis gewenst",
        "Geen zin in bezichtigingen",
        "Woning staat nog vol spullen",
        "Achterstallig onderhoud",
        "Opknapwoning",
        "Behoefte aan privacy",
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
        "Als het voorstel past, worden afspraken over overdracht, oplevering en eventuele spullen in de woning vooraf duidelijk vastgelegd.",
      ],
    },
  ],
  comparisonRows: [
    ["Makelaarskosten", "Vaak courtage of vast tarief", "Geen makelaarskosten"],
    ["Bezichtigingen", "Vaak meerdere kijkers", "Geen open huis nodig"],
    ["Privacy", "Vaak openbare presentatie", "Discreet traject mogelijk"],
    ["Verkoopklaar maken", "Vaak eerst opruimen of herstellen", "Niet eerst opknappen of leeghalen"],
    ["Spullen in de woning", "Moeten vaak eerst weg", "Bespreekbaar binnen het voorstel"],
    ["Afwikkeling", "Afhankelijk van afspraken", "Bij akkoord via de notaris"],
  ],
  faqs: [
    {
      question: "Kan ik mijn woning verkopen zonder makelaar?",
      answer:
        "Ja, u kunt rechtstreeks een vrijblijvend voorstel aanvragen zonder traditioneel makelaarstraject.",
    },
    {
      question: "Moet mijn woning verkoopklaar of leeg zijn?",
      answer:
        "Nee, dat hoeft niet vooraf. Ook als de woning nog vol spullen staat, onderhoud nodig heeft of niet verkoopklaar is, kunt u een aanvraag doen.",
    },
    {
      question: "Moet ik bezichtigingen of een open huis doen?",
      answer:
        "Nee, dat is niet standaard nodig. U kunt eerst rustig een voorstel aanvragen zonder open huis of reeks bezichtigingen.",
    },
    {
      question: "Is de aanvraag vrijblijvend?",
      answer:
        "Ja, de aanvraag is gratis en vrijblijvend. U beslist zelf of u verder wilt.",
    },
  ],
  ctaTitle: "Wilt u verkopen zonder makelaarstraject?",
  ctaText:
    "Vraag vrijblijvend een voorstel aan. Ook als de woning nog niet verkoopklaar is of nog vol spullen staat.",
  keywords: "woning verkopen zonder makelaar, huis verkopen zonder makelaar, zonder courtage",
};

export default function WoningVerkopenZonderMakelaarPage() {
  return <SeoLandingPage page={page} />;
}
