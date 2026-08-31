import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen aan opkoper | rustig vergelijken",
  description: "Overweegt u verkoop aan een opkoper? Vraag vrijblijvend een voorstel aan en vergelijk rustig bedrag, voorwaarden en overdracht.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-aan-opkoper",
  },
  openGraph: {
    title: "Huis verkopen aan opkoper | Vastgoed Direct Nederland",
    description: "Bekijk rustig wat verkoop aan een directe koper kan betekenen. Vrijblijvend voorstel, duidelijke voorwaarden en notariële afwikkeling.",
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-aan-opkoper",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

const page = {
  slug: "/huis-verkopen-aan-opkoper",
  pageType: "high-intent",
  breadcrumb: "Huis verkopen aan opkoper",
  eyebrow: "Verkoop aan opkoper overwegen",
  h1: "Huis verkopen aan een opkoper zonder lang verkooptraject",
  lead: "Overweegt u uw huis rechtstreeks te verkopen aan een opkoper of directe koper? Vraag eerst vrijblijvend duidelijkheid over het bedrag, de voorwaarden, de oplevering en de notariële afwikkeling.",
  heroNote: "Een aanvraag is geen akkoord. U kunt het voorstel rustig vergelijken met andere verkooproutes.",
  defaultSituation: "Huis verkopen aan opkoper",
  formTrustItems: [
    "Vrijblijvend voorstel",
    "Voorwaarden vooraf duidelijk",
    "Ook bij onderhoud of leegstand",
    "Notariële afwikkeling",
  ],
  afterRequestText: "Wij bekijken de woninggegevens en bespreken welke route haalbaar is. Een bod, prijs of verkoop binnen een vaste termijn wordt niet vooraf gegarandeerd.",
  shortAnswer: "Verkoop aan een opkoper kan interessant zijn als u geen lang makelaarstraject wilt en vooral duidelijkheid zoekt. Het blijft belangrijk om bedrag, kosten, voorwaarden en overdracht vooraf goed vast te leggen.",
  benefits: [
    "Rechtstreeks voorstel aanvragen",
    "Geen open huis nodig",
    "Ook bij onderhoud of leegstand",
    "Voorwaarden schriftelijk vastleggen",
    "Notariële afwikkeling",
    "U beslist zelf",
  ],
  heroBenefits: [
    "Vrijblijvend vergelijken",
    "Geen verkoopdruk",
    "Duidelijke voorwaarden",
    "Notariële overdracht",
  ],
  concernTitle: "Waar letten eigenaren op bij verkoop aan een opkoper?",
  concernCards: [
    "Is het voorstel duidelijk genoeg om rustig te kunnen vergelijken?",
    "Welke kosten, opleverafspraken en voorbehouden gelden er?",
    "Moet de woning eerst leeg, opgeknapt of verkoopklaar worden gemaakt?",
    "Hoe wordt de overdracht juridisch en notarieel vastgelegd?",
  ],
  solutionTitle: "Hoe houden wij dit overzichtelijk?",
  solutionCards: [
    "U ontvangt eerst een voorstel met uitgangspunten en voorwaarden.",
    "Bijzondere afspraken over oplevering, spullen of planning worden apart benoemd.",
    "Kostenafspraken worden niet verstopt, maar vooraf besproken en schriftelijk vastgelegd.",
    "Definitieve verkoop ontstaat pas na ondertekening van de koopovereenkomst.",
  ],
  vdnTasks: [
    "Woning en situatie beoordelen op basis van de aangeleverde gegevens.",
    "Uitleg geven over bedrag, planning en voorwaarden.",
    "Oplevering, overdracht en eventuele bijzonderheden duidelijk maken.",
    "Bij akkoord meewerken aan correcte notariële afwikkeling.",
  ],
  ownerTasks: [
    "Bekende gebreken en juridische bijzonderheden melden.",
    "Controleren of alle eigenaren of betrokkenen kunnen meewerken.",
    "Het voorstel rustig vergelijken met reguliere verkoop of ander advies.",
    "Alleen tekenen als alle afspraken duidelijk en akkoord zijn.",
  ],
  practiceExample: {
    situation: "Eigenaar vergelijkt reguliere verkoop met directe verkoop",
    propertyType: "Woning met onderhoud",
    region: "Noord-Nederland",
    mainProblem: "De eigenaar wilde weten of verkoop aan een directe koper praktischer was dan eerst investeren in herstel, foto's en bezichtigingen.",
    solution: "Er is eerst gekeken naar de huidige staat, de gewenste oplevering en de voorwaarden die nodig waren om het voorstel goed te kunnen beoordelen.",
    delivery: "Oplevering in huidige staat werd als optie besproken.",
    transfer: "Definitieve afspraken zouden pas bij akkoord in de koopovereenkomst komen.",
    nextStep: "De eigenaar kon het voorstel naast een regulier verkooptraject leggen.",
  },
  sections: [
    {
      title: "Wanneer kan verkoop aan een opkoper interessant zijn?",
      paragraphs: [
        "Deze route kan passen wanneer u geen open huis, uitgebreide verkoopcampagne of lange onzekerheid wilt.",
        "Ook bij leegstand, achterstallig onderhoud, verhuur, erfenis of dubbele lasten kan een directe verkoopoplossing praktisch zijn.",
      ],
    },
    {
      title: "Kosten en afspraken zorgvuldig benoemen",
      paragraphs: [
        "U betaalt geen makelaarskosten voor het indienen van een vrijblijvende aanvraag bij Vastgoed Direct Nederland.",
        "Eventuele afspraken over kosten, overdracht, oplevering, notaris of aanvullende voorwaarden worden vooraf besproken en schriftelijk vastgelegd. We gebruiken geen vaste belofte dat bepaalde kosten altijd worden overgenomen, tenzij dat in het concrete voorstel staat.",
      ],
    },
  ],
  processTitle: "Hoe verloopt verkoop aan een opkoper?",
  processSteps: [
    { title: "Aanvraag indienen", text: "U deelt de woninggegevens en de reden waarom directe verkoop wordt overwogen." },
    { title: "Beoordeling en toelichting", text: "We bespreken de woning, de gewenste termijn, oplevering en eventuele aandachtspunten." },
    { title: "Vrijblijvend voorstel", text: "U ontvangt waar mogelijk een voorstel met bedrag, voorwaarden en vervolgstappen." },
    { title: "Koopovereenkomst en notaris", text: "Alleen bij akkoord worden afspraken uitgewerkt en verloopt de overdracht via de notaris." },
  ],
  comparisonRows: [
    ["Verkoopcampagne", "Foto's, plaatsing en bezichtigingen", "Niet standaard nodig voor een eerste voorstel"],
    ["Voorbereiding", "Vaak verkoopklaar maken", "Huidige staat kan worden beoordeeld"],
    ["Prijs", "Marktwerking kan hogere opbrengst geven", "Voorstel biedt vooral duidelijkheid en gemak"],
    ["Kosten", "Vaak courtage of vaste kosten", "Kostenafspraken vooraf schriftelijk"],
    ["Voorbehouden", "Afhankelijk van koper", "Voorwaarden worden in het voorstel benoemd"],
    ["Overdracht", "Via notaris na akkoord", "Ook via notaris na schriftelijke afspraken"],
  ],
  faqs: [
    {
      question: "Is verkoop aan een opkoper altijd de beste keuze?",
      answer: "Niet altijd. Een reguliere verkoop kan soms een hogere opbrengst opleveren. Directe verkoop kan juist aantrekkelijk zijn wanneer rust, snelheid, minder voorbereiding en duidelijke afspraken belangrijk zijn.",
    },
    {
      question: "Krijg ik gegarandeerd een bod?",
      answer: "Nee, een bod of verkoop binnen een vaste termijn wordt niet vooraf gegarandeerd. Eerst worden de woninggegevens en situatie beoordeeld.",
    },
    {
      question: "Moet mijn woning verkoopklaar zijn?",
      answer: "Niet altijd. Ook woningen met onderhoud, leegstand of spullen in de woning kunnen vrijblijvend worden aangemeld.",
    },
    {
      question: "Betaal ik makelaarskosten?",
      answer: "Voor de vrijblijvende aanvraag via Vastgoed Direct Nederland betaalt u geen makelaarskosten. Eventuele verdere kostenafspraken worden vooraf duidelijk besproken.",
    },
    {
      question: "Hoe weet ik dat afspraken goed zijn vastgelegd?",
      answer: "Definitieve afspraken worden pas bindend na uitwerking en ondertekening van een koopovereenkomst. De juridische overdracht verloopt via de notaris.",
    },
  ],
  relatedLinks: [
    ["/huis-direct-verkopen", "Huis direct verkopen"],
    ["/huis-snel-verkopen", "Huis snel verkopen"],
    ["/huis-verkopen-in-huidige-staat", "Huis verkopen in huidige staat"],
    ["/opknapwoning-verkopen", "Opknapwoning verkopen"],
    ["/leegstaand-huis-verkopen", "Leegstaand huis verkopen"],
    ["/woning-verkopen-zonder-makelaar", "Woning verkopen zonder makelaar"],
    ["/huis-verkopen-zonder-bezichtigingen", "Huis verkopen zonder bezichtigingen"],
    ["/huis-verkopen-bij-dubbele-lasten", "Huis verkopen bij dubbele lasten"],
  ],
  ctaTitle: "Wilt u verkoop aan een opkoper rustig vergelijken?",
  ctaText: "Vraag vrijblijvend een verkoopvoorstel aan en bekijk rustig of directe verkoop past bij uw woning en situatie.",
};

export default function HuisVerkopenAanOpkoperPage() {
  return <SeoLandingPage page={page} />;
}
