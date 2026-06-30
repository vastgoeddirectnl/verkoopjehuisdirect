import { notFound } from "next/navigation";
import { queryOne } from "../../../../lib/neonDb";
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

function formatPostal(value) {
  return String(value || "").trim().toUpperCase();
}

function amount(value, fallback = "In overleg") {
  const raw = String(value || "").trim();
  if (!raw) return fallback;

  const cleaned = raw.replace(/\s/g, "");
  const numberLike = cleaned.replace(/[^\d]/g, "");

  if (numberLike && /^[€]?\d+$/.test(cleaned.replace(/\./g, ""))) {
    const formatted = new Intl.NumberFormat("nl-NL", {
      maximumFractionDigits: 0,
    }).format(Number(numberLike));
    return `€ ${formatted}`;
  }

  if (raw.includes("€")) return raw;
  return `€ ${raw}`;
}

function value(value, fallback = "-") {
  const raw = String(value || "").trim();
  return raw || fallback;
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
  if (proposal.property_address) return formatPostal(proposal.property_address);
  const parts = [proposal.property_postcode, proposal.property_house_number].filter(Boolean);
  return formatPostal(parts.join(" ")) || "-";
}

export default async function ProposalPrintPage({ params }) {
  const { id } = await params;
  const proposal = await queryOne("select * from proposals where id = $1", [id]);

  if (!proposal) notFound();

  const included = lines(proposal.included_items, [
    "Heldere communicatie",
    "Geen makelaarskosten",
    "Geen openbare bezichtigingen nodig",
    "Notariële afwikkeling",
    "Verkoopoplossing op maat",
    "Vrijblijvend voorstel",
  ]);

  const assumptions = value(
    proposal.assumptions_text,
    "Dit voorstel is gebaseerd op de door u verstrekte gegevens, openbare woninginformatie en de huidige bekende staat van de woning. Eventuele afwijkingen, bijzondere juridische situaties, verborgen gebreken of aanvullende kosten kunnen invloed hebben op de definitieve afspraken."
  );

  const reservations = lines(proposal.reservations_text, [
    "Controle woninggegevens",
    "Controle eigendomssituatie",
    "Controle beschikbare documenten",
    "Notariële toetsing",
    "Akkoord op voorwaarden",
    "Geen bijzondere belemmeringen",
  ]);

  const nextSteps = lines(proposal.next_steps_text, [
    "U beoordeelt het voorstel rustig.",
    "Wij bespreken vragen, bijzonderheden en eventuele voorwaarden.",
    "Bij akkoord worden afspraken juridisch en notarieel vastgelegd.",
    "De overdracht vindt plaats via de notaris.",
  ]);

  return (
    <main className="print-root">
      <style>{styles}</style>
      <div className="print-actions">
        <PrintButton />
      </div>

      <article className="page cover">
        <div className="cover-logo">
          <img src="/logo.png" alt="Vastgoed Direct Nederland" />
        </div>

        <div className="mobile-curve" aria-hidden="true" />

        <div className="cover-content">
          <span className="eyebrow">Vrijblijvend voorstel</span>
          <h1>Vrijblijvend verkoopvoorstel</h1>
          <p>Professioneel en vrijblijvend voorstel voor uw woningverkoop.</p>
          <div className="cover-card">
            <strong>{formatAddress(proposal)}</strong>
            <span>{amount(proposal.amount_text)}</span>
          </div>
        </div>

        <div className="cover-footer">
          <span>www.vastgoeddirectnederland.nl</span>
          <span>06 12 23 80 51</span>
        </div>
      </article>

      <article className="page">
        <header className="doc-header">
          <img src="/logo.png" alt="Vastgoed Direct Nederland" />
          <div>
            <strong>Vrijblijvend voorstel</strong>
            <span>Datum: {formatDate(proposal.created_at)}</span>
            <span>Geldig tot: {formatDate(proposal.validity_date)}</span>
          </div>
        </header>

        <h1>Vrijblijvend verkoopvoorstel</h1>
        <p className="lead">
          Beste {proposal.lead_naam || "heer/mevrouw"}, naar aanleiding van uw aanvraag ontvangt u hierbij een helder en vrijblijvend verkoopvoorstel.
          Dit voorstel is bedoeld om snel duidelijkheid te geven over de mogelijke verkooproute, voorwaarden en vervolgstappen.
        </p>
        <p className="subtle">
          Vergelijk niet alleen het bodbedrag, maar vooral de netto-opbrengst, voorwaarden, snelheid en zekerheid van de verkoop.
        </p>

        <section className="section">
          <div className="section-title orange"><span>1</span><strong>Voorgesteld bod</strong></div>
          <div className="offer-grid">
            <div className="offer-amount">
              <span>Voorgesteld bedrag</span>
              <strong>{amount(proposal.amount_text)}</strong>
            </div>
            <div className="facts">
              <div><span>Overdrachtsdatum / oplevering</span><strong>{value(proposal.transfer_date_text, "In overleg")}</strong></div>
              <div><span>Geldigheid voorstel</span><strong>{formatDate(proposal.validity_date)}</strong></div>
              <div><span>Aanbetaling / voorschot</span><strong>{value(proposal.deposit_text, "In overleg bespreekbaar")}</strong></div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-title navy"><span>2</span><strong>Gegevens woning</strong></div>
          <div className="table two">
            <div><strong>Adres / woning</strong><span>{formatAddress(proposal)}</span></div>
            <div><strong>Postcode / huisnummer</strong><span>{value([formatPostal(proposal.property_postcode), proposal.property_house_number].filter(Boolean).join(" "))}</span></div>
            <div><strong>Type woning</strong><span>{value(proposal.property_type)}</span></div>
            <div><strong>Woonoppervlakte</strong><span>{value(proposal.living_area_text)}</span></div>
            <div><strong>Perceeloppervlakte</strong><span>{value(proposal.plot_area_text)}</span></div>
            <div><strong>Bouwjaar</strong><span>{value(proposal.build_year_text)}</span></div>
            <div className="wide"><strong>Huidige situatie</strong><span>{value(proposal.current_situation)}</span></div>
          </div>
        </section>

        <section className="section">
          <div className="section-title navy"><span>3</span><strong>Wat is inbegrepen</strong></div>
          <div className="checks">
            {included.map((item) => <div key={item}>✓ {item}</div>)}
          </div>
        </section>

        <section className="notice">
          <strong>Uitgangspunten:</strong> {assumptions}
        </section>
      </article>

      <article className="page">
        <header className="doc-header small">
          <img src="/logo.png" alt="Vastgoed Direct Nederland" />
          <div>
            <strong>Vrijblijvend voorstel</strong>
            <span>Geldig tot: {formatDate(proposal.validity_date)}</span>
          </div>
        </header>

        <h1>Vergelijking en netto-opbrengst</h1>
        <p className="subtle">
          Gebruik dit overzicht om niet alleen het bod, maar vooral de netto-opbrengst en voorwaarden te vergelijken.
        </p>

        <section className="section">
          <div className="section-title orange"><span>4</span><strong>Netto-opbrengst vergelijken</strong></div>
          <div className="comparison">
            <div className="head">Onderdeel</div>
            <div className="head">Traditionele verkoop</div>
            <div className="head orange-head">Vastgoed Direct Nederland</div>

            <div><strong>Bod / verkoopprijs</strong></div>
            <div>{amount(proposal.traditional_price_text, "-")}</div>
            <div>{amount(proposal.amount_text)}</div>

            <div><strong>Makelaarskosten</strong></div>
            <div>{value(proposal.agent_costs_text, "-")}</div>
            <div>€ 0</div>

            <div><strong>Notariskosten levering</strong></div>
            <div>{value(proposal.notary_costs_text, "-")}</div>
            <div>Standaard voor onze rekening*</div>

            <div><strong>Herstel- of renovatiekosten</strong></div>
            <div>{value(proposal.renovation_costs_text, "-")}</div>
            <div>Niet noodzakelijk vooraf</div>

            <div><strong>Overige verkoopkosten</strong></div>
            <div>{value(proposal.other_costs_text, "-")}</div>
            <div>In overleg / niet standaard nodig</div>

            <div className="total"><strong>Verwachte netto-opbrengst</strong></div>
            <div className="total">{amount(proposal.traditional_net_text, "-")}</div>
            <div className="total accent">{amount(proposal.direct_net_text || proposal.amount_text)}</div>
          </div>
          <p className="footnote">* Eventuele afwijkende kosten of bijzondere afspraken worden vooraf besproken.</p>
        </section>

        <section className="section">
          <div className="section-title navy"><span>5</span><strong>Korte vergelijking</strong></div>
          <div className="mini-table">
            <div><strong>Bezichtigingen</strong><span>Vaak meerdere</span><em>Niet standaard nodig</em></div>
            <div><strong>Verkoopklaar maken</strong><span>Vaak gewenst</span><em>Niet noodzakelijk vooraf</em></div>
            <div><strong>Opleverdatum</strong><span>Afhankelijk van koper</span><em>In overleg bespreekbaar</em></div>
            <div><strong>Snelheid</strong><span>Kan weken/maanden duren</span><em>Snelle duidelijkheid mogelijk</em></div>
            <div><strong>Privacy</strong><span>Openbare presentatie</span><em>Vertrouwelijk traject</em></div>
          </div>
          {proposal.short_comparison_text ? <p className="notice">{proposal.short_comparison_text}</p> : null}
        </section>
      </article>

      <article className="page">
        <header className="doc-header small">
          <img src="/logo.png" alt="Vastgoed Direct Nederland" />
          <div>
            <strong>Vrijblijvend voorstel</strong>
            <span>Geldig tot: {formatDate(proposal.validity_date)}</span>
          </div>
        </header>

        <h1>Voorbehouden en vervolgstappen</h1>
        <p className="subtle">De exacte voorwaarden worden vooraf besproken en bij akkoord schriftelijk en notarieel vastgelegd.</p>

        <section className="section">
          <div className="section-title orange"><span>6</span><strong>Voorbehouden</strong></div>
          <div className="reservations">
            {reservations.map((item) => <div key={item}>☐ {item}</div>)}
          </div>
        </section>

        <section className="section">
          <div className="section-title navy"><span>7</span><strong>Vervolgstappen</strong></div>
          <ol className="steps">
            {nextSteps.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </section>

        <section className="section">
          <div className="section-title navy"><span>8</span><strong>Contact</strong></div>
          <div className="contact-grid">
            <div>
              <strong>Vastgoed Direct Nederland</strong>
              <span>info@vastgoeddirectnederland.nl</span>
              <span>06 12 23 80 51</span>
              <span>www.vastgoeddirectnederland.nl</span>
            </div>
            <div>
              <strong>Contactpersoon: {proposal.contact_person || "Rob Schiphuis"}</strong>
              <span>Datum: {formatDate(proposal.created_at)}</span>
              <span>Bespreeknotitie: ________________________________</span>
            </div>
          </div>
        </section>

        {proposal.notes ? (
          <section className="notice">
            <strong>Aanvullende opmerkingen:</strong> {proposal.notes}
          </section>
        ) : null}

        <section className="disclaimer">
          <strong>Belangrijk:</strong> aan dit document kunnen geen rechten worden ontleend. Dit document is bedoeld als vrijblijvend verkoopvoorstel en vormt geen koopovereenkomst. Definitieve afspraken komen uitsluitend tot stand na schriftelijke bevestiging en notariële vastlegging.
        </section>
      </article>
    </main>
  );
}

const styles = `
*{box-sizing:border-box}body{margin:0;background:#f5f2ec;color:#071f3a;font-family:Arial,Helvetica,sans-serif}.print-root{padding:24px}.print-actions{width:min(980px,100%);margin:0 auto 18px;text-align:right}.print-actions button{border:0;background:#D96A1C;color:#fff;border-radius:999px;padding:14px 22px;font-weight:900;cursor:pointer;box-shadow:0 12px 28px rgba(217,106,28,.20)}.page{width:min(980px,100%);min-height:1320px;margin:0 auto 24px;background:#fffdf9;border:1px solid #e8e3db;padding:44px;box-shadow:0 22px 70px rgba(7,31,58,.12);position:relative;overflow:hidden}.cover{display:flex;flex-direction:column;justify-content:space-between;background:radial-gradient(circle at 78% 62%,rgba(217,106,28,.14),transparent 28%),linear-gradient(135deg,#fffdf9 0%,#fff 54%,#f5f9ff 100%)}.cover:after{content:"";position:absolute;right:-260px;bottom:-260px;width:700px;height:700px;border-radius:50%;background:#071f3a;box-shadow:-26px -26px 0 #D96A1C;z-index:0}.mobile-curve{display:none}.cover-logo,.cover-content,.cover-footer{position:relative;z-index:1}.cover-logo{text-align:center}.cover-logo img{width:260px;height:auto}.eyebrow{display:inline-block;margin-top:80px;background:#FFF1E6;border:1px solid #F2B885;color:#B85216;border-radius:999px;padding:8px 12px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.cover h1{font-size:76px;line-height:.95;margin:22px 0;letter-spacing:-.06em;max-width:720px}.cover p{font-size:24px;line-height:1.35;color:#415168;max-width:520px}.cover-card{margin-top:36px;background:#fff;border:1px solid #e8e3db;border-radius:28px;padding:22px;width:min(520px,100%);box-shadow:0 18px 50px rgba(7,31,58,.12)}.cover-card strong,.cover-card span{display:block}.cover-card strong{font-size:21px;text-transform:uppercase}.cover-card span{margin-top:6px;font-size:32px;color:#D96A1C;font-weight:900}.cover-footer{display:flex;gap:26px;font-weight:900}.doc-header{display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid #e8e3db;padding-bottom:22px;margin-bottom:32px}.doc-header img{width:210px;background:#fff;border-radius:16px;padding:8px}.doc-header div{text-align:right}.doc-header strong{display:block;color:#D96A1C;font-size:19px}.doc-header span{display:block;color:#536273;margin-top:4px}.doc-header.small{padding-bottom:14px;margin-bottom:28px}.doc-header.small img{width:170px}h1{font-size:44px;line-height:1.06;letter-spacing:-.04em;margin:0 0 12px}.lead,.subtle,p,li{font-size:17px;line-height:1.55;color:#536273}.subtle{margin-top:0}.section{margin-top:28px}.section-title{display:grid;grid-template-columns:80px 1fr;align-items:center;color:#fff;text-transform:uppercase;font-weight:900;letter-spacing:.02em}.section-title span{text-align:center;padding:12px}.section-title strong{padding:12px;text-align:center}.section-title.orange{background:#D96A1C}.section-title.navy{background:#071f3a}.offer-grid{display:grid;grid-template-columns:.9fr 1.4fr;border:1px solid #e8e3db;border-top:0}.offer-amount{background:#FFF1E6;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px;text-align:center}.offer-amount span{font-weight:900}.offer-amount strong{font-size:44px;color:#D96A1C;margin-top:10px}.facts div,.table div{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #e8e3db}.facts div:last-child{border-bottom:0}.facts span,.facts strong,.table strong,.table span{padding:14px}.facts span,.table strong{font-weight:900}.facts strong,.table span{color:#536273}.table{border:1px solid #e8e3db;border-top:0}.table .wide{grid-column:1/-1}.checks{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #e8e3db;border-top:0}.checks div{padding:14px;border-right:1px solid #e8e3db;border-bottom:1px solid #e8e3db;font-weight:900}.checks div:nth-child(3n){border-right:0}.notice{background:#F7F2EC;border:1px solid #F2B885;border-radius:0;padding:14px 16px;color:#415168;line-height:1.55}.comparison{display:grid;grid-template-columns:1.15fr 1fr 1.15fr;border:1px solid #e8e3db;border-top:0}.comparison>div{padding:14px;border-right:1px solid #e8e3db;border-bottom:1px solid #e8e3db;color:#536273}.comparison .head{background:#071f3a;color:#fff;text-align:center;font-weight:900}.comparison .orange-head{background:#D96A1C}.comparison .total{background:#F7F2EC;font-weight:900;color:#071f3a}.comparison .accent{color:#D96A1C;font-size:20px}.footnote{font-size:13px;margin:8px 0 0}.mini-table{border:1px solid #e8e3db;border-top:0}.mini-table div{display:grid;grid-template-columns:1fr 1fr 1.2fr;border-bottom:1px solid #e8e3db}.mini-table div:last-child{border-bottom:0}.mini-table strong,.mini-table span,.mini-table em{padding:14px;font-style:normal}.mini-table strong{font-weight:900}.mini-table span{color:#536273}.mini-table em{color:#071f3a;font-weight:900}.reservations{display:grid;grid-template-columns:1fr 1fr;border:1px solid #e8e3db;border-top:0}.reservations div{padding:16px;border-right:1px solid #e8e3db;border-bottom:1px solid #e8e3db}.reservations div:nth-child(2n){border-right:0}.steps{counter-reset:step;list-style:none;margin:0;border:1px solid #e8e3db;border-top:0;padding:0}.steps li{position:relative;color:#071f3a;font-weight:900;padding:18px 18px 18px 74px;border-bottom:1px solid #e8e3db}.steps li:last-child{border-bottom:0}.steps li:before{counter-increment:step;content:counter(step);position:absolute;left:24px;color:#D96A1C;font-size:22px}.contact-grid{display:grid;grid-template-columns:1fr 1.55fr;border:1px solid #e8e3db;border-top:0}.contact-grid>div{padding:18px;border-right:1px solid #e8e3db}.contact-grid>div:last-child{border-right:0}.contact-grid span{display:block;color:#536273;margin-top:6px}.disclaimer{margin-top:28px;background:#F7F2EC;border:1px solid #F2B885;padding:16px;color:#415168;line-height:1.55}@media print{body{background:#fff}.print-root{padding:0}.print-actions{display:none}.page{width:100%;min-height:0;height:auto;margin:0;box-shadow:none;border:0;page-break-after:always;padding:28px}.page:last-child{page-break-after:auto}.cover{min-height:100vh}.cover h1{font-size:64px}.cover:after{display:block;opacity:.96}}@media(max-width:760px){body{background:#f5f2ec}.print-root{padding:10px}.print-actions{text-align:center;margin-bottom:10px}.print-actions button{width:100%;padding:12px 15px}.page{width:100%;min-height:auto;margin:0 auto 14px;padding:20px;border-radius:20px;box-shadow:0 12px 38px rgba(7,31,58,.10);overflow:hidden}.cover{min-height:auto;display:block;background:#fffdf9;padding:0}.cover:after{display:none}.mobile-curve{display:block;height:82px;margin:14px -20px 0;background:linear-gradient(135deg,#D96A1C 0 40%,#071f3a 41% 100%);border-radius:0 0 24px 24px}.cover-logo{padding:20px 16px 4px}.cover-logo img{width:min(250px,72vw)}.cover-content{padding:20px}.eyebrow{margin-top:0;font-size:10px;padding:7px 10px;letter-spacing:.07em}.cover h1{font-size:36px;line-height:1.01;letter-spacing:-.055em;margin:14px 0 10px;color:#071f3a;max-width:100%}.cover p{font-size:16px;line-height:1.4;color:#536273;max-width:100%;margin:0}.cover-card{margin-top:18px;border-radius:20px;padding:16px;width:100%;box-shadow:0 10px 28px rgba(7,31,58,.11)}.cover-card strong{font-size:17px}.cover-card span{font-size:32px}.cover-footer{padding:0 20px 22px;display:grid;gap:3px;font-size:13px}.doc-header{display:grid;gap:12px}.doc-header img{width:180px}.doc-header div{text-align:left}h1{font-size:34px}.offer-grid,.checks,.comparison,.mini-table div,.reservations,.contact-grid{grid-template-columns:1fr}.section-title{grid-template-columns:54px 1fr}.comparison .head{text-align:left}.comparison>div{border-right:0}.facts div,.table div{grid-template-columns:1fr}.offer-amount strong{font-size:36px}.checks div,.reservations div{border-right:0}.mini-table strong,.mini-table span,.mini-table em{padding:10px 12px}.steps li{padding-left:56px}.lead,.subtle,p,li{font-size:16px}}
`;
