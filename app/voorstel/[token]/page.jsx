import { notFound } from "next/navigation";
import { queryOne } from "../../lib/neonDb";
import { isUuid } from "../../lib/requestSecurity";
import ProposalDocument from "../../components/proposal/ProposalDocument";

export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export const dynamic = "force-dynamic";

export default async function PublicProposalPage({ params, searchParams }) {
  const { token } = await params;
  if (!isUuid(token)) notFound();

  const query = searchParams ? await searchParams : {};
  const isAdminPreview = query?.admin_preview === "1" || query?.preview === "admin";
  const proposal = await queryOne("select * from proposals where public_token = $1::uuid", [token]);

  if (!proposal) notFound();

  return <ProposalDocument proposal={proposal} variant="public" token={token} isAdminPreview={isAdminPreview} />;
}
