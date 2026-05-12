import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Opknapwoning verkopen? Zonder renovatie of makelaar",
  description:
    "Wilt u een opknapwoning verkopen zonder eerst te renoveren? Vraag vrijblijvend een verkoopvoorstel aan bij Vastgoed Direct Nederland.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/opknapwoning-verkopen",
  },
  openGraph: {
    title: "Opknapwoning verkopen? Zonder renovatie of makelaar",
    description:
      "Ook woningen met achterstallig onderhoud, schade of renovatiebehoefte kunnen worden aangemeld.",
    url: "https://www.verkoopjehuisdirect.nl/opknapwoning-verkopen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  slug: "/opknapwoning-verkopen",
  breadcrumb: "Opknapwoning verkopen",
  eyebrow: "Opknapwoning verkopen",
  h1: "Opknapwoning verkopen zonder renovatie of verkoopstress",
  lead:
    "Wilt u een opknapwoning verkopen zonder eerst te verbouwen, herstellen of verkoopklaar te maken? Vastgoed Direct Nederland helpt met een directe verkoopoplossing en duidelijke voorwaarden.",
  shortAnswer:
    "U hoeft een opknapwoning niet eerst te renoveren voordat u een verkoopvoorstel aanvraagt. Ook woningen met schade, achterstallig onderhoud of renovatiebehoefte kunnen worden aangemeld.",
  benefits: [
    "Geen renovatie vooraf nodig",
    "Geen makelaarskosten",
    "Geen open huis nodig",
    "Ook bij schade of onderhoud",
    "Oplevering in overleg",
    "Vrijblijvend voorstel",
  ],
  sections: [
    {
      title: "Waarom een opknapwoning direct verkopen?",
      paragraphs: [
        "Een opknapwoning verkoopklaar maken kan veel tijd en geld kosten. Denk aan schilderwerk, opruimen, herstel van schade, verouderde installaties of andere verbeteringen voordat een makelaar de woning goed kan presenteren.",
        "Als u die kosten of inspanning niet wilt maken, kan een directe verkoopoplossing interessant zijn. U krijgt duidelijkheid zonder eerst te renoveren of verkoopklaar te maken.",
      ],
    },
    {
      title: "Welke woningen kunnen worden aangemeld?",
      bullets: [
        "Woningen met achterstallig onderhoud",
        "Woningen met schade",
        "Verouderde woningen",
        "Leegstaande woningen",
        "Erfeniswoningen die opgeknapt moeten worden",
        "Woningen met verouderde installaties",
        "Woningen die lastig verkoopklaar te maken zijn",
      ],
    },
    {
      title: "Oplevering in huidige staat",
      paragraphs: [
        "In veel situaties kan oplevering in huidige staat bespreekbaar zijn. Dat betekent dat u niet altijd hoeft te verbouwen, leeg te halen of perfect te presenteren voordat u duidelijkheid krijgt over de verkoopmogelijkheden.",
        "De exacte afspraken hangen af van de woning, de staat, uw wensen en wat juridisch en notarieel goed kan worden vastgelegd.",
      ],
    },
    {
      title: "Hoe werkt het?",
      steps: [
        "U meldt de opknapwoning vrijblijvend aan.",
        "Wij bespreken de staat van de woning en uw gewenste snelheid.",
        "U ontvangt een verkoopvoorstel met duidelijke voorwaarden.",
        "Bij akkoord wordt de overdracht via de notaris geregeld.",
      ],
    },
    {
      title: "Kosten, notariskosten en aanbetaling",
      paragraphs: [
        "U betaalt geen makelaarskosten voor een aanvraag via Vastgoed Direct Nederland. Bij een passende verkoop nemen wij de standaard notariskosten voor de levering voor onze rekening.",
        "In sommige situaties is een aanbetaling of voorschot bespreekbaar, mits dit juridisch en notarieel goed kan worden vastgelegd.",
      ],
    },
  ],
  comparisonRows: [
    ["Renovatie vooraf", "Vaak gewenst", "Niet noodzakelijk vooraf"],
    ["Makelaarskosten", "Vaak courtage of vast tarief", "Geen makelaarskosten"],
    ["Bezichtigingen", "Vaak meerdere", "Niet standaard nodig"],
    ["Verkoopstyling", "Vaak gewenst", "Niet noodzakelijk"],
    ["Oplevering", "Vaak verkoopklaar", "In huidige staat bespreekbaar"],
    ["Notariële afwikkeling", "Afhankelijk van afspraken", "Bij akkoord via de notaris"],
  ],
  faqs: [
    {
      question: "Kan ik een opknapwoning verkopen zonder renovatie?",
      answer:
        "Ja, u hoeft uw woning niet eerst te renoveren. Ook woningen met achterstallig onderhoud, schade of renovatiebehoefte kunnen worden aangemeld.",
    },
    {
      question: "Moet ik eerst herstelwerk uitvoeren?",
      answer:
        "Nee, dat is niet altijd nodig. Wij bespreken de staat van de woning en kijken naar een passende verkoopoplossing.",
    },
    {
      question: "Kan ik verkopen zonder makelaar?",
      answer:
        "Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel verkooptraject met een makelaar.",
    },
    {
      question: "Is oplevering in huidige staat mogelijk?",
      answer:
        "In veel situaties is oplevering in huidige staat bespreekbaar, afhankelijk van de woning en de gemaakte afspraken.",
    },
    {
      question: "Kan ik een opknapwoning verkopen bij erfenis of leegstand?",
      answer:
        "Ja, ook bij erfenis, leegstand of persoonlijke omstandigheden kunt u vrijblijvend bespreken wat mogelijk is.",
    },
    {
      question: "Is de aanvraag vrijblijvend?",
      answer:
        "Ja, uw aanvraag is gratis en vrijblijvend. U zit nergens aan vast.",
    },
  ],
  ctaTitle: "Wilt u uw opknapwoning verkopen?",
  ctaText:
    "Vraag vrijblijvend een verkoopvoorstel aan zonder eerst te renoveren of verkoopklaar te maken.",
};

export default function OpknapwoningVerkopen() {
  return <SeoLandingPage page={page} />;
}
