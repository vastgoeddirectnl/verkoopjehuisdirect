import SeoLandingPage from "../components/SeoLandingPage";

// Flevoland hoort sinds 5.7.0 bij het werkgebied (zie WERKGEBIED_PROVINCIES in
// app/lib/address.js). De Google Ads-campagne adverteerde er al.

const description =
  "Woning verkopen in Flevoland? Wij kopen woningen in Almere, Lelystad, Dronten, Zeewolde, de Noordoostpolder en Urk zelf. Vrijblijvend voorstel met prijs.";

export const metadata = {
  title: "Woning verkopen in Flevoland",
  description,
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/woning-verkopen-flevoland",
  },
  openGraph: {
    title: "Woning verkopen in Flevoland | vrijblijvend verkoopvoorstel",
    description,
    url: "https://www.vastgoeddirectnederland.nl/woning-verkopen-flevoland",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

const page = {
  slug: "/woning-verkopen-flevoland",
  pageType: "region",
  regionName: "Flevoland",
  localAreas: [
    "Almere", "Lelystad", "Dronten", "Biddinghuizen", "Swifterbant", "Zeewolde",
    "Emmeloord", "Urk", "Marknesse", "Ens", "Kraggenburg", "Luttelgeest", "Tollebeek", "Nagele",
  ],
  localAreasTitle: "Van Almere tot de Noordoostpolder",
  breadcrumb: "Woning verkopen in Flevoland",
  eyebrow: "Regio Flevoland",
  h1: "Uw woning in Flevoland verkopen, rechtstreeks aan ons",
  lead:
    "Een rijwoning in Almere, een gezinswoning in Lelystad of een woning op het platteland van de Noordoostpolder: wij kopen woningen in heel Flevoland zelf. U krijgt eerst een vrijblijvend voorstel met prijs en planning, zonder Funda, open huis of kijkers.",
  heroNote: "Vrijblijvend. U ontvangt eerst duidelijkheid en beslist daarna zelf of u verder wilt.",
  defaultSituation: "Woning verkopen in Flevoland",
  afterRequestText:
    "Wij bekijken uw woninggegevens, de locatie in Flevoland en uw gewenste planning. Als directe verkoop passend is, ontvangt u een vrijblijvend verkoopvoorstel. Wij garanderen vooraf geen verkoop binnen een vaste termijn.",
  shortAnswer:
    "Ja, Flevoland hoort bij ons werkgebied. Voor een woning in Almere, Lelystad, Dronten, Zeewolde, de Noordoostpolder of Urk kunt u rechtstreeks een vrijblijvende beoordeling aanvragen, ook als de woning onderhoud nodig heeft, leegstaat of nog vol spullen staat.",
  benefits: [
    "Actief in heel Flevoland",
    "Ook bij onderhoud of leegstand",
    "Geen open huis nodig",
    "Vrijblijvend voorstel",
    "Duidelijke opleverafspraken",
    "Notariële overdracht",
  ],
  heroBenefits: [
    "Wij kopen zelf, geen tussenpersoon",
    "Vrijblijvend voorstel met prijs",
    "Geen kijkers over de vloer",
    "Duidelijke afspraken",
  ],
  concernTitle: "Situaties die wij in Flevoland vaak tegenkomen",
  concernCards: [
    "U verhuist voor werk of gezin en wilt niet maandenlang twee woonlasten betalen.",
    "Een woning uit de jaren zeventig of tachtig is toe aan onderhoud of verduurzaming.",
    "Een erfeniswoning of woning op het platteland moet worden verkocht terwijl u verder weg woont.",
    "U wilt vooraf weten waar u aan toe bent, zonder lange verkoopcampagne.",
  ],
  solutionTitle: "Wat wij meenemen in de beoordeling",
  solutionCards: [
    "Het woningtype en de ligging, in de stad, een dorp of het buitengebied.",
    "Bouwjaar, staat en wat er nog aan onderhoud of verduurzaming nodig is.",
    "Uw gewenste planning, ook als die moet aansluiten op een volgende woning.",
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
      title: "Een jonge provincie met eigen soorten woningen",
      paragraphs: [
        "Flevoland is de jongste provincie van Nederland. Veel woningen in Almere en Lelystad zijn gebouwd vanaf de jaren zeventig en tachtig; een deel daarvan is nu toe aan groot onderhoud, een nieuwe keuken of badkamer, of verduurzaming.",
        "Daarnaast zijn er de dorpen en het buitengebied van Dronten, Zeewolde en de Noordoostpolder, met vrijstaande woningen en woningen op het platteland. Wij beoordelen de woning zoals ze nu is; u hoeft niet eerst te verbouwen.",
      ],
    },
    {
      title: "Verkopen zonder dubbele lasten",
      paragraphs: [
        "Wie vanuit Flevoland verhuist, heeft vaak al een volgende woning op het oog. Een verkoop die maanden duurt, betekent dan twee keer woonlasten. Bij een directe verkoop leggen we de overdrachtsdatum vooraf vast, zodat die aansluit op uw planning.",
      ],
    },
    {
      title: "Passende verkoopsituaties",
      bullets: [
        "Rijwoning of gezinswoning met achterstallig onderhoud",
        "Woning die moet aansluiten op een verhuizing of nieuwe woning",
        "Erfeniswoning, ook als de erfgenamen niet in Flevoland wonen",
        "Leegstaande woning of woning die nog vol spullen staat",
        "Woning in het buitengebied of een dorp in de polder",
      ],
    },
  ],
  processTitle: "Hoe verloopt een aanvraag?",
  processSteps: [
    { title: "Aanvraag indienen", text: "U deelt het adres, het type woning en uw situatie." },
    { title: "Beoordeling", text: "Wij kijken naar de woning, de staat, de ligging en uw planning." },
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
      question: "Kopen jullie ook woningen in Flevoland?",
      answer: "Ja. Flevoland hoort bij ons werkgebied, samen met Groningen, Friesland, Drenthe en Overijssel. Dat geldt voor Almere en Lelystad en voor de dorpen in Dronten, Zeewolde, de Noordoostpolder en Urk.",
    },
    {
      question: "Moet mijn woning eerst opgeknapt of verduurzaamd worden?",
      answer: "Nee. Wij beoordelen de woning in de huidige staat. Onderhoud en verduurzaming nemen wij mee in het voorstel.",
    },
    {
      question: "Kan de overdracht aansluiten op mijn nieuwe woning?",
      answer: "Dat is vaak juist de reden om direct te verkopen. De overdrachtsdatum spreken we vooraf af en leggen we vast in de koopovereenkomst.",
    },
    {
      question: "Krijg ik gegarandeerd een bod?",
      answer: "Nee. Wij garanderen vooraf geen bod of verkoop binnen een vaste termijn. Dat hangt af van de woning, de gegevens en de afspraken die mogelijk zijn.",
    },
  ],
  relatedLinks: [
    ["/huis-verkopen-almere", "Huis verkopen in Almere"],
    ["/huis-verkopen-lelystad", "Huis verkopen in Lelystad"],
    ["/huis-verkopen-bij-dubbele-lasten", "Huis verkopen bij dubbele lasten"],
    ["/huis-verkopen-zonder-opknappen", "Huis verkopen zonder opknappen"],
    ["/huis-verkopen-bij-erfenis", "Huis verkopen bij erfenis"],
    ["/woning-verkopen-overijssel", "Woning verkopen in Overijssel"],
  ],
  ctaTitle: "Woning in Flevoland verkopen?",
  ctaText: "Vraag vrijblijvend een voorstel aan op basis van de woning zoals ze nu is.",
};

export default function WoningVerkopenFlevolandPage() {
  return <SeoLandingPage page={page} />;
}
