import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://www.verkoopjehuisdirect.nl"),
  title: {
    default: "Vastgoed Direct Nederland",
    template: "%s | Vastgoed Direct Nederland",
  },
  description:
    "Uw woning snel verkopen? Ontvang een vrijblijvend verkoopvoorstel zonder makelaarskosten of open huis.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Vastgoed Direct Nederland",
    description:
      "Uw woning snel verkopen? Ontvang een vrijblijvend verkoopvoorstel zonder makelaarskosten of open huis.",
    url: "https://www.verkoopjehuisdirect.nl",
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
