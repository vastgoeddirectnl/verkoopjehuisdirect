import { notFound } from "next/navigation";
import { queryOne } from "../../lib/neonDb";
import { markProposalViewed } from "../../lib/automation";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function amount(value, fallback = "In overleg") {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  if (raw.includes("€")) return raw;
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return raw;
  return `€ ${new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 0 }).format(Number(digits))}`;
}

function value(value, fallback = "-") {
  return String(value || "").trim() || fallback;
}

function lines(value, fallback = []) {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatAddress(proposal) {
  if (proposal.property_address) return String(proposal.property_address).trim().toUpperCase();
  return [proposal.property_postcode, proposal.property_house_number].filter(Boolean).join(" ").toUpperCase() || "-";
}

function firstName(name) {
  const raw = String(name || "").trim();
  if (!raw) return "heer/mevrouw";
  return raw.split(" ")[0];
}

const SPECIAL_PROPOSAL_TYPES = ["Uitgestelde levering", "Overbruggingsoplossing", "ABC-doorverkoop mogelijk"];

function isSpecialProposalType(type) {
  return SPECIAL_PROPOSAL_TYPES.includes(String(type || "").trim());
}

function constructieChecks(proposal) {
  const checks = [];
  if (proposal.allow_kadaster_registration) checks.push("Koopovereenkomst mag worden ingeschreven bij het Kadaster");
  if (proposal.allow_abc_resale) checks.push("ABC-doorverkoop mogelijk");
  if (proposal.seller_cooperates_resale) checks.push("Verkoper werkt mee aan taxatie, bezichtiging en voorbereiding doorverkoop");
  if (proposal.delivery_free_of_claims) checks.push("Levering vrij van huur, gebruik, beslagen en hypotheken");
  if (proposal.property_same_state) checks.push("Woning blijft tot levering in huidige staat");
  return checks;
}

export default async function PublicProposalPage({ params, searchParams }) {
  const { token } = await params;
  const query = searchParams ? await searchParams : {};
  const isAdminPreview = query?.admin_preview === "1" || query?.preview === "admin";
  const proposal = await queryOne("select * from proposals where public_token = $1::uuid", [token]);

  if (!proposal) notFound();

  if (!isAdminPreview) {
    await markProposalViewed(proposal);
  }

  const address = formatAddress(proposal);
  const offerAmount = amount(proposal.amount_text);
  const validity = formatDate(proposal.validity_date);
  const transfer = value(proposal.transfer_date_text, "In overleg");
  const deposit = value(proposal.deposit_text, "In overleg bespreekbaar");

  const assumptions = value(
    proposal.assumptions_text,
    "Dit voorstel is gebaseerd op de door u verstrekte gegevens, openbare woninginformatie en de huidige bekende staat van de woning. Voor definitieve vastlegging controleren wij de juridische, bouwkundige en notariële uitgangspunten."
  );

  const conditions = value(
    proposal.conditions_text,
    "Het voorstel is vrijblijvend en onder voorbehoud van definitieve controle, akkoord van betrokken partijen en notariële vastlegging."
  );

  const included = lines(proposal.included_items, [
    "Een helder en concreet verkoopvoorstel",
    "Geen makelaarskosten voor een traditioneel verkooptraject",
    "Geen openbare bezichtigingsrondes nodig",
    "Afstemming over een passende overdrachtsdatum",
    "Notariële afwikkeling van de verkoop",
    "Eén vast aanspreekpunt tijdens het proces",
  ]);

  const reservations = lines(proposal.reservations_text, [
    "Controle van eigendomssituatie en kadastrale gegevens",
    "Controle van beschikbare woninginformatie en eventuele bijzonderheden",
    "Controle van eventuele huur-, gebruiks- of beslag-/beperkingssituaties",
    "Akkoord over oplevering, roerende zaken en overdrachtsdatum",
    "Definitieve vastlegging via de notaris",
  ]);

  const nextSteps = lines(proposal.next_steps_text, [
    "U bekijkt het voorstel rustig en noteert eventuele vragen.",
    "Wij bespreken het voorstel telefonisch of per e-mail met u door.",
    "Als het voorstel passend is, leggen wij de afspraken helder vast.",
    "De juridische en notariële afwikkeling wordt opgestart.",
    "De overdracht vindt plaats op de afgesproken datum via de notaris.",
  ]);

  const shortComparison = lines(proposal.short_comparison_text, [
    "Geen verkoopklaar maken van de woning noodzakelijk voordat wij kunnen meedenken.",
    "Geen open huis of meerdere bezichtigingsmomenten nodig.",
    "Meer duidelijkheid over voorwaarden, planning en afwikkeling.",
    "Een verkooproute die vooral gericht is op rust, snelheid en overzicht.",
  ]);

  const proposalType = value(proposal.proposal_type, proposal.proposal_variant || "Standaard aankoop");
  const specialProposal = isSpecialProposalType(proposalType);
  const checks = constructieChecks(proposal);
  const showBridge = specialProposal && (proposal.bridge_current_home || proposal.bridge_old_home || proposal.bridge_goal_text || proposal.bridge_explanation_text);

  return (
    <main className="proposal-page">
      <style>{styles}</style>

      <header className="topbar">
        <img src="/logo.png" alt="Vastgoed Direct Nederland" />
        <div className="top-actions">
          <span>Persoonlijk verkoopvoorstel</span>
          <PrintButton />
        </div>
      </header>

      <section className="cover">
        <div className="cover-copy">
          <span className="label">Vrijblijvend & persoonlijk</span>
          <h1>Verkoopvoorstel voor uw woning</h1>
          <p>
            Beste {firstName(proposal.lead_naam)}, op basis van de beschikbare informatie hebben wij
            een concreet en overzichtelijk voorstel uitgewerkt. Het doel: duidelijkheid over bedrag,
            voorwaarden en vervolgstappen zonder onnodige verkoopdruk.
          </p>
        </div>

        <aside className="offer-panel">
          <span>Voorgesteld bedrag</span>
          <strong>{offerAmount}</strong>
          <small>{address}</small>
          <div className="micro-grid">
            <div>
              <em>Geldig tot</em>
              <b>{validity}</b>
            </div>
            <div>
              <em>Oplevering</em>
              <b>{transfer}</b>
            </div>
          </div>
        </aside>
      </section>

      <section className="executive-summary">
        <div>
          <span className="section-kicker">Samenvatting</span>
          <h2>De kern van dit voorstel</h2>
          <p>
            Dit voorstel geeft u direct inzicht in de mogelijke verkooproute via Vastgoed Direct Nederland.
            U ziet niet alleen het voorgestelde bedrag, maar ook welke kosten, inspanningen en onzekerheden
            u hiermee mogelijk voorkomt ten opzichte van een traditioneel verkooptraject.
          </p>
        </div>
        <div className="summary-list">
          <div><strong>{offerAmount}</strong><span>voorgesteld bedrag</span></div>
          <div><strong>{transfer}</strong><span>mogelijke overdracht</span></div>
          <div><strong>{deposit}</strong><span>aanbetaling / voorschot</span></div>
        </div>
      </section>

      {specialProposal ? (
        <section className="card special-card">
          <span className="section-kicker">Levering & constructie</span>
          <h2>{proposalType}</h2>
          <div className="construct-grid">
            <div><strong>Passeertermijn</strong><span>{value(proposal.delivery_term_text, transfer)}</span></div>
            <div><strong>Gewenste leverdatum</strong><span>{formatDate(proposal.desired_transfer_date)}</span></div>
            <div><strong>Koper</strong><span>{value(proposal.buyer_text, "Vastgoed Direct Nederland of nader te noemen meester")}</span></div>
            {showBridge ? <div><strong>Huidige woning klant</strong><span>{value(proposal.bridge_current_home)}</span></div> : null}
            {showBridge ? <div><strong>Oude woning / te verkopen woning</strong><span>{value(proposal.bridge_old_home)}</span></div> : null}
            {showBridge ? <div><strong>Doel constructie</strong><span>{value(proposal.bridge_goal_text)}</span></div> : null}
          </div>
          {checks.length ? (
            <div className="mini-checks">
              {checks.map((item) => <div key={item}><span>✓</span>{item}</div>)}
            </div>
          ) : null}
          {proposal.bridge_explanation_text ? <p className="bridge-copy">{proposal.bridge_explanation_text}</p> : null}
        </section>
      ) : null}

      <section className="proposal-assurance">
        <article>
          <strong>Rustig beoordelen</strong>
          <span>U hoeft niet direct te beslissen. Het voorstel is bedoeld om helderheid te geven.</span>
        </article>
        <article>
          <strong>Vragen bespreken</strong>
          <span>Wij lichten bedragen, uitgangspunten en planning graag persoonlijk toe.</span>
        </article>
        <article>
          <strong>Vrijblijvend</strong>
          <span>Pas bij akkoord worden afspraken definitief vastgelegd via de notaris.</span>
        </article>
      </section>

      <section className="card">
        <span className="section-kicker">Woninggegevens</span>
        <h2>Uitgangspunt woning</h2>
        <div className="facts">
          <div><strong>Adres / object</strong><span>{address}</span></div>
          <div><strong>Type woning</strong><span>{value(proposal.property_type, "Nog te controleren")}</span></div>
          <div><strong>Woonoppervlakte</strong><span>{value(proposal.living_area_text, "Nog te controleren")}</span></div>
          <div><strong>Perceel</strong><span>{value(proposal.plot_area_text, "Nog te controleren")}</span></div>
          <div><strong>Bouwjaar</strong><span>{value(proposal.build_year_text, "Nog te controleren")}</span></div>
          <div><strong>Huidige situatie</strong><span>{value(proposal.current_situation, "Op basis van uw aanvraag te beoordelen")}</span></div>
        </div>
      </section>

      <section className="card">
        <span className="section-kicker">Waarom deze route</span>
        <h2>Wat dit voorstel vooral oplevert</h2>
        <div className="benefits">
          <article>
            <strong>Duidelijkheid vooraf</strong>
            <p>U weet waar u aan toe bent voordat u vervolgstappen zet.</p>
          </article>
          <article>
            <strong>Minder verkoopgedoe</strong>
            <p>Geen standaard verkooptraject met veel losse bezichtigingen of open huis.</p>
          </article>
          <article>
            <strong>Rustige afwikkeling</strong>
            <p>Afspraken worden helder vastgelegd en de overdracht loopt via de notaris.</p>
          </article>
          <article>
            <strong>Passend bij de situatie</strong>
            <p>Ook geschikt als snelheid, privacy, onderhoud of een bijzondere situatie meespeelt.</p>
          </article>
        </div>
      </section>

      <section className="card">
        <span className="section-kicker">Financieel overzicht</span>
        <h2>Netto-opbrengst in perspectief</h2>
        <p className="intro">
          Bij een woningverkoop gaat het niet alleen om de verkoopprijs, maar ook om kosten, voorbereiding,
          doorlooptijd en zekerheid. Onderstaand overzicht helpt om het voorstel naast een regulier traject te leggen.
        </p>
        <div className="comparison">
          <div className="head">Onderdeel</div>
          <div className="head">Traditionele verkoop</div>
          <div className="head orange">Vastgoed Direct Nederland</div>

          <div>Bod / verkoopprijs</div>
          <div>{amount(proposal.traditional_price_text, "Nog onbekend")}</div>
          <div>{offerAmount}</div>

          <div>Makelaarskosten</div>
          <div>{value(proposal.agent_costs_text, "Gebruikelijk van toepassing")}</div>
          <div>€ 0</div>

          <div>Herstel-/renovatiekosten vooraf</div>
          <div>{value(proposal.renovation_costs_text, "Afhankelijk van verkoopstrategie")}</div>
          <div>Niet noodzakelijk vooraf</div>

          <div>Overige verkoopkosten</div>
          <div>{value(proposal.other_costs_text, "Afhankelijk van situatie")}</div>
          <div>In overleg en vooraf helder</div>

          <div className="total">Verwachte netto-opbrengst</div>
          <div className="total">{amount(proposal.traditional_net_text, "Nog te bepalen")}</div>
          <div className="total accent">{amount(proposal.direct_net_text || proposal.amount_text)}</div>
        </div>
      </section>

      <section className="card">
        <span className="section-kicker">Inbegrepen</span>
        <h2>Wat u van ons mag verwachten</h2>
        <div className="checks">
          {included.map((item) => <div key={item}><span>✓</span>{item}</div>)}
        </div>
      </section>

      <section className="two-columns">
        <section className="card">
          <span className="section-kicker">Uitgangspunten</span>
          <h2>Waar dit voorstel op is gebaseerd</h2>
          <p>{assumptions}</p>
          <p>{conditions}</p>
        </section>

        <section className="card">
          <span className="section-kicker">Vergelijking</span>
          <h2>Kort samengevat</h2>
          <ul className="clean-list">
            {shortComparison.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      </section>

      <section className="card">
        <span className="section-kicker">Voorbehouden</span>
        <h2>Nog te controleren vóór definitieve vastlegging</h2>
        <div className="reservations">
          {reservations.map((item) => <div key={item}><span>□</span>{item}</div>)}
        </div>
      </section>

      <section className="card timeline-card">
        <span className="section-kicker">Proces</span>
        <h2>Vervolgstappen</h2>
        <div className="timeline">
          {nextSteps.map((item, index) => (
            <div key={item} className="timeline-step">
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="signature">
        <div>
          <span className="section-kicker">Contact</span>
          <h2>Voorstel bespreken?</h2>
          <p>
            Wij lichten het voorstel graag toe en kunnen samen bekijken of deze verkooproute aansluit
            bij uw situatie en planning.
          </p>
        </div>
        <div className="contact-block">
          <strong>Vastgoed Direct Nederland</strong>
          <span>06 12 23 80 51</span>
          <span>info@vastgoeddirectnederland.nl</span>
          <span>vastgoeddirectnederland.nl</span>

          <div className="contact-actions">
            <a href="tel:0612238051">Bel direct</a>
            <a href="mailto:info@vastgoeddirectnederland.nl">Stel een vraag</a>
            <a href="https://wa.me/31612238051" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </section>

      <section className="disclaimer">
        <strong>Belangrijk:</strong> dit voorstel is vrijblijvend en onder voorbehoud van definitieve controle,
        akkoord van betrokken partijen en notariële vastlegging. Aan dit document kunnen geen rechten worden ontleend.
      </section>
    </main>
  );
}

const styles = `
*{box-sizing:border-box}
:root{--navy:#071f3a;--navy2:#0d2d52;--orange:#D96A1C;--cream:#f5f2ec;--card:#fffdf9;--line:#e8e3db;--muted:#5f7083;--soft:#FFF1E6;--shadow:0 22px 70px rgba(7,31,58,.12)}
body{margin:0;background:radial-gradient(circle at 82% 0,#FFF1E6 0,transparent 34%),linear-gradient(180deg,#f7f3ec 0,#f1ede6 100%);color:var(--navy);font-family:Arial,Helvetica,sans-serif}
.proposal-page{max-width:1080px;margin:0 auto;padding:26px}
.topbar{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:18px}
.topbar img{width:235px;background:#fff;border:1px solid var(--line);border-radius:20px;padding:10px;box-shadow:0 12px 36px rgba(7,31,58,.08)}
.top-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:flex-end}
.top-actions span{font-size:13px;font-weight:900;color:var(--muted);text-transform:uppercase;letter-spacing:.07em}
.topbar button{border:0;background:var(--orange);color:#fff;border-radius:999px;padding:13px 18px;font-weight:900;box-shadow:0 14px 30px rgba(217,106,28,.20)}
.cover{display:grid;grid-template-columns:1.25fr .85fr;gap:22px;background:linear-gradient(135deg,var(--navy) 0,var(--navy2) 64%,#123a67 100%);color:#fff;border-radius:34px;padding:38px;box-shadow:var(--shadow);position:relative;overflow:hidden;margin-bottom:20px}
.cover:after{content:"";position:absolute;right:-110px;top:-120px;width:320px;height:320px;border-radius:999px;background:rgba(217,106,28,.18)}
.cover:before{content:"";position:absolute;right:88px;bottom:-160px;width:280px;height:280px;border-radius:999px;border:42px solid rgba(255,255,255,.08)}
.cover-copy,.offer-panel{position:relative;z-index:1}
.label,.section-kicker{display:inline-flex;align-items:center;width:max-content;background:var(--soft);border:1px solid #F2B885;color:#B85216;border-radius:999px;padding:8px 12px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.07em}
.cover .label{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.24);color:#fff}
.cover h1{font-size:58px;line-height:.98;letter-spacing:-.06em;margin:18px 0 16px;max-width:640px}
.cover p{font-size:18px;line-height:1.65;color:#dbe8f5;margin:0;max-width:690px}
.offer-panel{background:#fff;color:var(--navy);border-radius:28px;padding:26px;align-self:stretch;box-shadow:0 24px 55px rgba(0,0,0,.20)}
.offer-panel>span{display:block;color:var(--muted);font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.07em}
.offer-panel strong{display:block;color:var(--orange);font-size:48px;line-height:1;margin:12px 0 10px;letter-spacing:-.055em}
.offer-panel small{display:block;color:var(--navy);font-weight:900;text-transform:uppercase;line-height:1.35}
.micro-grid{display:grid;grid-template-columns:1fr;gap:10px;margin-top:20px}
.micro-grid div{background:#f8f5ef;border:1px solid var(--line);border-radius:18px;padding:14px}
.micro-grid em,.micro-grid b{display:block;font-style:normal}
.micro-grid em{font-size:12px;color:var(--muted);font-weight:900;text-transform:uppercase;letter-spacing:.06em}
.micro-grid b{font-size:16px;margin-top:4px}

.proposal-assurance{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px}
.proposal-assurance article{background:#fffdf9;border:1px solid var(--line);border-radius:24px;padding:20px;box-shadow:0 14px 40px rgba(7,31,58,.07)}
.proposal-assurance article:before{content:"";display:block;width:42px;height:5px;border-radius:999px;background:var(--orange);margin-bottom:14px}
.proposal-assurance strong,.proposal-assurance span{display:block}
.proposal-assurance strong{font-size:17px;color:var(--navy);margin-bottom:8px}
.proposal-assurance span{font-size:14.5px;line-height:1.5;color:var(--muted)}
.contact-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.contact-actions a{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:var(--orange);color:#fff;text-decoration:none;font-weight:900;padding:11px 14px;font-size:14px}
.contact-actions a:nth-child(2){background:#fff;color:var(--navy);border:1px solid rgba(255,255,255,.25)}
.contact-actions a:nth-child(3){background:#3E8F5E}

.executive-summary,.card,.signature,.disclaimer{background:var(--card);border:1px solid var(--line);border-radius:30px;padding:28px;box-shadow:var(--shadow);margin-bottom:18px}
.executive-summary{display:grid;grid-template-columns:1.15fr .85fr;gap:24px;align-items:center}
h2{font-size:34px;line-height:1.05;letter-spacing:-.045em;margin:14px 0 14px}
p,.intro,li{font-size:16.5px;line-height:1.68;color:var(--muted)}
.summary-list{display:grid;gap:10px}
.summary-list div{background:#fff;border:1px solid var(--line);border-radius:20px;padding:16px}
.summary-list strong,.summary-list span{display:block}
.summary-list strong{font-size:24px;color:var(--navy)}
.summary-list span{color:var(--muted);margin-top:5px}
.special-card{background:linear-gradient(135deg,#fffdf9 0,#F7F2EC 100%)}.construct-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}.construct-grid div{background:#fff;border:1px solid var(--line);border-radius:20px;padding:16px}.construct-grid strong,.construct-grid span{display:block}.construct-grid strong{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}.construct-grid span{margin-top:6px;color:var(--navy);font-weight:800;line-height:1.35}.mini-checks{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:12px}.mini-checks div{display:flex;gap:10px;align-items:flex-start;background:#fff;border:1px solid var(--line);border-radius:18px;padding:14px;font-weight:800;line-height:1.4}.mini-checks span{color:var(--orange);font-weight:900}.bridge-copy{background:#fff;border:1px solid var(--line);border-radius:18px;padding:16px;margin:12px 0 0}
.facts{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line);border-radius:22px;overflow:hidden;background:#fff}
.facts div{padding:17px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);min-height:92px}
.facts div:nth-child(3n){border-right:0}
.facts strong,.facts span{display:block}
.facts strong{font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
.facts span{font-size:16px;color:var(--navy);font-weight:800;margin-top:7px;line-height:1.35}
.benefits{display:grid;grid-template-columns:repeat(4,1fr);gap:13px}
.benefits article{background:#fff;border:1px solid var(--line);border-radius:22px;padding:18px;min-height:160px}
.benefits article:before{content:"";display:block;width:38px;height:5px;border-radius:999px;background:var(--orange);margin-bottom:16px}
.benefits strong{display:block;font-size:18px}
.benefits p{font-size:15px;margin:9px 0 0}
.comparison{display:grid;grid-template-columns:1.18fr 1fr 1.12fr;border:1px solid var(--line);border-radius:22px;overflow:hidden;background:#fff;margin-top:18px}
.comparison>div{padding:15px 16px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);color:var(--muted);line-height:1.35}
.comparison>div:nth-child(3n){border-right:0}
.comparison .head{background:var(--navy);color:#fff;font-weight:900;text-align:center}
.comparison .orange{background:var(--orange)}
.comparison .total{background:#F7F2EC;font-weight:900;color:var(--navy)}
.comparison .accent{color:var(--orange);font-size:18px}
.checks{display:grid;grid-template-columns:repeat(2,1fr);gap:11px}
.checks div,.reservations div{display:flex;gap:10px;align-items:flex-start;background:#fff;border:1px solid var(--line);border-radius:18px;padding:15px;font-weight:800;line-height:1.4}
.checks span{color:var(--orange);font-weight:900}
.two-columns{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.clean-list{margin:12px 0 0;padding:0;list-style:none;display:grid;gap:10px}
.clean-list li{background:#fff;border:1px solid var(--line);border-radius:16px;padding:13px 14px}
.reservations{display:grid;grid-template-columns:1fr 1fr;gap:11px}
.reservations span{color:var(--orange);font-weight:900}
.timeline{display:grid;gap:12px}
.timeline-step{display:grid;grid-template-columns:70px 1fr;align-items:center;background:#fff;border:1px solid var(--line);border-radius:20px;overflow:hidden}
.timeline-step strong{height:100%;display:flex;align-items:center;justify-content:center;background:var(--navy);color:#fff;font-size:18px}
.timeline-step span{padding:16px;color:var(--muted);line-height:1.55}
.signature{display:grid;grid-template-columns:1.1fr .9fr;gap:22px;background:linear-gradient(135deg,#fffdf9 0,#F7F2EC 100%)}
.contact-block{background:var(--navy);color:#fff;border-radius:24px;padding:22px;align-self:center}
.contact-block strong,.contact-block span{display:block}
.contact-block strong{font-size:20px;margin-bottom:10px}
.contact-block span{color:#d9e6f5;margin-top:6px}
.disclaimer{background:#F7F2EC;color:#415168;line-height:1.65;font-size:14px;box-shadow:none}
@media(max-width:900px){.cover,.executive-summary,.two-columns,.signature,.proposal-assurance{grid-template-columns:1fr}.benefits{grid-template-columns:1fr 1fr}.facts{grid-template-columns:1fr 1fr}.facts div:nth-child(3n){border-right:1px solid var(--line)}.facts div:nth-child(2n){border-right:0}.comparison{grid-template-columns:1fr}.comparison .head{text-align:left}.comparison>div{border-right:0}.checks,.reservations,.construct-grid,.mini-checks{grid-template-columns:1fr}}
@media(max-width:640px){.proposal-page{padding:12px}.topbar{display:grid}.top-actions{justify-content:stretch}.top-actions span{display:none}.topbar img{width:215px}.topbar button{width:100%}.cover,.executive-summary,.card,.signature,.disclaimer{border-radius:24px;padding:20px}.cover h1{font-size:39px}.cover p{font-size:16px}.offer-panel strong{font-size:36px}.benefits,.facts{grid-template-columns:1fr}.facts div{border-right:0!important}.timeline-step{grid-template-columns:54px 1fr}.section-kicker{font-size:11px}h2{font-size:28px}}
@media print{body{background:#fff}.proposal-page{max-width:none;padding:0}.topbar button,.top-actions span{display:none}.topbar img{box-shadow:none}.cover,.executive-summary,.card,.signature,.disclaimer{box-shadow:none;page-break-inside:avoid;border-radius:18px}.cover{background:#071f3a!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}.offer-panel{box-shadow:none}.comparison .head,.timeline-step strong,.contact-block{background:#071f3a!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}.comparison .orange{background:#D96A1C!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`;
