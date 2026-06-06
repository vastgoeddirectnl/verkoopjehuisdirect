import "./globals.css";

export const metadata = {
  title: "Vastgoed Direct Nederland",
  description:
    "Uw woning snel verkopen? Ontvang een vrijblijvend verkoopvoorstel zonder makelaarskosten of open huis.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
