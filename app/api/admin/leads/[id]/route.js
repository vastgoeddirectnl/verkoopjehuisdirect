import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/adminAuth";
import { queryOne } from "../../../../lib/neonDb";

export const runtime = "nodejs";

export async function PATCH(request, context) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();

  const allowedFields = ["status", "notitie", "last_contact_at"];
  const updates = [];
  const params = [];

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      params.push(body[field] || null);
      updates.push(`${field} = $${params.length}`);
    }
  }

  if (!updates.length) {
    return NextResponse.json(
      { error: "Geen wijzigingen ontvangen." },
      { status: 400 }
    );
  }

  params.push(id);

  try {
    const lead = await queryOne(
      `update leads set ${updates.join(", ")}, updated_at = now() where id = $${params.length} returning *`,
      params
    );

    if (!lead) {
      return NextResponse.json({ error: "Lead niet gevonden." }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
