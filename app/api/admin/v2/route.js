import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../lib/adminAuth";
import { reportError } from "../../../lib/reportError.js";
import * as reads from "../../../lib/admin/api/reads";
import * as leadActions from "../../../lib/admin/api/leadActions";
import * as proposalActions from "../../../lib/admin/api/proposalActions";

export const runtime = "nodejs";
// De bulk-automatisering verwerkt leads in blokken; geef die ruimte.
export const maxDuration = 60;

// ARCH-07: deze route doet alleen nog de toegangscontrole en verdeelt de
// acties. De acties zelf staan in app/lib/admin/api/. Een actie die hier niet
// staat bestaat niet — er is geen dynamische lookup op de actienaam.
const GET_ACTIONS = {
  leads: reads.leads,
  lead: reads.lead,
  tasks: reads.tasks,
  proposals: reads.proposals,
  proposal: reads.proposal,
  mailLogs: reads.mailLogs,
  report: reads.report,
  overview: reads.report,
};

const POST_ACTIONS = {
  updateLead: leadActions.updateLead,
  createTask: leadActions.createTask,
  updateTask: leadActions.updateTask,
  resolveCustomerAction: leadActions.resolveCustomerAction,
  runAutomation: leadActions.runAutomation,
  createProposal: proposalActions.createProposal,
  updateProposal: proposalActions.updateProposal,
  updateProposalStatus: proposalActions.updateProposalStatus,
  cloneProposalVersion: proposalActions.cloneProposalVersion,
  recordProposalWhatsapp: proposalActions.recordProposalWhatsapp,
  sendProposalEmail: proposalActions.sendProposalEmail,
};

async function requireAdmin() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }
  return null;
}

export async function GET(request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "overview";
  const handler = Object.prototype.hasOwnProperty.call(GET_ACTIONS, action) ? GET_ACTIONS[action] : null;
  if (!handler) return NextResponse.json({ error: "Onbekende actie." }, { status: 400 });

  try {
    return await handler({ searchParams, request });
  } catch (error) {
    await reportError({ scope: `admin/v2 GET ${action}`, error, severity: "critical" });
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  let action = "onbekend";
  try {
    const body = await request.json();
    action = String(body?.action || "");
    const handler = Object.prototype.hasOwnProperty.call(POST_ACTIONS, action) ? POST_ACTIONS[action] : null;
    if (!handler) return NextResponse.json({ error: "Onbekende actie." }, { status: 400 });
    return await handler({ body, request });
  } catch (error) {
    await reportError({ scope: `admin/v2 POST ${action}`, error, severity: "critical" });
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}
