import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Woning verkopen zonder makelaar | Vrijblijvend voorstel",
  description:
    "Wilt u uw woning verkopen zonder makelaar, open huis of Funda-traject? Vraag vrijblijvend een verkoopvoorstel aan. Niet zelf alles regelen en geen verkoopdruk.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/woning-verkopen-zonder-makelaar",
  },
  openGraph: {
    title: "Woning verkopen zonder makelaar | Vastgoed Direct Nederland",
    description:
      "Verkoop zonder traditioneel makelaarstraject. Geen open huis, geen makelaarskosten bij directe aankoop en duidelijke schriftelijke afspraken.",
    url: "https://www.vastgoeddirectnederland.nl/woning-verkopen-zonder-makelaar",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "Woning verkopen zonder makelaar",
    description:
      "Vraag vrijblijvend een verkoopvoorstel aan zonder traditioneel verkooptraject of open huis.",
  },
};

const page = {
  slug: "/woning-verkopen-zonder-makelaar",
  breadcrumb: "Woning verkopen zonder makelaar",
  pageType: "high-intent",
  eyebrow: "Zonder traditioneel makelaarstraject",
  defaultSituation: "Woning verkopen zonder makelaar",
  h1: "Woning verkopen zonder makelaar, maar niet alles zelf hoeven regelen",
  lead:
    "Wilt u geen regulier makelaarstraject met Funda, fotografie, open huis en bezichtigingen? Dan kunt u eerst vrijblijvend laten beoordelen of directe verkoop past. Als dat zo is, ontvangt u een verkoopvoorstel zonder verkoopdruk.",
  shortAnswer:
    "U bent niet verplicht om via een makelaar te verkopen. Bij directe verkoop vraagt u eerst vrijblijvend duidelijkheid aan. U hoeft niet zelf een verkoopcampagne te organiseren en afspraken over prijs, oplevering en overdracht worden schriftelijk vastgelegd.",
  heroBenefits: [
    "Geen Funda-traject nodig",
    "Geen open huis of kijkersronde",
    "Niet zelf alles regelen",
    "U beslist zelf na het voorstel",
  ],
  benefits: [
    "Vrijblijvend verkoopvoorstel",
    "Geen makelaarskosten bij directe aankoop",
    "Geen open huis nodig",
    "Geen traditionele verkoopcampagne",
    "Duidelijke afspraken over oplevering",
    "Notariële afwikkeling",
  ],
  concernTitle: "Waarom kiezen eigenaren voor verkopen zonder makelaar?",
  concernCards: [
    "U wilt geen woningpresentatie, fotografie, open huis of bezichtigingsrondes.",
    "U wilt niet zelf onderhandelen met meerdere kijkers of bieders.",
    "De woning is nog niet verkoopklaar, staat vol spullen of heeft onderhoud nodig.",
    "U wilt eerst weten wat directe verkoop concreet betekent voordat u kosten maakt.",
  ],
  solutionTitle: "Wat maakt directe verkoop anders dan zelf verkopen?",
  solutionCards: [
    "U hoeft niet zelf een Funda-campagne of verkoopwebsite op te zetten.",
    "Wij bekijken de woning en situatie als geheel, ook als deze niet verkoopklaar is.",
    "Als directe verkoop passend is, ontvangt u een voorstel met prijs, planning en voorwaarden.",
    "Bij akkoord worden afspraken vastgelegd en verloopt levering via de notaris.",
  ],
  valueTitle: "Zonder makelaar verkopen moet wel duidelijk en zorgvuldig blijven.",
  valueText:
    "Zelf verkopen kan passend zijn, maar vraagt vaak veel regelwerk. Directe verkoop kan een rustiger alternatief zijn wanneer u geen traditioneel verkooptraject wilt, maar wel duidelijke schriftelijke afspraken en een correcte notariële afwikkeling belangrijk vindt.",
  vdnTasks: [
    "Beoordelen of directe verkoop bij uw situatie past.",
    "Meedenken over prijs, planning, oplevering en eventuele spullen of onderhoud.",
    "Een voorstel uitwerken dat u rustig kunt beoordelen.",
    "Bij akkoord de afspraken laten vastleggen en overdracht via de notaris laten verlopen.",
  ],
  ownerTasks: [
    "Bekende gebreken, bijzonderheden en eigendomssituatie eerlijk melden.",
    "Aangeven welke termijn, oplevering of voorwaarden voor u belangrijk zijn.",
    "Controleren of alle eigenaren of betrokkenen akkoord zijn met verkoop.",
    "Het voorstel vergelijken met reguliere verkoop voordat u beslist.",
  ],
  practiceExample: {
    situation: "Eigenaar wilde geen Funda-traject en geen kijkers in huis",
    propertyType: "Hoekwoning",
    region: "Noord-Nederland",
    mainProblem:
      "De eigenaar wilde de woning niet eerst verkoopklaar maken en zag op tegen foto's, bezichtigingen en onderhandelingen met meerdere geïnteresseerden.",
    solution:
      "Eerst werd vrijblijvend gekeken of directe verkoop in de huidige staat mogelijk was, met een voorstel waarin prijs, termijn en oplevering duidelijk stonden.",
    delivery:
      "Afspraken over achterblijvende spullen en staat van oplevering werden als apart aandachtspunt meegenomen.",
    transfer:
      "Bij akkoord zou de koopovereenkomst pas worden opgesteld nadat alle voorwaarden duidelijk waren en de overdracht via de notaris kon worden voorbereid.",
    nextStep:
      "De eigenaar kon het voorstel naast reguliere verkoop leggen en daarna pas beslissen.",
  },
  sections: [
    {
      title: "Wanneer is verkopen zonder makelaar interessant?",
      paragraphs: [
        "Verkopen zonder makelaar speelt vaak wanneer iemand geen courtage, verkoopcampagne, open huis of lange reeks bezichtigingen wil. Het kan ook gaan om privacy, tijdsdruk, dubbele lasten of een woning die niet geschikt voelt voor een normale presentatie.",
        "Belangrijk is wel dat u goed weet wat u kiest. Reguliere verkoop via een makelaar kan soms een hogere opbrengst opleveren. Directe verkoop is vooral interessant wanneer rust, gemak, snelheid en duidelijke afspraken zwaarder wegen.",
      ],
    },
    {
      title: "Niet hetzelfde als alles zelf doen",
      paragraphs: [
        "Zonder makelaar verkopen betekent niet automatisch dat u zelf een verkoopsite moet maken, biedingen moet verzamelen, onderhandelingen moet voeren of een koopovereenkomst moet voorbereiden.",
        "Bij Vastgoed Direct Nederland vraagt u eerst een vrijblijvend voorstel aan. Als het voorstel past, worden de afspraken schriftelijk uitgewerkt en loopt de juridische levering via de notaris.",
      ],
    },
    {
      title: "Wat hoeft u niet vooraf te regelen?",
      bullets: [
        "Geen uitgebreide woningpresentatie of Funda-campagne opstarten.",
        "Geen open huis of meerdere bezichtigingsmomenten organiseren.",
        "Niet eerst schilderen, stylen of verkoopklaar maken voor een eerste beoordeling.",
        "Niet zelf met verschillende kijkers of bieders onderhandelen.",
        "Niet zelf uitzoeken welke opleverafspraken juridisch handig zijn.",
      ],
    },
    {
      title: "Hoe werkt deze verkooproute?",
      steps: [
        "U vult de woninggegevens en uw situatie in.",
        "Wij beoordelen de woning, locatie, staat en gewenste planning.",
        "Als directe verkoop passend is, ontvangt u een vrijblijvend verkoopvoorstel.",
        "Als er nog informatie nodig is, nemen wij kort contact op of plannen wij een beoordeling.",
        "Bij akkoord worden prijs, voorwaarden en oplevering schriftelijk vastgelegd en verloopt overdracht via de notaris.",
      ],
    },
    {
      title: "Waar moet u op letten?",
      paragraphs: [
        "Ook zonder makelaar blijft het belangrijk dat bekende gebreken, eigendomssituatie, oplevering, inboedel en datum van overdracht duidelijk worden vastgelegd.",
        "Een vrijblijvend voorstel is nog geen koopovereenkomst. Pas wanneer koper en verkoper alle afspraken hebben uitgewerkt en ondertekend, ontstaat een bindende koopovereenkomst.",
      ],
    },
  ],
  processSteps: [
    "Woninggegevens en reden van verkoop invullen.",
    "Eerste beoordeling van woning, staat en verkoopwens.",
    "Vrijblijvend verkoopvoorstel ontvangen.",
    "Vragen, oplevering en voorwaarden rustig bespreken.",
    "Bij akkoord afspraken vastleggen en overdracht via de notaris voorbereiden.",
  ],
  comparisonRows: [
    ["Verkoopklaar maken", "Vaak opruimen, styling, foto's en presentatie", "Niet nodig voor een eerste beoordeling"],
    ["Funda en presentatie", "Meestal onderdeel van het makelaarstraject", "Geen Funda-traject nodig voor een voorstel"],
    ["Bezichtigingen", "Vaak meerdere kijkers of open huis", "Geen open huis of brede kijkersronde nodig"],
    ["Onderhandelingen", "Vaak biedingen, voorwaarden en tegenvoorstellen", "Voorstel met prijs, planning en voorwaarden"],
    ["Onzekerheid koper", "Afhankelijk van interesse, bod en financiering", "Voorwaarden worden vooraf besproken"],
    ["Makelaarskosten", "Vaak courtage of vast tarief", "Geen makelaarskosten bij directe aankoop"],
    ["Oplevering", "Onderhandeling met uiteindelijke koper", "Afspraken vooraf duidelijk vastleggen"],
    ["Afwikkeling", "Via koopovereenkomst en notaris", "Ook via koopovereenkomst en notaris"],
  ],
  faqs: [
    {
      question: "Kan ik mijn woning verkopen zonder makelaar?",
      answer:
        "Ja. U bent niet verplicht om een makelaar in te schakelen. U kunt zelf verkopen of een directe verkooproute onderzoeken. Bij Vastgoed Direct Nederland vraagt u eerst vrijblijvend een voorstel aan.",
    },
    {
      question: "Moet ik dan zelf alles regelen?",
      answer:
        "Nee. Bij directe verkoop hoeft u niet zelf een verkoopcampagne, open huis of reeks bezichtigingen te organiseren. Afspraken worden bij akkoord schriftelijk uitgewerkt en de overdracht verloopt via de notaris.",
    },
    {
      question: "Betaal ik makelaarskosten bij directe verkoop?",
      answer:
        "Bij directe aankoop door Vastgoed Direct Nederland betaalt u geen traditionele makelaarskosten. Eventuele afspraken en kosten worden vooraf duidelijk besproken.",
    },
    {
      question: "Kan dit ook als de woning nog niet netjes of leeg is?",
      answer:
        "Ja, dat kan worden bekeken. Een woning hoeft niet altijd eerst opgeknapt, gestyled of volledig leeggehaald te worden om een eerste voorstel te kunnen aanvragen.",
    },
    {
      question: "Is verkopen zonder makelaar altijd de beste keuze?",
      answer:
        "Niet altijd. Een reguliere verkoop via een makelaar kan soms een hogere opbrengst opleveren. Directe verkoop kan vooral interessant zijn als rust, snelheid, privacy, oplevering of minder regelwerk belangrijk zijn.",
    },
    {
      question: "Zit ik vast aan het voorstel?",
      answer:
        "Nee. De aanvraag en het voorstel zijn vrijblijvend. Een koopovereenkomst komt pas tot stand nadat alle voorwaarden zijn uitgewerkt en door koper en verkoper zijn ondertekend.",
    },
  ],
  relatedLinks: [
    ["/huis-direct-verkopen", "Huis direct verkopen", "Rechtstreeks duidelijkheid zonder traditioneel verkooptraject."],
    ["/huis-snel-verkopen", "Huis snel verkopen", "Wanneer snelheid en duidelijkheid belangrijk zijn."],
    ["/huis-verkopen-aan-opkoper", "Huis verkopen aan een opkoper", "Verkoop aan een directe koper rustig vergelijken."],
    ["/huis-verkopen-zonder-bezichtigingen", "Huis verkopen zonder bezichtigingen", "Geen open huis of brede kijkersronde nodig."],
    ["/huis-verkopen-zonder-opknappen", "Huis verkopen zonder opknappen", "Niet eerst verbouwen of verkoopklaar maken."],
    ["/woning-verkopen-die-nog-vol-staat", "Woning verkopen die nog vol staat", "Oplevering en spullen bespreekbaar maken."],
  ],
  ctaTitle: "Wilt u verkopen zonder traditioneel makelaarstraject?",
  ctaText:
    "Vraag vrijblijvend een verkoopvoorstel aan. U ontvangt eerst duidelijkheid over mogelijkheden, prijs, planning en voorwaarden. Daarna beslist u zelf.",
};

export default function WoningVerkopenZonderMakelaarPage() {
  return <SeoLandingPage page={page} />;
}
