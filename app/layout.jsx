import "./globals.css";
import GoogleAdsTag from "./components/GoogleAdsTag";
import GoogleAdsClickTracker from "./components/GoogleAdsClickTracker";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.vastgoeddirectnederland.nl").replace(/\/$/, "");

export const metadata = {
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>
        <GoogleAdsTag />
        <GoogleAdsClickTracker />
        {children}
      </body>
    </html>
  );
}
