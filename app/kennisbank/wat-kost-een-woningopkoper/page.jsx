import KnowledgeArticle from "../../components/KnowledgeArticle";

export const metadata = {
  title: "Wat kost een woningopkoper?",
  description: "Een opkoper rekent meestal geen courtage, maar goedkoper is het niet vanzelf. Zo vergelijkt u een direct bod eerlijk met verkoop via een makelaar.",
  alternates: { canonical: "/kennisbank/wat-kost-een-woningopkoper" },
  openGraph: {
    title: "Wat kost een woningopkoper? | Vastgoed Direct Nederland",
    description: "Waar het verschil tussen directe verkoop en een makelaar echt zit, en hoe u een bod eerlijk vergelijkt.",
    url: "https://www.vastgoeddirectnederland.nl/kennisbank/wat-kost-een-woningopkoper",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "article",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
};

const article = {
  path: "/kennisbank/wat-kost-een-woningopkoper",
  breadcrumb: "Wat kost een woningopkoper?",
  h1: "Wat kost een woningopkoper? Waar het verschil echt zit",
  description: "Een opkoper rekent meestal geen courtage, maar goedkoper is het niet vanzelf. Zo vergelijkt u een direct bod eerlijk.",
  intro:
    "Bij een woningopkoper betaalt u meestal geen makelaarscourtage of verkoopkosten. Toch is directe verkoop niet automatisch de goedkoopste route: de kosten zitten in het bod zelf. In dit artikel leest u waar het verschil zit en hoe u een direct bod eerlijk naast een verkoop via de makelaar legt.",
  published: "2026-10-03",
  updatedLabel: "oktober 2026",
  summary: [
    "Een opkoper rekent in de regel geen courtage; het verschil zit in de hoogte van het bod.",
    "Vergelijk altijd de netto-opbrengst, niet alleen de verkoopprijs.",
    "Let op voorbehouden: een bod dat na een keuring nog omlaag kan, is minder waard dan het lijkt.",
    "Directe verkoop levert meestal minder op dan de hoogste marktprijs, maar kan kosten, tijd en onzekerheid besparen.",
  ],
  sections: [
    {
      title: "Wat betaalt u bij een woningopkoper?",
      blocks: [
        { type: "text", text: "Bij een directe verkoop is de opkoper zelf de koper. Er is dus geen makelaar die voor u een koper zoekt, en daarmee vervallen de courtage en de kosten voor presentatie, fotografie en bezichtigingen. De kosten die bij een woningkoop horen, zoals overdrachtsbelasting en de notariskosten van de leveringsakte, zijn in Nederland meestal voor de koper (kosten koper)." },
        { type: "text", text: "Wat u als verkoper vaak wel blijft betalen, zijn de kosten om uw eigen hypotheek af te lossen en de hypotheekinschrijving bij het Kadaster te laten doorhalen. Soms neemt een opkoper ook die kosten over; dat hoort dan in het voorstel te staan." },
      ],
    },
    {
      title: "Waar zit het verschil dan wel?",
      blocks: [
        { type: "text", text: "In het bod. Een opkoper koopt de woning zoals hij is, neemt het risico van onderhoud, leegstand en doorverkoop, en moet daar zelf een marge op houden. Daarom ligt een direct bod in de regel lager dan de prijs die u op de vrije markt zou kunnen halen met een opgeknapte woning en een lang verkooptraject." },
        { type: "text", text: "Daar staat tegenover dat u bij een reguliere verkoop ook kosten maakt die u niet terugziet in de vraagprijs:" },
        { type: "list", items: [
          "makelaarscourtage, vaak een percentage van de verkoopprijs (met btw erbovenop);",
          "kosten voor presentatie en plaatsing op verkoopsites;",
          "opknappen of verkoopklaar maken voordat de woning de markt op gaat;",
          "dubbele woonlasten zolang de woning te koop staat;",
          "leeghalen of ontruimen vóór de overdracht.",
        ] },
        { type: "callout", title: "Eerlijk vergelijken", text: "De vraag is dus niet welke route geen kosten heeft, maar welke route na aftrek van alle kosten, tijd en risico het beste bij uw situatie past. In het artikel over de netto-opbrengst staat een rekenvoorbeeld." },
      ],
    },
    {
      title: "Zo vergelijkt u een direct bod",
      blocks: [
        { type: "steps", items: [
          ["Vraag het bod schriftelijk", "Met bedrag, geldigheid, overdrachtsdatum en wie welke kosten betaalt. Een mondeling bedrag zegt weinig."],
          ["Kijk naar voorbehouden", "Kan het bod nog omlaag na een bouwkundige keuring of een tweede bezichtiging? Een bod zonder financieringsvoorbehoud en zonder bouwkundig voorbehoud geeft meer zekerheid."],
          ["Reken de netto-opbrengst uit", "Trek bij beide routes alle kosten af: courtage, opknappen, dubbele lasten, ontruiming, aflossing van de hypotheek."],
          ["Weeg tijd en zekerheid", "Hoe lang kunt of wilt u de lasten dragen? Hoe zeker is het dat de woning op de vrije markt de verwachte prijs haalt?"],
          ["Laat de overdracht via de notaris lopen", "De koopsom wordt via de notaris betaald, na de gebruikelijke controles op eigendom, hypotheek en beslagen."],
        ] },
      ],
    },
    {
      title: "Vragen om aan een opkoper te stellen",
      blocks: [
        { type: "list", items: [
          "Is dit bod definitief, of kan het na een keuring of bezichtiging nog veranderen?",
          "Koopt u met of zonder financieringsvoorbehoud?",
          "Welke kosten neemt u over, en welke blijven voor mij?",
          "Kan ik spullen achterlaten, en wat gebeurt daarmee?",
          "Kan de overdrachtsdatum aansluiten op mijn planning, ook als ik er nog even wil blijven wonen?",
          "Gaat de betaling via de notaris?",
        ] },
      ],
    },
  ],
  disclaimer: "Dit artikel geeft algemene informatie. Voor uw eigen situatie, zeker bij een hypotheek, erfenis of scheiding, kunt u het beste uw notaris of adviseur raadplegen.",
  relatedPages: [
    ["/huis-verkopen-aan-opkoper", "Huis verkopen aan een opkoper", "Hoe directe verkoop bij Vastgoed Direct Nederland werkt."],
  ],
  cta: { title: "Benieuwd wat een direct bod in uw situatie betekent?", text: "Vraag een vrijblijvend schriftelijk voorstel aan, met de netto-vergelijking erbij." },
};

export default function Page() {
  return <KnowledgeArticle article={article} />;
}
