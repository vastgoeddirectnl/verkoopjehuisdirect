import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Opknapwoning verkopen zonder eerst te renoveren",
  description:
    "Opknapwoning verkopen met onderhoud, schade of volle woning? Vraag vrijblijvend een voorstel aan zonder eerst te verbouwen, schilderen of leeghalen.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/opknapwoning-verkopen",
  },
  openGraph: {
    title: "Opknapwoning verkopen zonder eerst te renoveren",
    description:
      "Vraag vrijblijvend duidelijkheid aan voor verkoop van een opknapwoning in de huidige staat. Niet eerst opknappen, leeghalen of verkoopklaar maken.",
    url: "https://www.vastgoeddirectnederland.nl/opknapwoning-verkopen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "Opknapwoning verkopen zonder eerst te renoveren",
    description:
      "Ook bij achterstallig onderhoud, schade of een woning die nog vol staat kunt u vrijblijvend een verkoopvoorstel aanvragen.",
  },
};

const page = {
  slug: "/opknapwoning-verkopen",
  breadcrumb: "Opknapwoning verkopen",
  pageType: "situation",
  eyebrow: "Opknapwoning verkopen",
  defaultSituation: "Achterstallig onderhoud",
  h1: "Uw opknapwoning verkopen zonder eerst duizenden euro’s te investeren",
  lead:
    "Heeft uw woning achterstallig onderhoud, een verouderde inrichting of schade? U hoeft niet eerst te schilderen, verbouwen of leeghalen. Wij bekijken de woning zoals deze nu is en bespreken vrijblijvend welke verkoopafspraken mogelijk zijn.",
  shortAnswer:
    "Een opknapwoning kan ook in de huidige staat worden beoordeeld. U hoeft niet vooraf te renoveren om duidelijkheid te krijgen over een mogelijke verkooproute, koopprijs, oplevering en overdracht.",
  heroBenefits: [
    "Geen renovatie vooraf",
    "Ook mogelijk met gebreken",
    "Geen open huis nodig",
    "Duidelijke opleverafspraken",
  ],
  benefits: [
    "Niet eerst renoveren",
    "Ook bij achterstallig onderhoud",
    "Ook als de woning nog vol staat",
    "Gebreken kunnen worden besproken",
    "Geen uitgebreide bezichtigingsrondes",
    "Vrijblijvend voorstel",
  ],
  concernTitle: "Wat maakt een opknapwoning vaak lastig?",
  concernCards: [
    "Kopers rekenen met verbouwingskosten en bouwkundige risico’s.",
    "Foto’s en bezichtigingen vragen vaak eerst opruimen, herstel of styling.",
    "Investeren in herstel voelt niet logisch als u toch wilt verkopen.",
    "Gebreken moeten goed worden gemeld en verwerkt in de afspraken.",
  ],
  solutionTitle: "Welke afspraken kunnen helpen?",
  solutionCards: [
    "Beoordeling van de woning in de huidige staat.",
    "Afspraken over spullen, oplevering en eventuele werkzaamheden.",
    "Duidelijkheid over welke gebreken bekend zijn en hoe die worden meegenomen.",
    "Een voorstel waarbij verbouwen vooraf niet het uitgangspunt is.",
  ],
  valueTitle: "Bij een opknapwoning draait verkoop niet alleen om de vraagprijs.",
  valueText:
    "De staat van de woning, bekende gebreken, oplevering en mogelijke kosten voor herstel zijn minstens zo belangrijk. Daarom leggen wij afspraken over de woning zoals deze is zo duidelijk mogelijk vast.",
  vdnTasks: [
    "Meekijken naar verkoop in de huidige staat zonder renovatie vooraf.",
    "Bespreken hoe onderhoud, schade of spullen in de woning worden meegenomen.",
    "Duidelijke afspraken maken over oplevering en juridische levering.",
    "Een voorstel uitwerken dat u rustig kunt beoordelen.",
  ],
  ownerTasks: [
    "Bekende gebreken en bijzonderheden melden.",
    "Aangeven wat wel of niet vóór levering wordt gedaan.",
    "Foto’s of aanvullende informatie delen als dat helpt bij beoordeling.",
    "Het voorstel controleren op prijs, voorwaarden en opleverafspraken.",
  ],
  practiceExample: {
    situation: "Verouderde woning met achterstallig onderhoud",
    propertyType: "Vrijstaande woning",
    region: "Drenthe / Groningen",
    mainProblem:
      "De eigenaar wilde niet meer investeren in schilderwerk, installaties en verkoopstyling voordat duidelijk was wat verkoop kon opleveren.",
    solution:
      "De woning werd beoordeeld in de huidige staat. Onderhoud en mogelijke herstelkosten werden meegenomen in het voorstel.",
    delivery:
      "Oplevering kon worden besproken zonder dat eerst alles volledig werd opgeknapt.",
    transfer:
      "Bij akkoord zouden de afspraken schriftelijk worden vastgelegd en via de notaris worden afgewikkeld.",
    nextStep:
      "Eigenaar ontving eerst duidelijkheid en kon daarna kiezen tussen direct verkopen of regulier aanbieden.",
  },
  sections: [
    {
      title: "Moet u eerst opknappen voordat u verkoopt?",
      paragraphs: [
        "Dat hoeft niet altijd. Bij een reguliere verkoop kan opknappen helpen bij presentatie of opbrengst, maar het kost ook geld, tijd en energie. Bij een directe verkoopoplossing kan de woning juist in de huidige staat worden beoordeeld.",
        "Dat is vooral relevant wanneer de woning verouderd is, herstel nodig heeft, schade heeft of nog niet leeg is.",
      ],
    },
    {
      title: "Welke verkoopoplossingen zijn mogelijk?",
      bullets: [
        "Eerst renoveren en daarna regulier verkopen.",
        "Via een makelaar aanbieden als kluswoning of opknapwoning.",
        "Zelf een koper zoeken en alle afspraken zelf regelen.",
        "Vrijblijvend laten beoordelen of directe verkoop in de huidige staat past.",
      ],
    },
    {
      title: "Gebreken en meldingsplicht",
      paragraphs: [
        "Bij verkoop van een woning is het belangrijk dat bekende gebreken en bijzonderheden eerlijk worden gemeld. Dat geldt ook bij directe verkoop.",
        "Het voordeel is dat deze punten vooraf kunnen worden besproken en vervolgens in prijs, voorwaarden en opleverafspraken kunnen worden meegenomen.",
      ],
    },
    {
      title: "Oplevering en levering",
      paragraphs: [
        "Bij een opknapwoning zijn opleverafspraken extra belangrijk. Denk aan spullen die achterblijven, werkzaamheden die nog worden uitgevoerd of juist de afspraak dat de woning wordt geleverd in de huidige staat.",
        "Als u verder wilt met een voorstel, worden dit soort afspraken schriftelijk uitgewerkt voordat de koopovereenkomst wordt ondertekend.",
      ],
    },
    {
      title: "Hoe verloopt de aanvraag?",
      steps: [
        "U vult de woninggegevens en de staat van de woning in.",
        "Wij bekijken onderhoud, locatie, type woning en gewenste planning.",
        "Als directe verkoop passend is, ontvangt u een vrijblijvend verkoopvoorstel.",
        "Eventuele gebreken, spullen en opleverafspraken worden besproken.",
        "Bij akkoord volgen schriftelijke afspraken en notariële overdracht.",
      ],
    },
  ],
  processSteps: [
    "Woninggegevens en onderhoudssituatie invullen.",
    "Bekende gebreken, spullen en gewenste oplevering benoemen.",
    "Vrijblijvend verkoopvoorstel ontvangen.",
    "Afspraken over staat, oplevering en levering controleren.",
    "Bij akkoord vastleggen en via de notaris afronden.",
  ],
  comparisonRows: [
    ["Verkoopklaar maken", "Vaak eerst opruimen, herstellen of stylen", "Niet nodig voor een eerste voorstel"],
    ["Renovatiekosten", "Vaak vooraf investeren", "Geen verplichte renovatie vooraf"],
    ["Bezichtigingen", "Kopers letten sterk op gebreken", "Geen open huis of brede kijkersronde nodig"],
    ["Gebreken", "Kunnen onderhandelingen lastiger maken", "Vooraf bespreken en schriftelijk vastleggen"],
    ["Oplevering", "Vaak leeg en netjes verwacht", "In overleg afspraken over huidige staat"],
    ["Makelaarskosten", "Vaak courtage of verkoopkosten", "Geen makelaarskosten bij directe aankoop"],
    ["Planning", "Afhankelijk van markt en koper", "In overleg concreet af te spreken"],
    ["Afwikkeling", "Via koopovereenkomst en notaris", "Ook via koopovereenkomst en notaris"],
  ],
  faqs: [
    {
      question: "Moet ik de woning eerst opknappen?",
      answer:
        "Nee, dat hoeft niet altijd. U kunt vrijblijvend laten bekijken wat verkoop in de huidige staat betekent, zonder eerst te schilderen, herstellen of verbouwen.",
    },
    {
      question: "Kan ik verkopen met achterstallig onderhoud?",
      answer:
        "Ja, dat kan worden beoordeeld. Achterstallig onderhoud heeft invloed op de waarde en voorwaarden, maar hoeft verkoop niet onmogelijk te maken.",
    },
    {
      question: "Mag de woning nog vol staan?",
      answer:
        "Dat kan worden besproken. Soms kan inboedel of achtergebleven materiaal onderdeel worden van de opleverafspraken.",
    },
    {
      question: "Heeft schade invloed op het voorstel?",
      answer:
        "Ja, schade of gebreken kunnen invloed hebben op het voorstel. Daarom is het belangrijk deze punten vooraf duidelijk te melden.",
    },
    {
      question: "Moet ik gebreken melden?",
      answer:
        "Ja. Bekende gebreken en bijzonderheden moeten eerlijk worden gemeld. Zo kunnen ze correct worden meegenomen in de afspraken.",
    },
  ],
  relatedLinks: [
    ["/huis-verkopen-met-achterstallig-onderhoud", "Huis verkopen met achterstallig onderhoud", "Als herstel niet wenselijk of haalbaar is."],
    ["/huis-verkopen-zonder-opknappen", "Huis verkopen zonder opknappen", "Bekijk verkoopmogelijkheden zonder verbouwing vooraf."],
    ["/huis-verkopen-in-huidige-staat", "Huis verkopen in de huidige staat", "Niet eerst verkoopklaar maken."],
    ["/woning-verkopen-die-nog-vol-staat", "Woning verkopen die nog vol staat", "Voor woningen met spullen of inboedel."],
    ["/woning-verkopen-met-schade", "Woning verkopen met schade", "Schade of gebreken vooraf duidelijk meenemen."],
    ["/huis-verkopen-zonder-bezichtigingen", "Huis verkopen zonder bezichtigingen", "Geen open huis of reeks kijkers nodig."],
  ],
  ctaTitle: "Wilt u weten wat uw opknapwoning in de huidige staat kan betekenen?",
  ctaText:
    "Vraag vrijblijvend een verkoopvoorstel aan. U hoeft niet eerst te renoveren, herstellen of leeghalen om duidelijkheid te krijgen.",
};

export default function OpknapwoningVerkopenPage() {
  return <SeoLandingPage page={page} />;
}
