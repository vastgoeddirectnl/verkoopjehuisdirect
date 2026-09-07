import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_LEAD_LIMIT,
  LIST_LEADS_EXTRA_FIELDS,
  MAX_LEAD_LIMIT,
  buildListLeadsQuery,
} from "../app/lib/leadsQuery.js";
import { ARCHIVE_LEAD_STATUSES } from "../app/lib/leadStatus.js";

/**
 * Deze query voedt het leadoverzicht en het actiecentrum. Een weggevallen
 * kolom of een verschoven parameter valt pas op als het dashboard leeg blijft,
 * dus de vorm ligt hier vast.
 */

function normaliseer(sql) {
  return sql.replace(/\s+/g, " ").trim();
}

test("het overzicht levert alle afgeleide kolommen op", () => {
  const { sql } = buildListLeadsQuery();
  for (const veld of LIST_LEADS_EXTRA_FIELDS) {
    assert.ok(
      new RegExp(`as ${veld}\\b`).test(sql),
      `kolom ${veld} ontbreekt in de select`
    );
  }
});

test("de leadvelden zelf komen ongefilterd mee", () => {
  // b.* levert onder meer last_contact_at, automation_follow_up_at en
  // manual_follow_up_at, waar het actiecentrum op rekent.
  const { sql } = buildListLeadsQuery();
  assert.match(sql, /select\s+b\.\*/);
  assert.match(sql, /with base as \(\s*select l\.\*/);
});

test("de limiet staat binnen de CTE, zodat er niet per lead onnodig wordt gerekend", () => {
  const { sql } = normaliseerResultaat(buildListLeadsQuery());
  const cteEinde = sql.indexOf(") select b.*");
  const limitPositie = sql.indexOf("limit $");
  assert.ok(limitPositie > 0 && limitPositie < cteEinde, "limit hoort binnen de CTE te staan");
});

function normaliseerResultaat({ sql, params }) {
  return { sql: normaliseer(sql), params };
}

test("alle drie de aggregaties draaien per lead via LATERAL", () => {
  const { sql } = buildListLeadsQuery();
  assert.equal((sql.match(/left join lateral/g) || []).length, 3);
  assert.match(sql, /from tasks t\s+where t\.lead_id = b\.id/);
  assert.match(sql, /from proposals pr\s+where pr\.lead_id = b\.id/);
  assert.match(sql, /from mail_logs ml\s+where ml\.lead_id = b\.id/);
});

test("standaard worden gearchiveerde leads uitgesloten", () => {
  const { sql, params } = buildListLeadsQuery();
  assert.deepEqual(params[0], ARCHIVE_LEAD_STATUSES);
  assert.match(sql, /coalesce\(l\.status, 'Nieuw'\) <> all\(\$1\)/);
  assert.equal(params[params.length - 1], DEFAULT_LEAD_LIMIT);
});

test("archive=archive draait het filter om", () => {
  const { sql, params } = buildListLeadsQuery({ archive: "archive" });
  assert.deepEqual(params[0], ARCHIVE_LEAD_STATUSES);
  assert.match(sql, /l\.status = any\(\$1\)/);
});

test("archive=all filtert niet op status", () => {
  const { sql, params } = buildListLeadsQuery({ archive: "all" });
  assert.doesNotMatch(sql, /l\.status/);
  assert.equal(params.length, 1, "alleen de limiet blijft over");
});

test("een expliciete status wint van het archieffilter", () => {
  const { sql, params } = buildListLeadsQuery({ status: "Voorstel verzonden", archive: "archive" });
  assert.equal(params[0], "Voorstel verzonden");
  assert.match(sql, /l\.status = \$1/);
  assert.doesNotMatch(sql, /any\(\$1\)/);
});

test("status 'Alle' gedraagt zich als geen status", () => {
  const metAlle = buildListLeadsQuery({ status: "Alle" });
  const zonder = buildListLeadsQuery();
  assert.equal(normaliseer(metAlle.sql), normaliseer(zonder.sql));
});

test("zoeken voegt één parameter toe die over negen kolommen wordt gebruikt", () => {
  const { sql, params } = buildListLeadsQuery({ search: "Jansen" });
  assert.equal(params[1], "%Jansen%");
  assert.equal((sql.match(/\$2/g) || []).length, 9);
});

test("de zoekterm wordt afgekapt en niet als patroon vertrouwd", () => {
  const { params } = buildListLeadsQuery({ search: "x".repeat(500) });
  assert.equal(params[1].length, 122, "120 tekens plus de twee procenttekens");
});

test("een lege zoekterm voegt geen filter toe", () => {
  for (const zoek of ["", "   ", null, undefined]) {
    const { params } = buildListLeadsQuery({ search: zoek });
    assert.equal(params.length, 2, `verwacht alleen status + limiet voor ${JSON.stringify(zoek)}`);
  }
});

test("de limiet wordt geklemd en valt terug op de standaard", () => {
  assert.equal(buildListLeadsQuery({ limit: 9999 }).params.at(-1), MAX_LEAD_LIMIT);
  assert.equal(buildListLeadsQuery({ limit: 50 }).params.at(-1), 50);
  assert.equal(buildListLeadsQuery({ limit: 0 }).params.at(-1), DEFAULT_LEAD_LIMIT);
  assert.equal(buildListLeadsQuery({ limit: "abc" }).params.at(-1), DEFAULT_LEAD_LIMIT);
});

test("de parameternummers lopen door bij status én zoekterm", () => {
  const { sql, params } = buildListLeadsQuery({ status: "In behandeling", search: "9501" });
  assert.equal(params.length, 3);
  assert.equal(params[0], "In behandeling");
  assert.equal(params[1], "%9501%");
  assert.equal(params[2], DEFAULT_LEAD_LIMIT);
  assert.match(sql, /limit \$3/);
});

test("een afgehandelde klantactie telt niet meer als openstaande taak", () => {
  const { sql } = buildListLeadsQuery();
  assert.match(sql, /proposal-interest-%/);
  assert.match(sql, /b\.last_contact_at >= t\.created_at/);
});

test("de sortering blijft nieuwste lead eerst, ook na de laterals", () => {
  const sql = normaliseer(buildListLeadsQuery().sql);
  assert.ok(sql.endsWith("order by b.created_at desc"));
});
