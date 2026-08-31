import AdsLeadMiniForm from "./AdsLeadMiniForm";
import { MarketingFooter, MarketingHeader, ProofBar } from "./MarketingChrome";

const whatsappBase = "https://wa.me/31612238051";
const primaryCta = "Ontvang een vrijblijvend verkoopvoorstel";

const internalLinks = [
  ["/huis-snel-verkopen", "Huis snel verkopen"],
  ["/huis-direct-verkopen", "Huis direct verkopen"],
  ["/woning-verkopen-zonder-makelaar", "Woning verkopen zonder makelaar"],
  ["/opknapwoning-verkopen", "Opknapwoning verkopen"],
  ["/leegstaand-huis-verkopen", "Leegstaand huis verkopen"],
  ["/huis-verkopen-zonder-leeghalen", "Huis verkopen zonder leeghalen"],
  ["/huis-verkopen-zonder-opknappen", "Huis verkopen zonder opknappen"],
  ["/huis-verkopen-in-huidige-staat", "Huis verkopen in huidige staat"],
  ["/woning-verkopen-die-nog-vol-staat", "Woning verkopen die nog vol staat"],
  ["/huis-verkopen-bij-erfenis", "Huis verkopen bij erfenis"],
  ["/verhuurde-woning-verkopen", "Verhuurde woning verkopen"],
  ["/huis-verkopen-met-achterstallig-onderhoud", "Huis met achterstallig onderhoud verkopen"],
  ["/huis-verkopen-zonder-bezichtigingen", "Huis verkopen zonder bezichtigingen"],
  ["/huis-verkopen-aan-opkoper", "Huis verkopen aan een opkoper"],
  ["/huis-verkopen-groningen", "Huis verkopen in Groningen"],
  ["/woning-verkopen-drenthe", "Woning verkopen in Drenthe"],
  ["/woning-verkopen-friesland", "Woning verkopen in Friesland"],
  ["/woning-verkopen-overijssel", "Woning verkopen in Overijssel"],
];

const linkDescriptions = {
  "/huis-snel-verkopen": "Als snelheid belangrijk is, maar u niet overhaast wilt beslissen.",
  "/huis-direct-verkopen": "Rechtstreeks duidelijkheid over prijs, planning en voorwaarden.",
  "/woning-verkopen-zonder-makelaar": "Zonder traditioneel makelaarstraject of verkoopcampagne.",
  "/opknapwoning-verkopen": "Voor woningen met onderhoud, gebreken of renovatiebehoefte.",
  "/leegstaand-huis-verkopen": "Bij leegstand, zorgen of doorlopende lasten.",
  "/huis-verkopen-zonder-leeghalen": "Ook wanneer meubels, inboedel of spullen achterblijven.",
  "/huis-verkopen-zonder-opknappen": "Eerst beoordelen zonder vooraf te verbouwen of herstellen.",
  "/huis-verkopen-in-huidige-staat": "Verkoopmogelijkheden zonder eerst verkoopklaar te maken.",
  "/woning-verkopen-die-nog-vol-staat": "Voor woningen waar opruimen of ontruimen nog niet lukt.",
  "/geerfde-woning-verkopen-zonder-leeghalen": "Rust en overzicht bij een geërfde woning met inboedel.",
  "/opknapwoning-verkopen-zonder-makelaar": "Een opknapwoning verkopen zonder reguliere verkooproute.",
  "/leegstaand-huis-verkopen-wat-zijn-de-opties": "Vergelijk de mogelijkheden bij een lege woning.",
  "/huis-verkopen-bij-dubbele-lasten": "Wanneer planning, zekerheid en maandlasten meespelen.",
  "/huis-verkopen-bij-erfenis": "Praktische afspraken bij een erfenis of nalatenschap.",
  "/verhuurde-woning-verkopen": "Ook wanneer huur, gebruik of huuropbrengst een rol speelt.",
  "/huis-verkopen-met-achterstallig-onderhoud": "Als vooraf herstellen niet haalbaar of wenselijk is.",
  "/huis-verkopen-zonder-bezichtigingen": "Geen open huis of reeks openbare bezichtigingen nodig.",
  "/huis-verkopen-aan-opkoper": "Lees wat directe verkoop inhoudt en vergelijk eerlijk.",
  "/huis-verkopen-groningen": "Persoonlijke verkoopmogelijkheden in Groningen en omgeving.",
  "/woning-verkopen-drenthe": "Voor woningen in Drenthe, dorpen en buitengebieden.",
  "/woning-verkopen-friesland": "Een duidelijke verkooproute voor woningen in Friesland.",
  "/woning-verkopen-overijssel": "Directe verkoopmogelijkheden in Overijssel.",
  "/huis-verkopen-stadskanaal": "Lokale verkoopmogelijkheden in en rond Stadskanaal.",
  "/huis-verkopen-veendam": "Voor verkoopvragen in Veendam en omgeving.",
  "/huis-verkopen-winschoten": "Rustig inzicht in verkoopmogelijkheden rond Winschoten.",
  "/huis-verkopen-assen": "Voor verkoopvragen in Assen en omgeving.",
  "/huis-verkopen-emmen": "Voor woningen in Emmen en Zuidoost-Drenthe.",
  "/huis-verkopen-borger": "Voor woningeigenaren in Borger en de Hondsrug-regio.",
  "/huis-verkopen-gieten": "Voor verkoopvragen in Gieten en omgeving.",
};

