import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../lib/adminAuth";
import { queryOne } from "../../../lib/neonDb";

export const runtime = "nodejs";

function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function normalizePhone(value) {
  return clean(value, 40).replace(/[^\d+]/g, "");
}

function normalizePostcode(value) {
  return clean(value, 20).toUpperCase().replace(/\s+/g, " ");
}

export async function POST(request) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  try {
    const body = await request.json();

    const naam = clean(body.naam, 160);
    const email = clean(body.email, 220).toLowerCase();
    const telefoon = normalizePhone(body.telefoon);
    const postcode = normalizePostcode(body.postcode);
    const huisnummer = clean(body.huisnummer, 40);
    const woningtype = clean(body.woningtype, 120);
    const staat = clean(body.staat, 160);
    const reden = clean(body.reden, 220);
    const notitie = clean(body.notitie, 3000);
    const pagina = clean(body.pagina, 160) || "Telefonische aanvraag";
    const bron = clean(body.bron, 120) || "Telefonisch";
    const status = clean(body.status, 80) || "Nieuw";

    if (!naam && !telefoon && !email) {
      return NextResponse.json(
        { error: "Vul minimaal een naam, telefoonnummer of e-mailadres in." },
        { status: 400 }
      );
    }

    const lead = await queryOne(
      `insert into leads (
        naam, email, telefoon, postcode, huisnummer, woningtype, staat, reden,
        pagina, bron, status, notitie, last_contact_at
      )
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,now())
      returning *`,
      [
        naam || null,
        email || null,
        telefoon || null,
        postcode || null,
        huisnummer || null,
        woningtype || null,
        staat || null,
        reden || null,
        pagina,
        bron,
        status,
        notitie || null,
      ]
    );

    return NextResponse.json({ lead });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Lead aanmaken mislukt." }, { status: 500 });
  }
}
