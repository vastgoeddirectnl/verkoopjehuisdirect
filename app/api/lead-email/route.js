import { NextResponse } from "next/server";
import { sendLeadNotification } from "../../lib/mail";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const mail = await sendLeadNotification(body);
    return NextResponse.json({ ok: true, mail });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message || "E-mailmelding verzenden mislukt." },
      { status: 500 }
    );
  }
}
