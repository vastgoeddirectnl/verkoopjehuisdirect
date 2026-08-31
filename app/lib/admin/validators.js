export function isValidEmail(value) {
  const email = String(value || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function hasUsableEmail(value) {
  return Boolean(String(value || "").trim()) && isValidEmail(value);
}
