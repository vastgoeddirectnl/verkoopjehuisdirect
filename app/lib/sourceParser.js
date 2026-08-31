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

  const pageParts = pagina.split(" · ");
  const pagePath = pageParts[0] || pagina;
  const pageTitle = pageParts.slice(1).join(" · ");

  return {
    pagePath,
    pageTitle,
    source: params.utm_source || params.source || (bron === "direct" ? "direct" : ""),
    medium: params.utm_medium || "",
    campaign: params.utm_campaign || "",
    term: params.utm_term || "",
    content: params.utm_content || "",
    clickId: params.gclid || params.gbraid || params.wbraid || "",
    referrer: params.referrer || "",
  };
}

export function sourceChannelLabel(details) {
  const source = String(details?.source || "").toLowerCase();
  const medium = String(details?.medium || "").toLowerCase();
  if (details?.clickId || source.includes("google") || medium === "cpc") return "Google Ads";
  if (source === "direct") return "Direct";
  if (details?.referrer) return "Verwijzende website";
  if (details?.pagePath) return "Website / SEO";
  return "Onbekend";
}
