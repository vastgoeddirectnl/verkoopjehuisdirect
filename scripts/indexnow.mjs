// IndexNow: meldt pagina's direct aan bij Bing (en Yandex, Seznam, Naver)
// in plaats van te wachten tot de crawler langskomt.
//
// Gebruik:
//   npm run indexnow                    alle URL's uit de live sitemap
//   npm run indexnow -- /pad /ander-pad alleen deze pagina's
//
// Draai het na een release met nieuwe of flink gewijzigde pagina's. Niet bij
// elke kleine wijziging alles opnieuw melden; dat ziet Bing als ruis.
//
// De sleutel staat in public/<sleutel>.txt; zonder dat bestand weigert
// IndexNow de melding.

const HOST = "www.vastgoeddirectnederland.nl";
const KEY = "5ea49a7b278a4293b5dfb4838c534bf5";
const ORIGIN = `https://${HOST}`;

async function sitemapUrls() {
  const xml = await fetch(`${ORIGIN}/sitemap.xml`).then((r) => {
    if (!r.ok) throw new Error(`sitemap: HTTP ${r.status}`);
    return r.text();
  });
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

const paths = process.argv.slice(2);
const urlList = paths.length ? paths.map((p) => new URL(p, ORIGIN).href) : await sitemapUrls();

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList }),
});

console.log(`IndexNow: ${urlList.length} URL('s) gemeld, HTTP ${response.status}`);
if (response.status >= 300) {
  console.error(await response.text());
  process.exit(1);
}
