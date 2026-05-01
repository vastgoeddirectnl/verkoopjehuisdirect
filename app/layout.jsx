export const metadata = {
  title: "Huis snel verkopen? Binnen 24 uur bod | Vastgoed Direct Nederland",
  description:
    "Verkoop uw huis snel en zonder makelaar. Ontvang binnen 24 uur een vrijblijvend bod. Geen kosten, directe verkoop en ook woningen in slechte staat.",
  keywords: [
    "huis snel verkopen",
    "woning verkopen zonder makelaar",
    "huis verkopen binnen 24 uur",
    "direct huis verkopen",
    "woning snel verkopen",
    "huis verkopen zonder kosten",
    "opknapwoning verkopen",
    "verhuurde woning verkopen",
  ],
  openGraph: {
    title: "Huis snel verkopen? Binnen 24 uur bod",
    description:
      "Verkoop uw huis snel, direct en zonder makelaar via Vastgoed Direct Nederland.",
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
