import { neon } from "@neondatabase/serverless";

let sql;

export function getSql() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL ontbreekt. Voeg deze toe in Vercel Environment Variables.");
  }

  if (!sql) {
    sql = neon(connectionString);
  }

  return sql;
}

export async function query(text, params = []) {
  const rows = await getSql()(text, params);
  return { rows };
}

export async function queryOne(text, params = []) {
  const { rows } = await query(text, params);
  return rows[0] || null;
}
