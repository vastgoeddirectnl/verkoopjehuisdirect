import HomeClient from "./components/HomeClient";

export const metadata = {
  title: "Woning verkopen zonder opknappen of verkoopdruk",
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
