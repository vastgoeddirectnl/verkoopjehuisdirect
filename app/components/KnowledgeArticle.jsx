// Opmaak voor een kennisbankartikel (SEO-02). Informatieve pagina's naast de
// commerciële landingspagina's: ze beantwoorden een vraag volledig en linken
// door naar de passende verkooppagina. De inhoud staat per artikel in
// app/kennisbank/<slug>/page.jsx; de lijst in app/lib/sitePages.js.

import { MarketingFooter, MarketingHeader } from "./MarketingChrome";
import { KENNISBANK_ARTICLES } from "../lib/sitePages.js";

const SITE = "https://www.vastgoeddirectnederland.nl";

function Block({ block }) {
  if (block.type === "list") {
    return <ul className="article-list">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
  }
  if (block.type === "steps") {
    return (
      <ol className="article-steps">
        {block.items.map(([title, text]) => (
          <li key={title}><strong>{title}</strong><span>{text}</span></li>
        ))}
      </ol>
    );
  }
  if (block.type === "table") {
    return (
      <div className="article-table-wrap">
        <table className="article-table">
          <thead><tr>{block.head.map((cell) => <th key={cell}>{cell}</th>)}</tr></thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.cells[0]} className={row.total ? "total" : ""}>
                {row.cells.map((cell, index) => <td key={`${row.cells[0]}-${index}`}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        {block.note ? <p className="article-note">{block.note}</p> : null}
      </div>
    );
  }
  if (block.type === "callout") {
    return <div className="article-callout"><strong>{block.title}</strong><p>{block.text}</p></div>;
  }
  return <p>{block.text}</p>;
}

export default function KnowledgeArticle({ article }) {
  const url = `${SITE}${article.path}`;
  const related = KENNISBANK_ARTICLES.filter((item) => item.path !== article.path);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.h1,
    description: article.description,
    datePublished: article.published,
    dateModified: article.updated || article.published,
    inLanguage: "nl-NL",
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "Vastgoed Direct Nederland", url: SITE },
    publisher: { "@type": "Organization", name: "Vastgoed Direct Nederland", logo: { "@type": "ImageObject", url: `${SITE}/brand/logo.png` } },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Kennisbank", item: `${SITE}/kennisbank` },
      { "@type": "ListItem", position: 3, name: article.breadcrumb, item: url },
    ],
  };

  return (
    <main className="overview-page article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <MarketingHeader requestHref="/#aanvraag" />

      <article>
        <header className="overview-hero" id="hoofdinhoud">
          <div className="article-container">
            <nav className="seo-breadcrumbs" aria-label="Kruimelpad">
              <a href="/">Home</a><span>›</span><a href="/kennisbank">Kennisbank</a><span>›</span><span>{article.breadcrumb}</span>
            </nav>
            <p className="eyebrow">Kennisbank</p>
            <h1>{article.h1}</h1>
            <p>{article.intro}</p>
            <p className="article-meta">Bijgewerkt: {article.updatedLabel}</p>
          </div>
        </header>

        <div className="article-container article-body">
          {article.summary ? (
            <aside className="article-summary" aria-label="In het kort">
              <strong>In het kort</strong>
              <ul>{article.summary.map((item) => <li key={item}>{item}</li>)}</ul>
            </aside>
          ) : null}

          {article.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.blocks.map((block, index) => <Block key={`${section.title}-${index}`} block={block} />)}
            </section>
          ))}

          {article.disclaimer ? <p className="article-disclaimer">{article.disclaimer}</p> : null}

          <section className="article-cta">
            <div>
              <strong>{article.cta?.title || "Wilt u weten wat directe verkoop in uw situatie betekent?"}</strong>
              <p>{article.cta?.text || "Vraag vrijblijvend een beoordeling aan. U ontvangt een schriftelijk voorstel en beslist daarna zelf."}</p>
            </div>
            <div className="article-cta-actions">
              <a href={article.cta?.href || "/#aanvraag"} className="button button-primary">{article.cta?.label || "Vraag een voorstel aan"}</a>
              <a href="tel:0612238051" className="button button-secondary">06 12 23 80 51</a>
            </div>
          </section>

          <section className="article-related">
            <h2>Verder lezen</h2>
            <div className="overview-page-grid">
              {[...(article.relatedPages || []), ...related.map((item) => [item.path, item.title, item.summary])].slice(0, 3).map(([href, title, text]) => (
                <a href={href} className="overview-page-card" key={href}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                  <span>Lees verder →</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </article>

      <MarketingFooter requestHref="/#aanvraag" />
    </main>
  );
}
