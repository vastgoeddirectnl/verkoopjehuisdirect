import HomeClient from "./components/HomeClient";

export const metadata = {
  // title.template uit app/layout.jsx geldt alleen voor ONDERLIGGENDE
  // segmenten. app/page.jsx zit in hetzelfde segment als die layout, dus de
  // merknaam werd hier niet toegevoegd — uitgerekend op de belangrijkste
  // pagina. Met `absolute` zetten we de volledige titel zelf.
  title: { absolute: "Woning verkopen zonder opknappen | Vastgoed Direct Nederland" },
  description:
    "Uw woning verkopen zonder opknappen, bezichtigingen of verkoopdruk? Ontvang eerst een persoonlijk en vrijblijvend verkoopvoorstel.",
  alternates: {
    canonical: "https://www.vastgoeddirectnederland.nl",
  },
  openGraph: {
    title: "Uw woning verkopen zonder gedoe | Vastgoed Direct Nederland",
    description:
      "Ontvang eerst een persoonlijk voorstel met duidelijkheid over prijs, planning, voorwaarden en oplevering.",
    url: "https://www.vastgoeddirectnederland.nl",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vastgoed Direct Nederland" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uw woning verkopen zonder gedoe | Vastgoed Direct Nederland",
    description:
      "Ontvang eerst een persoonlijk en vrijblijvend verkoopvoorstel.",
    images: ["/og.png"],
  },
};

export default function Page() {
  return <HomeClient />;
}
