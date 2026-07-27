import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: 'Huis verkopen in Assen | vrijblijvend verkoopvoorstel',
  description: 'Huis verkopen in Assen zonder open huis of langdurige onzekerheid? Vraag vrijblijvend een verkoopvoorstel aan.',
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-assen",
  },
  openGraph: {
    title: 'Huis verkopen in Assen | vrijblijvend verkoopvoorstel',
    description: 'Huis verkopen in Assen zonder open huis of langdurige onzekerheid? Vraag vrijblijvend een verkoopvoorstel aan.',
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-assen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  slug: "/huis-verkopen-assen",
  pageType: "region",
  regionName: "Assen",
  breadcrumb: "Huis verkopen in Assen",
  eyebrow: "Regio Assen",
  h1: "Uw huis verkopen in Assen met rust en duidelijkheid",
  lead: "Wilt u uw woning in Assen verkopen en eerst weten welke verkooproute past? Ook als de woning onderhoud nodig heeft of niet verkoopklaar is, kunt u vrijblijvend een voorstel aanvragen.",
  heroNote: "Vrijblijvend. U ontvangt eerst duidelijkheid en beslist daarna zelf.",
  defaultSituation: "Huis verkopen in Assen",
  afterRequestText: "Wij bekijken uw woninggegevens, locatie en gewenste planning. Waar mogelijk ontvangt u een eerste vrijblijvende inschatting of verkoopvoorstel. Een verkoop binnen een vaste termijn wordt niet vooraf gegarandeerd.",
  shortAnswer: "Vraag vrijblijvend een verkoopvoorstel aan voor uw woning in Assen. Ook bij leegstand, onderhoud, erfenis, verhuur, dubbele lasten of een woning die nog vol staat kunt u rustig bespreken welke verkooproute past.",
  benefits: [
    "Actief in Assen",
    "Ook bij onderhoud of leegstand",
    "Geen open huis nodig",
    "Vrijblijvend voorstel",
    "Duidelijke opleverafspraken",
    "Notariële overdracht",
  ],
  heroBenefits: [
    "Regionale beoordeling",
    "Vrijblijvend voorstel",
    "Geen verkoopdruk",
    "Duidelijke afspraken",
  ],
  concernTitle: "Veelvoorkomende verkoopvragen in Assen",
  concernCards: [
    "De woning is niet verkoopklaar of vraagt onderhoud.",
    "Er is behoefte aan duidelijkheid over planning, oplevering en voorwaarden.",
    "De eigenaar wil liever geen open huis of reeks bezichtigingen.",
    "Er speelt een bijzondere situatie zoals erfenis, leegstand, verhuur of dubbele lasten.",
  ],
  solutionTitle: "Wat beoordelen wij in deze regio?",
  solutionCards: [
    "De woning en staat zoals deze nu is.",
    "De locatie, het type woning en de praktische verkoopmogelijkheden.",
    "De gewenste termijn en mogelijke opleverafspraken.",
    "Of directe verkoop of een andere route passend kan zijn.",
  ],
  vdnTasks: [
    "Woninggegevens en regionale situatie beoordelen.",
    "Meedenken over oplevering, planning en eventuele bijzonderheden.",
    "Waar mogelijk een eerste inschatting of voorstel uitwerken.",
    "Bij akkoord zorgen dat afspraken schriftelijk en notarieel worden vastgelegd.",
  ],
  ownerTasks: [
    "De ligging, staat en bekende bijzonderheden van de woning delen.",
    "Aangeven welke termijn of overdracht gewenst is.",
    "Controleren of alle eigenaren of betrokkenen kunnen meewerken.",
    "Het voorstel rustig beoordelen voordat er verdere afspraken worden gemaakt.",
  ],
  practiceExample: {
    situation: "Regionale woning waarbij eerst duidelijkheid nodig was",
    propertyType: "Dorpswoning / bestaande bouw",
    region: "Assen en omgeving",
    mainProblem: "De eigenaar wilde weten of directe verkoop passend kon zijn, zonder eerst kosten te maken voor herstel, presentatie en bezichtigingen.",
    solution: "De woning, staat en gewenste planning zijn eerst beoordeeld. Daarna kon worden bekeken welke afspraken over oplevering en overdracht logisch waren.",
    delivery: "Oplevering in huidige staat kon worden besproken.",
    transfer: "Bij akkoord zouden afspraken via koopovereenkomst en notaris worden vastgelegd.",
    nextStep: "De eigenaar kon het voorstel vergelijken met een regulier verkooptraject.",
  },
  sections: [
    {
      title: "Werkgebied in en rond Assen",
      paragraphs: [
        "Wij beoordelen woningen in Assen, Marsdijk, Peelo, Kloosterveen en omliggende dorpen.",
        "Het gaat niet alleen om de plaatsnaam. De staat van de woning, de gewenste termijn, eventuele bewoning en de oplevering bepalen samen welke verkooproute logisch is.",
      ],
    },
    {
      title: "Regionale bijzonderheden",
      paragraphs: [
        "In Assen kan directe duidelijkheid vooral prettig zijn bij verhuisplannen, dubbele lasten, onderhoud of woningen die niet direct verkoopklaar zijn.",
        "Daarom krijgt u geen standaardantwoord, maar eerst een beoordeling van uw woninggegevens en situatie.",
      ],
    },
    {
      title: "Welke woningen kunnen worden aangemeld?",
      paragraphs: [
        "U kunt ook een aanvraag doen wanneer de woning nog niet verkoopklaar is of wanneer er iets speelt waardoor een regulier verkooptraject minder prettig voelt.",
      ],
      bullets: [
        "Leegstaande woning",
        "Opknapwoning of woning met achterstallig onderhoud",
        "Erfeniswoning of woning die nog vol staat",
        "Verhuurde woning of woning met gebruiksafspraken",
        "Woning waarbij snel duidelijkheid gewenst is",
      ],
    },
  ],
  processTitle: "Hoe verloopt een regionale aanvraag?",
  processSteps: [
    { title: "Aanvraag indienen", text: "U deelt de woninggegevens, locatie en de reden van verkoop." },
    { title: "Beoordeling van woning en regio", text: "We kijken naar type woning, staat, ligging, planning en eventuele bijzonderheden." },
    { title: "Vrijblijvende inschatting of voorstel", text: "Waar mogelijk ontvangt u duidelijkheid over verkoopmogelijkheden en voorwaarden." },
    { title: "Afspraken en overdracht", text: "Alleen bij akkoord worden afspraken schriftelijk uitgewerkt en loopt de overdracht via de notaris." },
  ],
  comparisonRows: [
    ["Voorbereiding", "Vaak verkoopklaar maken voor presentatie", "Huidige staat kan worden beoordeeld"],
    ["Bezichtigingen", "Vaak meerdere kijkers", "Geen open huis nodig"],
    ["Kosten", "Mogelijk courtage, styling of herstel", "Geen makelaarskosten voor de aanvraag"],
    ["Planning", "Afhankelijk van markt en koper", "In overleg duidelijk af te spreken"],
    ["Oplevering", "Regulier per koper af te stemmen", "Bijzonderheden vooraf bespreken"],
    ["Afwikkeling", "Via koopovereenkomst en notaris", "Bij akkoord ook via notaris"],
  ],
  faqs: [
    {
      question: "Kan ik mijn woning in Assen verkopen zonder makelaar?",
      answer: "Ja, u kunt rechtstreeks een vrijblijvende aanvraag doen. Daarna bekijken wij of een directe verkooproute of een andere oplossing passend kan zijn.",
    },
    {
      question: "Moet mijn woning in Assen verkoopklaar zijn?",
      answer: "Niet altijd. Ook bij onderhoud, leegstand, spullen in de woning of andere bijzonderheden kunt u eerst vrijblijvend duidelijkheid aanvragen.",
    },
    {
      question: "Krijg ik gegarandeerd snel een bod?",
      answer: "Nee, een bod of verkoop binnen een vaste termijn wordt niet vooraf gegarandeerd. De haalbaarheid hangt af van de woning, gegevens, afspraken en notariële mogelijkheden.",
    },
    {
      question: "Hoe worden afspraken vastgelegd?",
      answer: "Pas bij akkoord worden afspraken over prijs, planning, oplevering en voorwaarden uitgewerkt in een koopovereenkomst. De juridische overdracht verloopt via de notaris.",
    },
  ],
  relatedLinks: [
    ["/opknapwoning-verkopen", "Opknapwoning verkopen"],
    ["/leegstaand-huis-verkopen", "Leegstaand huis verkopen"],
    ["/huis-verkopen-bij-erfenis", "Huis verkopen bij erfenis"],
    ["/woning-verkopen-zonder-makelaar", "Woning verkopen zonder makelaar"],
    ["/huis-direct-verkopen", "Huis direct verkopen"],
    ["/huis-snel-verkopen", "Huis snel verkopen"],
    ["/huis-verkopen-zonder-opknappen", "Huis verkopen zonder opknappen"],
    ["/huis-verkopen-in-huidige-staat", "Huis verkopen in huidige staat"],
  ],
  ctaTitle: "Wilt u uw huis in Assen verkopen?",
  ctaText: "Vraag vrijblijvend een verkoopvoorstel aan. U ontvangt eerst duidelijkheid en beslist daarna zelf of u verder wilt.",
};

export default function HuisVerkopenAssenPage() {
  return <SeoLandingPage page={page} />;
}
