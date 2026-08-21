import HomeClient from "./components/HomeClient";

export const metadata = {
  title: "Huis snel verkopen zonder makelaar",
  description:
    "Wilt u uw woning snel verkopen zonder makelaar, open huis of verkoopstress? Vraag vrijblijvend een helder verkoopvoorstel aan.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl",
  },
  openGraph: {
    title: "Huis snel verkopen zonder makelaar | VDN",
    description:
      "Vraag vrijblijvend een helder verkoopvoorstel aan. Geen makelaarskosten, geen open huis nodig en notariële afwikkeling.",
    url: "https://www.vastgoeddirectnederland.nl",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Huis snel verkopen zonder makelaar | VDN",
    description:
      "Vraag vrijblijvend een helder verkoopvoorstel aan. Geen makelaarskosten, geen open huis nodig en notariële afwikkeling.",
  },
};

export default function Page() {
  return <HomeClient />;
}
