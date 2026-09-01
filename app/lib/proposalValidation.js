function text(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function parseProposalMoney(value) {
  const raw = text(value);
  if (!raw) return 0;

  let normalized = raw
    .replace(/€/g, "")
    .replace(/\s/g, "")
    .replace(/[^0-9,.-]/g, "");

  if (!normalized) return 0;

  if (normalized.includes(",") && normalized.includes(".")) {
    normalized = normalized.replace(/\./g, "").replace(",", ".");
  } else if (normalized.includes(",")) {
    normalized = normalized.replace(",", ".");
  } else if (normalized.includes(".")) {
    const parts = normalized.split(".");
    if (parts.length > 1 && parts[parts.length - 1].length === 3) {
      normalized = normalized.replace(/\./g, "");
    }
  }

  const number = Number.parseFloat(normalized);
  return Number.isFinite(number) ? Math.abs(number) : 0;
}

export function sellerWorkDetails(proposal = {}) {
  const offer = parseProposalMoney(proposal.amount_text);
  const base = parseProposalMoney(proposal.seller_work_base_price_text);
  const work = parseProposalMoney(proposal.seller_work_amount_text);
  const total = parseProposalMoney(proposal.seller_work_total_price_text);
  const expectedTotal = base + work;

  return {
    offer,
    base,
    work,
    total,
    expectedTotal,
    baseMatchesOffer: Boolean(offer && base && Math.abs(offer - base) < 1),
    totalMatches: Boolean(total && expectedTotal && Math.abs(total - expectedTotal) < 1),
  };
}

export function proposalValidationIssues(proposal = {}, { forSending = false } = {}) {
  const issues = [];
  const amount = parseProposalMoney(proposal.amount_text);

  if (!amount) issues.push("Vul een geldig voorgesteld bedrag in.");
  if (forSending && !text(proposal.validity_date)) issues.push("Vul een geldigheidsdatum in.");
  if (forSending) {
    const address = text(proposal.property_address);
    if (!address && !(text(proposal.property_postcode) && text(proposal.property_house_number))) {
      issues.push("Vul het adres van de woning of het object in.");
    } else if (/^\d{4}\s?[a-z]{2}\s+\d/i.test(address)) {
      issues.push("Vul het volledige straatadres in; alleen postcode en huisnummer is niet voldoende.");
    }
  }

  if (proposal.seller_work_enabled) {
    const details = sellerWorkDetails(proposal);
    if (!details.base) issues.push("Vul bij werkzaamheden de basiskoopprijs in.");
    if (!details.work) issues.push("Vul het bedrag voor de werkzaamheden in.");
    if (!text(proposal.seller_work_description)) issues.push("Omschrijf de werkzaamheden die de verkoper uitvoert.");
    if (!text(proposal.seller_work_deadline)) issues.push("Vul de uiterste uitvoeringsdatum van de werkzaamheden in.");
    if (details.offer && details.base && !details.baseMatchesOffer) {
      issues.push("De basiskoopprijs bij werkzaamheden moet gelijk zijn aan het voorgestelde bedrag.");
    }
    if (details.base && details.work && details.total && !details.totalMatches) {
      issues.push("De totale koopprijs bij werkzaamheden klopt niet met de basiskoopprijs en het bedrag van de werkzaamheden.");
    }
  }

  if (proposal.resale_payment_enabled) {
    const threshold = parseProposalMoney(proposal.resale_threshold_text);
    const percentage = Number(String(proposal.resale_percentage_text || "").replace(",", ".").replace(/[^0-9.]/g, ""));
    const period = Number(proposal.resale_period_months || 0);
    if (!threshold) issues.push("Vul het drempelbedrag voor de aanvullende betaling in.");
    if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 100) {
      issues.push("Vul een percentage voor de aanvullende betaling in tussen 0 en 100.");
    }
    if (!Number.isFinite(period) || period <= 0) issues.push("Vul de periode voor de aanvullende betaling in.");
  }

  return issues;
}

export function proposalReviewWarnings(proposal = {}) {
  const warnings = [];
  const directNet = parseProposalMoney(proposal.direct_net_text) || parseProposalMoney(proposal.amount_text);
  const traditionalNet = parseProposalMoney(proposal.traditional_net_text);

  if (directNet && traditionalNet && directNet < traditionalNet * 0.8) {
    const difference = new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(Math.round(traditionalNet - directNet));
    warnings.push(`De directe netto-opbrengst ligt ${difference} onder de traditionele netto-opbrengst. Controleer of de vergelijking realistisch is en licht het verschil concreet toe.`);
  }

  if (/^in overleg(?: bespreekbaar)?$/i.test(text(proposal.deposit_text))) {
    warnings.push("De aanbetaling of het voorschot is niet concreet ingevuld en wordt daarom niet aan de klant getoond.");
  }

  if (/appartement/i.test(text(proposal.property_type)) && parseProposalMoney(proposal.plot_area_text)) {
    warnings.push("Controleer of een perceeloppervlakte bij dit appartement werkelijk van toepassing is.");
  }

  return warnings;
}

export function isSellerWorkComplete(proposal = {}) {
  if (!proposal.seller_work_enabled) return false;
  const details = sellerWorkDetails(proposal);
  return Boolean(
    details.base &&
    details.work &&
    details.total &&
    details.baseMatchesOffer &&
    details.totalMatches &&
    text(proposal.seller_work_description) &&
    text(proposal.seller_work_deadline)
  );
}
