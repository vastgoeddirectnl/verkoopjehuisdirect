import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen bij erfenis of nalatenschap",
  description:
    "Geërfde woning verkopen? Vraag vrijblijvend duidelijkheid aan over verkoop, oplevering, erfgenamen, spullen in de woning en notariële afwikkeling.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl/huis-verkopen-bij-erfenis",
  },
  openGraph: {
    title: "Huis verkopen bij erfenis of nalatenschap",
    description:
      "Rustige verkoopoplossing voor een geërfde woning. Vrijblijvend voorstel, duidelijke afspraken en notariële afwikkeling.",
    url: "https://www.vastgoeddirectnederland.nl/huis-verkopen-bij-erfenis",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "Huis verkopen bij erfenis of nalatenschap",
    description:
      "Vraag vrijblijvend duidelijkheid aan over verkoop van een geërfde woning zonder direct een regulier verkooptraject te starten.",
  },
};

const page = {
  slug: "/huis-verkopen-bij-erfenis",
  breadcrumb: "Huis verkopen bij erfenis",
  pageType: "situation",
  eyebrow: "Erfeniswoning verkopen",
  defaultSituation: "Erfenis / nalatenschap",
  h1: "Een huis verkopen bij erfenis zonder onnodige druk of onduidelijkheid",
  lead:
    "Een geërfde woning verkopen roept vaak praktische en juridische vragen op. Denk aan erfgenamen, spullen in de woning, een bestaande hypotheek, onderhoud en het moment van overdracht. Wij helpen u eerst rustig duidelijkheid te krijgen.",
  shortAnswer:
    "Een woning uit een erfenis kan vaak worden verkocht zodra duidelijk is wie bevoegd is om te tekenen en welke afspraken nodig zijn. U kunt vrijblijvend een voorstel aanvragen, ook als de woning nog vol staat of onderhoud nodig heeft.",
  heroBenefits: [
    "Rustige aanpak bij nalatenschap",
    "Ook als de woning nog vol staat",
    "Duidelijke schriftelijke afspraken",
    "Notariële afwikkeling",
  ],
  benefits: [
    "Vrijblijvend verkoopvoorstel",
    "Geen open huis nodig",
    "Afspraken over spullen en oplevering",
    "Ook bij onderhoud of leegstand",
    "Duidelijkheid voor erfgenamen",
    "Overdracht via de notaris",
  ],
  concernTitle: "Welke vragen spelen vaak bij een erfeniswoning?",
  concernCards: [
    "Moeten alle erfgenamen akkoord zijn voordat er verkocht kan worden?",
    "Wat gebeurt er met spullen, inboedel of achterstallig onderhoud?",
    "Wie is bevoegd om afspraken te maken en te tekenen?",
    "Hoe wordt een bestaande hypotheek, verzekering of leegstand praktisch opgepakt?",
  ],
  solutionTitle: "Wat kan de verkoop eenvoudiger maken?",
  solutionCards: [
    "Eerst een vrijblijvende beoordeling zonder open huis.",
    "Afspraken over leeghalen, oplevering en overdrachtsdatum vooraf bespreken.",
    "Een voorstel dat erfgenamen rustig kunnen beoordelen.",
    "Duidelijke vastlegging in koopovereenkomst en notariële afwikkeling.",
  ],
  valueTitle: "Bij een erfeniswoning is rust vaak belangrijker dan haast.",
  valueText:
    "Er zijn meestal meerdere belangen, documenten en praktische stappen. Daarom is het belangrijk dat een voorstel niet alleen over prijs gaat, maar ook over wie beslist, wat met de woning gebeurt en hoe de overdracht zorgvuldig wordt geregeld.",
  vdnTasks: [
    "Meedenken over verkoop zonder open huis of lange bezichtigingsperiode.",
    "Afspraken over spullen, onderhoud en oplevering overzichtelijk maken.",
    "Een voorstel opstellen dat erfgenamen kunnen bespreken.",
    "Bij akkoord de verkoop laten verlopen via koopovereenkomst en notaris.",
  ],
  ownerTasks: [
    "Nagaan wie erfgenaam is en wie bevoegd is om te tekenen.",
    "Controleren of de nalatenschap zuiver of beneficiair is aanvaard.",
    "Informatie verzamelen over hypotheek, verzekeringen en eventuele lasten.",
    "Onderling afstemmen of alle betrokkenen akkoord zijn met verkoop.",
  ],
  practiceExample: {
    situation: "Geërfde woning die nog niet leeg was",
    propertyType: "Tussenwoning",
    region: "Groningen / Drenthe",
    mainProblem:
      "Er waren meerdere erfgenamen, de woning stond nog vol spullen en niemand wilde direct een regulier verkooptraject met bezichtigingen starten.",
    solution:
      "Eerst werd vrijblijvend bekeken welke verkooproute mogelijk was en welke opleverafspraken nodig konden zijn.",
    delivery:
      "Spullen en oplevering werden als apart bespreekpunt meegenomen, zodat erfgenamen niet direct alles hoefden op te lossen.",
    transfer:
      "Bij akkoord zou de koopovereenkomst pas worden opgesteld nadat bevoegdheid en voorwaarden duidelijk waren.",
    nextStep:
      "Erfgenamen konden het voorstel eerst gezamenlijk beoordelen voordat verdere stappen werden gezet.",
  },
  sections: [
    {
      title: "Wie mag de woning verkopen?",
      paragraphs: [
        "Bij een erfenis moet eerst duidelijk zijn wie eigenaar of erfgenaam is en wie bevoegd is om namens de nalatenschap te tekenen. Soms zijn alle erfgenamen nodig, soms is er een executeur of gevolmachtigde.",
        "Wij kunnen geen erfrechtelijk advies vervangen, maar we kunnen wel helpen om verkoopafspraken rustig en overzichtelijk te maken zodra duidelijk is wie mag beslissen.",
      ],
    },
    {
      title: "Als de woning nog vol spullen staat",
      paragraphs: [
        "Een erfeniswoning is niet altijd direct leeg of verkoopklaar. Dat hoeft een eerste aanvraag niet te blokkeren. Het kan juist verstandig zijn eerst te weten wat de verkoopmogelijkheden zijn voordat u kosten maakt voor ontruiming, opslag of herstel.",
        "Afspraken over inboedel, achterblijvende spullen of oplevering kunnen later expliciet worden vastgelegd.",
      ],
    },
    {
      title: "Hypotheek, verzekeringen en lasten",
      paragraphs: [
        "Bij een geërfde woning kunnen doorlopende lasten blijven bestaan, zoals hypotheekrente, verzekeringen, energie of gemeentelijke lasten. Ook kan er een bestaande hypotheek zijn die bij overdracht moet worden afgelost.",
        "Voor de uiteindelijke overdracht kijkt de notaris mee naar eigendom, hypotheekaflossing en juridische levering.",
      ],
    },
    {
      title: "Welke verkooproutes zijn mogelijk?",
      bullets: [
        "Reguliere verkoop via een makelaar, mogelijk met hogere opbrengstkans maar meer voorbereiding.",
        "Eerst leeghalen, herstellen en daarna verkopen.",
        "Direct vrijblijvend een voorstel aanvragen voor verkoop met duidelijke opleverafspraken.",
        "Eerst de situatie bespreken wanneer erfgenamen nog niet overal uit zijn.",
      ],
    },
    {
      title: "Hoe verloopt het proces?",
      steps: [
        "U vult de woninggegevens en de erfenissituatie in.",
        "Wij bekijken de woning, staat, locatie en gewenste planning.",
        "Waar mogelijk ontvangt u een eerste vrijblijvende inschatting of voorstel.",
        "Erfgenamen of betrokkenen kunnen het voorstel rustig beoordelen.",
        "Bij akkoord worden voorwaarden uitgewerkt en verloopt overdracht via de notaris.",
      ],
    },
  ],
  processSteps: [
    "Woninggegevens en betrokkenen in kaart brengen.",
    "Bevoegdheid, nalatenschap en praktische situatie laten controleren waar nodig.",
    "Vrijblijvende inschatting of voorstel ontvangen.",
    "Oplevering, spullen, termijn en voorwaarden afstemmen.",
    "Bij akkoord koopovereenkomst ondertekenen en overdracht via de notaris laten verlopen.",
  ],
  comparisonRows: [
    ["Voorbereiding", "Vaak eerst leeghalen, herstellen en presenteren", "Eerste beoordeling kan ook vóór volledige voorbereiding"],
    ["Erfgenamen", "Afstemming blijft nodig", "Voorstel kan eerst gezamenlijk worden beoordeeld"],
    ["Bezichtigingen", "Meerdere kijkers of open huis mogelijk", "Geen brede kijkersronde nodig"],
    ["Inboedel", "Vaak eerst oplossen voor verkoop", "Kan als opleverafspraak worden besproken"],
    ["Verkooptermijn", "Afhankelijk van markt en koper", "Planning kan gericht worden afgesproken"],
    ["Makelaarskosten", "Vaak courtage of verkoopkosten", "Geen makelaarskosten bij directe aankoop"],
    ["Hypotheek", "Aflossing via notaris bij overdracht", "Ook via notaris bij overdracht"],
    ["Afwikkeling", "Via koopovereenkomst en notaris", "Via koopovereenkomst en notaris"],
  ],
  faqs: [
    {
      question: "Kan een geërfde woning direct worden verkocht?",
      answer:
        "Dat kan vaak, maar eerst moet duidelijk zijn wie bevoegd is om te verkopen en te tekenen. Een aanvraag voor een eerste voorstel kan wel alvast helpen om de mogelijkheden te verkennen.",
    },
    {
      question: "Moeten alle erfgenamen akkoord zijn?",
      answer:
        "Meestal moeten alle gerechtigden akkoord zijn, tenzij er een executeur, gevolmachtigde of andere bevoegdheid is geregeld. Laat dit bij twijfel juridisch of notarieel controleren.",
    },
    {
      question: "Kan de woning worden verkocht als deze nog vol staat?",
      answer:
        "Ja, dat kan worden besproken. Spullen, inboedel en oplevering kunnen onderdeel zijn van de afspraken, mits dit duidelijk wordt vastgelegd.",
    },
    {
      question: "Wat gebeurt er met een bestaande hypotheek?",
      answer:
        "Een bestaande hypotheek moet normaal gesproken bij de overdracht worden afgelost via de notaris. De notaris controleert dit in het overdrachtsproces.",
    },
    {
      question: "Wie tekent de koopovereenkomst?",
      answer:
        "De bevoegde eigenaar, erfgenamen, executeur of gevolmachtigde ondertekent. Wie dat precies is, hangt af van de nalatenschap en de beschikbare documenten.",
    },
  ],
  relatedLinks: [
    ["/geerfde-woning-verkopen-zonder-leeghalen", "Geërfde woning verkopen zonder leeghalen", "Als de woning nog vol spullen staat."],
    ["/huis-verkopen-na-overlijden", "Huis verkopen na overlijden", "Rustig overzicht na overlijden van een eigenaar."],
    ["/leegstaand-huis-verkopen", "Leegstaand huis verkopen", "Bij leegstand, zorgen of doorlopende lasten."],
    ["/huis-verkopen-zonder-leeghalen", "Huis verkopen zonder leeghalen", "Oplevering en spullen bespreekbaar maken."],
    ["/opknapwoning-verkopen", "Opknapwoning verkopen", "Wanneer onderhoud of staat een rol speelt."],
    ["/huis-snel-verkopen", "Huis snel verkopen", "Wanneer erfgenamen snel duidelijkheid willen."],
  ],
  ctaTitle: "Wilt u een geërfde woning rustig laten beoordelen?",
  ctaText:
    "Vraag vrijblijvend een verkoopvoorstel aan. U ontvangt eerst duidelijkheid over mogelijkheden, voorwaarden, oplevering en vervolgstappen.",
};

export default function HuisVerkopenBijErfenisPage() {
  return <SeoLandingPage page={page} />;
}
