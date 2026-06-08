import { notFound } from "next/navigation";
import { query, queryOne } from "../../lib/neonDb";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("nl-NL", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}
function amount(value, fallback = "In overleg") {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  if (raw.includes("€")) return raw;
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return raw;
  return `€ ${new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 0 }).format(Number(digits))}`;
}
function value(value, fallback = "-") { return String(value || "").trim() || fallback; }
function lines(value, fallback = []) {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  return raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}
function formatAddress(proposal) {
  if (proposal.property_address) return String(proposal.property_address).trim().toUpperCase();
  return [proposal.property_postcode, proposal.property_house_number].filter(Boolean).join(" ").toUpperCase() || "-";
}

export default async function PublicProposalPage({ params }) {
  const { token } = await params;
  const proposal = await queryOne("select * from proposals where public_token = $1::uuid", [token]);
  if (!proposal) notFound();
  await query(
    `update proposals set public_viewed_at = now(), public_view_count = coalesce(public_view_count, 0) + 1, updated_at = now() where id = $1`,
    [proposal.id]
  );

  const included = lines(proposal.included_items, ["Heldere communicatie", "Geen makelaarskosten", "Geen openbare bezichtigingen nodig", "Notariële afwikkeling", "Verkoopoplossing op maat", "Vrijblijvend voorstel"]);
  const reservations = lines(proposal.reservations_text, ["Controle woninggegevens", "Controle eigendomssituatie", "Controle beschikbare documenten", "Notariële toetsing", "Akkoord op voorwaarden", "Geen bijzondere belemmeringen"]);
  const nextSteps = lines(proposal.next_steps_text, ["U beoordeelt het voorstel rustig.", "Wij bespreken vragen, bijzonderheden en eventuele voorwaarden.", "Bij akkoord worden afspraken juridisch en notarieel vastgelegd.", "De overdracht vindt plaats via de notaris."]);
  const assumptions = value(proposal.assumptions_text, "Dit voorstel is gebaseerd op de door u verstrekte gegevens, openbare woninginformatie en de huidige bekende staat van de woning.");

  return (
    <main className="proposal-page">
      <style>{styles}</style>
      <div className="topbar"><img src="/logo.png" alt="Vastgoed Direct Nederland" /><PrintButton /></div>
      <section className="hero"><span>Vrijblijvend verkoopvoorstel</span><h1>Uw voorstel staat klaar</h1><p>Bekijk hieronder het voorgestelde bedrag, de uitgangspunten, voorwaarden en vervolgstappen.</p><div className="offer-card"><strong>{formatAddress(proposal)}</strong><em>{amount(proposal.amount_text)}</em><small>Geldig tot: {formatDate(proposal.validity_date)}</small></div></section>
      <section className="card"><h2>Samenvatting</h2><div className="facts"><div><strong>Woning</strong><span>{formatAddress(proposal)}</span></div><div><strong>Voorgesteld bedrag</strong><span>{amount(proposal.amount_text)}</span></div><div><strong>Oplevering</strong><span>{value(proposal.transfer_date_text, "In overleg")}</span></div><div><strong>Aanbetaling / voorschot</strong><span>{value(proposal.deposit_text, "In overleg bespreekbaar")}</span></div></div></section>
      <section className="card"><h2>Uitgangspunten</h2><p>{assumptions}</p></section>
      <section className="card"><h2>Wat is inbegrepen</h2><div className="checks">{included.map((item) => <div key={item}>✓ {item}</div>)}</div></section>
      <section className="card"><h2>Netto-opbrengst vergelijken</h2><div className="comparison"><div className="head">Onderdeel</div><div className="head">Traditionele verkoop</div><div className="head orange">Vastgoed Direct Nederland</div><div>Bod / verkoopprijs</div><div>{amount(proposal.traditional_price_text, "-")}</div><div>{amount(proposal.amount_text)}</div><div>Makelaarskosten</div><div>{value(proposal.agent_costs_text, "-")}</div><div>€ 0</div><div>Herstel-/renovatiekosten</div><div>{value(proposal.renovation_costs_text, "-")}</div><div>Niet noodzakelijk vooraf</div><div className="total">Verwachte netto-opbrengst</div><div className="total">{amount(proposal.traditional_net_text, "-")}</div><div className="total accent">{amount(proposal.direct_net_text || proposal.amount_text)}</div></div></section>
      <section className="card"><h2>Voorbehouden</h2><div className="checks">{reservations.map((item) => <div key={item}>☐ {item}</div>)}</div></section>
      <section className="card"><h2>Vervolgstappen</h2><ol>{nextSteps.map((item) => <li key={item}>{item}</li>)}</ol></section>
      <section className="disclaimer"><strong>Belangrijk:</strong> dit voorstel is vrijblijvend en onder voorbehoud van definitieve controle, akkoord van betrokken partijen en notariële vastlegging. Aan dit document kunnen geen rechten worden ontleend.</section>
      <section className="contact"><strong>Vragen of voorstel bespreken?</strong><span>Bel of WhatsApp: 06 12 23 80 51</span><span>info@verkoopjehuisdirect.nl</span></section>
    </main>
  );
}