function relatedCardsFor(page) {
  const source = Array.isArray(page.relatedLinks) && page.relatedLinks.length
    ? page.relatedLinks
    : internalLinks;

  return source
    .filter(([href]) => href !== page.slug)
    .slice(0, 6)
    .map(([href, label, text]) => ({
      href,
      label,
      text: text || linkDescriptions[href] || "Bekijk welke verkooproute hierbij past.",
    }));
}

function normaliseExample(page) {
  if (page.practiceExample) return page.practiceExample;
  if (!page.exampleSituation) return null;
  return { situation: page.exampleSituation.title, mainProblem: page.exampleSituation.text };
}

function pageTypeCopy(page) {
  if (page.pageType === "region") {
    return {
      eyebrow: "Regionaal en persoonlijk",
      valueTitle: `Verkopen in ${page.regionName || page.breadcrumb} met duidelijke afspraken`,
      valueText:
        "We kijken naar de ligging én naar de woning, staat, gewenste planning en persoonlijke situatie. Zo krijgt u geen standaardantwoord, maar een verkooproute die praktisch klopt.",
    };
  }

  if (page.pageType === "situation") {
    return {
      eyebrow: "Situatiegericht verkopen",
      valueTitle: "Geen standaard verkooptraject wanneer uw situatie niet standaard is.",
      valueText:
        "Bij erfenis, onderhoud, leegstand, verhuur of een volle woning spelen andere vragen. Daarom kijken we eerst naar de hele situatie en leggen we afspraken concreet vast.",
    };
  }

  return {
    eyebrow: "Directe verkooproute",
    valueTitle: "Eerst een helder voorstel. Pas daarna beslist u.",
    valueText:
      "Een eerste aanvraag is laagdrempelig. Waar mogelijk ontvangt u een vrijblijvende inschatting of voorstel met uitleg over bedrag, planning, oplevering en voorwaarden.",
  };
}

function detailEntries(example) {
  if (!example) return [];
  return [
    ["Type woning", example.propertyType],
    ["Regio", example.region],
    ["Mogelijke oplossing", example.solution],
    ["Oplevering", example.delivery],
    ["Overdracht", example.transfer],
    ["Vervolgstap", example.nextStep],
  ].filter(([, value]) => value);
}

