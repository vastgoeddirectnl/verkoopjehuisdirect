import { notFound } from "next/navigation";
import { queryOne } from "../../../../lib/neonDb";
import { isAdminAuthenticated } from "../../../../lib/adminAuth";
import ProposalDocument from "../../../../components/proposal/ProposalDocument";

export const dynamic = "force-dynamic";

export default async function ProposalPrintPage({ params }) {
  // Deze pagina rendert klantgegevens server-side. Zonder geldige adminsessie
  // geven we 404 in plaats van 401, zodat niet te achterhalen is of de id bestaat.
  if (!(await isAdminAuthenticated())) notFound();

  const { id } = await params;
  const proposal = await queryOne("select * from proposals where id = $1", [id]);

  if (!proposal) notFound();

  return <ProposalDocument proposal={proposal} variant="print" />;
}
