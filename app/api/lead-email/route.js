import { NextResponse } from "next/server";
import { sendLeadNotification } from "../../lib/mail";
import { isAdminAuthenticated } from "../../lib/adminAuth";

export const runtime = "nodejs";

export async function POST(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Niet geautoriseerd." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const mail = await sendLeadNotification(body);
    return NextResponse.json({ ok: true, mail });
  } catch (error) {
    console.error("Interne e-mailmelding verzenden mislukt:", error);
    return NextResponse.json(
      { ok: false, error: "E-mailmelding verzenden mislukt." },
      { status: 500 }
    );
  }
}
