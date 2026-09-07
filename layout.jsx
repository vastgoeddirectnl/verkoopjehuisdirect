import "./globals.css";
import CookieConsent from "./components/CookieConsent";
import GoogleAdsTag from "./components/GoogleAdsTag";
import GoogleAdsClickTracker from "./components/GoogleAdsClickTracker";
import MetaPixelTag from "./components/MetaPixelTag";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.vastgoeddirectnederland.nl").replace(/\/$/, "");

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vastgoed Direct Nederland",
    template: "%s | Vastgoed Direct Nederland",
  },
  description:
    "Uw woning verkopen zonder opknappen, bezichtigingen of verkoopdruk? Ontvang eerst een persoonlijk en vrijblijvend verkoopvoorstel.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Vastgoed Direct Nederland",
    description:
      "Uw woning verkopen zonder opknappen, bezichtigingen of verkoopdruk? Ontvang eerst een persoonlijk en vrijblijvend verkoopvoorstel.",
    url: siteUrl,
    siteName: "Vastgoed Direct Nederland",
    locale: "nl_NL",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Vastgoed Direct Nederland – uw woning verkopen zonder gedoe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vastgoed Direct Nederland",
    description: "Een persoonlijk en vrijblijvend verkoopvoorstel voor uw woning.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>
        <GoogleAdsTag />
        <MetaPixelTag />
        <GoogleAdsClickTracker />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
