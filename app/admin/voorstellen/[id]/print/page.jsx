import { notFound } from "next/navigation";
import { queryOne } from "../../../../lib/neonDb";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("nl-NL", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

export default async function ProposalPrintPage({ params }) {
  const { id } = await params;
  const proposal = await queryOne("select * from proposals where id = $1", [id]);

  if (!proposal) notFound();

  return (
    <main className="print-page">
      <style>{styles}</style>
      <div className="print-actions"><PrintButton /></div>
      <article className="paper">
        <header>
          <img src="/logo.png" alt="Vastgoed Direct Nederland" />
          <div>
            <span>Vrijblijvend</span>
            <h1>Verkoopvoorstel</h1>
            <p>Vastgoed Direct Nederland</p>
          </div>
        </header>

        <p>Beste {proposal.lead_naam || "heer/mevrouw"},</p>
        <p>
          Naar aanleiding van uw aanvraag ontvangt u hierbij een helder en vrijblijvend verkoopvoorstel.
          Dit voorstel is bedoeld om snel duidelijkheid te geven over de mogelijke verkooproute,
          voorwaarden en vervolgstappen.
        </p>

        <section className="summary">
          <div><span>Woning</span><strong>{proposal.property_address || "-"}</strong></div>
          <div><span>Voorgesteld bedrag</span><strong>{proposal.amount_text || "In overleg"}</strong></div>
          <div><span>Geldig tot</span><strong>{formatDate(proposal.validity_date)}</strong></div>
          <div><span>Oplevering</span><strong>{proposal.transfer_date_text || "In overleg"}</strong></div>
        </section>

        <h2>Voorwaarden</h2>
        <p>{proposal.conditions_text || "Vrijblijvend voorstel onder voorbehoud van definitieve controle, akkoord van betrokken partijen en notariële vastlegging."}</p>

        <h2>Aanbetaling / voorschot</h2>
        <p>{proposal.deposit_text || "In overleg bespreekbaar."}</p>

        <h2>Vervolgstappen</h2>
        <ol>
          <li>U beoordeelt het voorstel rustig.</li>
          <li>Wij bespreken vragen, bijzonderheden en eventuele voorwaarden.</li>
          <li>Bij akkoord worden afspraken juridisch en notarieel vastgelegd.</li>
          <li>De overdracht vindt plaats via de notaris.</li>
        </ol>

        {proposal.notes ? <><h2>Aanvullende opmerkingen</h2><p>{proposal.notes}</p></> : null}

        <footer>
          <strong>Vastgoed Direct Nederland</strong><br />
          06 12 23 80 51 · info@verkoopjehuisdirect.nl · www.verkoopjehuisdirect.nl<br />
          Dit voorstel is vrijblijvend en onder voorbehoud van definitieve controle, akkoord van betrokken partijen en notariële vastlegging.
        </footer>
      </article>
    </main>
  );
}

const styles = `
body{margin:0;background:#f5f2ec;color:#071f3a;font-family:Arial,Helvetica,sans-serif}.print-page{padding:28px}.print-actions{width:min(930px,100%);margin:0 auto 18px;text-align:right}.print-actions button{border:0;background:#ff6a00;color:#fff;border-radius:999px;padding:14px 22px;font-weight:900;cursor:pointer}.paper{width:min(930px,100%);margin:0 auto;background:#fffdf9;border:1px solid #e8e3db;border-radius:32px;padding:48px;box-shadow:0 22px 70px rgba(7,31,58,.12)}header{display:flex;align-items:center;justify-content:space-between;gap:28px;border-bottom:1px solid #e8e3db;padding-bottom:28px;margin-bottom:32px}header img{width:230px;max-width:45%;height:auto;background:#fff;border-radius:18px;padding:10px}header span{display:inline-block;background:#fff3e7;border:1px solid #ffd5b6;color:#a64200;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}h1{margin:10px 0 6px;font-size:44px;line-height:1;letter-spacing:-.04em}h2{margin:32px 0 10px;font-size:24px}p,li,footer{font-size:17px;color:#536273;line-height:1.7}.summary{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin:30px 0}.summary div{background:#f8f5ef;border:1px solid #e8e3db;border-radius:20px;padding:18px}.summary span{display:block;color:#617184;font-weight:900;margin-bottom:8px}.summary strong{font-size:20px}footer{border-top:1px solid #e8e3db;margin-top:36px;padding-top:20px}@media print{body{background:#fff}.print-page{padding:0}.print-actions{display:none}.paper{width:100%;box-shadow:none;border:0;border-radius:0;padding:28px}}@media(max-width:720px){.paper{padding:28px}header,.summary{display:grid;grid-template-columns:1fr}header img{max-width:100%;width:220px}}
`;
