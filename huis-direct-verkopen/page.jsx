import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis direct verkopen met duidelijke afspraken",
  description: "Huis direct verkopen zonder open huis, verkoopdruk of eerst verkoopklaar maken? Vraag vrijblijvend een helder voorstel aan.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-direct-verkopen",
  },
  openGraph: {
    title: "Huis direct verkopen met duidelijke afspraken",
    description: "Vraag vrijblijvend duidelijkheid over directe verkoop, planning, voorwaarden en notariële overdracht.",
    url: "https://www.vastgoeddirectnederland.nl/huis-direct-verkopen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

const page = {
  slug: "/huis-direct-verkopen",
  pageType: "high-intent",
  breadcrumb: "Huis direct verkopen",
  eyebrow: "Directe verkoop",
  h1: "Huis direct verkopen met duidelijke afspraken",
  lead: "Wilt u zonder lang verkooptraject weten wat directe verkoop voor uw woning kan betekenen? Vraag vrijblijvend een voorstel aan. U hoeft niet eerst te verbouwen, leeghalen of een open huis te organiseren.",
  heroNote: "Snel duidelijkheid krijgen betekent niet dat u overhaast hoeft te beslissen.",
  defaultSituation: "Huis direct verkopen",
  formTrustItems: [
    "Vrijblijvende aanvraag",
    "Geen open huis nodig",
    "Schriftelijke afspraken",
    "Notariële overdracht",
  ],
  afterRequestText: "Wij bekijken uw woninggegevens en de gewenste planning. Als directe verkoop passend is, ontvangt u een vrijblijvend verkoopvoorstel. Wij garanderen vooraf geen verkoop binnen een vaste termijn.",
  shortAnswer: "Direct verkopen betekent dat u eerst rustig duidelijkheid krijgt over bedrag, planning en voorwaarden zonder een volledig makelaarstraject te starten. Pas als het voorstel past, worden afspraken verder uitgewerkt.",
  benefits: [
    "Direct duidelijkheid",
    "Geen open huis",
    "Niet eerst verkoopklaar maken",
    "Ook bij leegstand of onderhoud",
    "Persoonlijk contact",
    "U beslist zelf",
  ],
  heroBenefits: [
    "Vrijblijvend voorstel",
    "Geen verkoopdruk",
    "Geen open huis",
    "Notariële afwikkeling",
  ],
  concernTitle: "Wanneer past directe verkoop?",
  concernCards: [
    "U wilt eerst een concreet voorstel voordat u kosten maakt voor presentatie of herstel.",
    "De woning staat leeg, vraagt onderhoud of is nog niet verkoopklaar.",
    "U wilt geen lange reeks bezichtigingen of onzekerheid over de koper.",
    "U zoekt rust en duidelijke afspraken over oplevering en overdracht.",
  ],
  solutionTitle: "Wat maakt Vastgoed Direct Nederland eenvoudiger?",
  solutionCards: [
    "Wij beoordelen de woning zoals deze nu is, inclusief aandachtspunten.",
    "Wij bespreken planning, oplevering en eventuele bijzonderheden vooraf.",
    "Als directe verkoop passend is, ontvangt u een verkoopvoorstel met heldere uitgangspunten.",
    "Bij akkoord worden afspraken schriftelijk en notarieel vastgelegd.",
  ],
  vdnTasks: [
    "Eerste beoordeling van woninggegevens en situatie.",
    "Bespreken van gewenste planning en overdracht.",
    "Duidelijk maken welke voorwaarden in het voorstel gelden.",
    "Notariële afwikkeling voorbereiden bij akkoord.",
  ],
  ownerTasks: [
    "Bekende gebreken en bijzonderheden eerlijk melden.",
    "Beschikbare gegevens of foto’s delen als dat helpt bij beoordeling.",
    "Rustig beoordelen of het voorstel past bij uw situatie.",
    "Pas tekenen wanneer alle afspraken duidelijk zijn uitgewerkt.",
  ],
  practiceExample: {
    situation: "Eigenaar wil eerst duidelijkheid zonder open huis",
    propertyType: "Eengezinswoning",
    region: "Noord-Nederland",
    mainProblem: "De eigenaar twijfelde tussen regulier verkopen en direct duidelijkheid krijgen, omdat de woning nog onderhoud nodig had en niet verkoopklaar was.",
    solution: "Eerst is de huidige staat besproken. Daarna is gekeken welke overdracht en oplevering praktisch haalbaar waren.",
    delivery: "Oplevering in de huidige staat bespreekbaar gemaakt.",
    transfer: "Afspraken zouden bij akkoord schriftelijk en via de notaris worden vastgelegd.",
    nextStep: "De eigenaar kon het voorstel rustig vergelijken met een regulier verkooptraject.",
  },
  sections: [
    {
      title: "Wat betekent direct verkopen?",
      paragraphs: [
        "Direct verkopen betekent niet dat u meteen vastzit aan verkoop. Het begint met een vrijblijvende beoordeling van uw woning, situatie en gewenste planning.",
        "Daarna hoort u of directe verkoop passend is. In dat geval ontvangt u een vrijblijvend verkoopvoorstel dat u rustig kunt beoordelen.",
      ],
    },
    {
      title: "Wanneer is een regulier makelaarstraject minder passend?",
      paragraphs: [
        "Een reguliere verkoop kan financieel aantrekkelijk zijn, maar vraagt vaak voorbereiding, foto's, bezichtigingen en onzekerheid over financiering en oplevering.",
        "Als rust, snelheid of duidelijkheid belangrijker is dan het maximale verkooptraject, kan directe verkoop een praktische route zijn.",
      ],
    },
  ],
  processTitle: "Hoe verloopt direct verkopen?",
  processSteps: [
    { title: "Aanvraag indienen", text: "U vult kort de woninggegevens en uw situatie in." },
    { title: "Persoonlijk contact en beoordeling", text: "Wij bespreken de woning, de gewenste planning en eventuele bijzonderheden." },
    { title: "Vrijblijvend verkoopvoorstel", text: "Als directe verkoop passend is, ontvangt u een voorstel met bedrag, uitgangspunten en voorwaarden." },
    { title: "Schriftelijke afspraken en notariële overdracht", text: "Alleen bij akkoord worden afspraken uitgewerkt in een koopovereenkomst en via de notaris afgehandeld." },
  ],
  comparisonRows: [
    ["Verkoopklaar maken", "Vaak nodig voor presentatie", "Niet vooraf nodig voor een eerste voorstel"],
    ["Bezichtigingen", "Meerdere kijkers of open huis", "Geen open huis nodig"],
    ["Koperzekerheid", "Afhankelijk van interesse en financiering", "Voorwaarden worden vooraf besproken"],
    ["Planning", "Afhankelijk van markt en koper", "In overleg vast te leggen"],
    ["Kosten", "Mogelijk courtage, styling of herstel", "Geen makelaarskosten bij directe aankoop"],
    ["Afwikkeling", "Via afspraken met koper en notaris", "Bij akkoord schriftelijk en notarieel"],
  ],
  faqs: [
    {
      question: "Wat betekent mijn huis direct verkopen?",
      answer: "U vraagt eerst een vrijblijvende beoordeling aan zonder direct een regulier verkooptraject te starten. Als directe verkoop passend is, ontvangt u een verkoopvoorstel. Pas daarna worden eventuele afspraken verder uitgewerkt.",
    },
    {
      question: "Is direct verkopen hetzelfde als overhaast verkopen?",
      answer: "Nee. Direct verkopen gaat vooral over sneller duidelijkheid krijgen. U beslist zelf of u het voorstel wilt bespreken of accepteren.",
    },
    {
      question: "Kan ik direct verkopen als de woning onderhoud nodig heeft?",
      answer: "Ja, ook woningen met achterstallig onderhoud, schade of een verouderde inrichting kunnen worden beoordeeld.",
    },
    {
      question: "Moet de woning leeg zijn?",
      answer: "Niet altijd. Als de woning nog vol staat, kan dat worden meegenomen in de beoordeling en eventuele afspraken over oplevering.",
    },
    {
      question: "Wanneer ontstaat er een koopovereenkomst?",
      answer: "Een koopovereenkomst ontstaat pas nadat alle voorwaarden zijn uitgewerkt en koper en verkoper de koopovereenkomst hebben ondertekend.",
    },
  ],
  relatedLinks: [
    ["/huis-snel-verkopen", "Huis snel verkopen"],
    ["/huis-verkopen-aan-opkoper", "Huis verkopen aan een opkoper"],
    ["/huis-verkopen-in-huidige-staat", "Huis verkopen in de huidige staat"],
    ["/huis-verkopen-zonder-opknappen", "Huis verkopen zonder opknappen"],
    ["/huis-verkopen-zonder-leeghalen", "Huis verkopen zonder leeghalen"],
    ["/huis-verkopen-zonder-bezichtigingen", "Huis verkopen zonder bezichtigingen"],
    ["/woning-verkopen-zonder-makelaar", "Woning verkopen zonder makelaar"],
    ["/leegstaand-huis-verkopen", "Leegstaand huis verkopen"],
  ],
  ctaTitle: "Wilt u direct duidelijkheid over uw woning?",
  ctaText: "Vraag vrijblijvend een verkoopvoorstel aan. U ontvangt eerst duidelijkheid en beslist daarna zelf of u verder wilt.",
};

export default function HuisDirectVerkopenPage() {
  return <SeoLandingPage page={page} />;
}
