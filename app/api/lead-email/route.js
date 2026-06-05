import { NextResponse } from "next/server";
import { sendLeadEmails } from "../../lib/mail";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const mail = await sendLeadEmails(body);
    return NextResponse.json({ success: true, mail });
  } catch (error) {
    console.error("Mail error:", error);
    return NextResponse.json({ success: false, error: "Mail failed" }, { status: 500 });
  }
}
