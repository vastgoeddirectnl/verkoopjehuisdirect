import test from "node:test";
import assert from "node:assert/strict";

import { buildCloseTaskQueries, AUTOMATION_TASK_CLOSE_RULES } from "../app/lib/automation.js";
import { ARCHIVE_LEAD_STATUSES } from "../app/lib/leadStatus.js";

/**
 * TASK-01. Automatische taken werden aangemaakt maar nooit gesloten. De
 * opschoning draait als losse update per regel; een verkeerd genummerde
 * parameter ($1/$2) zou pas in productie falen. Deze tests controleren de
 * opbouw zonder database.
 */

function placeholders(sql) {
  return [...new Set([...sql.matchAll(/\$(\d+)/g)].map((m) => Number(m[1])))].sort((a, b) => a - b);
}

test("elke opschoonregel gebruikt precies de parameters die hij meestuurt", () => {
  for (const leadId of [null, "lead-1"]) {
    for (const { key, sql, params } of buildCloseTaskQueries({ leadId })) {
      const used = placeholders(sql);
      assert.deepEqual(used, params.map((_, i) => i + 1), `regel ${key} (leadId=${leadId})`);
    }
  }
});

test("alleen automatische, nog open taken worden geraakt", () => {
  for (const { sql } of buildCloseTaskQueries()) {
    assert.match(sql, /t\.automation_key is not null/, "handmatige taken blijven met rust");
    assert.match(sql, /t\.status <> 'Afgerond'/);
  }
});

test("met een leadId wordt alleen die lead opgeschoond", () => {
  for (const { sql, params } of buildCloseTaskQueries({ leadId: "lead-1" })) {
    assert.match(sql, /and t\.lead_id = \$\d+/);
    assert.equal(params[params.length - 1], "lead-1");
  }
  for (const { sql } of buildCloseTaskQueries()) {
    assert.doesNotMatch(sql, /t\.lead_id = \$/);
  }
});

test("de archiefregel gebruikt dezelfde statuslijst als de rest van de app", () => {
  const archief = buildCloseTaskQueries().find((q) => q.key === "gearchiveerd");
  assert.deepEqual(archief.params[0], ARCHIVE_LEAD_STATUSES);
});

test("elke regel legt in de notitie vast waarom de taak is gesloten", () => {
  for (const { params } of buildCloseTaskQueries()) {
    assert.ok(params.some((p) => typeof p === "string" && p.startsWith("Automatisch afgesloten:")));
  }
  assert.equal(new Set(AUTOMATION_TASK_CLOSE_RULES.map((r) => r.key)).size, AUTOMATION_TASK_CLOSE_RULES.length, "unieke sleutels");
});
