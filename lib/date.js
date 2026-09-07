const AMSTERDAM_TZ = "Europe/Amsterdam";

function datePartsAmsterdam(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: AMSTERDAM_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
}

export function todayAmsterdam(date = new Date()) {
  const { year, month, day } = datePartsAmsterdam(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function addDaysAmsterdam(days = 0, date = new Date()) {
  const { year, month, day } = datePartsAmsterdam(date);
  const shifted = new Date(Date.UTC(year, month - 1, day + Number(days || 0), 12, 0, 0));
  return shifted.toISOString().slice(0, 10);
}

export function normalizeDateOnly(value) {
  if (!value) return null;
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    const { year, month, day } = datePartsAmsterdam(value);
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  const raw = String(value).trim();
  if (!raw) return null;
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const nl = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (nl) return `${nl[3]}-${String(nl[2]).padStart(2, "0")}-${String(nl[1]).padStart(2, "0")}`;
  const fallback = new Date(raw);
  if (Number.isNaN(fallback.getTime())) return null;
  const { year, month, day } = datePartsAmsterdam(fallback);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function dateOnlyToUtc(value) {
  const normalized = normalizeDateOnly(value);
  if (!normalized) return null;
  const [year, month, day] = normalized.split("-").map(Number);
  return Date.UTC(year, month - 1, day, 12, 0, 0);
}

export function daysUntilAmsterdam(value, now = new Date()) {
  const target = dateOnlyToUtc(value);
  const today = dateOnlyToUtc(todayAmsterdam(now));
  if (target === null || today === null) return null;
  return Math.round((target - today) / 86400000);
}

export function isExpiredAmsterdam(value, now = new Date()) {
  const days = daysUntilAmsterdam(value, now);
  return days !== null && days < 0;
}

export function validityStatus(value, now = new Date()) {
  const days = daysUntilAmsterdam(value, now);
  if (days === null) return { days: null, label: "", state: "unknown" };
  if (days < 0) return { days, label: "Dit voorstel is verlopen", state: "expired" };
  if (days === 0) return { days, label: "Loopt vandaag af", state: "urgent" };
  return {
    days,
    label: `Nog ${days} dag${days === 1 ? "" : "en"} geldig`,
    state: days <= 3 ? "urgent" : "active",
  };
}

export function formatDateNL(value, options = {}) {
  const normalized = normalizeDateOnly(value);
  if (!normalized) return options.fallback ?? "-";
  const [year, month, day] = normalized.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return new Intl.DateTimeFormat("nl-NL", {
    timeZone: AMSTERDAM_TZ,
    day: options.day || "2-digit",
    month: options.month || "long",
    year: options.year || "numeric",
  }).format(date);
}

export function formatDateTimeNL(value, fallback = "-") {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat("nl-NL", {
    timeZone: AMSTERDAM_TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export { AMSTERDAM_TZ };
