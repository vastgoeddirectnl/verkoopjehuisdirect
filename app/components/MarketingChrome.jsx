import { reviewData, reviewDisplayText } from "../lib/reviewData";

const whatsappLink =
  "https://wa.me/31612238051?text=Hallo%2C%20ik%20wil%20graag%20mijn%20woning%20verkopen.%20Kunt%20u%20met%20mij%20meedenken%3F";

export function MarketingHeader() {
  return (
    <>
      <div className="trust-strip" aria-label="Belangrijkste kenmerken">
        <div className="site-container trust-strip-inner">
          <span>Vrijblijvend voorstel</span>
          <span>Geen makelaarskosten bij directe aankoop</span>
          <span>Geen open huis nodig</span>
          <span>Overdracht via de notaris</span>
        </div>
      </div>

      <header className="marketing-header">
        <div className="site-container marketing-header-inner">
          <a href="/" className="brand-link" aria-label="Vastgoed Direct Nederland – home">
            <img src="/logo.png" alt="Vastgoed Direct Nederland" className="brand-logo" />
          </a>

          <nav className="desktop-nav" aria-label="Hoofdnavigatie">
            <a href="/#mogelijkheden">Mogelijkheden</a>
            <a href="/#werkwijze">Werkwijze</a>
            <a href="/#vergelijking">Vergelijken</a>
            <a href="/#faq">Veelgestelde vragen</a>
          </nav>

          <div className="header-cta-group">
            <a
              href="tel:0612238051"
              className="text-action"
              data-analytics-event="secondary_cta_click"
              data-analytics-component="header_phone"
            >
              06 12 23 80 51
            </a>
            <a
              href="#aanvraag"
              className="button button-primary button-compact"
              data-analytics-event="primary_cta_click"
              data-analytics-component="header"
            >
              Voorstel aanvragen
            </a>
          </div>

          <details className="mobile-menu">
            <summary aria-label="Menu openen">Menu</summary>
            <nav aria-label="Mobiele navigatie">
              <a href="/#mogelijkheden">Mogelijkheden</a>
              <a href="/#werkwijze">Werkwijze</a>
              <a href="/#vergelijking">Vergelijken</a>
              <a href="/#faq">Veelgestelde vragen</a>
              <a href="tel:0612238051">Bel 06 12 23 80 51</a>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}

export function ProofBar() {
  return (
    <section className="proof-bar" aria-label="Zekerheden en beoordeling">
      <div className="site-container proof-bar-grid">
        <a
          href={reviewData.url}
          target="_blank"
          rel="noopener noreferrer"
          className="proof-item proof-review"
          aria-label="Bekijk de Google-beoordelingen"
        >
          <span className="proof-icon proof-stars">★★★★★</span>
          <span><strong>{reviewData.rating} op Google</strong><small>{reviewDisplayText(reviewData)}</small></span>
        </a>
        <div className="proof-item">
          <span className="proof-icon">1</span>
          <span><strong>Doorgaans binnen één werkdag</strong><small>Persoonlijke eerste reactie</small></span>
        </div>
        <div className="proof-item">
          <span className="proof-icon">✓</span>
          <span><strong>Eén vast contactpersoon</strong><small>Geen anoniem callcenter</small></span>
        </div>
        <div className="proof-item">
          <span className="proof-icon">§</span>
          <span><strong>Schriftelijke afspraken</strong><small>Notariële overdracht bij akkoord</small></span>
        </div>
      </div>
    </section>
  );
}

export function MarketingFooter() {
  return (
    <>
      <footer className="marketing-footer">
        <div className="site-container footer-grid">
          <div className="footer-brand">
            <img src="/logo.png" alt="Vastgoed Direct Nederland" className="footer-logo" />
            <p>
              Persoonlijke verkoopoplossingen voor woningeigenaren die eerst duidelijkheid willen over prijs,
              planning en voorwaarden.
            </p>
            <p className="footer-small">Actief in Noord- en Oost-Nederland.</p>
          </div>

          <div>
            <h2>Contact</h2>
            <p><a href="tel:0612238051">06 12 23 80 51</a></p>
            <p><a href="mailto:info@vastgoeddirectnederland.nl">info@vastgoeddirectnederland.nl</a></p>
            <p><a href={whatsappLink} target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
          </div>

          <div>
            <h2>Direct verkopen</h2>
            <p><a href="/huis-direct-verkopen">Huis direct verkopen</a></p>
            <p><a href="/huis-snel-verkopen">Huis snel verkopen</a></p>
            <p><a href="/woning-verkopen-zonder-makelaar">Zonder makelaar</a></p>
            <p><a href="/huis-verkopen-aan-opkoper">Verkopen aan een opkoper</a></p>
          </div>

          <div>
            <h2>Veelvoorkomend</h2>
            <p><a href="/opknapwoning-verkopen">Opknapwoning</a></p>
            <p><a href="/huis-verkopen-bij-erfenis">Erfeniswoning</a></p>
            <p><a href="/leegstaand-huis-verkopen">Leegstaande woning</a></p>
            <p><a href="/woning-verkopen-met-schade">Woning met schade</a></p>
          </div>

          <div>
            <h2>Werkgebied</h2>
            <p><a href="/huis-verkopen-groningen">Groningen</a></p>
            <p><a href="/woning-verkopen-drenthe">Drenthe</a></p>
            <p><a href="/woning-verkopen-friesland">Friesland</a></p>
            <p><a href="/woning-verkopen-overijssel">Overijssel</a></p>
          </div>
        </div>
        <div className="site-container footer-bottom">
          <span>© 2026 Vastgoed Direct Nederland</span>
          <span>VerkoopJeHuisDirect.nl verwijst naar dit hoofddomein.</span>
          <a href="/privacyverklaring">Privacyverklaring</a>
        </div>
      </footer>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-pill"
        data-analytics-event="secondary_cta_click"
        data-analytics-component="floating_whatsapp"
      >
        WhatsApp
      </a>

      <div className="mobile-action-bar">
        <a href="tel:0612238051" className="button button-secondary">Bel direct</a>
        <a href="#aanvraag" className="button button-primary">Voorstel aanvragen</a>
      </div>
    </>
  );
}

export { whatsappLink };
