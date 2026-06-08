"use client";

export default function PrintButton() {
  return <button onClick={() => window.print()}>Opslaan als PDF / printen</button>;
}
