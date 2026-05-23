import "./globals.css";

export const metadata = {
  title: {
    default: "Vastgoed Direct Nederland | Huis snel verkopen zonder makelaar",
    template: "%s | Vastgoed Direct Nederland",
  },
  description:
    "Wilt u uw woning snel verkopen zonder makelaar, open huis of verkoopstress? Vraag vrijblijvend een helder verkoopvoorstel aan.",
  keywords: [
    "huis snel verkopen",
    "huis direct verkopen",
    "woning verkopen zonder makelaar",
    "huis verkopen binnen 24 uur",
    "huis verkopen binnen 1 week",
    "direct huis verkopen",
    "woning snel verkopen",
    "opknapwoning verkopen",
    "verhuurde woning verkopen",
    "huis verkopen bij erfenis",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Vastgoed Direct Nederland | Huis snel verkopen zonder makelaar",
    description:
      "Vraag vrijblijvend een helder verkoopvoorstel aan. Geen makelaarskosten, geen open huis nodig en notariële afwikkeling.",
    url: "https://www.verkoopjehuisdirect.nl",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
