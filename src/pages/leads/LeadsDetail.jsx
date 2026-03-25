import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  ArrowLeft,
  Download,
  Upload,
  Building2,
  BadgeCheck,
  Copy,
  Star,
} from "lucide-react";
import { getMetaLeadDetailApi } from "../../lib/metaApi";

function formatDate(value) {
  if (!value) return "--";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function buildLeadView(row) {
  const payload = row?.payload || {};
  const fullName =
    row?.full_name ||
    payload.full_name ||
    `${payload.first_name || ""} ${payload.last_name || ""}`.trim() ||
    "Unnamed Lead";

  return {
    id: row?.id || "",
    profileId: row?.meta_lead_id || "",
    name: fullName,
    priority: "Meta Lead",
    role: payload.job_title || payload.job || "Lead Form Submission",
    company: payload.company_name || payload.company || "Unknown Company",
    campaign: row?.meta_campaign_id || "Meta Campaign",
    segment: row?.meta_form_id || "Lead Form",
    email: row?.email || payload.email || "",
    phone: row?.phone || payload.phone_number || "",
    jobTitle: payload.job_title || payload.job_title_text || "Not provided",
    manager: "Unassigned",
    region: payload.city || payload.country || "Unknown Region",
    grade: 4,
    sourceChannel: "Meta Lead Ads",
    campaignName: row?.meta_campaign_id || "Meta Campaign",
    conversionPage: payload.page_name || payload.form_name || "Lead Form",
    utmMedium: payload.utm_medium || "meta",
    utmTerm: payload.utm_term || "",
    node: row?.meta_form_id || "",
    payload,
    createdTime: row?.created_time || row?.created_at || "",
  };
}

export default function LeadsDetail() {
  const navigate = useNavigate();
  const { leadId } = useParams();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([
    {
      author: "System",
      time: "Just now",
      text: "Lead detail loaded from Meta lead sync.",
    },
  ]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getMetaLeadDetailApi(leadId);
        if (!active) return;
        setLead(buildLeadView(data));
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [leadId]);

  const payloadRows = useMemo(() => {
    return Object.entries(lead?.payload || {}).map(([field, value]) => ({
      field,
      value: Array.isArray(value) ? value.join(", ") : String(value ?? ""),
      tone: String(value || "").toLowerCase().includes("urgent") ? "urgent" : "",
    }));
  }, [lead]);

  const handlePostNote = () => {
    const value = noteText.trim();
    if (!value) return;

    setNotes((prev) => [
      {
        author: "Workspace User",
        time: "Just now",
        text: value,
      },
      ...prev,
    ]);
    setNoteText("");
  };

  const handleDownloadJson = () => {
    if (!lead) return;

    const blob = new Blob([JSON.stringify(lead.payload || {}, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `lead-${lead.id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <AppShell>
        <div className="app-panel rounded-[2rem] p-8 text-sm text-slate-500 dark:text-slate-400">
          Loading lead detail...
        </div>
      </AppShell>
    );
  }

  if (!lead) {
    return (
      <AppShell>
        <div className="app-panel rounded-[2rem] p-8 text-sm text-slate-500 dark:text-slate-400">
          Lead not found.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <button
            onClick={() => navigate("/leads")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Leads
          </button>
        </div>

        <div className="app-panel overflow-hidden rounded-[2rem] p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl border border-slate-200 bg-slate-200 text-3xl font-black text-slate-600 shadow-xl dark:border-white/10 dark:bg-white/[0.06] dark:text-white">
                {(lead.name || "L").slice(0, 1).toUpperCase()}
              </div>

              <div>
                <div className="mb-2 flex items-center gap-4">
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                    {lead.name}
                  </h1>
                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">
                    {lead.priority}
                  </span>
                </div>

                <p className="mb-4 flex items-center gap-2 text-lg font-medium text-slate-500 dark:text-slate-400">
                  <Building2 size={18} className="text-blue-500" />
                  {lead.role}
                  <span className="text-slate-400">•</span>
                  {lead.company}
                </p>

                <div className="flex flex-wrap gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
                    {lead.profileId}
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
                    {lead.campaign}
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
                    {lead.segment}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full xl:w-56">
              <div className="flex flex-col gap-3">
                <button className="blue-gradient-btn w-full rounded-2xl py-3.5 text-sm font-black text-white">
                  Update Status
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadJson}
                    className="auth-outline-btn flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold"
                  >
                    <Download size={14} />
                    Download
                  </button>
                  <button className="auth-outline-btn flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold">
                    <Upload size={14} />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 dark:border-white/10">
          <div className="flex flex-wrap gap-10">
            <button className="border-b-2 border-blue-600 pb-5 text-sm font-black uppercase tracking-widest text-blue-600 dark:border-blue-400 dark:text-blue-400">
              General Information
            </button>
            <button className="pb-5 text-sm font-bold uppercase tracking-widest text-slate-500 transition hover:text-slate-800 dark:hover:text-slate-200">
              Engagement Stats
            </button>
            <button className="pb-5 text-sm font-bold uppercase tracking-widest text-slate-500 transition hover:text-slate-800 dark:hover:text-slate-200">
              Related Documents
            </button>
            <button className="pb-5 text-sm font-bold uppercase tracking-widest text-slate-500 transition hover:text-slate-800 dark:hover:text-slate-200">
              Security & Logs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 xl:grid-cols-3">
          <div className="space-y-10 xl:col-span-2">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <section className="space-y-5">
                <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Personal Information
                </h3>

                <div className="app-panel rounded-3xl p-6">
                  <div className="space-y-6">
                    <div>
                      <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Email Address
                      </p>
                      <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                        {lead.email || "--"}
                        {lead.email ? (
                          <button
                            onClick={() => navigator.clipboard.writeText(lead.email)}
                            className="text-blue-500"
                          >
                            <Copy size={14} />
                          </button>
                        ) : null}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Phone Number
                      </p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {lead.phone || "--"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Job Title
                      </p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {lead.jobTitle}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-5">
                <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Assignment Info
                </h3>

                <div className="app-panel rounded-3xl p-6">
                  <div className="space-y-6">
                    <div>
                      <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Account Manager
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full border border-slate-200 bg-slate-200 dark:border-white/10 dark:bg-white/[0.08]" />
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {lead.manager}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Region
                      </p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {lead.region}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Lead Grade
                      </p>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= lead.grade
                                ? "fill-blue-500 text-blue-500"
                                : "text-slate-300 dark:text-slate-700"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className="space-y-5">
              <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Campaign & Traffic Data
              </h3>

              <div className="app-panel rounded-[2rem] p-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Source Channel
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                        <BadgeCheck size={18} className="text-blue-500" />
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {lead.sourceChannel}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Campaign Name
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {lead.campaignName}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Conversion Page / Form
                    </p>
                    <p className="cursor-pointer text-sm font-bold text-blue-600 dark:text-blue-400">
                      {lead.conversionPage}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-8 dark:border-white/10">
                  <div className="flex flex-wrap gap-10">
                    <div>
                      <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        UTM Medium
                      </p>
                      <p className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-mono text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
                        {lead.utmMedium}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        UTM Term
                      </p>
                      <p className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-mono text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
                        {lead.utmTerm || "--"}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-widest italic text-slate-500">
                    Form ID: {lead.node || "--"}
                  </span>
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Submission Payloads
              </h3>

              <div className="app-panel overflow-hidden rounded-3xl">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/80 dark:border-white/10 dark:bg-white/[0.03]">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Parameter Field
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Value Metadata
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {payloadRows.map((row) => (
                      <tr
                        key={row.field}
                        className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                      >
                        <td className="px-8 py-5 font-bold text-slate-500">
                          {row.field}
                        </td>
                        <td className="px-8 py-5">
                          {row.tone === "urgent" ? (
                            <span className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-red-500">
                              {row.value}
                            </span>
                          ) : (
                            <span className="font-bold text-slate-900 dark:text-white">
                              {row.value}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {!payloadRows.length && (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-8 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                        >
                          No payload fields found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="space-y-10">
            <section className="space-y-5">
              <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Live Events
              </h3>

              <div className="app-panel rounded-3xl p-8">
                <div className="space-y-10">
                  {[
                    {
                      title: "Inbound Lead Created",
                      time: formatDate(lead.createdTime),
                      desc: "Lead was submitted from Meta lead ad form.",
                      tone: "blue",
                    },
                    {
                      title: "Payload Synced",
                      time: "Just now",
                      desc: "Lead payload saved into local workspace database.",
                      tone: "slate",
                    },
                    {
                      title: "Ready for Follow-up",
                      time: "Now",
                      desc: "Lead is available for export, review and routing.",
                      tone: "amber",
                    },
                  ].map((item, index) => (
                    <div key={item.title} className="flex gap-6">
                      <div className="relative mt-1">
                        <div
                          className={`h-5 w-5 rounded-full ${
                            item.tone === "blue"
                              ? "bg-blue-500"
                              : item.tone === "amber"
                              ? "bg-amber-500"
                              : "bg-slate-400 dark:bg-white/[0.12]"
                          }`}
                        />
                        {index !== 2 ? (
                          <div className="absolute left-1/2 top-5 h-16 w-[2px] -translate-x-1/2 bg-slate-200 dark:bg-white/10" />
                        ) : null}
                      </div>

                      <div className="flex-1">
                        <div className="mb-2 flex items-start justify-between">
                          <p
                            className={`text-sm font-black ${
                              item.tone === "amber"
                                ? "text-amber-500"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {item.title}
                          </p>
                          <span className="text-[10px] font-black uppercase text-slate-500">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-xs font-medium leading-relaxed text-slate-500">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-10 w-full rounded-xl border border-blue-500/20 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 transition hover:bg-blue-500/5 dark:text-blue-400">
                  View Full History
                </button>
              </div>
            </section>

            <section className="space-y-5">
              <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Internal Notes
              </h3>

              <div className="app-panel rounded-3xl p-6">
                <div className="mb-5">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="auth-minimal-input min-h-[140px] w-full resize-none rounded-2xl p-5 text-sm"
                    placeholder="Log sensitive data or internal feedback..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-3">
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-300 dark:border-[#0b0b0f] dark:bg-white/[0.08]" />
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-300 dark:border-[#0b0b0f] dark:bg-white/[0.08]" />
                  </div>

                  <button
                    onClick={handlePostNote}
                    className="rounded-xl bg-white px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-900 transition hover:bg-slate-200 dark:bg-white dark:text-black"
                  >
                    Post Note
                  </button>
                </div>

                <div className="mt-8 space-y-5">
                  {notes.map((note, idx) => (
                    <div
                      key={`${note.author}-${idx}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.03]"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-blue-600 dark:text-blue-400">
                          {note.author}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          {note.time}
                        </span>
                      </div>
                      <p className="text-xs italic leading-relaxed text-slate-600 dark:text-slate-300">
                        "{note.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}