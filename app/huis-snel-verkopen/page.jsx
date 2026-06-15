import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis snel verkopen",
  description:
    "Huis snel verkopen zonder gedoe? Ook bij onderhoud, leegstand of een woning die nog niet leeg is. Vraag vrijblijvend een voorstel aan.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/huis-snel-verkopen",
  },
  openGraph: {
    title: "Huis snel verkopen",
    description:
      "Huis snel verkopen zonder gedoe? Ook bij onderhoud, leegstand of een woning die nog niet leeg is. Vraag vrijblijvend een voorstel aan.",
    url: "https://www.verkoopjehuisdirect.nl/huis-snel-verkopen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  slug: "/huis-snel-verkopen",
  breadcrumb: "Huis snel verkopen",
  eyebrow: "Huis snel verkopen",
  h1: "Huis snel verkopen zonder gedoe",
  lead:
    "Wilt u snel weten wat er mogelijk is met uw woning? Vraag vrijblijvend een voorstel aan. Ook als de woning nog vol spullen staat, onderhoud nodig heeft of niet verkoopklaar is.",
  shortAnswer:
    "Als u uw huis snel wilt verkopen, kunt u eerst vrijblijvend duidelijkheid aanvragen. U hoeft de woning niet vooraf op te knappen of leeg te halen om te horen wat er mogelijk is.",
  benefits: [
    "Snel duidelijkheid",
    "Niet eerst opknappen",
    "Niet leeghalen",
    "Geen open huis nodig",
    "Geen verkoopdruk",
    "Vrijblijvend voorstel",
  ],
  sections: [
    {
      title: "Huis snel verkopen: wanneer is dit interessant?",
      paragraphs: [
        "Snel verkopen kan relevant zijn bij dubbele lasten, leegstand, verhuizing, erfenis, scheiding of wanneer u geen zin heeft in een lang verkooptraject.",
        "Het belangrijkste is dat u eerst rustig duidelijkheid krijgt. Daarna beslist u zelf of het voorstel bij uw situatie past.",
      ],
    },
    {
      title: "Niet eerst alles regelen voor de verkoop",
      paragraphs: [
        "Bij een normale verkoop moet een woning vaak netjes, leeg en verkoopklaar zijn. Dat is niet altijd haalbaar of wenselijk.",
        "Daarom kunt u ook contact opnemen als de woning nog vol staat, onderhoud nodig heeft of nog niet klaar is voor bezichtigingen.",
      ],
    },
    {
      title: "Voor welke situaties?",
      bullets: [
        "Huis snel verkopen",
        "Dubbele lasten",
        "Leegstand",
        "Woning staat nog vol spullen",
        "Achterstallig onderhoud",
        "Opknapwoning",
        "Erfenis of nalatenschap",
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
        "Als het voorstel past, worden afspraken over overdracht, oplevering en eventuele spullen in de woning duidelijk vastgelegd.",
      ],
    },
  ],
  comparisonRows: [
    ["Makelaarskosten", "Vaak courtage of vast tarief", "Geen makelaarskosten"],
    ["Bezichtigingen", "Vaak meerdere kijkers", "Geen open huis nodig"],
    ["Snelheid", "Kan weken of maanden duren", "Snel duidelijkheid mogelijk"],
    ["Verkoopklaar maken", "Vaak eerst opruimen of herstellen", "Niet eerst opknappen of leeghalen"],
    ["Spullen in de woning", "Moeten vaak eerst weg", "Bespreekbaar binnen het voorstel"],
    ["Afwikkeling", "Afhankelijk van afspraken", "Bij akkoord via de notaris"],
  ],
  faqs: [
    {
      question: "Kan ik mijn huis snel verkopen zonder makelaar?",
      answer:
        "Ja, u kunt rechtstreeks een vrijblijvend voorstel aanvragen zonder traditioneel makelaarstraject.",
    },
    {
      question: "Moet de woning eerst leeg zijn?",
      answer:
        "Nee, niet vooraf. Ook als de woning nog vol spullen staat, kunt u een aanvraag doen.",
    },
    {
      question: "Moet ik eerst opknappen of herstellen?",
      answer:
        "Nee, dat hoeft niet voordat u een voorstel aanvraagt. Ook woningen met onderhoud of schade kunnen worden aangemeld.",
    },
    {
      question: "Is de aanvraag vrijblijvend?",
      answer:
        "Ja, de aanvraag is gratis en vrijblijvend. U zit nergens aan vast.",
    },
  ],
  ctaTitle: "Wilt u snel duidelijkheid over uw woning?",
  ctaText:
    "Vraag vrijblijvend een voorstel aan. Ook als de woning nog niet leeg, opgeknapt of verkoopklaar is.",
  keywords: "huis snel verkopen, snel huis verkopen, woning snel verkopen",
};

export default function HuisSnelVerkopenPage() {
  return <SeoLandingPage page={page} />;
}
