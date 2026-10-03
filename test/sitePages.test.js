import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { SITE_PAGES, MERGED_PAGES, KENNISBANK_ARTICLES, canonicalPath } from "../app/lib/sitePages.js";

/**
 * SEO-02. De lijst van publieke pagina's staat op één plek. Deze test bewaakt
 * dat die lijst en de mappen in app/ niet uit elkaar lopen: een nieuwe pagina
 * die niet in de sitemap komt, of een samengevoegde pagina die toch nog
 * bestaat (en dan met de doorverwijzing botst), valt hier op.
 */

function publicPagePaths(dir = "app", found = []) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (["admin", "api", "voorstel", "components", "lib"].includes(item.name) && dir === "app") continue;
      if (item.name.startsWith("[") || item.name.startsWith("zz-")) continue;
      publicPagePaths(full, found);
    } else if (item.name === "page.jsx") {
      const rel = path.relative("app", dir).split(path.sep).join("/");
      found.push(rel ? `/${rel}` : "/");
    }
  }
  return found;
}

const sitemapPaths = SITE_PAGES.map((page) => page.path);

test("elke publieke pagina staat in de sitemaplijst", () => {
  const missing = publicPagePaths().filter((p) => !sitemapPaths.includes(p));
  assert.deepEqual(missing, []);
});

test("elke pagina in de sitemaplijst bestaat", () => {
  const pages = publicPagePaths();
  const missing = sitemapPaths.filter((p) => !pages.includes(p));
  assert.deepEqual(missing, []);
});

test("geen dubbele paden in de sitemaplijst", () => {
  assert.equal(new Set(sitemapPaths).size, sitemapPaths.length);
});

test("samengevoegde pagina's bestaan niet meer en wijzen naar een bestaande pagina", () => {
  const pages = publicPagePaths();
  for (const [from, to] of Object.entries(MERGED_PAGES)) {
    assert.ok(!pages.includes(from), `${from} bestaat nog en botst met de doorverwijzing`);
    assert.ok(!sitemapPaths.includes(from), `${from} staat nog in de sitemap`);
    assert.ok(sitemapPaths.includes(to), `${from} verwijst naar ${to}, die niet in de sitemap staat`);
    assert.ok(!MERGED_PAGES[to], `${to} is zelf ook samengevoegd (keten van doorverwijzingen)`);
  }
});

test("canonicalPath vertaalt alleen samengevoegde paden", () => {
  assert.equal(canonicalPath("/huis-verkopen-met-spoed"), "/huis-snel-verkopen");
  assert.equal(canonicalPath("/huis-snel-verkopen"), "/huis-snel-verkopen");
});

test("elk kennisbankartikel heeft een titel, samenvatting en pagina", () => {
  const pages = publicPagePaths();
  for (const article of KENNISBANK_ARTICLES) {
    assert.ok(article.title && article.summary, article.path);
    assert.ok(pages.includes(article.path), `${article.path} bestaat niet`);
  }
});
