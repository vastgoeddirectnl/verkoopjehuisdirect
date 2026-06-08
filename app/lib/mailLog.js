import { queryOne } from "./neonDb";

function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

export async function logMailEvent({
  lead_id = null,
  proposal_id = null,
  type = "mail",
  recipient = "",
  subject = "",
  status = "Onbekend",
  provider_id = "",
  error = "",
} = {}) {
  return queryOne(
    `insert into mail_logs (
      lead_id, proposal_id, type, recipient, subject, status, provider_id, error
    ) values ($1,$2,$3,$4,$5,$6,$7,$8) returning *`,
    [
      lead_id || null,
      proposal_id || null,
      clean(type, 80),
      clean(recipient, 220),
      clean(subject, 260),
      clean(status, 80),
      clean(provider_id, 180),
      clean(error, 500),
    ]
  );
}

export async function logMailEventSafe(input) {
  try {
    return await logMailEvent(input);
  } catch (error) {
    console.warn("Mailhistorie kon niet worden opgeslagen:", error.message);
    return null;
  }
}
