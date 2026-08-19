import { NextResponse } from "next/server";
import { createLead } from "../../lib/leads";
import { enforceRateLimit, isLikelyBotSubmission, publicError } from "../../lib/requestSecurity";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const rate = await enforceRateLimit(request, {
      scope: "public-lead",
      limit: 6,
      windowSeconds: 10 * 60,
    });

    if (!rate.allowed) {
      return NextResponse.json(
        { ok: false, error: "Te veel aanvragen in korte tijd. Probeer het later opnieuw." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot: echte bezoekers vullen deze verborgen velden nooit in.
    if (isLikelyBotSubmission(body)) {
      return NextResponse.json({ ok: true });
    }

    const result = await createLead(body);

    // Stuur geen CRM- of mailgegevens terug naar de publieke browser.
    return NextResponse.json({ ok: true, reference: result.lead?.id || null });
  } catch (error) {
    console.error("Publieke leadaanvraag mislukt:", error);
    const status = Number(error?.status) || 500;
    return NextResponse.json(
      { ok: false, error: publicError(error, "Aanvraag opslaan mislukt.") },
      { status: status >= 400 && status < 500 ? status : 500 }
    );
  }
}
