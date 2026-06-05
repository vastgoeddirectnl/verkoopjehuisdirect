import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../lib/adminAuth";
import { query } from "../../../lib/neonDb";

export const runtime = "nodejs";

export async function GET(request) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = String(searchParams.get("search") || "").trim().slice(0, 120);

  const where = [];
  const params = [];

  if (status && status !== "Alle") {
    params.push(status);
    where.push(`status = $${params.length}`);
  }

  if (search) {
    params.push(`%${search}%`);
    const i = params.length;
    where.push(
      `(naam ilike $${i} or telefoon ilike $${i} or postcode ilike $${i} or huisnummer ilike $${i} or pagina ilike $${i} or bron ilike $${i})`
    );
  }

  try {
    const sql = `
      select *
      from leads
      ${where.length ? `where ${where.join(" and ")}` : ""}
      order by created_at desc
      limit 250
    `;

    const { rows } = await query(sql, params);

    return NextResponse.json({ leads: rows });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
