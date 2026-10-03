import KnowledgeArticle from "../../components/KnowledgeArticle";

export const metadata = {
  title: "Stappenplan bij een erfhuis",
  description: "Een geërfde woning verkopen: van verklaring van erfrecht tot de notaris. Welke stappen erfgenamen doorlopen en waar u op let.",
  alternates: { canonical: "/kennisbank/stappenplan-erfhuis-verkopen" },
  openGraph: {
    title: "Stappenplan bij een erfhuis | Vastgoed Direct Nederland",
    description: "Van verklaring van erfrecht tot notaris: welke stappen erfgenamen doorlopen bij de verkoop van een geërfde woning.",
    url: "https://www.vastgoeddirectnederland.nl/kennisbank/stappenplan-erfhuis-verkopen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "article",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

const article = {
  path: "/kennisbank/stappenplan-erfhuis-verkopen",
  breadcrumb: "Stappenplan bij een erfhuis",
  h1: "Een geërfde woning verkopen: het stappenplan",
  description: "Van verklaring van erfrecht tot notaris: welke stappen erfgenamen doorlopen bij de verkoop van een geërfde woning.",
  intro:
    "Na een overlijden komt er veel tegelijk op erfgenamen af. Als er een woning in de nalatenschap zit, moet er ook iets met dat huis gebeuren. Dit stappenplan zet de volgorde op een rij: wat er eerst geregeld moet zijn voordat een woning verkocht kan worden, en waar u in de tussentijd op let.",
  published: "2026-10-03",
  updatedLabel: "oktober 2026",
  summary: [
    "Zonder verklaring van erfrecht kan de woning meestal niet worden verkocht of geleverd.",
    "Alle erfgenamen moeten instemmen met de verkoop, tenzij iemand daartoe bevoegd is (bijvoorbeeld een executeur of gevolmachtigde).",
    "Lopende lasten, verzekering en leegstand vragen in de tussentijd aandacht.",
    "De opbrengst wordt via de notaris verrekend en verdeeld.",
  ],
  sections: [
    {
      title: "De stappen op volgorde",
      blocks: [
        { type: "steps", items: [
          ["1. Verklaring van erfrecht", "De notaris stelt vast wie de erfgenamen zijn en wie namens de nalatenschap mag optreden. Banken, het Kadaster en de notaris die de verkoop afwikkelt, vragen hierom."],
          ["2. Aanvaarden of verwerpen", "Erfgenamen kiezen of zij de erfenis zuiver aanvaarden, beneficiair aanvaarden (alleen als er per saldo iets overblijft) of verwerpen. Bij twijfel over schulden is beneficiair aanvaarden vaak verstandig; bespreek dit met de notaris."],
          ["3. Afspraken tussen erfgenamen", "Spreek af of de woning wordt verkocht, wie het aanspreekpunt is en hoe besluiten worden genomen. Met een volmacht kan één persoon namens de anderen tekenen."],
          ["4. Lasten en verzekering regelen", "Hypotheek, VvE-bijdrage, energie en gemeentelijke belastingen lopen door. Meld leegstand bij de verzekeraar: een leegstaande woning is niet altijd op dezelfde manier verzekerd."],
          ["5. Inboedel en staat bepalen", "Kies of de woning eerst wordt leeggehaald en opgeknapt, of in de huidige staat wordt verkocht. Bij directe verkoop kunnen spullen soms in overleg achterblijven."],
          ["6. Verkoop en koopovereenkomst", "De koopovereenkomst wordt getekend door alle erfgenamen of door de gevolmachtigde. De notaris controleert de bevoegdheid voordat de woning wordt geleverd."],
          ["7. Levering en verdeling", "Bij de notaris wordt de koopsom ontvangen, wordt een eventuele hypotheek afgelost en wordt de rest verdeeld volgens de nalatenschap."],
        ] },
      ],
    },
    {
      title: "Erfbelasting en de waarde van de woning",
      blocks: [
        { type: "text", text: "Voor de erfbelasting telt de waarde van de woning op de datum van overlijden; daarvoor wordt in de regel de WOZ-waarde gebruikt. De aangifte erfbelasting moet doorgaans binnen acht maanden na het overlijden worden gedaan. Een verkoop later tegen een andere prijs verandert die aangifte niet automatisch." },
        { type: "callout", title: "Laat u adviseren", text: "Regels rond erfbelasting, vrijstellingen en termijnen kunnen per situatie verschillen. De notaris of een belastingadviseur kan precies zeggen wat in uw geval geldt." },
      ],
    },
    {
      title: "Verkopen via een makelaar of direct?",
      blocks: [
        { type: "text", text: "Bij een erfhuis spelen vaak andere vragen dan bij een gewone verkoop. Wie heeft tijd om bezichtigingen te regelen? Wie draait op voor de lasten zolang de woning te koop staat? Zijn alle erfgenamen het eens over opknappen of niet?" },
        { type: "list", items: [
          "Via een makelaar haalt u meestal de hoogste prijs, maar het traject duurt langer en vraagt opknappen, leeghalen en afstemming tussen erfgenamen.",
          "Bij directe verkoop ligt het bedrag lager, maar is er sneller duidelijkheid en hoeft de woning vaak niet leeg of opgeknapt te worden.",
          "Een schriftelijk voorstel met een netto-vergelijking maakt het makkelijker om samen een besluit te nemen.",
        ] },
      ],
    },
  ],
  disclaimer: "Dit artikel geeft algemene informatie en is geen juridisch of fiscaal advies. Raadpleeg voor uw situatie de notaris of een adviseur.",
  relatedPages: [
    ["/huis-verkopen-bij-erfenis", "Huis verkopen bij erfenis", "Hoe een directe verkoop bij een erfenis in de praktijk gaat."],
  ],
  cta: { title: "Een erfhuis, en nog geen besluit?", text: "Vraag vrijblijvend een schriftelijk voorstel aan dat u met de andere erfgenamen kunt bespreken.", href: "/huis-verkopen-bij-erfenis#aanvraag" },
};

export default function Page() {
  return <KnowledgeArticle article={article} />;
}
