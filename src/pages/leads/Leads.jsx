import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  Upload,
  UserPlus,
  Users,
  UserRoundPlus,
  ClipboardCheck,
  UserX,
  FileOutput,
  Calendar,
  Building2,
  Megaphone,
  MonitorSmartphone,
  Globe2,
  FilterX,
  CheckCircle2,
  UserCheck,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
} from "lucide-react";

const initialLeadStats = [
  {
    title: "Total Leads",
    value: "12,840",
    change: "+12%",
    icon: Users,
    tone: "blue",
  },
  {
    title: "New Today",
    value: "142",
    change: "+5.2%",
    icon: UserRoundPlus,
    tone: "emerald",
  },
  {
    title: "Assigned",
    value: "8,230",
    change: "64%",
    icon: ClipboardCheck,
    tone: "amber",
  },
  {
    title: "Unassigned",
    value: "4,610",
    change: "High",
    icon: UserX,
    tone: "rose",
  },
  {
    title: "Exported",
    value: "10,120",
    change: "78%",
    icon: FileOutput,
    tone: "indigo",
  },
];

const initialLeads = [
  {
    id: "LD-1001",
    name: "Sarah Jenkins",
    email: "sarah.j@techflow.io",
    phone: "+1 (555) 234-8891",
    campaign: "Winter Cloud Promo",
    sourceKey: "cloud-v2",
    platform: "Meta Ads",
    regionTag: "NA",
    region: "USA (NY)",
    time: "14:23 PM",
    date: "Oct 24, 2023",
    owner: "Marcus K.",
    ownerStatus: "online",
    status: "Exported",
    selected: true,
  },
  {
    id: "LD-1002",
    name: "David Chen",
    email: "dchen@vertex-global.com",
    phone: "+65 9212 4332",
    campaign: "Enterprise SEO Q4",
    sourceKey: "audit-tool",
    platform: "Google Search",
    regionTag: "APAC",
    region: "Singapore",
    time: "12:05 PM",
    date: "Oct 24, 2023",
    owner: "Unassigned",
    ownerStatus: "empty",
    status: "Pending",
    selected: false,
  },
  {
    id: "LD-1003",
    name: "Elena Rodriguez",
    email: "elena.r@madrid-digital.es",
    phone: "+34 91 123 45 67",
    campaign: "SaaS Integration",
    sourceKey: "demo-request",
    platform: "LinkedIn Ads",
    regionTag: "EU",
    region: "Spain (MD)",
    time: "11:15 AM",
    date: "Oct 24, 2023",
    owner: "Sophie L.",
    ownerStatus: "busy",
    status: "Synced",
    selected: true,
  },
];

function statToneClasses(tone) {
  const map = {
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    rose: "bg-rose-500/10 text-rose-500",
    indigo: "bg-indigo-500/10 text-indigo-500",
  };
  return map[tone] || map.blue;
}

function leadStatusClasses(status) {
  if (status === "Exported") {
    return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  }
  if (status === "Pending") {
    return "border border-amber-500/20 bg-amber-500/10 text-amber-500";
  }
  if (status === "Synced") {
    return "border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500";
  }
  return "border border-blue-500/20 bg-blue-500/10 text-blue-500";
}

function selectClasses(active) {
  return active
    ? "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
    : "border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300";
}

