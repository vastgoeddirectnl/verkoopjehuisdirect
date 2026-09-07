import { NextResponse } from "next/server";
import { enforceRateLimit } from "../../lib/requestSecurity";

export const runtime = "nodejs";

function normalizePostcode(value) {
  return String(value || "").toUpperCase().replace(/\s+/g, "").slice(0, 6);
}

function cleanHouseNumber(value) {
  return String(value || "").trim().slice(0, 20);
}

export async function GET(request) {
  try {
    const limited = await enforceRateLimit(request, {
      scope: "address-lookup",
      limit: 40,
      windowSeconds: 600,
    });
    if (!limited.allowed) {
      return NextResponse.json({ error: "Te veel adrescontroles." }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const postcode = normalizePostcode(searchParams.get("postcode"));
    const huisnummer = cleanHouseNumber(searchParams.get("huisnummer"));

    if (!/^\d{4}[A-Z]{2}$/.test(postcode) || !huisnummer) {
      return NextResponse.json({ error: "Vul een geldige postcode en huisnummer in." }, { status: 400 });
    }

    const url = new URL("https://api.pdok.nl/bzk/locatieserver/search/v3_1/free");
    url.searchParams.set("q", `${postcode} ${huisnummer}`);
    url.searchParams.set("fq", "type:adres");
    url.searchParams.set("rows", "1");

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    const data = await response.json().catch(() => ({}));
    const doc = data?.response?.docs?.[0];
    if (!doc) return NextResponse.json({ found: false });

    const house = [
      doc.huisnummer,
      doc.huisletter,
      doc.huisnummertoevoeging,
    ].filter(Boolean).join("");

    return NextResponse.json({
      found: true,
      address: {
        street: doc.straatnaam || "",
        houseNumber: house || huisnummer,
        postcode: doc.postcode || postcode,
        city: doc.woonplaatsnaam || "",
        display: doc.weergavenaam || [doc.straatnaam, house, doc.postcode, doc.woonplaatsnaam].filter(Boolean).join(" "),
      },
    });
  } catch (error) {
    console.warn("Adrescontrole overgeslagen:", error.message);
    return NextResponse.json({ found: false });
  }
}
