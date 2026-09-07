import { NextResponse } from "next/server";
import { queryOne } from "../../../../lib/neonDb";
import { isUuid, enforceRateLimit } from "../../../../lib/requestSecurity";
import { markProposalViewed } from "../../../../lib/automation";
import { isExpiredAmsterdam } from "../../../../lib/date";

export const runtime = "nodejs";

const ALLOWED_EVENTS = new Set(["view", "whatsapp", "print", "pdf"]);

function clean(value, max = 200) {
  return String(value || "").trim().slice(0, max);
}

export async function POST(request, { params }) {
  try {
    const limited = await enforceRateLimit(request, {
      scope: "proposal-event",
      limit: 80,
      windowSeconds: 600,
    });
    if (!limited.allowed) {
      return NextResponse.json({ error: "Te veel verzoeken." }, { status: 429 });
    }

    const { token } = await params;
    if (!isUuid(token)) {
      return NextResponse.json({ error: "Ongeldig voorstel." }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const eventType = clean(body.event, 40).toLowerCase();
    if (!ALLOWED_EVENTS.has(eventType)) {
      return NextResponse.json({ error: "Ongeldig event." }, { status: 400 });
    }

    const proposal = await queryOne(
      `select id, lead_id, lead_naam, status, validity_date
       from proposals
       where public_token = $1::uuid`,
      [token]
    );
    if (!proposal) {
      return NextResponse.json({ error: "Voorstel niet gevonden." }, { status: 404 });
    }

    const sessionKey = clean(body.session_key, 120) || null;
    const metadata = {
      page_visible_ms: Math.max(0, Math.min(Number(body.page_visible_ms) || 0, 3600000)),
      viewport: clean(body.viewport, 80) || undefined,
    };

    const inserted = await queryOne(
      `insert into proposal_events (
         proposal_id, lead_id, event_type, session_key, metadata
       ) values ($1,$2,$3,$4,$5::jsonb)
       on conflict do nothing
       returning id, created_at`,
      [
        proposal.id,
        proposal.lead_id || null,
        eventType,
        sessionKey,
        JSON.stringify(metadata),
      ]
    );

    // Alleen een nieuwe, door JavaScript bevestigde view telt als echte view.
    if (eventType === "view" && inserted?.id) {
      const status = String(proposal.status || "").trim().toLowerCase();
      const active = ["verzonden", "bekeken"].includes(status) && !isExpiredAmsterdam(proposal.validity_date);
      if (active) {
        await markProposalViewed(proposal);
      }
    }

    return NextResponse.json({
      ok: true,
      recorded: Boolean(inserted?.id),
    });
  } catch (error) {
    console.error("proposal event failed", error);
    return NextResponse.json({ error: "Event kon niet worden opgeslagen." }, { status: 500 });
  }
}
