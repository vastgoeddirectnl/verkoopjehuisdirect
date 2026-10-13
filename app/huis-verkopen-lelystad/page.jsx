import SeoLandingPage from "../components/SeoLandingPage";

const description =
  "Huis verkopen in Lelystad zonder open huis of verkoopstress? Wij kopen woningen in Lelystad en Lelystad-Haven zelf. Vraag vrijblijvend een voorstel met prijs aan.";

export const metadata = {
  title: "Huis verkopen in Lelystad",
  description,
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-lelystad",
  },
  openGraph: {
    title: "Huis verkopen in Lelystad | vrijblijvend verkoopvoorstel",
    description,
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-lelystad",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

const page = {
  slug: "/huis-verkopen-lelystad",
  pageType: "region",
  regionName: "Lelystad",
  localAreas: [
    "Lelystad-Haven", "Stadshart", "Atolwijk", "Boswijk", "Bolder", "Waterwijk",
    "Zuiderzeewijk", "Kustwijk", "Hollandse Hout", "Warande",
  ],
  localAreasTitle: "In en rond Lelystad",
  breadcrumb: "Huis verkopen in Lelystad",
  eyebrow: "Regio Lelystad",
  h1: "Uw huis in Lelystad verkopen, rechtstreeks aan ons",
  lead:
    "Verkoopt u een rijwoning, twee-onder-een-kapwoning of appartement in Lelystad? Wij kopen woningen zelf, ook als er onderhoud nodig is of de woning nog vol staat. U krijgt eerst een vrijblijvend voorstel met prijs en planning.",
  heroNote: "Vrijblijvend. U ontvangt eerst duidelijkheid en beslist daarna zelf of u verder wilt.",
  defaultSituation: "Huis verkopen in Lelystad",
  afterRequestText:
    "Wij bekijken uw woninggegevens, de locatie in Lelystad en uw gewenste planning. Als directe verkoop passend is, ontvangt u een vrijblijvend verkoopvoorstel. Wij garanderen vooraf geen verkoop binnen een vaste termijn.",
  shortAnswer:
    "Voor een woning in Lelystad of Lelystad-Haven kunt u rechtstreeks een vrijblijvende beoordeling aanvragen. Dat kan ook bij achterstallig onderhoud, leegstand, verhuur of een erfenis.",
  benefits: [
    "Actief in heel Lelystad",
    "Ook bij onderhoud of leegstand",
    "Geen open huis nodig",
    "Vrijblijvend voorstel",
    "Overdrachtsdatum in overleg",
    "Notariële overdracht",
  ],
  heroBenefits: [
    "Wij kopen zelf, geen tussenpersoon",
    "Vrijblijvend voorstel met prijs",
    "Geen kijkers over de vloer",
    "Duidelijke afspraken",
  ],
  concernTitle: "Situaties die wij in Lelystad vaak tegenkomen",
  concernCards: [
    "Een woning uit de jaren zeventig of tachtig is toe aan onderhoud of verduurzaming.",
    "U verhuist en wilt de verkoop laten aansluiten op uw nieuwe woning.",
    "Een ouderlijke woning of erfeniswoning moet worden verkocht en leeggehaald.",
    "U wilt geen reeks bezichtigingen, maar wel vooraf weten waar u aan toe bent.",
  ],
  solutionTitle: "Wat wij meenemen in de beoordeling",
  solutionCards: [
    "De wijk, het woningtype en het bouwjaar.",
    "De huidige staat, bewoning en eventuele achtergebleven spullen.",
    "Uw gewenste overdrachtsdatum en praktische opleverafspraken.",
    "Of directe verkoop voor u genoeg voordeel heeft ten opzichte van regulier verkopen.",
  ],
  vdnTasks: [
    "Woninggegevens en de situatie beoordelen.",
    "Meedenken over oplevering, planning en eventuele bijzonderheden.",
    "Als directe verkoop passend is, een vrijblijvend verkoopvoorstel uitwerken.",
    "Bij akkoord zorgen dat afspraken schriftelijk en notarieel worden vastgelegd.",
  ],
  ownerTasks: [
    "De staat en bekende bijzonderheden van de woning delen.",
    "Aangeven welke termijn of overdracht gewenst is.",
    "Controleren of alle eigenaren of erfgenamen kunnen meewerken.",
    "Het voorstel rustig beoordelen voordat verdere afspraken worden gemaakt.",
  ],
  sections: [
    {
      title: "Woningen uit de beginjaren en nieuwe wijken",
      paragraphs: [
        "Lelystad werd vanaf eind jaren zestig gebouwd. Veel woningen in wijken als de Atolwijk, Boswijk, Bolder en Waterwijk stammen uit de jaren zeventig en tachtig en zijn nu toe aan onderhoud of verduurzaming. In nieuwere wijken zoals Warande spelen eerder vragen rond verhuizen en planning.",
        "Wij beoordelen de woning zoals ze nu is. U hoeft niet eerst te verbouwen om te weten wat een directe verkoop kan opleveren.",
      ],
    },
    {
      title: "Een erfenis of ouderlijke woning in Lelystad",
      paragraphs: [
        "Moet een ouderlijke woning worden verkocht terwijl de erfgenamen elders wonen, dan zijn leeghalen, beheer en bezichtigingen veel werk op afstand. Wij kunnen een woning ook kopen als die nog niet leeg is; wat er achterblijft, spreken we vooraf af.",
      ],
    },
    {
      title: "Passende verkoopsituaties",
      bullets: [
        "Rijwoning of gezinswoning met achterstallig onderhoud",
        "Erfeniswoning die nog vol staat",
        "Verkoop die moet aansluiten op een nieuwe woning",
        "Leegstaande of verhuurde woning",
        "Woning in Lelystad-Haven of het centrum",
      ],
    },
  ],
  processTitle: "Hoe verloopt een aanvraag?",
  processSteps: [
    { title: "Aanvraag indienen", text: "U deelt het adres, het type woning en uw situatie." },
    { title: "Beoordeling", text: "Wij kijken naar de woning, de staat, de wijk en uw planning." },
    { title: "Vrijblijvend verkoopvoorstel", text: "Als directe verkoop passend is, ontvangt u een voorstel met prijs en voorwaarden." },
    { title: "Afspraken en overdracht", text: "Alleen bij akkoord worden de afspraken vastgelegd en loopt de overdracht via de notaris." },
  ],
  comparisonRows: [
    ["Voorbereiding", "Vaak verkoopklaar maken voor presentatie", "De huidige staat kan worden beoordeeld"],
    ["Bezichtigingen", "Vaak meerdere kijkers of open huis", "Geen open huis nodig"],
    ["Kosten", "Courtage, presentatie of herstel mogelijk", "Geen makelaarskosten bij directe aankoop"],
    ["Planning", "Afhankelijk van markt en koper", "Overdrachtsdatum in overleg vast te leggen"],
    ["Oplevering", "Regulier per koper af te stemmen", "Bijzonderheden vooraf vastleggen"],
    ["Afwikkeling", "Via koopovereenkomst en notaris", "Bij akkoord ook via koopovereenkomst en notaris"],
  ],
  faqs: [
    {
      question: "Kopen jullie ook in Lelystad-Haven?",
      answer: "Ja. Wij beoordelen woningen in heel Lelystad, inclusief Lelystad-Haven, het Stadshart en de nieuwere wijken.",
    },
    {
      question: "Moet de woning leeg zijn?",
      answer: "Niet altijd. Of meubels en spullen kunnen achterblijven, spreken we af in het voorstel.",
    },
    {
      question: "Moet ik eerst verduurzamen of opknappen?",
      answer: "Nee. Wij beoordelen de woning in de huidige staat en nemen het onderhoud mee in het voorstel.",
    },
    {
      question: "Krijg ik gegarandeerd een bod?",
      answer: "Nee. Wij garanderen vooraf geen bod of verkoop binnen een vaste termijn. Dat hangt af van de woning, de gegevens en de afspraken die mogelijk zijn.",
    },
  ],
  relatedLinks: [
    ["/woning-verkopen-flevoland", "Woning verkopen in Flevoland"],
    ["/huis-verkopen-almere", "Huis verkopen in Almere"],
    ["/huis-verkopen-bij-erfenis", "Huis verkopen bij erfenis"],
    ["/huis-verkopen-zonder-leeghalen", "Huis verkopen zonder leeghalen"],
    ["/huis-verkopen-zonder-opknappen", "Huis verkopen zonder opknappen"],
    ["/huis-verkopen-bij-dubbele-lasten", "Huis verkopen bij dubbele lasten"],
  ],
  ctaTitle: "Huis in Lelystad verkopen?",
  ctaText: "Vraag vrijblijvend een voorstel aan op basis van de woning zoals ze nu is.",
};

export default function HuisVerkopenLelystadPage() {
  return <SeoLandingPage page={page} />;
}
