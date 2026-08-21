import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../lib/adminAuth";
import { listLeads } from "../../../lib/leads";

export const runtime = "nodejs";

export async function GET(request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  try {
    const leads = await listLeads({
      status: searchParams.get("status"),
      search: searchParams.get("search"),
      limit: 250,
    });
    return NextResponse.json({ leads });
  } catch (error) {
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}
