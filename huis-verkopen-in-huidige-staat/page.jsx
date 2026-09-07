import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen in de huidige staat",
  description: "Uw huis verkopen in de huidige staat zonder eerst op te knappen, leeg te halen of verkoopklaar te maken? Vraag vrijblijvend duidelijkheid aan.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-in-huidige-staat",
  },
  openGraph: {
    title: "Huis verkopen in de huidige staat",
    description: "Uw huis verkopen in de huidige staat zonder eerst op te knappen, leeg te halen of verkoopklaar te maken? Vraag vrijblijvend duidelijkheid aan.",
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-in-huidige-staat",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

const page = {
  slug: "/huis-verkopen-in-huidige-staat",
  pageType: "situation",
  breadcrumb: "Huis verkopen in de huidige staat",
  eyebrow: "Verkopen zoals het is",
  h1: "Huis verkopen in de huidige staat",
  lead: "Niet eerst opknappen, leeghalen of verkoopklaar maken. Vraag vrijblijvend wat er mogelijk is als u de woning wilt verkopen zoals deze nu is.",
  shortAnswer: "Een woning hoeft niet altijd eerst verkoopklaar te zijn. Ook bij onderhoud, schade, leegstand of spullen in de woning kunt u vrijblijvend laten bekijken welke verkooproute past.",
  defaultSituation: "Woning in de huidige staat verkopen",
  benefits: [
    "Verkopen zoals het is",
    "Niet eerst opknappen",
    "Niet eerst leeghalen",
    "Geen open huis nodig",
    "Vrijblijvend voorstel",
    "U beslist zelf",
  ],
  exampleSituation: {
    title: "Als verkoopklaar maken niet logisch is",
    text: "Een eigenaar wil duidelijkheid, maar de woning heeft onderhoud nodig of staat nog vol spullen. Dan kan het prettiger zijn om eerst een voorstel te ontvangen op basis van de huidige staat in plaats van direct kosten te maken.",
  },
  sections: [
    {
      title: "Wat betekent verkopen in de huidige staat?",
      paragraphs: [
        "Verkopen in de huidige staat betekent dat u eerst laat bekijken wat mogelijk is zonder de woning vooraf volledig klaar te maken voor verkoop.",
        "Dat kan passen als u geen tijd, geld of energie wilt steken in herstel, styling, schilderwerk, opruimen of bezichtigingen.",
      ],
    },
    {
      title: "Voor welke woningen kan dit passen?",
      bullets: [
        "Woningen met achterstallig onderhoud",
        "Woningen die nog vol spullen staan",
        "Leegstaande woningen",
        "Gedateerde woningen",
        "Woningen met schade of herstelpunten",
        "Woningen waarbij privacy of rust belangrijk is",
      ],
    },
    {
      title: "Waarom eerst vrijblijvend duidelijkheid?",
      paragraphs: [
        "Opknappen of leeghalen kost vaak tijd en geld. Door eerst een voorstel aan te vragen, krijgt u beter zicht op de verkoopmogelijkheden voordat u keuzes maakt.",
      ],
    },
    {
      title: "Hoe werkt het?",
      steps: [
        "U vult kort postcode, huisnummer en uw situatie in.",
        "Wij nemen persoonlijk contact met u op.",
        "De woning kan in de huidige staat worden besproken of bekeken.",
        "U ontvangt duidelijkheid over bedrag, planning en voorwaarden.",
        "U beslist zelf of u verder wilt.",
      ],
    },
    {
      title: "Waar moet u op letten?",
      paragraphs: [
        "Geef bekende gebreken, achterstallig onderhoud en achterblijvende spullen duidelijk door. Zo kunnen afspraken over oplevering, planning en overdracht helder worden vastgelegd.",
      ],
    },
  ],
  comparisonRows: [
    ["Opknappen", "Vaak eerst nodig voor presentatie", "Niet vooraf nodig voor een voorstel"],
    ["Leeghalen", "Vaak zelf regelen voor foto's", "Kan worden meegenomen in de afspraken"],
    ["Bezichtigingen", "Meerdere kijkers of open huis", "Geen open huis nodig"],
    ["Kosten vooraf", "Herstel, styling of opruimen", "Eerst vrijblijvend duidelijkheid"],
    ["Planning", "Afhankelijk van markt en koper", "In overleg vast te leggen"],
    ["Beslissing", "Vaak pas later overzicht", "U beslist zelf na het voorstel"],
  ],
  faqs: [
    {
      question: "Kan ik mijn huis verkopen in de huidige staat?",
      answer: "Ja, dat kan in veel situaties. Ook als de woning onderhoud nodig heeft, nog vol spullen staat of niet verkoopklaar is, kunt u vrijblijvend laten bekijken wat mogelijk is.",
    },
    {
      question: "Moet ik de woning eerst opknappen?",
      answer: "Nee, niet altijd. Soms is eerst duidelijkheid krijgen verstandiger dan direct investeren in verbouwing, styling of herstel.",
    },
    {
      question: "Kan de woning nog vol spullen staan?",
      answer: "Ja, dat kan worden besproken. De woning hoeft niet altijd eerst volledig leeg te zijn voordat u een voorstel aanvraagt.",
    },
    {
      question: "Is de aanvraag vrijblijvend?",
      answer: "Ja. U vraagt eerst duidelijkheid aan en beslist daarna zelf of u verder wilt.",
    },
    {
      question: "Hoe snel krijg ik reactie?",
      answer: "Na uw aanvraag nemen wij persoonlijk contact op om de woning en uw situatie kort door te nemen.",
    },
  ],
  relatedLinks: [
    ["/huis-verkopen-zonder-opknappen", "Huis verkopen zonder opknappen"],
    ["/huis-verkopen-zonder-leeghalen", "Huis verkopen zonder leeghalen"],
    ["/woning-verkopen-die-nog-vol-staat", "Woning verkopen die nog vol staat"],
    ["/opknapwoning-verkopen", "Opknapwoning verkopen"],
    ["/huis-verkopen-met-achterstallig-onderhoud", "Huis verkopen met achterstallig onderhoud"],
    ["/leegstaand-huis-verkopen", "Leegstaand huis verkopen"],
  ],
  ctaTitle: "Wilt u verkopen in de huidige staat?",
  ctaText: "Vraag vrijblijvend een voorstel aan zonder de woning eerst op te knappen, leeg te halen of verkoopklaar te maken.",
};

export default function HuisVerkopenInHuidigeStaatPage() {
  return <SeoLandingPage page={page} />;
}
