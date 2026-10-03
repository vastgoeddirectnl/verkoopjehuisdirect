import { notFound } from "next/navigation";
import { queryOne } from "../../lib/neonDb";
import { isUuid } from "../../lib/requestSecurity";
import { isAdminAuthenticated } from "../../lib/adminAuth";
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
  // Alleen een ingelogde admin krijgt de preview (geen weergaveteller, wel de
  // interne controlemeldingen). Voorheen kon iedereen met de link
  // ?admin_preview=1 toevoegen en zo de weergavetelling uitzetten.
  const wantsPreview = query?.admin_preview === "1" || query?.preview === "admin";
  const isAdminPreview = wantsPreview ? await isAdminAuthenticated() : false;
  const proposal = await queryOne("select * from proposals where public_token = $1::uuid", [token]);

  if (!proposal) notFound();

  return <ProposalDocument proposal={proposal} variant="public" token={token} isAdminPreview={isAdminPreview} />;
}
