"use client";

// Gedeeld door de publieke voorstelpagina (met `token`, voor eventtracking)
// en de admin-printpagina (zonder `token`, alleen window.print()).
export default function PrintButton({ token }) {
  async function handlePrint() {
    if (token) {
      fetch(`/api/proposal/${token}/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({ event: "print" }),
      }).catch(() => {});
    }
    window.print();
  }

  return <button type="button" onClick={handlePrint}>Print / opslaan als PDF</button>;
}
