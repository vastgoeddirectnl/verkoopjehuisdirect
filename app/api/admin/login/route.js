import { NextResponse } from "next/server";
import {
  createAdminToken,
  adminCookieName,
  hasAdminSessionSecret,
  safeEqualText,
} from "../../../lib/adminAuth";
import { enforceRateLimit } from "../../../lib/requestSecurity";

export async function POST(request) {
  try {
    if (!process.env.ADMIN_PASSWORD || !hasAdminSessionSecret()) {
      console.error("ADMIN_PASSWORD en/of ADMIN_SESSION_SECRET ontbreekt.");
      return NextResponse.json(
        { error: "Adminomgeving is niet volledig geconfigureerd." },
        { status: 503 }
      );
    }

    const rate = await enforceRateLimit(request, {
      scope: "admin-login",
      limit: 8,
      windowSeconds: 15 * 60,
    });

    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Te veel inlogpogingen. Probeer het later opnieuw." },
        { status: 429 }
      );
    }

    const { password } = await request.json();
    if (!safeEqualText(password, process.env.ADMIN_PASSWORD)) {
      return NextResponse.json({ error: "Onjuist wachtwoord." }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: adminCookieName(),
      value: createAdminToken(),
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return res;
  } catch (error) {
    console.error("Admin-login mislukt:", error);
    return NextResponse.json({ error: "Inloggen mislukt." }, { status: 500 });
  }
}
