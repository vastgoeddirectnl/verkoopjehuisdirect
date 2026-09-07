import { NextResponse, after } from "next/server";
import { createLead, sendLeadMails } from "../../lib/leads";
import { enforceRateLimit, isLikelyBotSubmission, publicError } from "../../lib/requestSecurity";
import { reportError } from "../../lib/reportError.js";

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

    const result = await createLead(body, { sendMail: false });

    // Duplicaten (dubbelklik/retry) kregen ook vóór deze wijziging nooit mail.
    if (!result.mail?.duplicate) {
      after(async () => {
        await sendLeadMails(result.lead);
      });
    }

    // Stuur geen CRM- of mailgegevens terug naar de publieke browser.
    return NextResponse.json({ ok: true, reference: result.lead?.id || null });
  } catch (error) {
    const status = Number(error?.status) || 500;

    // Een 4xx is een invoerfout van de bezoeker, geen storing. Alleen een 5xx
    // betekent dat er een aanvraag verloren is gegaan; daar wil je van weten.
    // Via after(), zodat de bezoeker niet op een storingsmail hoeft te wachten.
    if (status >= 500) {
      after(() => reportError({
        scope: "api/leads",
        error,
        severity: "critical",
        context: { melding: "aanvraag niet opgeslagen" },
      }));
    } else {
      console.warn("Leadaanvraag afgewezen:", error.message);
    }

    return NextResponse.json(
      { ok: false, error: publicError(error, "Aanvraag opslaan mislukt.") },
      { status: status >= 400 && status < 500 ? status : 500 }
    );
  }
}
