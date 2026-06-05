import { NextResponse } from "next/server";
import { createLead } from "../../lib/leads";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await createLead(body);
    return NextResponse.json({ ok: true, lead: result.lead, mail: result.mail });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message || "Aanvraag opslaan mislukt." },
      { status: error.status || 500 }
    );
  }
}