export default function Leads() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [leads, setLeads] = useState(initialLeads);
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;

    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.id.toLowerCase().includes(q) ||
        lead.platform.toLowerCase().includes(q) ||
        lead.campaign.toLowerCase().includes(q)
    );
  }, [query, leads]);

  const selectedCount = filteredLeads.filter((lead) => lead.selected).length;

  const toggleLead = (leadId) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, selected: !lead.selected } : lead
      )
    );
  };

  const handleRemove = (leadId, leadName) => {
    const ok = window.confirm(`Remove "${leadName}"?`);
    if (!ok) return;
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
    setOpenMenuId(null);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Leads
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Real-time management of inbound multi-channel leads.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/lead-exports")}
              className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
            >
              <Upload size={16} />
              Export
            </button>

            <button className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white">
              <UserPlus size={16} />
              Manual Add
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
          {initialLeadStats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="metric-card app-panel-glow">
                <div className="mb-6 flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${statToneClasses(
                      item.tone
                    )}`}
                  >
                    <Icon size={20} />
                  </div>

                  <span
                    className={`rounded-lg px-3 py-1 text-xs font-bold ${statToneClasses(
                      item.tone
                    )}`}
                  >
                    {item.change}
                  </span>
                </div>

                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  {item.title}
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="app-panel p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6">
            <div className="xl:col-span-6">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search leads by name, email, or ID..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                />
              </div>
            </div>

            <button
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold ${selectClasses(
                false
              )}`}
            >
              <Calendar size={14} />
              Last 30 Days
            </button>

            <button
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold ${selectClasses(
                false
              )}`}
            >
              <Building2 size={14} />
              All Brands
            </button>

            <button
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold ${selectClasses(
                false
              )}`}
            >
              <Megaphone size={14} />
              All Campaigns
            </button>

            <button
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold ${selectClasses(
                false
              )}`}
            >
              <MonitorSmartphone size={14} />
              All Platforms
            </button>

            <button
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold ${selectClasses(
                false
              )}`}
            >
              <Globe2 size={14} />
              Global
            </button>

            <button className="auth-outline-btn flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-[0.14em]">
              <FilterX size={14} />
              Reset
            </button>
          </div>
        </div>

        <div className="app-panel overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 dark:border-white/10 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
                <CheckCircle2 size={14} />
                {selectedCount} Selected
              </div>

              <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500 transition hover:text-blue-600 dark:hover:text-blue-400">
                <UserCheck size={16} />
                Assign
              </button>

              <button
                onClick={() => navigate("/lead-exports")}
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500 transition hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Upload size={16} />
                Export
              </button>

              <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-rose-500 transition hover:text-rose-600">
                <Trash2 size={16} />
                Remove
              </button>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
              Showing 1-15 of 12,840
              <div className="flex gap-2">
                <button className="auth-outline-btn flex h-8 w-8 items-center justify-center rounded-lg">
                  <ChevronLeft size={14} />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                  1
                </button>
                <button className="auth-outline-btn flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold">
                  2
                </button>
                <button className="auth-outline-btn flex h-8 w-8 items-center justify-center rounded-lg">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1280px] text-left">
              <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                <tr>
                  <th className="px-8 py-5">
                    <input type="checkbox" className="h-4 w-4 rounded" />
                  </th>
                  <th className="px-4 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Lead Details
                  </th>
                  <th className="px-4 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Source & Campaign
                  </th>
                  <th className="px-4 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Region
                  </th>
                  <th className="px-4 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Timestamp
                  </th>
                  <th className="px-4 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Ownership
                  </th>
                  <th className="px-4 py-5 text-center text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Status
                  </th>
                  <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filteredLeads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-8 py-5">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded"
                        checked={lead.selected}
                        onChange={() => toggleLead(lead.id)}
                      />
                    </td>

                    <td className="px-4 py-5">
                      <div className="flex flex-col">
                        <button
                          onClick={() => navigate(`/leads/${lead.id}`)}
                          className="text-left text-sm font-bold text-slate-900 transition hover:text-blue-600 dark:text-white"
                        >
                          {lead.name}
                        </button>
                        <span className="mt-0.5 text-xs text-slate-500">
                          {lead.email}
                        </span>
                        <span className="mt-1 text-[10px] font-medium tracking-wide text-slate-500">
                          {lead.phone}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              index === 0
                                ? "bg-blue-500"
                                : index === 1
                                ? "bg-blue-500"
                                : "bg-purple-500"
                            }`}
                          />
                          <span className="text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                            {lead.campaign}
                          </span>
                        </div>

                        <span className="text-[10px] font-medium text-slate-500">
                          {lead.sourceKey}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {lead.platform}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-tight text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                          {lead.regionTag}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {lead.region}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {lead.time}
                        </span>
                        <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          {lead.date}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-5">
                      {lead.ownerStatus === "empty" ? (
                        <div className="flex items-center gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-slate-300 bg-slate-50 text-[10px] font-bold text-slate-400 dark:border-white/10 dark:bg-white/[0.03]">
                            ?
                          </div>
                          <span className="text-xs italic text-slate-500">
                            Unassigned
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="h-7 w-7 rounded-full border border-slate-200 bg-slate-200 dark:border-white/10 dark:bg-white/[0.08]" />
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-[#0b0b0f] ${
                                lead.ownerStatus === "online"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {lead.owner}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-5 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.1em] ${leadStatusClasses(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="relative px-8 py-5 text-right">
                      <button
                        onClick={() =>
                          setOpenMenuId((prev) => (prev === lead.id ? null : lead.id))
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/5"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openMenuId === lead.id && (
                        <div className="absolute right-8 top-[56px] z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#111111]">
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              navigate(`/leads/${lead.id}`);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                          >
                            <Eye size={16} />
                            View Detail
                          </button>

                          <button
                            onClick={() => handleRemove(lead.id, lead.name)}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-8 py-5 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Items per page
              </span>
              <select className="auth-minimal-input rounded-lg px-3 py-2 text-xs font-bold">
                <option>15</option>
                <option>50</option>
              </select>
            </div>

            <div className="flex items-center gap-6">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                Page 1 / 856
              </p>

              <div className="flex gap-3">
                <button className="auth-outline-btn rounded-lg px-5 py-2 text-[10px] font-black uppercase tracking-widest">
                  Previous
                </button>
                <button className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}