import { query, queryOne } from "./neonDb";

export function supabaseAdmin() {
  throw new Error("Oude databasehelper aangeroepen. Deze app gebruikt Neon. Vervang deze import door neonDb.js.");
}

export { query, queryOne };