export default function SeoLandingPage({ page }) {
  const faqs = Array.isArray(page.faqs) ? page.faqs : [];
  const sections = Array.isArray(page.sections) ? page.sections : [];
  const benefits = Array.isArray(page.benefits) ? page.benefits : [];
  const heroBenefits = Array.isArray(page.heroBenefits) && page.heroBenefits.length
    ? page.heroBenefits.slice(0, 4)
    : benefits.slice(0, 4);
  const comparisonRows = Array.isArray(page.comparisonRows) ? page.comparisonRows : [];
  const concernCards = Array.isArray(page.concernCards) ? page.concernCards : [];
  const solutionCards = Array.isArray(page.solutionCards) ? page.solutionCards : [];
  const ownerTasks = Array.isArray(page.ownerTasks) ? page.ownerTasks : [];
  const vdnTasks = Array.isArray(page.vdnTasks) ? page.vdnTasks : [];
  const relatedCards = relatedCardsFor(page);
  const example = normaliseExample(page);
  const typeCopy = pageTypeCopy(page);
  const fallbackProcessSection = sections.find((section) => Array.isArray(section.steps) && section.steps.length);
  const processSteps = Array.isArray(page.processSteps) && page.processSteps.length
    ? page.processSteps
    : fallbackProcessSection?.steps || [];
  const processTitle = page.processTitle || fallbackProcessSection?.title || "Zo verloopt een vrijblijvende aanvraag";
  const processIntro = page.processIntro ||
    "De aanvraag is bedoeld om eerst duidelijkheid te krijgen. Een verkoop ontstaat pas na uitwerking en ondertekening van de afspraken.";
  const contentSections = sections.filter((section) => {
    if (section !== fallbackProcessSection) return true;
    return Boolean(section.paragraphs?.length || section.bullets?.length);
  });
  const afterRequestTitle = page.afterRequestTitle || "Wat gebeurt er na uw aanvraag?";
  const afterRequestText = page.afterRequestText ||
    "Wij beoordelen de woninggegevens en uw situatie. Waar mogelijk ontvangt u een eerste vrijblijvende inschatting of voorstel. Als informatie ontbreekt, nemen we persoonlijk contact op.";
  const heroNote = page.heroNote || "Vrijblijvend. U ontvangt eerst duidelijkheid en beslist daarna zelf.";
  const exampleDetails = detailEntries(example);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vastgoeddirectnederland.nl" },
      {
        "@type": "ListItem",
        position: 2,
        name: page.breadcrumb,
        item: `https://www.vastgoeddirectnederland.nl${page.slug}`,
      },
    ],
  };

  const whatsappText = encodeURIComponent(
    `Hallo, ik wil graag mijn situatie bespreken over: ${page.breadcrumb}. Kunt u met mij meedenken?`
  );
  const whatsappLink = `${whatsappBase}?text=${whatsappText}`;

  return (
    <main className="seo-page">
      {faqs.length > 0 ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <MarketingHeader />

      <section className="seo-hero">
        <div className="site-container">
          <nav className="seo-breadcrumbs" aria-label="Kruimelpad">
            <a href="/">Home</a><span>›</span><span>{page.breadcrumb}</span>
          </nav>

          <div className="seo-hero-grid">
            <div className="seo-hero-copy">
              <span className="eyebrow-pill">{page.eyebrow || typeCopy.eyebrow}</span>
              <h1>{page.h1}</h1>
              <p className="seo-lead">{page.lead}</p>

              <div className="seo-hero-actions">
                <a href="#aanvraag" className="button button-primary">{primaryCta}</a>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button-secondary">
                  Bespreek eerst mijn situatie
                </a>
              </div>
              <p className="seo-hero-note">{heroNote}</p>

              {heroBenefits.length > 0 ? (
                <div className="seo-hero-benefits" aria-label="Belangrijkste voordelen">
                  {heroBenefits.map((item) => <span key={item}>{item}</span>)}
                </div>
              ) : null}
            </div>

            <aside className="seo-form-panel" id="aanvraag">
              <p className="section-eyebrow">Persoonlijk beoordeeld</p>
              <h2>Vraag vrijblijvend een voorstel aan</h2>
              <p>Vul de belangrijkste woning- en contactgegevens in. Dat is genoeg om te starten.</p>
              <AdsLeadMiniForm
                pageTitle={page.breadcrumb}
                pageSlug={page.slug}
                defaultSituation={page.defaultSituation || page.breadcrumb}
                submitLabel={page.formSubmitLabel || primaryCta}
                successText={page.formSuccessText}
                privacyNote={page.formPrivacyNote}
              />
              <div className="after-request">
                <strong>{afterRequestTitle}</strong>
                <span>{afterRequestText}</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <ProofBar />

      <section className="seo-intro-strip">
        <div className="site-container seo-intro-grid">
          <div>
            <p className="section-eyebrow">Kort antwoord</p>
            <h2>{page.breadcrumb}</h2>
          </div>
          <p>{page.shortAnswer}</p>
        </div>
      </section>

      {benefits.length > 0 ? (
        <section className="section-shell section-cream">
          <div className="site-container">
            <div className="section-heading centered-heading">
              <p className="section-eyebrow">Wat deze route kan bieden</p>
              <h2>Duidelijkheid zonder onnodige stappen vooraf.</h2>
            </div>
            <div className="benefit-pill-grid">
              {benefits.map((item) => <div className="benefit-pill" key={item}>{item}</div>)}
            </div>
          </div>
        </section>
      ) : null}

      {concernCards.length > 0 || solutionCards.length > 0 ? (
        <section className="section-shell">
          <div className="site-container insight-grid">
            {concernCards.length > 0 ? (
              <article className="insight-card">
                <p className="section-eyebrow">Herkenbaar</p>
                <h2>{page.concernTitle || "Welke vragen spelen vaak?"}</h2>
                <ul className="plain-list">{concernCards.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ) : null}
            {solutionCards.length > 0 ? (
              <article className="insight-card">
                <p className="section-eyebrow">Praktische route</p>
                <h2>{page.solutionTitle || "Wat kan eenvoudiger?"}</h2>
                <ul className="plain-list">{solutionCards.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="section-shell section-cream">
        <div className="site-container">
          <div className="section-heading centered-heading">
            <p className="section-eyebrow">{typeCopy.eyebrow}</p>
            <h2>{page.valueTitle || typeCopy.valueTitle}</h2>
            <p>{page.valueText || typeCopy.valueText}</p>
          </div>
          <div className="why-grid">
            <article className="why-card">
              <strong>Duidelijkheid vóór verplichtingen</strong>
              <p>U vraagt eerst een voorstel aan. Pas als dit past, worden de afspraken verder uitgewerkt.</p>
            </article>
            <article className="why-card">
              <strong>Concrete schriftelijke afspraken</strong>
              <p>Prijs, planning, staat, oplevering en bijzondere voorwaarden komen duidelijk op papier.</p>
            </article>
            <article className="why-card">
              <strong>Afwikkeling via de notaris</strong>
              <p>Bij akkoord verloopt de juridische levering en betaling via de notaris.</p>
            </article>
          </div>
        </div>
      </section>

      {vdnTasks.length > 0 || ownerTasks.length > 0 ? (
        <section className="section-shell">
          <div className="site-container">
            <div className="section-heading centered-heading">
              <p className="section-eyebrow">Rollen en verwachtingen</p>
              <h2>Vooraf helder wie wat doet.</h2>
            </div>
            <div className="task-grid">
              {vdnTasks.length > 0 ? (
                <article className="task-card">
                  <h2>Wat wij kunnen vereenvoudigen</h2>
                  <ul className="plain-list">{vdnTasks.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              ) : null}
              {ownerTasks.length > 0 ? (
                <article className="task-card">
                  <h2>Wat van u belangrijk blijft</h2>
                  <ul className="plain-list">{ownerTasks.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {example ? (
        <section className="section-shell section-cream">
          <div className="site-container">
            <article className="example-panel">
              <p className="section-eyebrow">Geanonimiseerde voorbeeldsituatie</p>
              <h2>{example.situation || example.title || "Praktijkvoorbeeld"}</h2>
              {example.mainProblem ? <p>{example.mainProblem}</p> : null}
              {exampleDetails.length > 0 ? (
                <div className="example-detail-grid">
                  {exampleDetails.map(([label, value]) => (
                    <div className="example-detail" key={label}><small>{label}</small><span>{value}</span></div>
                  ))}
                </div>
              ) : null}
            </article>
          </div>
        </section>
      ) : null}

      {contentSections.length > 0 ? (
        <section className="section-shell">
          <div className="site-container content-grid">
            {contentSections.map((section) => (
              <article className="content-block" key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets?.length > 0 ? (
                  <ul className="plain-list">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {processSteps.length > 0 ? (
        <section className="section-shell section-cream">
          <div className="site-container">
            <div className="section-heading centered-heading">
              <p className="section-eyebrow">Zo werkt het</p>
              <h2>{processTitle}</h2>
              <p>{processIntro}</p>
            </div>
            <ol className="seo-process-grid">
              {processSteps.map((step) => {
                const key = typeof step === "string" ? step : `${step.title}-${step.text}`;
                return (
                  <li key={key}>
                    {typeof step === "string" ? <span>{step}</span> : <><strong>{step.title}</strong><small>{step.text}</small></>}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      ) : null}

      {comparisonRows.length > 0 ? (
        <section id="vergelijking" className="section-shell">
          <div className="site-container">
            <div className="section-heading split-heading">
              <div>
                <p className="section-eyebrow">Eerlijk vergelijken</p>
                <h2>Reguliere verkoop of directe verkoop?</h2>
              </div>
              <p>
                Een reguliere verkoop kan soms meer opleveren. Directe verkoop kan aantrekkelijk zijn wanneer rust,
                snelheid, minder voorbereiding en heldere voorwaarden zwaarder wegen.
              </p>
            </div>
            <div className="comparison-two-col">
              <article className="compare-card">
                <h3>Reguliere verkoop</h3>
                {comparisonRows.map(([label, regular]) => (
                  <div className="compare-item" key={`regular-${label}`}><strong>{label}</strong><span>{regular}</span></div>
                ))}
              </article>
              <article className="compare-card direct">
                <h3>Direct via Vastgoed Direct Nederland</h3>
                {comparisonRows.map(([label, , direct]) => (
                  <div className="compare-item" key={`direct-${label}`}><strong>{label}</strong><span>{direct}</span></div>
                ))}
              </article>
            </div>
          </div>
        </section>
      ) : null}

      {faqs.length > 0 ? (
        <section id="faq" className="section-shell section-cream seo-faq">
          <div className="site-container faq-layout">
            <div className="faq-intro">
              <p className="section-eyebrow">Veelgestelde vragen</p>
              <h2>Duidelijkheid voordat u iets aanvraagt.</h2>
              <p>U kunt ook eerst bellen of uw situatie via WhatsApp toelichten.</p>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button-secondary">Bespreek mijn situatie</a>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <details key={faq.question} open={index === 0}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedCards.length > 0 ? (
        <section className="section-shell">
          <div className="site-container">
            <div className="section-heading split-heading">
              <div>
                <p className="section-eyebrow">Verder oriënteren</p>
                <h2>Bekijk ook verwante verkoopsituaties.</h2>
              </div>
              <p>Kies alleen de informatie die bij uw woning, regio of reden van verkoop past.</p>
            </div>
            <div className="seo-related-grid">
              {relatedCards.map((card) => (
                <a href={card.href} className="seo-related-card" key={card.href}>
                  <strong>{card.label}</strong>
                  <p>{card.text}</p>
                  <span>Lees verder →</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="final-cta-section">
        <div className="site-container final-cta-grid">
          <div>
            <p className="section-eyebrow">Vrijblijvend laten beoordelen</p>
            <h2>{page.ctaTitle}</h2>
            <p>{page.ctaText}</p>
          </div>
          <div className="final-cta-actions">
            <a href="#aanvraag" className="button button-primary">{primaryCta}</a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button-on-dark">WhatsApp</a>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