const styles = `
*{box-sizing:border-box}body{margin:0;background:#f5f2ec;color:#071f3a;font-family:Arial,Helvetica,sans-serif}.proposal-page{max-width:980px;margin:0 auto;padding:22px}.topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}.topbar img{width:230px;background:#fff;border-radius:18px;padding:10px}.topbar button{border:0;background:#ff6a00;color:#fff;border-radius:999px;padding:13px 18px;font-weight:900}.hero,.card,.contact,.disclaimer{background:#fffdf9;border:1px solid #e8e3db;border-radius:28px;padding:28px;margin-bottom:18px;box-shadow:0 18px 50px rgba(7,31,58,.10)}.hero{background:linear-gradient(135deg,#fffdf9 0,#fff 55%,#fff3e7 100%)}.hero span{display:inline-block;background:#fff3e7;border:1px solid #ffd5b6;color:#a64200;border-radius:999px;padding:8px 12px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}.hero h1{font-size:52px;letter-spacing:-.055em;line-height:1;margin:18px 0 10px}.hero p,p,li{font-size:17px;line-height:1.62;color:#536273}.offer-card{margin-top:22px;background:#fff;border:1px solid #e8e3db;border-radius:24px;padding:22px;box-shadow:0 12px 34px rgba(7,31,58,.10)}.offer-card strong,.offer-card em,.offer-card small{display:block}.offer-card strong{font-size:20px;text-transform:uppercase}.offer-card em{font-style:normal;color:#ff6a00;font-size:42px;font-weight:900;margin-top:6px}.offer-card small{color:#536273;margin-top:8px}h2{font-size:28px;margin:0 0 18px;letter-spacing:-.035em}.facts{display:grid;grid-template-columns:1fr 1fr;border:1px solid #e8e3db}.facts div{padding:16px;border-right:1px solid #e8e3db;border-bottom:1px solid #e8e3db}.facts div:nth-child(2n){border-right:0}.facts strong,.facts span{display:block}.facts span{color:#536273;margin-top:5px}.checks{display:grid;grid-template-columns:1fr 1fr;gap:10px}.checks div{background:#f8f5ef;border:1px solid #e8e3db;border-radius:16px;padding:14px;font-weight:900}.comparison{display:grid;grid-template-columns:1.2fr 1fr 1.15fr;border:1px solid #e8e3db}.comparison>div{padding:14px;border-right:1px solid #e8e3db;border-bottom:1px solid #e8e3db;color:#536273}.comparison .head{background:#071f3a;color:#fff;font-weight:900;text-align:center}.comparison .orange{background:#ff6a00}.comparison .total{background:#fff7ef;font-weight:900;color:#071f3a}.comparison .accent{color:#ff6a00}.contact{background:#071f3a;color:#fff}.contact strong,.contact span{display:block}.contact span{margin-top:6px;color:#d9e6f5}.disclaimer{background:#fff7ef;color:#415168;line-height:1.6}@media(max-width:760px){.proposal-page{padding:12px}.topbar{display:grid}.topbar img{width:220px}.topbar button{width:100%}.hero,.card,.contact,.disclaimer{padding:20px;border-radius:22px}.hero h1{font-size:38px}.offer-card em{font-size:34px}.facts,.checks,.comparison{grid-template-columns:1fr}.facts div,.comparison>div{border-right:0}.comparison .head{text-align:left}}@media print{body{background:#fff}.proposal-page{max-width:none;padding:0}.topbar button{display:none}.hero,.card,.contact,.disclaimer{box-shadow:none;page-break-inside:avoid}.topbar img{box-shadow:none}}
`;
