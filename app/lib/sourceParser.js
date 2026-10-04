// Herkomst van een aanvraag: het ruwe `bron`- en `pagina`-veld leesbaar maken.
//
// `bron` is door de jaren heen in verschillende vormen opgeslagen: de huidige
// "utm_source=… | gclid=… | referrer=…", oudere kale referrer-URL's, en
// handmatige invoer uit /admin/nieuwe-lead ("Telefonisch", "Mail", …). Het
// ruwe veld blijft ongewijzigd in de database staan; hier wordt het vertaald
// naar één vast kanaal, zodat de rapportage per kanaal telt in plaats van per
// unieke klik-ID.

export const LEAD_CHANNELS = {
  googleAds: "Google Ads",
  googleOrganic: "Google (organisch)",
  googleBusinessProfile: "Google-bedrijfsprofiel",
  otherSearch: "Andere zoekmachine",
  social: "Facebook / Instagram",
  ai: "AI-assistent (ChatGPT e.d.)",
  phone: "Telefonisch",
  email: "E-mail",
  whatsapp: "WhatsApp",
  referral: "Verwijzende website",
  direct: "Direct",
  manual: "Handmatig ingevoerd",
  test: "Test",
  unknown: "Onbekend",
};

const OWN_DOMAINS = ["vastgoeddirectnederland.nl", "verkoopjehuisdirect.nl"];

const PAGE_SEPARATOR = / [·|] /;

// Verkeer dat geen echte bezoeker is: Google Tag Assistant bij het testen van
// conversies, Vercel-previews en lokale ontwikkeling.
const TEST_MARKERS = ["tagassistant", "vercel.com", "vercel.app", "localhost", "127.0.0.1"];

const AI_MARKERS = ["chatgpt", "chatgtp", "openai", "perplexity", "gemini.google", "copilot", "claude.ai"];
const SOCIAL_MARKERS = ["facebook", "instagram", "fb.", "fbclid", "l.facebook", "lm.facebook", "meta"];
const OTHER_SEARCH_MARKERS = ["bing.", "duckduckgo", "ecosia", "yahoo.", "startpage"];

function lower(value) {
  return String(value || "").toLowerCase();
}

function includesAny(haystack, needles) {
  return needles.some((needle) => haystack.includes(needle));
}

function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function parseLeadSourceDetails(lead) {
  const bron = String(lead?.bron || "");
  const pagina = String(lead?.pagina || "");
  const params = {};

  bron.split("|").map((part) => part.trim()).forEach((part) => {
    const index = part.indexOf("=");
    if (index > 0) {
      params[part.slice(0, index).trim()] = part.slice(index + 1).trim();
    }
  });

  // Pad en paginatitel zijn in de loop van de tijd met " · " en met " | "
  // gescheiden opgeslagen (attribution.js gebruikt " | ").
  const pageParts = pagina.split(PAGE_SEPARATOR);
  const rawPagePath = pageParts[0] || pagina;
  const pageTitle = pageParts.slice(1).join(" · ");

  // Oudere aanvragen bewaarden de volledige URL inclusief trackingparameters
  // in `pagina`. Die parameters tellen hier mee als bron, en het pad zelf
  // wordt zonder querystring getoond.
  const [pathOnly, queryString = ""] = rawPagePath.split("?");
  const pageParams = new URLSearchParams(queryString);

  // Oudere aanvragen hebben soms een kale URL als bron, zonder "referrer=".
  const bareReferrer = /^https?:\/\//i.test(bron.trim()) ? bron.trim().split(" ")[0] : "";

  return {
    pagePath: pathOnly || rawPagePath,
    pageTitle,
    source: params.utm_source || params.source || pageParams.get("utm_source") || (bron.trim() === "direct" ? "direct" : ""),
    medium: params.utm_medium || pageParams.get("utm_medium") || "",
    campaign: params.utm_campaign || pageParams.get("utm_campaign") || "",
    term: params.utm_term || pageParams.get("utm_term") || "",
    content: params.utm_content || pageParams.get("utm_content") || "",
    clickId:
      params.gclid || params.gbraid || params.wbraid ||
      pageParams.get("gclid") || pageParams.get("gbraid") || pageParams.get("wbraid") || "",
    adSource: params.gad_source || pageParams.get("gad_source") || "",
    fbclid: params.fbclid || pageParams.get("fbclid") || "",
    referrer: params.referrer || bareReferrer || "",
  };
}

