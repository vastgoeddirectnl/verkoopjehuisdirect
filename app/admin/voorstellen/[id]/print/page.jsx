"use client";
import { useEffect, useState } from "react";

export default function ProposalPrintPage({ params }) {
  const [proposal, setProposal] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/v2?action=proposal&id=${params.id}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setError(json.error || "Voorstel ophalen mislukt.");
      setProposal(json.proposal);
    }
    load();
  }, [params.id]);

  if (error) return <main><style jsx global>{styles}</style><article className="paper"><h1>Fout</h1><p>{error}</p></article></main>;
  if (!proposal) return <main><style jsx global>{styles}</style><article className="paper"><p>Laden...</p></article></main>;

  return (
    <main className="print">
      <style jsx global>{styles}</style>
      <div className="printbtn"><button onClick={() => window.print()}>Opslaan als PDF / printen</button></div>
      <article className="paper">
        <header><img src="/logo.png" alt="Vastgoed Direct Nederland"/><div><h1>Vrijblijvend verkoopvoorstel</h1><p>Vastgoed Direct Nederland</p></div></header>
        <p>Beste {proposal.lead_naam || "heer/mevrouw"},</p>
        <p>Naar aanleiding van uw aanvraag ontvangt u hierbij een vrijblijvend verkoopvoorstel. Dit voorstel geeft duidelijkheid over de mogelijke verkooproute, voorwaarden en vervolgstappen.</p>
        <section className="summary"><div><span>Woning</span><strong>{proposal.property_address || "-"}</strong></div><div><span>Voorgesteld bedrag</span><strong>{proposal.amount_text || "-"}</strong></div><div><span>Geldig tot</span><strong>{proposal.validity_date || "-"}</strong></div><div><span>Oplevering</span><strong>{proposal.transfer_date_text || "In overleg"}</strong></div></section>
        <h2>Voorwaarden</h2><p>{proposal.conditions_text || "-"}</p>
        <h2>Aanbetaling / voorschot</h2><p>{proposal.deposit_text || "In overleg bespreekbaar."}</p>
        <h2>Vervolgstappen</h2><ol><li>U beoordeelt het voorstel rustig.</li><li>Wij bespreken vragen en bijzonderheden.</li><li>Bij akkoord worden afspraken juridisch en notarieel vastgelegd.</li><li>De overdracht vindt plaats via de notaris.</li></ol>
        {proposal.notes ? <><h2>Aanvullende opmerkingen</h2><p>{proposal.notes}</p></> : null}
        <footer>Dit voorstel is vrijblijvend en onder voorbehoud van definitieve controle, akkoord van betrokken partijen en notariële vastlegging.<br/>Vastgoed Direct Nederland · 06 12 23 80 51 · info@verkoopjehuisdirect.nl</footer>
      </article>
    </main>
  );
}

const styles = `
body{margin:0;background:#f7f5f0;color:#0a2540;font-family:Arial,Helvetica,sans-serif}.print{padding:28px}.printbtn{width:min(900px,100%);margin:0 auto 18px;text-align:right}.printbtn button{border:none;background:#ff6a00;color:#fff;border-radius:999px;padding:14px 22px;font-weight:900}.paper{width:min(900px,100%);margin:0 auto;background:#fff;border-radius:28px;padding:46px;box-shadow:0 20px 60px rgba(10,37,64,.12)}header{display:flex;justify-content:space-between;gap:28px;align-items:center;border-bottom:1px solid #e6e2db;padding-bottom:24px;margin-bottom:28px}header img{width:220px;max-width:40%;height:auto}h1{margin:0;font-size:38px;line-height:1.05}h2{margin:30px 0 8px;font-size:24px}p,li,footer{color:#536273;line-height:1.7;font-size:17px}.summary{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin:28px 0}.summary div{background:#f7f5f0;border-radius:18px;padding:18px}.summary span{display:block;color:#647386;font-weight:800;margin-bottom:6px}.summary strong{font-size:20px}footer{margin-top:36px;border-top:1px solid #e6e2db;padding-top:18px}@media print{body{background:#fff}.print{padding:0}.printbtn{display:none}.paper{box-shadow:none;border-radius:0;width:100%;padding:28px}}
`;
