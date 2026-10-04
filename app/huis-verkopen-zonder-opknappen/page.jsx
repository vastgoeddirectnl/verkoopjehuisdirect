import SeoLandingPage from "../components/SeoLandingPage";

// Search Console (okt 2026): "huis verkopen zonder opknappen" staat rond
// positie 11-14, net naast pagina 1. Mensen zoeken ook op "huis opknappen voor
// verkoop", "verouderd huis verkopen" en "huis verkopen zonder renovatie".
// Daarom beantwoordt deze pagina eerst de echte vraag (loont opknappen?) en
// daarna pas onze route. "Zoals het staat" hoort bij /huis-verkopen-in-huidige-staat,
// een echte kluswoning bij /opknapwoning-verkopen.

const description =
  "Opknappen voor de verkoop kost geld en tijd en verdient zich lang niet altijd terug. Lees wanneer het loont, wat u beter laat en hoe u verkoopt zonder te verbouwen.";

export const metadata = {
  title: "Huis verkopen zonder opknappen",
  description,
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-zonder-opknappen",
  },
  openGraph: {
    title: "Huis verkopen zonder opknappen: loont opknappen wel?",
    description,
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-zonder-opknappen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

const page = {
  slug: "/huis-verkopen-zonder-opknappen",
  pageType: "situation",
  breadcrumb: "Huis verkopen zonder opknappen",
  eyebrow: "Opknappen of niet?",
  defaultSituation: "Huis verkopen zonder opknappen",
  h1: "Huis verkopen zonder opknappen",
  lead:
    "Een nieuwe keuken, badkamer of verfbeurt vóór de verkoop lijkt logisch, maar levert lang niet altijd meer op dan hij kost. Hieronder leest u wanneer opknappen wel loont, wanneer niet, en hoe u verkoopt zonder eerst te verbouwen.",
  heroNote:
    "Wij kopen woningen zelf, ook als ze verouderd zijn of onderhoud nodig hebben. U ontvangt eerst een vrijblijvend voorstel met prijs en beslist daarna.",
  heroBenefits: [
    "Niet eerst verbouwen of schilderen",
    "Geen kosten vooraf",
    "Voorstel op basis van de huidige staat",
    "U beslist zelf na het voorstel",
  ],
  shortAnswer:
    "Nee, u hoeft uw huis niet op te knappen om het te verkopen. Kleine dingen zoals opruimen, schoonmaken en losse reparaties betalen zich bij een gewone verkoop vaak terug. Een grote verbouwing meestal niet: kopers willen hun eigen keuze maken en u draagt zelf de kosten, de wachttijd en het risico op tegenvallers. Wilt u helemaal niets voorbereiden, dan kunt u ook rechtstreeks verkopen in de huidige staat.",
  benefits: [
    "Geen verbouwing vooraf",
    "Geen voorfinanciering",
    "Ook bij verouderde woningen",
    "Geen open huis",
    "Afspraken op papier",
    "Overdracht via de notaris",
  ],
  sections: [
    {
      title: "Loont opknappen voor de verkoop?",
      paragraphs: [
        "Dat hangt af van wat u wilt opknappen. Een opgeruimde, schone woning zonder losse gebreken maakt op foto's en bij bezichtigingen een betere indruk. Die kleine investering verdient zich bij een verkoop via een makelaar vaak terug.",
        "Bij grotere klussen ligt dat anders. Een nieuwe keuken of badkamer kost al snel tienduizenden euro's en weken tot maanden tijd. Veel kopers rekenen die verbouwing niet volledig mee in hun bod, omdat zij zelf willen kiezen. Wat u uitgeeft, krijgt u dan maar deels terug.",
      ],
    },
    {
      title: "Wat meestal wel loont, en wat niet",
      bullets: [
        "Wel: opruimen, leeghalen en grondig schoonmaken.",
        "Wel: kleine reparaties, zoals een lekkende kraan, kapotte deurklink of loszittend tegelwerk.",
        "Wel: bekende gebreken laten onderzoeken, zodat kopers niet op hun gevoel afprijzen.",
        "Vaak niet: een nieuwe keuken of badkamer kort voor de verkoop.",
        "Vaak niet: een verbouwing die u moet voorfinancieren terwijl u ook al woonlasten heeft.",
        "Vaak niet: modern schilderwerk of styling als de woning daarna toch volledig wordt aangepast.",
      ],
    },
    {
      title: "Een rekenvoorbeeld",
      paragraphs: [
        "Stel: u vervangt keuken en badkamer voor € 25.000 en dat duurt drie maanden. Door die verbouwing brengt de woning € 18.000 meer op. Dan heeft u € 7.000 toegelegd, plus drie maanden extra woonlasten en het risico dat de klus uitloopt of duurder wordt.",
        "Dit is een fictief voorbeeld; de werkelijke getallen verschillen per woning en regio. Het laat wel zien waarom een verbouwing vooraf niet vanzelf meer oplevert. In onze kennisbank staat een uitgebreider rekenvoorbeeld van de netto-opbrengst.",
      ],
    },
    {
      title: "Drie manieren om te verkopen zonder opknappen",
      bullets: [
        "Als kluswoning via een makelaar: u bereikt de meeste kopers, maar zij rekenen de verbouwing en een marge af. Ook moeten zij de verbouwing vaak zelf financieren, en dat lukt niet iedereen.",
        "Zelf verkopen: u bespaart courtage, maar regelt zelf de presentatie, bezichtigingen en onderhandeling.",
        "Rechtstreeks verkopen aan een opkoper: geen bezichtigingen en geen voorfinanciering. Het bod ligt meestal lager dan de prijs van een opgeknapte woning; daar staat tegenover dat u niets hoeft te investeren of af te wachten.",
      ],
    },
    {
      title: "Hoe komt een prijs voor een niet-opgeknapte woning tot stand?",
      paragraphs: [
        "Wij kijken naar wat de woning waard is in goede staat, en trekken daar de kosten van het herstel en de bijkomende risico's van af. Daarom vragen wij naar het onderhoud, bekende gebreken en de gewenste planning.",
        "U krijgt een voorstel met een concrete prijs en uitleg over de opbouw. Zo kunt u het eerlijk vergelijken met eerst opknappen of met een verkoop via een makelaar.",
      ],
    },
    {
      title: "Gebreken: wat moet u melden?",
      paragraphs: [
        "Als verkoper heeft u een mededelingsplicht: gebreken die u kent, moet u melden. Dat geldt ook als u de woning verkoopt zonder op te knappen.",
        "In de koopovereenkomst kan worden vastgelegd dat de koper de woning accepteert in de staat waarin deze zich bevindt. Zo'n afspraak beperkt discussie achteraf, maar ontslaat u niet van het melden van gebreken die u kende.",
      ],
    },
    {
      title: "Hoe werkt het proces?",
      steps: [
        "U vult kort uw woning en situatie in. Foto's of een opsomming van het onderhoud helpen, maar zijn niet verplicht.",
        "Wij bespreken de staat van de woning en bekijken haar zoals ze nu is.",
        "U ontvangt een vrijblijvend voorstel met prijs, planning en opleverafspraken.",
        "Bij akkoord worden de afspraken vastgelegd in een koopovereenkomst en volgt de overdracht via de notaris.",
      ],
    },
  ],
  exampleSituation: {
    title: "Wanneer verkopen zonder opknappen vaak de logische keuze is",
    text: "Bijvoorbeeld bij een ouderlijk huis dat al jaren niet is gemoderniseerd, een woning die leegstaat terwijl de lasten doorlopen, of als u na een verhuizing geen tijd en energie meer heeft voor een verbouwing. Dan weegt de zekerheid van een vaste prijs en planning vaak zwaarder dan een mogelijk hogere opbrengst na een verbouwing.",
  },
  comparisonRows: [
    ["Opknappen", "Vaak verwacht voor een goede presentatie", "Niet nodig; de huidige staat is het uitgangspunt"],
    ["Investering vooraf", "Herstel, schilderwerk of styling voor eigen rekening", "Geen kosten vooraf"],
    ["Bezichtigingen", "Meerdere kijkers en mogelijk een bouwkundige keuring", "Geen open huis nodig"],
    ["Prijs", "Mogelijk hoger, afhankelijk van markt en staat", "Meestal lager, maar zonder verbouwingskosten en wachttijd"],
    ["Planning", "Verbouwing plus verkooptijd", "In overleg vast te leggen"],
    ["Beslissing", "Na verbouwing en onderhandeling", "U beslist zelf na het voorstel"],
  ],
  faqs: [
    {
      question: "Moet ik mijn huis opknappen voordat ik het verkoop?",
      answer:
        "Nee. Een woning mag in elke staat worden verkocht, zolang u bekende gebreken meldt. Opruimen en kleine reparaties helpen bij een gewone verkoop vaak wel; een grote verbouwing verdient zich zelden volledig terug.",
    },
    {
      question: "Welke klussen lonen wel voor de verkoop?",
      answer:
        "Vooral goedkope dingen die de eerste indruk verbeteren: opruimen, schoonmaken, losse reparaties en zorgen dat ramen, deuren en installaties werken. Dure keuze-afhankelijke klussen, zoals een nieuwe keuken of badkamer, lonen meestal minder.",
    },
    {
      question: "Krijg ik minder als ik niet opknap?",
      answer:
        "De verkoopprijs ligt meestal lager dan die van een opgeknapte woning. Maar u bespaart de kosten, de tijd en het risico van de verbouwing. Vergelijk daarom wat u netto overhoudt, niet alleen de verkoopprijs.",
    },
    {
      question: "Kan ik een verouderd huis verkopen zonder renovatie?",
      answer:
        "Ja. Ook een woning met een oude keuken, badkamer of installaties is verkoopbaar. Wij beoordelen de woning zoals ze nu is en verwerken het benodigde herstel in het voorstel.",
    },
    {
      question: "Ben ik aansprakelijk voor gebreken na de verkoop?",
      answer:
        "Gebreken die u kende en niet heeft gemeld, kunnen tot aansprakelijkheid leiden. Meld daarom alles wat u weet. In de koopovereenkomst worden de staat van de woning en de afspraken daarover vastgelegd.",
    },
    {
      question: "Moet de woning leeg zijn als ik niet opknap?",
      answer:
        "Niet altijd. Of spullen of inboedel kunnen achterblijven, spreken wij af in het voorstel.",
    },
  ],
  relatedLinks: [
    ["/opknapwoning-verkopen", "Opknapwoning verkopen"],
    ["/huis-verkopen-met-achterstallig-onderhoud", "Huis verkopen met achterstallig onderhoud"],
    ["/huis-verkopen-in-huidige-staat", "Huis verkopen in de huidige staat"],
    ["/woning-verkopen-met-schade", "Woning verkopen met schade"],
    ["/huis-verkopen-zonder-leeghalen", "Huis verkopen zonder leeghalen"],
    [
      "/kennisbank/netto-opbrengst-berekenen",
      "Netto-opbrengst berekenen",
      "Rekenvoorbeeld: wat houdt u over via een makelaar of bij directe verkoop?",
    ],
  ],
  ctaTitle: "Wilt u verkopen zonder eerst te verbouwen?",
  ctaText: "Vraag vrijblijvend een voorstel aan op basis van de woning zoals deze nu is.",
};

export default function HuisVerkopenZonderOpknappenPage() {
  return <SeoLandingPage page={page} />;
}
