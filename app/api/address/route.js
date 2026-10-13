import { NextResponse } from "next/server";
import { enforceRateLimit } from "../../lib/requestSecurity";
import { lookupAddress } from "../../lib/address.js";

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

    // De opzoeking zelf staat in app/lib/address.js, zodat de server bij elke
    // aanvraag dezelfde controle doet.
    const address = await lookupAddress(postcode, huisnummer, { timeoutMs: 5000 });
    if (!address) return NextResponse.json({ found: false });

    return NextResponse.json({
      found: true,
      address: {
        street: address.street,
        houseNumber: address.houseNumber,
        postcode: address.postcode,
        city: address.city,
        display: address.display,
      },
    });
  } catch (error) {
    console.warn("Adrescontrole overgeslagen:", error.message);
    return NextResponse.json({ found: false });
  }
}
