import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: "48px 24px", maxWidth: "760px", margin: "0 auto" }}>
      <h1>Pagina niet gevonden</h1>
      <p>
        De pagina die u zoekt bestaat niet of is verplaatst.
      </p>
      <Link href="/">
        Terug naar de homepage
      </Link>
    </main>
  );
}
