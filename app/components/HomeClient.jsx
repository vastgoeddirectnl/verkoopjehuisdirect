import Image from "next/image";
import HomeLeadForm from "./HomeLeadForm";
import { MarketingFooter, MarketingHeader, ProofBar, whatsappLink } from "./MarketingChrome";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Vastgoed Direct Nederland",
  url: "https://www.vastgoeddirectnederland.nl",
  logo: "https://www.vastgoeddirectnederland.nl/logo.png",
  image: "https://www.vastgoeddirectnederland.nl/og.png",
  telephone: "+31612238051",
  email: "info@vastgoeddirectnederland.nl",
  description:
    "Vastgoed Direct Nederland biedt woningeigenaren een persoonlijke route naar directe verkoop met een vrijblijvend voorstel, schriftelijke afspraken en notariële afwikkeling.",
  areaServed: ["Groningen", "Drenthe", "Friesland", "Overijssel"],
  priceRange: "Vrijblijvend verkoopvoorstel",
};

const faqItems = [
  [
    "Is een aanvraag echt vrijblijvend?",
    "Ja. U vraagt eerst informatie en een voorstel aan. U beslist pas daarna of u verder wilt. Er is pas sprake van verkoop wanneer de afspraken zijn uitgewerkt en de koopovereenkomst door beide partijen is ondertekend.",
  ],
  [
    "Moet mijn woning eerst leeg of opgeknapt zijn?",
    "Nee. Ook bij achterstallig onderhoud, schade of spullen in de woning kunt u een aanvraag doen. Wij bespreken vooraf welke staat en oplevering bij het voorstel horen.",
  ],
  [
    "Krijg ik altijd direct een bod?",
    "Niet iedere woning kan alleen op basis van een adres worden beoordeeld. Na de eerste beoordeling hoort u welke informatie nog nodig is. Als directe verkoop passend is, ontvangt u een vrijblijvend verkoopvoorstel.",
  ],
  [
    "Kan reguliere verkoop meer opleveren?",
    "Dat kan. Directe verkoop draait niet alleen om de hoogste mogelijke verkoopprijs, maar ook om tijd, kosten, zekerheid, voorbereiding en oplevering. Daarom leggen wij de uitgangspunten helder uit zodat u goed kunt vergelijken.",
  ],
  [
    "Hoe snel nemen jullie contact op?",
    "Doorgaans nemen wij binnen één werkdag persoonlijk contact op. De termijn voor een voorstel of overdracht hangt af van de woning, beschikbare informatie en notariële mogelijkheden.",
  ],
  [
    "Hoe verloopt de overdracht?",
    "Bij akkoord worden koopprijs, planning, oplevering en voorwaarden schriftelijk vastgelegd. De juridische levering en betaling verlopen via de notaris.",
  ],
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const situationCards = [
  {
    href: "/huis-verkopen-in-huidige-staat",
    kicker: "Geen voorbereiding",
    title: "Verkopen in de huidige staat",
    text: "Laat eerst beoordelen wat mogelijk is, zonder vooraf te verbouwen, schilderen of verkoopklaar te maken.",
  },
  {
    href: "/huis-verkopen-zonder-leeghalen",
    kicker: "Spullen of inboedel",
    title: "Niet eerst leeghalen",
    text: "Ook een volle woning kan worden aangemeld. Afspraken over spullen en oplevering maken wij expliciet.",
  },
  {
    href: "/huis-verkopen-bij-erfenis",
    kicker: "Rust voor betrokkenen",
    title: "Erfenis of overlijden",
    text: "Eerst overzicht over woning, bevoegdheid, planning en oplevering voordat erfgenamen beslissen.",
  },
  {
    href: "/leegstaand-huis-verkopen",
    kicker: "Doorlopende lasten",
    title: "Leegstand of dubbele lasten",
    text: "Krijg snel zicht op een haalbare verkooproute wanneer kosten en zorgen blijven doorlopen.",
  },
  {
    href: "/woning-verkopen-met-schade",
    kicker: "Onderhoud of schade",
    title: "Woning met aandachtspunten",
    text: "Schade en gebreken worden onderdeel van de beoordeling en de schriftelijke afspraken.",
  },
  {
    href: "/verhuurde-woning-verkopen",
    kicker: "Gebruik of verhuur",
    title: "Verhuurde woning",
    text: "Wij kijken naar de huursituatie, afspraken, opbrengst en een passende overdrachtsroute.",
  },
];

const processSteps = [
  ["01", "Korte aanvraag", "Adres, type woning en uw situatie zijn genoeg om te starten."],
  ["02", "Persoonlijke beoordeling", "Wij bekijken de gegevens en nemen doorgaans binnen één werkdag contact op."],
  ["03", "Verkoopvoorstel", "Als directe verkoop passend is, ontvangt u een vrijblijvend voorstel met heldere uitgangspunten."],
  ["04", "Definitieve afspraken", "Na eventuele opname leggen wij prijs, planning, oplevering en voorwaarden vast."],
  ["05", "U beslist", "Alleen bij akkoord volgt de koopovereenkomst en overdracht via de notaris."],
];

const comparisonRows = [
  ["Verkoopprijs", "Gericht op maximale marktwerking", "Afgewogen tegen gemak, tijd en risico"],
  ["Voorbereiding", "Vaak opruimen, herstel, styling en fotografie", "Eerste beoordeling in de huidige staat"],
  ["Bezichtigingen", "Meerdere kijkers of open huis mogelijk", "Geen openbare kijkersronde nodig"],
  ["Kosten", "Courtage en presentatiekosten mogelijk", "Geen makelaarskosten bij directe aankoop"],
  ["Zekerheid", "Afhankelijk van koper en voorbehouden", "Voorwaarden vooraf schriftelijk vastgelegd"],
  ["Oplevering", "Onderdeel van onderhandeling", "Spullen, staat en datum vooraf bespreekbaar"],
];

const regionLinks = [
  ["/huis-verkopen-groningen", "Groningen"],
  ["/woning-verkopen-drenthe", "Drenthe"],
  ["/woning-verkopen-friesland", "Friesland"],
  ["/woning-verkopen-overijssel", "Overijssel"],
  ["/huis-verkopen-assen", "Assen"],
  ["/huis-verkopen-emmen", "Emmen"],
  ["/huis-verkopen-stadskanaal", "Stadskanaal"],
  ["/huis-verkopen-veendam", "Veendam"],
];

export default function HomeClient() {
  return (
    <main className="marketing-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <MarketingHeader />

      <section className="home-hero">
        <div className="site-container home-hero-grid">
          <div className="home-hero-copy">
            <span className="eyebrow-pill">Directe verkoop · persoonlijk geregeld</span>
            <h1>Uw woning verkopen zonder opknappen, bezichtigingen of verkoopdruk.</h1>
            <p className="hero-intro">
              U ontvangt eerst een persoonlijk, schriftelijk verkoopvoorstel met duidelijkheid over prijs, planning,
              voorwaarden en oplevering. Daarna beslist u rustig of directe verkoop bij uw situatie past.
            </p>

            <div className="hero-actions">
              <a href="#aanvraag" className="button button-primary">Vraag vrijblijvend een voorstel aan</a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button-secondary">
                Bespreek eerst mijn situatie
              </a>
            </div>

            <div className="hero-certainties" aria-label="Belangrijkste voordelen">
              <span>Geen open huis</span>
              <span>Niet eerst leeghalen</span>
              <span>Overdracht via de notaris</span>
            </div>

            <figure className="hero-image-card">
              <Image
                src="/hero-woning-v2.webp"
                alt="Nederlandse woning die in de huidige staat kan worden beoordeeld"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 58vw"
              />
              <figcaption>
                <strong>Ook als de woning nog niet verkoopklaar is</strong>
                <span>Onderhoud, schade of spullen hoeven een eerste beoordeling niet tegen te houden.</span>
              </figcaption>
            </figure>
          </div>

          <div className="hero-form-wrap">
            <div className="form-context">
              <span className="form-context-label">Vrijblijvend starten</span>
              <strong>In drie korte stappen geeft u voldoende informatie voor een eerste beoordeling.</strong>
            </div>
            <HomeLeadForm />
          </div>
        </div>
      </section>

      <ProofBar />

      <section className="section-shell positioning-section">
        <div className="site-container positioning-grid">
          <div>
            <p className="section-eyebrow">Waarom deze aanpak anders is</p>
            <h2>Geen grootse beloftes, maar precies weten waar u aan toe bent.</h2>
          </div>
          <div className="positioning-copy">
            <p>
              Veel woningopkopers beloven “de beste prijs” of verkoop binnen één dag. Wij vinden dat een goed voorstel
              verder gaat dan een snelle slogan. U moet kunnen zien wat het bedrag betekent, welke afspraken gelden en
              wat u praktisch nog moet regelen.
            </p>
            <div className="principle-list">
              <div><strong>Eerlijk vergelijken</strong><span>Reguliere verkoop kan soms meer opleveren. Directe verkoop kan rust, tijd en zekerheid bieden.</span></div>
              <div><strong>Alles op papier</strong><span>Prijs, leverdatum, staat, spullen en voorwaarden worden helder uitgewerkt.</span></div>
              <div><strong>Geen anoniem loket</strong><span>U krijgt persoonlijk contact en ruimte om vragen te stellen voordat u beslist.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="mogelijkheden" className="section-shell section-cream">
        <div className="site-container">
          <div className="section-heading split-heading">
            <div>
              <p className="section-eyebrow">Herkenbare situaties</p>
              <h2>De woning hoeft niet in het standaard verkoopplaatje te passen.</h2>
            </div>
            <p>
              Kies wat het dichtst bij uw situatie komt. Op iedere pagina leest u concreet wat mogelijk is en welke
              informatie of afspraken belangrijk zijn.
            </p>
          </div>

          <div className="situation-grid">
            {situationCards.map((card, index) => (
              <a href={card.href} className="situation-card" key={card.href}>
                <span className="situation-index">0{index + 1}</span>
                <span className="situation-kicker">{card.kicker}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <span className="card-link">Bekijk mogelijkheden <b>→</b></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="werkwijze" className="section-shell process-section">
        <div className="site-container">
          <div className="section-heading centered-heading">
            <p className="section-eyebrow">Van aanvraag tot overdracht</p>
            <h2>Vijf heldere stappen. Na iedere stap beslist u zelf.</h2>
            <p>U behoudt op ieder moment overzicht over wat er gebeurt en waarom.</p>
          </div>
          <ol className="process-grid">
            {processSteps.map(([number, title, text]) => (
              <li key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <div className="center-actions">
            <a href="#aanvraag" className="button button-primary">Start een vrijblijvende aanvraag</a>
            <span>Adres en situatie zijn genoeg om te beginnen.</span>
          </div>
        </div>
      </section>

      <section className="section-shell proposal-section">
        <div className="site-container proposal-grid">
          <div className="proposal-copy">
            <p className="section-eyebrow">Meer dan alleen een bedrag</p>
            <h2>Een voorstel dat u echt kunt beoordelen.</h2>
            <p>
              U ziet niet alleen een koopprijs. Ook de uitgangspunten, gewenste planning, oplevering en vervolgstappen
              komen duidelijk terug. Zo kunt u het voorstel naast een reguliere verkooproute leggen.
            </p>
            <ul className="check-list">
              <li>Koopprijs en eventuele voorwaarden</li>
              <li>Gewenste leverdatum of passeertermijn</li>
              <li>Afspraken over staat, spullen en oplevering</li>
              <li>Inzicht in kosten en praktische verschillen</li>
              <li>Heldere vervolgstappen bij akkoord</li>
            </ul>
          </div>

          <div className="proposal-preview" aria-label="Voorbeeld van de opbouw van een verkoopvoorstel">
            <div className="proposal-preview-top">
              <img src="/logo.png" alt="" aria-hidden="true" />
              <span>Persoonlijk verkoopvoorstel</span>
            </div>
            <div className="proposal-address">
              <small>Voorbeeldwoning</small>
              <strong>Uw adres</strong>
              <span>Persoonlijk en vrijblijvend opgesteld</span>
            </div>
            <div className="proposal-value-row">
              <div><small>Voorstel</small><strong>Helder bedrag</strong></div>
              <span>Vrijblijvend</span>
            </div>
            <div className="proposal-detail-grid">
              <div><small>Planning</small><strong>In overleg</strong></div>
              <div><small>Oplevering</small><strong>Duidelijk vastgelegd</strong></div>
              <div><small>Afwikkeling</small><strong>Via de notaris</strong></div>
              <div><small>Beslissing</small><strong>U bepaalt</strong></div>
            </div>
            <div className="proposal-preview-note">✓ U krijgt ruimte om vragen te stellen en rustig te vergelijken.</div>
          </div>
        </div>
      </section>

      <section id="vergelijking" className="section-shell comparison-section">
        <div className="site-container">
          <div className="section-heading split-heading comparison-heading">
            <div>
              <p className="section-eyebrow">Eerlijk naast elkaar</p>
              <h2>Reguliere verkoop of directe verkoop?</h2>
            </div>
            <p>De juiste keuze hangt af van wat u belangrijk vindt. Vergelijk daarom niet alleen het bod.</p>
          </div>

          <div className="comparison-table" role="table" aria-label="Vergelijking reguliere en directe verkoop">
            <div className="comparison-row comparison-head" role="row">
              <strong role="columnheader">Onderdeel</strong>
              <strong role="columnheader">Reguliere verkoop</strong>
              <strong role="columnheader">Direct via VDN</strong>
            </div>
            {comparisonRows.map(([label, regular, direct]) => (
              <div className="comparison-row" role="row" key={label}>
                <strong role="cell">{label}</strong>
                <span role="cell">{regular}</span>
                <span role="cell">{direct}</span>
              </div>
            ))}
          </div>
          <p className="comparison-disclaimer">
            Een directe verkoop is niet automatisch de financieel hoogste uitkomst. Het voordeel kan juist zitten in
            minder kosten, minder voorbereiding, een duidelijke planning en zekerheid over de afspraken.
          </p>
        </div>
      </section>

      <section className="section-shell region-section">
        <div className="site-container region-grid">
          <div>
            <p className="section-eyebrow">Noord- en Oost-Nederland</p>
            <h2>Lokale beoordeling, ook buiten de grote steden.</h2>
            <p>
              Wij kijken naar woningen in steden, dorpen en buitengebieden. De ligging is belangrijk, maar de staat,
              planning en uw persoonlijke situatie bepalen samen welke route passend is.
            </p>
            <a href="/regios" className="inline-link">Bekijk het volledige werkgebied →</a>
          </div>
          <div className="region-links">
            {regionLinks.map(([href, label]) => <a href={href} key={href}>{label}<span>→</span></a>)}
          </div>
        </div>
      </section>

      <section id="faq" className="section-shell faq-section">
        <div className="site-container faq-layout">
          <div className="faq-intro">
            <p className="section-eyebrow">Veelgestelde vragen</p>
            <h2>Eerst antwoord. Daarna pas uw aanvraag.</h2>
            <p>Staat uw vraag er niet tussen? U kunt ook eerst bellen of uw situatie via WhatsApp sturen.</p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button-secondary">Stel uw vraag via WhatsApp</a>
          </div>
          <div className="faq-list">
            {faqItems.map(([question, answer], index) => (
              <details key={question} open={index === 0}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta-section">
        <div className="site-container final-cta-grid">
          <div>
            <p className="section-eyebrow">Klaar voor een eerste beoordeling?</p>
            <h2>Ontdek wat er met uw woning mogelijk is.</h2>
            <p>Vrijblijvend, persoonlijk en zonder dat u de woning eerst hoeft klaar te maken voor verkoop.</p>
          </div>
          <div className="final-cta-actions">
            <a href="#aanvraag" className="button button-primary">Vraag een voorstel aan</a>
            <a href="tel:0612238051" className="button button-on-dark">Bel 06 12 23 80 51</a>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