/**
 * Vertaalt een lead naar één kanaal uit LEAD_CHANNELS. Volgorde is bewust:
 * testverkeer eerst (anders telt een Tag Assistant-klik als Google Ads), dan
 * betaalde klik-ID's, dan de rest.
 */
export function leadChannel(lead) {
  const details = parseLeadSourceDetails(lead);
  const bron = lower(lead?.bron);
  const pagina = lower(lead?.pagina);
  const source = lower(details.source);
  const medium = lower(details.medium);
  const referrer = lower(details.referrer);
  const referrerHost = hostOf(details.referrer);
  const everything = `${bron} ${pagina}`;

  if (includesAny(everything, TEST_MARKERS)) return LEAD_CHANNELS.test;

  if (details.clickId || details.adSource || ["cpc", "ppc", "paid", "paidsearch", "paid_search"].includes(medium)) {
    return LEAD_CHANNELS.googleAds;
  }

  if (details.fbclid || includesAny(source, SOCIAL_MARKERS) || includesAny(referrerHost, ["facebook.", "instagram.", "fb.com"])) {
    return LEAD_CHANNELS.social;
  }

  if (includesAny(`${source} ${referrer} ${bron}`, AI_MARKERS)) return LEAD_CHANNELS.ai;

  // De websitelink in het Google-bedrijfsprofiel draagt utm_medium=gbp; zonder
  // die markering is een klik vanuit Maps niet van gewoon zoekverkeer te
  // onderscheiden.
  if (medium === "gbp" || source === "gbp") return LEAD_CHANNELS.googleBusinessProfile;

  if (source === "google" || /(^|\.)google\.[a-z.]+$/.test(referrerHost)) return LEAD_CHANNELS.googleOrganic;
  if (includesAny(`${source} ${referrerHost}`, OTHER_SEARCH_MARKERS)) return LEAD_CHANNELS.otherSearch;

  // Handmatig ingevoerde bronnen in /admin/nieuwe-lead.
  if (/telefo|gebeld|belde/.test(bron)) return LEAD_CHANNELS.phone;
  if (/whatsapp/.test(bron)) return LEAD_CHANNELS.whatsapp;
  if (/^(e-?)?mail/.test(bron.trim())) return LEAD_CHANNELS.email;

  if (referrerHost && !OWN_DOMAINS.some((domain) => referrerHost.endsWith(domain))) return LEAD_CHANNELS.referral;

  // Een verwijzing vanaf de eigen site (of het oude domein) zegt niets over
  // waar de bezoeker oorspronkelijk vandaan kwam.
  if (source === "direct" || bron.includes("direct") || referrerHost) return LEAD_CHANNELS.direct;

  if (pagina.includes("handmatig")) return LEAD_CHANNELS.manual;
  if (!bron.trim()) return LEAD_CHANNELS.unknown;
  return LEAD_CHANNELS.manual;
}

export function isTestLead(lead) {
  return leadChannel(lead) === LEAD_CHANNELS.test;
}

/**
 * Kanaal op basis van al geparste details (gebruikt door het leaddetail).
 * Dunne wrapper rond leadChannel, zodat er één regel is.
 */
export function sourceChannelLabel(details) {
  if (!details) return LEAD_CHANNELS.unknown;
  const bron = [
    details.source ? `utm_source=${details.source}` : "",
    details.medium ? `utm_medium=${details.medium}` : "",
    details.clickId ? `gclid=${details.clickId}` : "",
    details.referrer ? `referrer=${details.referrer}` : "",
    details.source === "direct" ? "direct" : "",
  ].filter(Boolean).join(" | ");
  const channel = leadChannel({ bron, pagina: details.pagePath || "" });
  if (channel === LEAD_CHANNELS.unknown && details.pagePath) return LEAD_CHANNELS.direct;
  return channel;
}

/** Landingspad zonder querystring en zonder paginatitel, voor groeperen. */
export function cleanLandingPath(pagina) {
  const path = String(pagina || "").split(PAGE_SEPARATOR)[0].split("?")[0].trim();
  return path || "/";
}
