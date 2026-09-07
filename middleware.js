import { NextResponse } from "next/server";

/**
 * Centrale poort voor de adminomgeving.
 *
 * Let op: middleware draait op de edge runtime, waar `node:crypto` niet
 * beschikbaar is. Daarom wordt hier alleen gecontroleerd of er een
 * sessiecookie aanwezig is. De echte HMAC-verificatie blijft staan waar hij
 * hoort: in `isAdminAuthenticated()` op elke adminpagina en in elke
 * /api/admin-route. Dit is dus een extra laag, geen vervanging.
 */

const COOKIE = "vdn_admin_session";

// Routes die zonder sessie bereikbaar moeten blijven.
const OPEN_PATHS = new Set(["/admin", "/api/admin/login", "/api/admin/logout"]);

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (OPEN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  if (request.cookies.get(COOKIE)?.value) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const loginUrl = new URL("/admin", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // `:path+` eist minstens één segment, zodat /admin (de loginpagina) buiten
  // de matcher valt en er geen redirect-lus kan ontstaan.
  matcher: ["/admin/:path+", "/api/admin/:path*"],
};
