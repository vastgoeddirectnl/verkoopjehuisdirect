import KnowledgeArticle from "../../components/KnowledgeArticle";

export const metadata = {
  title: "Netto-opbrengst berekenen",
  description: "Rekenvoorbeeld: wat houdt u netto over bij verkoop via een makelaar en bij directe verkoop? Met alle kosten die vaak worden vergeten.",
  alternates: { canonical: "/kennisbank/netto-opbrengst-berekenen" },
  openGraph: {
    title: "Netto-opbrengst berekenen | Vastgoed Direct Nederland",
    description: "Een rekenvoorbeeld: wat houdt u netto over bij verkoop via een makelaar en bij directe verkoop?",
    url: "https://www.vastgoeddirectnederland.nl/kennisbank/netto-opbrengst-berekenen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "article",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

// Voorbeeldbedragen. Courtage: 1,5% van € 285.000 = € 4.275 excl. btw,
// € 5.173 incl. 21% btw. Totaal regulier: 5.173 + 1.000 + 15.000 + 3.600 + 400
// = 25.173 → netto € 259.827. Direct: 250.000 - 900 - 400 = € 248.700.
const article = {
  path: "/kennisbank/netto-opbrengst-berekenen",
  breadcrumb: "Netto-opbrengst berekenen",
  h1: "Netto-opbrengst berekenen: makelaar of directe verkoop?",
  description: "Rekenvoorbeeld: wat houdt u netto over bij verkoop via een makelaar en bij directe verkoop?",
  intro:
    "De verkoopprijs is niet wat u overhoudt. Tussen de prijs op de koopovereenkomst en het bedrag op uw rekening zitten kosten die bij de ene route wel en bij de andere niet voorkomen. Met dit rekenvoorbeeld legt u beide routes eerlijk naast elkaar.",
  published: "2026-10-03",
  updatedLabel: "oktober 2026",
  summary: [
    "Netto-opbrengst = verkoopprijs min alle kosten die u als verkoper maakt.",
    "Bij een reguliere verkoop horen daar courtage, presentatie, opknappen en dubbele lasten bij.",
    "In het voorbeeld levert de reguliere route ongeveer € 11.000 meer op, maar pas na maanden en met meer onzekerheid.",
    "Welke route beter is, hangt af van de staat van de woning, uw planning en hoe zeker u wilt zijn.",
  ],
  sections: [
    {
      title: "De formule",
      blocks: [
        { type: "text", text: "Netto-opbrengst = verkoopprijs − courtage en verkoopkosten − kosten om verkoopklaar te maken − dubbele lasten tijdens de verkoop − kosten bij de notaris voor de verkoper (zoals het doorhalen van de hypotheekinschrijving)." },
        { type: "text", text: "Het restant van uw hypotheek lost u bij beide routes af; dat bedrag is gelijk en laten we daarom buiten de vergelijking." },
      ],
    },
    {
      title: "Rekenvoorbeeld",
      blocks: [
        { type: "text", text: "Een tussenwoning met achterstallig onderhoud. Na opknappen zou die op de vrije markt rond € 285.000 kunnen opbrengen. Een directe koper biedt € 250.000 in de huidige staat." },
        {
          type: "table",
          head: ["Post", "Via makelaar", "Directe verkoop"],
          rows: [
            { cells: ["Verkoopprijs", "€ 285.000", "€ 250.000"] },
            { cells: ["Makelaarscourtage (1,5% + btw)", "− € 5.173", "€ 0"] },
            { cells: ["Presentatie, foto's, verkoopsites", "− € 1.000", "€ 0"] },
            { cells: ["Opknappen en verkoopklaar maken", "− € 15.000", "€ 0"] },
            { cells: ["Dubbele lasten (4 maanden vs. 1 maand)", "− € 3.600", "− € 900"] },
            { cells: ["Doorhalen hypotheekinschrijving", "− € 400", "− € 400"] },
            { cells: ["Netto-opbrengst", "€ 259.827", "€ 248.700"], total: true },
          ],
          note: "Alle bedragen zijn voorbeeldbedragen. Courtage, opknapkosten en de verkooptijd verschillen per woning en per regio.",
        },
      ],
    },
    {
      title: "Wat het rekenvoorbeeld niet laat zien",
      blocks: [
        { type: "text", text: "In dit voorbeeld houdt u via de makelaar ruim € 11.000 meer over. Dat is het eerlijke antwoord, en voor veel woningen is een reguliere verkoop daarom de beste keuze. Het voorbeeld rekent wel met een aantal aannames die in de praktijk anders kunnen uitvallen:" },
        { type: "list", items: [
          "dat de woning na het opknappen ook echt de verwachte prijs haalt;",
          "dat het opknappen niet duurder uitvalt of langer duurt;",
          "dat de koper niet afhaakt op een financierings- of bouwkundig voorbehoud;",
          "dat u de tijd, het geld en de energie heeft om het traject te doorlopen.",
        ] },
        { type: "callout", title: "Wanneer directe verkoop logisch is", text: "Als opknappen niet haalbaar is, de lasten doorlopen, erfgenamen snel duidelijkheid willen of zekerheid zwaarder weegt dan het laatste bedrag. Dan kan een lager bedrag met minder kosten, minder tijd en zonder voorbehouden de betere uitkomst zijn." },
      ],
    },
    {
      title: "Zelf rekenen",
      blocks: [
        { type: "steps", items: [
          ["Schat de marktprijs", "Na opknappen én in de huidige staat. Een makelaar of recente verkopen in de buurt geven houvast."],
          ["Vraag de courtage op", "Als percentage of vast bedrag, en reken de btw mee."],
          ["Begroot opknappen en leeghalen", "Vraag offertes op of reken met een ruime marge."],
          ["Tel de maanden", "Hoe lang staat de woning naar verwachting te koop, en wat kosten die maanden?"],
          ["Vergelijk netto", "Zet beide routes naast elkaar, zoals in de tabel hierboven."],
        ] },
      ],
    },
  ],
  disclaimer: "Dit artikel geeft algemene informatie. Uw notaris of adviseur kan de kosten voor uw situatie precies berekenen.",
  relatedPages: [
    ["/woning-verkopen-zonder-makelaar", "Woning verkopen zonder makelaar", "Hoe een verkoop zonder makelaarstraject verloopt."],
  ],
  cta: { title: "Wilt u deze vergelijking voor uw eigen woning?", text: "In elk voorstel staat de netto-vergelijking met uw eigen cijfers. Vrijblijvend, en u beslist zelf." },
};

export default function Page() {
  return <KnowledgeArticle article={article} />;
}
