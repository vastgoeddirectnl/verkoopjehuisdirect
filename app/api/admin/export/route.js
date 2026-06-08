import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../lib/adminAuth";
import { listLeads } from "../../../lib/leads";

export const runtime = "nodejs";

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const leads = await listLeads({
    status: searchParams.get("status"),
    search: searchParams.get("search"),
    limit: 500,
  });

  const headers = [
    "Datum",
    "Naam",
    "E-mail",
    "Telefoon",
    "Postcode",
    "Huisnummer",
    "Woningtype",
    "Staat",
    "Reden",
    "Status",
    "Pagina",
    "Bron",
    "Notitie",
    "Laatste contact",
  ];

  const rows = leads.map((lead) => [
    lead.created_at,
    lead.naam,
    lead.email,
    lead.telefoon,
    lead.postcode,
    lead.huisnummer,
    lead.woningtype,
    lead.staat,
    lead.reden,
    lead.status,
    lead.pagina,
    lead.bron,
    lead.notitie,
    lead.last_contact_at,
  ]);

  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  return new NextResponse(`\ufeff${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="verkoopjehuisdirect-leads.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
