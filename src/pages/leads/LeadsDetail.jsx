import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  ArrowLeft,
  Bell,
  Download,
  Upload,
  Building2,
  BadgeCheck,
  CalendarDays,
  Copy,
  Star,
} from "lucide-react";

const leadData = [
  {
    id: "LD-1001",
    profileId: "#88291",
    name: "Jonathan Vance",
    priority: "High Priority",
    role: "Senior Decision Maker",
    company: "TechCorp Solutions",
    campaign: "Google Search Campaign",
    segment: "Q4 Target",
    email: "j.vance@techcorp.com",
    phone: "+1 (555) 902-8821",
    jobTitle: "VP of Operations",
    manager: "Sarah Miller",
    region: "North America (West)",
    grade: 4,
    sourceChannel: "Google Ads",
    campaignName: "Enterprise_Cloud_2023_Q4",
    conversionPage: "/solutions/enterprise-cloud",
    utmMedium: "cpc",
    utmTerm: "enterprise-crm-software",
    node: "192.168.1.45",
  },
];

const payloadRows = [
  { field: "Employee Count", value: "500 - 1,000" },
  { field: "Current CRM", value: "Legacy In-house System" },
  { field: "Urgency Level", value: "Immediate", tone: "urgent" },
  {
    field: "Primary Goal",
    value: "Workflow automation and cross-departmental reporting",
  },
];

const notesSeed = [
  {
    author: "Sarah Miller",
    time: "Yesterday, 4:12 PM",
    text: "Client mentioned they are looking to migrate within 3 months. Needs a demo scheduled for next week.",
  },
];

export default function LeadsDetail() {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const lead = useMemo(
    () => leadData.find((item) => item.id === leadId) || leadData[0],
    [leadId]
  );

  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState(notesSeed);

  const handlePostNote = () => {
    const value = noteText.trim();
    if (!value) return;

    setNotes((prev) => [
      {
        author: "Alexander Chen",
        time: "Just now",
        text: value,
      },
      ...prev,
    ]);
    setNoteText("");
  };

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
              <div className="h-32 w-32 rounded-3xl border border-slate-200 bg-slate-200 shadow-xl dark:border-white/10 dark:bg-white/[0.06]" />

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
                  <button className="auth-outline-btn flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold">
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
                        {lead.email}
                        <button className="text-blue-500">
                          <Copy size={14} />
                        </button>
                      </p>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Phone Number
                      </p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {lead.phone}
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
                      Conversion Page
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
                        {lead.utmTerm}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-widest italic text-slate-500">
                    Node: {lead.node}
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
                      time: "2h ago",
                      desc: "Form submitted via Landing Page A.",
                      tone: "blue",
                    },
                    {
                      title: "Email Sent",
                      time: "1h ago",
                      desc: `Auto-responder: "Welcome to TechCorp" sent.`,
                      tone: "slate",
                    },
                    {
                      title: "Status Escalated",
                      time: "45m ago",
                      desc: `Lead marked "High Priority" by AI Engine.`,
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