import { neon, types as pgTypes } from "@neondatabase/serverless";

let sqlClient;

// Postgres-OID van het type `date` (een kalenderdatum zonder tijd of zone).
const DATE_OID = 1082;

/**
 * Een `date`-kolom kwam standaard terug als JS Date op middernacht UTC, en
 * belandde dan als "2026-10-02T00:00:00.000Z" in de JSON naar de admin. Dat
 * gaf drie fouten tegelijk: `next_follow_up_at <= today` vergeleek als tekst
 * en zag een opvolging van vandaag niet als "vandaag", <input type="date">
 * bleef leeg omdat het die vorm niet leest, en overal stonden kale
 * tijdstempels. Een datum is een datum: hier geven we hem terug zoals
 * Postgres hem levert, als "YYYY-MM-DD".
 *
 * Alle andere types (timestamptz, numeric, json, …) houden de standaardparser.
 */
export const dbTypes = {
  getTypeParser(oid, format) {
    if (oid === DATE_OID) return (value) => value;
    return pgTypes.getTypeParser(oid, format);
  },
};

/**
 * "Vandaag" in Nederland, als SQL-expressie. `current_date` volgt de tijdzone
 * van de databaseserver (UTC bij Neon), waardoor tussen middernacht en 02:00
 * Nederlandse tijd nog "gisteren" gold.
 */
export const SQL_TODAY_NL = "(now() at time zone 'Europe/Amsterdam')::date";

export function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      "DATABASE_URL ontbreekt. Voeg de Neon connection string toe in Vercel Environment Variables."
    );
  }

  return url;
}

export function getSqlClient() {
  if (!sqlClient) {
    sqlClient = neon(getDatabaseUrl(), { types: dbTypes });
  }

  return sqlClient;
}

export async function query(text, params = []) {
  const sql = getSqlClient();

  const result = await sql.query(text, params);

  if (Array.isArray(result)) {
    return { rows: result };
  }

  return { rows: result?.rows || [] };
}

export async function queryOne(text, params = []) {
  const { rows } = await query(text, params);
  return rows[0] || null;
}
