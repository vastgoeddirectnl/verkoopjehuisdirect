import SeoLandingPage from "../components/SeoLandingPage";

export const metadata = {
  title: "Huis verkopen in Groningen? Vrijblijvend voorstel",
  description:
    "Wilt u uw huis verkopen in Groningen zonder makelaar of verkoopstress? Vraag vrijblijvend een helder verkoopvoorstel aan.",
  alternates: {
    canonical: "https://www.verkoopjehuisdirect.nl/huis-verkopen-groningen",
  },
  openGraph: {
    title: "Huis verkopen in Groningen? Vrijblijvend voorstel",
    description:
      "Snel duidelijkheid over uw woning in Groningen. Zonder makelaar, zonder open huis en met heldere afspraken.",
    url: "https://www.verkoopjehuisdirect.nl/huis-verkopen-groningen",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

const page = {
  slug: "/huis-verkopen-groningen",
  breadcrumb: "Huis verkopen in Groningen",
  eyebrow: "Huis verkopen Groningen",
  h1: "Huis verkopen in Groningen zonder makelaar of verkoopstress",
  lead:
    "Wilt u uw woning in Groningen snel verkopen en duidelijkheid krijgen zonder traditioneel verkooptraject? Vastgoed Direct Nederland helpt woningeigenaren met een directe verkoopoplossing, heldere afspraken en notariële afwikkeling.",
  shortAnswer:
    "U kunt uw huis in Groningen vrijblijvend aanmelden voor een verkoopvoorstel. Dit kan ook bij leegstand, achterstallig onderhoud, verhuur, erfenis of wanneer u snel duidelijkheid wilt.",
  benefits: [
    "Huis verkopen in Groningen",
    "Geen makelaarskosten",
    "Geen open huis nodig",
    "Ook bij onderhoud",
    "Vrijblijvend voorstel",
    "Notariële afwikkeling",
  ],
  sections: [
    {
      title: "Wanneer is direct verkopen in Groningen interessant?",
      paragraphs: [
        "Een woning verkopen via de traditionele route kan tijd kosten. In sommige situaties wilt u liever snel duidelijkheid, zonder open huis, makelaarskosten of lange onderhandelingen.",
        "Dat kan bijvoorbeeld spelen bij leegstand, achterstallig onderhoud, een erfeniswoning, verhuur, scheiding of financiële druk.",
      ],
    },
    {
      title: "Voor welke woningen in Groningen?",
      bullets: [
        "Rijtjeshuizen en eengezinswoningen",
        "Appartementen",
        "Opknapwoningen",
        "Verhuurde woningen",
        "Erfeniswoningen",
        "Leegstaande woningen",
        "Woningen met achterstallig onderhoud",
        "Woningen waarbij snel duidelijkheid nodig is",
      ],
    },
    {
      title: "Verkopen zonder makelaar in Groningen",
      paragraphs: [
        "U hoeft niet altijd een traditioneel verkooptraject met makelaar te starten. Bij Vastgoed Direct Nederland kunt u rechtstreeks een vrijblijvend verkoopvoorstel aanvragen.",
        "Dat kan prettig zijn wanneer u geen open huis wilt, geen courtage wilt betalen of geen lange periode met bezichtigingen en onzekerheid wilt doorlopen.",
      ],
    },
    {
      title: "Ook bij opknapwoning, erfenis of verhuur",
      paragraphs: [
        "Niet iedere woning is direct verkoopklaar. Ook woningen met onderhoud, schade, leegstand of verhuur kunnen worden aangemeld. We bespreken rustig wat mogelijk is en welke voorwaarden daarbij horen.",
      ],
    },
    {
      title: "Hoe werkt het?",
      steps: [
        "U vult uw woninggegevens in via het formulier.",
        "Wij nemen contact met u op om uw situatie en gewenste snelheid te bespreken.",
        "U ontvangt een vrijblijvend verkoopvoorstel met duidelijke voorwaarden.",
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
    ["Makelaarskosten", "Vaak courtage of vast tarief", "Geen makelaarskosten"],
    ["Bezichtigingen", "Vaak meerdere kijkers", "Niet standaard nodig"],
    ["Onderhoud", "Kan verkoop lastiger maken", "Ook deze woningen kunnen worden aangemeld"],
    ["Snelheid", "Kan weken of maanden duren", "Snelle duidelijkheid mogelijk"],
    ["Opleverdatum", "Afhankelijk van koper", "In overleg bespreekbaar"],
    ["Notariële afwikkeling", "Afhankelijk van afspraken", "Bij akkoord via notaris"],
  ],
  faqs: [
    {
      question: "Kan ik mijn huis in Groningen verkopen zonder makelaar?",
      answer:
        "Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel verkooptraject met een makelaar.",
    },
    {
      question: "Kan ik ook een opknapwoning in Groningen aanmelden?",
      answer:
        "Ja, ook woningen met achterstallig onderhoud, schade, leegstand of renovatiebehoefte kunnen worden aangemeld.",
    },
    {
      question: "Is een snelle overdracht mogelijk?",
      answer:
        "Een snelle overdracht is in overleg mogelijk. De exacte planning hangt af van de woning, afspraken en notariële mogelijkheden.",
    },
    {
      question: "Betaal ik makelaarskosten?",
      answer:
        "Nee, u betaalt geen makelaarskosten voor een vrijblijvende aanvraag via Vastgoed Direct Nederland.",
    },
    {
      question: "Kan ik een verhuurde woning in Groningen verkopen?",
      answer:
        "Een verhuurde woning verkopen is in veel situaties mogelijk, maar vraagt om duidelijke afspraken over de huursituatie. Wij bespreken graag wat mogelijk is.",
    },
    {
      question: "Is de aanvraag vrijblijvend?",
      answer:
        "Ja, uw aanvraag is gratis en vrijblijvend. U zit nergens aan vast.",
    },
  ],
  ctaTitle: "Wilt u uw huis in Groningen verkopen?",
  ctaText:
    "Vraag vrijblijvend een verkoopvoorstel aan en ontvang duidelijkheid over uw mogelijkheden.",
};

export default function HuisVerkopenGroningen() {
  return <SeoLandingPage page={page} />;
}
