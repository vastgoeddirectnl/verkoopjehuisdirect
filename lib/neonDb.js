import { neon } from "@neondatabase/serverless";

let sqlClient;

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
    sqlClient = neon(getDatabaseUrl());
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
