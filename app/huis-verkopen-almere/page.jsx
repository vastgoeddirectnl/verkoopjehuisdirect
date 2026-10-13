import SeoLandingPage from "../components/SeoLandingPage";

const description =
  "Huis verkopen in Almere zonder open huis of lange verkoopcampagne? Wij kopen woningen in alle stadsdelen zelf. Vraag vrijblijvend een voorstel met prijs aan.";

export const metadata = {
  title: "Huis verkopen in Almere",
  description,
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-almere",
  },
  openGraph: {
    title: "Huis verkopen in Almere | vrijblijvend verkoopvoorstel",
    description,
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-almere",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

const page = {
  slug: "/huis-verkopen-almere",
  pageType: "region",
  regionName: "Almere",
  localAreas: [
    "Almere Stad", "Almere Haven", "Almere Buiten", "Almere Hout", "Almere Poort", "Almere Pampus",
    "Oosterwold", "Muziekwijk", "Filmwijk", "Literatuurwijk", "Stedenwijk", "Noorderplassen", "Nobelhorst",
  ],
  localAreasTitle: "In alle stadsdelen van Almere",
  breadcrumb: "Huis verkopen in Almere",
  eyebrow: "Regio Almere",
  h1: "Uw huis in Almere verkopen zonder lange verkoopcampagne",
  lead:
    "Verkoopt u een rijwoning, appartement of gezinswoning in Almere? Wij kopen woningen zelf, ook als ze nog niet verkoopklaar zijn. U krijgt eerst een vrijblijvend voorstel met prijs en een overdrachtsdatum die bij uw planning past.",
  heroNote: "Vrijblijvend. U ontvangt eerst duidelijkheid en beslist daarna zelf of u verder wilt.",
  defaultSituation: "Huis verkopen in Almere",
  afterRequestText:
    "Wij bekijken uw woninggegevens, de locatie in Almere en uw gewenste planning. Als directe verkoop passend is, ontvangt u een vrijblijvend verkoopvoorstel. Wij garanderen vooraf geen verkoop binnen een vaste termijn.",
  shortAnswer:
    "Voor een woning in Almere kunt u rechtstreeks een vrijblijvende beoordeling aanvragen, van Almere Haven tot Almere Poort en Oosterwold. Dat kan ook bij onderhoud, leegstand, verhuur of spullen in de woning.",
  benefits: [
    "Actief in heel Almere",
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
  concernTitle: "Situaties die wij in Almere vaak tegenkomen",
  concernCards: [
    "U verhuist en wilt de verkoop laten aansluiten op uw nieuwe woning, zonder dubbele lasten.",
    "Een woning uit de eerste bouwjaren van de stad is toe aan onderhoud of verduurzaming.",
    "Een appartement of woning wordt verhuurd en u wilt verkopen zonder de huurder te storen met kijkers.",
    "Na een scheiding of erfenis wilt u vooraf duidelijkheid over prijs en planning.",
  ],
  solutionTitle: "Wat wij meenemen in de beoordeling",
  solutionCards: [
    "Het stadsdeel, het woningtype en het bouwjaar.",
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
    "Controleren of alle eigenaren of betrokkenen kunnen meewerken.",
    "Het voorstel rustig beoordelen voordat verdere afspraken worden gemaakt.",
  ],
  sections: [
    {
      title: "Van Almere Haven tot Almere Poort",
      paragraphs: [
        "Almere is in delen gebouwd: Almere Haven en Almere Stad als eerste, later Almere Buiten, Almere Poort en Almere Hout. Woningen uit de eerste jaren zijn nu vaak toe aan een nieuwe keuken, badkamer, dak of isolatie; nieuwere wijken hebben andere vragen, zoals een verhuurde woning of een snelle verhuizing.",
        "Wij beoordelen de woning zoals ze nu is. U hoeft niet eerst te verbouwen of te verduurzamen om te weten wat de woning bij een directe verkoop kan opleveren.",
      ],
    },
    {
      title: "Verkopen zonder dubbele lasten",
      paragraphs: [
        "Wie Almere verlaat of binnen de stad verhuist, heeft vaak al een volgende woning. Een verkoop via Funda kan maanden duren. Bij een directe verkoop spreken we de overdrachtsdatum vooraf af, zodat u niet twee keer woonlasten betaalt.",
      ],
    },
    {
      title: "Passende verkoopsituaties",
      bullets: [
        "Rijwoning of gezinswoning met achterstallig onderhoud",
        "Appartement of woning die verhuurd is",
        "Verkoop die moet aansluiten op een nieuwe woning",
        "Erfeniswoning of woning na een scheiding",
        "Woning die nog vol spullen staat",
      ],
    },
  ],
  processTitle: "Hoe verloopt een aanvraag?",
  processSteps: [
    { title: "Aanvraag indienen", text: "U deelt het adres, het type woning en uw situatie." },
    { title: "Beoordeling", text: "Wij kijken naar de woning, de staat, het stadsdeel en uw planning." },
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
      question: "Kopen jullie in alle stadsdelen van Almere?",
      answer: "Ja. Wij beoordelen woningen in heel Almere, van Almere Haven en Almere Stad tot Almere Buiten, Hout, Poort, Pampus en Oosterwold.",
    },
    {
      question: "Kan ik mijn huis in Almere verkopen zonder makelaar?",
      answer: "Ja. U verkoopt rechtstreeks aan ons. U vraagt vrijblijvend een voorstel aan en beslist daarna zelf of u verder wilt.",
    },
    {
      question: "Mijn woning is verhuurd. Kan ik toch verkopen?",
      answer: "Vaak wel. De huurovereenkomst loopt dan door; wij nemen de huur en de afspraken met de huurder mee in de beoordeling.",
    },
    {
      question: "Krijg ik gegarandeerd een bod?",
      answer: "Nee. Wij garanderen vooraf geen bod of verkoop binnen een vaste termijn. Dat hangt af van de woning, de gegevens en de afspraken die mogelijk zijn.",
    },
  ],
  relatedLinks: [
    ["/woning-verkopen-flevoland", "Woning verkopen in Flevoland"],
    ["/huis-verkopen-lelystad", "Huis verkopen in Lelystad"],
    ["/huis-verkopen-bij-dubbele-lasten", "Huis verkopen bij dubbele lasten"],
    ["/verhuurde-woning-verkopen", "Verhuurde woning verkopen"],
    ["/huis-verkopen-zonder-opknappen", "Huis verkopen zonder opknappen"],
    ["/huis-verkopen-bij-scheiding", "Huis verkopen bij scheiding"],
  ],
  ctaTitle: "Huis in Almere verkopen?",
  ctaText: "Vraag vrijblijvend een voorstel aan en spreek een overdrachtsdatum af die bij u past.",
};

export default function HuisVerkopenAlmerePage() {
  return <SeoLandingPage page={page} />;
}
