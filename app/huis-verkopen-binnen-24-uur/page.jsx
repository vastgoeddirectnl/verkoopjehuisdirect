import SeoLandingPage from "../components/SeoLandingPage";
  shortAnswer:
    "Binnen 24 uur verkopen is niet altijd realistisch als definitieve overdracht, maar snel duidelijkheid krijgen over uw mogelijkheden kan vaak wel. U vraagt gratis en vrijblijvend een verkoopvoorstel aan.",
  benefits: [
    "Snel reactie",
    "Vrijblijvend voorstel",
    "Geen makelaarskosten",
    "Geen open huis nodig",
    "Ook bij onderhoud of schade",
    "Notariële afwikkeling",
  ],
  sections: [
    {
      title: "Wat betekent huis verkopen binnen 24 uur?",
      paragraphs: [
        "Veel verkopers zoeken naar snelheid, maar een woning juridisch overdragen binnen 24 uur is niet altijd haalbaar. Documenten, eigendomssituatie en notariële planning spelen daarbij een belangrijke rol.",
        "Wat wél vaak mogelijk is: snel contact, snel duidelijkheid en een eerste inschatting van de verkoopmogelijkheden.",
      ],
    },
    {
      title: "Wanneer is snelle duidelijkheid belangrijk?",
      bullets: [
        "Bij leegstand of dubbele lasten",
        "Bij een erfeniswoning",
        "Bij scheiding of financiële druk",
        "Bij een woning met achterstallig onderhoud",
        "Bij verhuur of lastige verkoopomstandigheden",
        "Als u geen traditioneel verkooptraject wilt",
      ],
    },
    {
      title: "Hoe werkt het?",
      steps: [
        "U vult uw woninggegevens in.",
        "Wij nemen contact met u op om uw situatie te bespreken.",
        "U ontvangt duidelijkheid over een mogelijke verkoopoplossing.",
        "Bij akkoord wordt de overdracht via de notaris geregeld.",
      ],
    },
    {
      title: "Geen makelaar of open huis nodig",
      paragraphs: [
        "U hoeft geen makelaar in te schakelen, geen open huis te organiseren en uw woning niet altijd eerst verkoopklaar te maken. Dat kan veel tijd, kosten en stress besparen.",
      ],
    },
  ],
  comparisonRows: [
    ["Snelheid", "Vaak afhankelijk van bezichtigingen en koper", "Snelle duidelijkheid mogelijk"],
    ["Makelaarskosten", "Vaak courtage of vast tarief", "Geen makelaarskosten"],
    ["Bezichtigingen", "Vaak meerdere", "Niet standaard nodig"],
    ["Woning voorbereiden", "Vaak gewenst", "Niet noodzakelijk vooraf"],
    ["Opleverdatum", "Afhankelijk van koper", "In overleg bespreekbaar"],
  ],
  faqs: [
    {
      question: "Kan ik mijn huis echt binnen 24 uur verkopen?",
      answer:
        "Een definitieve overdracht binnen 24 uur is meestal niet realistisch, omdat notariële en juridische stappen nodig zijn. Wel kunnen wij vaak snel duidelijkheid geven over de mogelijkheden.",
    },
    {
      question: "Kan ik binnen 24 uur reactie krijgen?",
      answer:
        "Wij proberen snel te reageren op aanvragen. De exacte reactietijd kan afhangen van het moment van aanvraag en de beschikbare informatie.",
    },
    {
      question: "Kan dit zonder makelaar?",
      answer:
        "Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel verkooptraject met een makelaar.",
    },
    {
      question: "Kan ik ook een woning met schade aanmelden?",
      answer:
        "Ja, ook woningen met schade, achterstallig onderhoud of renovatiebehoefte kunnen worden aangemeld.",
    },
    {
      question: "Is de aanvraag vrijblijvend?",
      answer:
        "Ja, uw aanvraag is gratis en vrijblijvend. U zit nergens aan vast.",
    },
  ],
  ctaTitle: "Wilt u snel duidelijkheid over uw woning?",
  ctaText:
    "Vraag vrijblijvend een verkoopvoorstel aan en ontdek wat mogelijk is zonder makelaar of verkoopstress.",
};

export default function HuisVerkopenBinnen24Uur() {
  return <SeoLandingPage page={page} />;
}
