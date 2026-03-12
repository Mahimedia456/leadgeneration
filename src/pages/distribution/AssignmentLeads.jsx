import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  Upload,
  Plus,
  Users,
  UserPlus,
  MessageSquare,
  RotateCcw,
  ChevronDown,
  SlidersHorizontal,
  CheckCircle2,
  FilePlus2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const stats = [
  {
    title: "My Assigned Leads",
    value: "128",
    change: "~+5%",
    icon: Users,
    tone: "blue",
  },
  {
    title: "New Today",
    value: "12",
    change: "~+2%",
    icon: UserPlus,
    tone: "emerald",
  },
  {
    title: "Contacted",
    value: "84",
    change: "~1%",
    icon: MessageSquare,
    tone: "rose",
  },
  {
    title: "Pending Follow-up",
    value: "32",
    change: "~8%",
    icon: RotateCcw,
    tone: "emerald",
  },
];

const initialLeads = [
  {
    id: "AL-001",
    initials: "JD",
    name: "John Doe",
    company: "Acme Corporation",
    role: "CEO",
    status: "New Lead",
    priority: "High",
    interactionAgo: "2 hours ago",
    interactionType: "Email Received",
    completed: false,
  },
  {
    id: "AL-002",
    initials: "SM",
    name: "Sarah Miller",
    company: "Starlight Tech",
    role: "VP Ops",
    status: "Follow-up",
    priority: "Medium",
    interactionAgo: "Yesterday",
    interactionType: "Discovery Call",
    completed: false,
  },
  {
    id: "AL-003",
    initials: "RK",
    name: "Robert King",
    company: "Nexus Logistics",
    role: "Manager",
    status: "Contacted",
    priority: "Low",
    interactionAgo: "3 days ago",
    interactionType: "LinkedIn Message",
    completed: true,
  },
];

function statToneClasses(tone) {
  const map = {
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    rose: "bg-rose-500/10 text-rose-500",
  };
  return map[tone] || map.blue;
}

function statusClasses(status) {
  if (status === "New Lead") {
    return "border border-blue-500/20 bg-blue-500/10 text-blue-500";
  }
  if (status === "Follow-up") {
    return "border border-amber-500/20 bg-amber-500/10 text-amber-500";
  }
  if (status === "Contacted") {
    return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  }
  return "border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500";
}

function priorityClasses(priority) {
  if (priority === "High") return "text-rose-500";
  if (priority === "Medium") return "text-amber-500";
  return "text-slate-400";
}

export default function AssignmentLeads() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [leads, setLeads] = useState(initialLeads);

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;

    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q) ||
        lead.role.toLowerCase().includes(q) ||
        lead.status.toLowerCase().includes(q)
    );
  }, [query, leads]);

  const toggleComplete = (id) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, completed: !lead.completed } : lead
      )
    );
  };

  return (
    <AppShell>
      <div className="space-y-10">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Assigned Leads
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Manage and track your active sales prospects efficiently.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <Upload size={16} />
              Export
            </button>

            <button className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white">
              <Plus size={16} />
              New Lead
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="metric-card app-panel-glow">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-slate-400">{item.title}</p>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${statToneClasses(
                      item.tone
                    )}`}
                  >
                    <Icon size={18} />
                  </div>
                </div>

                <div className="flex items-end gap-3">
                  <p className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                  <span
                    className={`mb-1 rounded-lg px-2.5 py-1 text-xs font-bold ${statToneClasses(
                      item.tone
                    )}`}
                  >
                    {item.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="app-panel overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-5 dark:border-white/10">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  All Leads
                  <ChevronDown size={16} />
                </button>

                <button className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/[0.03]">
                  Status
                  <ChevronDown size={16} />
                </button>

                <button className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/[0.03]">
                  Priority
                  <ChevronDown size={16} />
                </button>

                <button className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/[0.03]">
                  More
                  <SlidersHorizontal size={16} />
                </button>
              </div>

              <div className="relative w-full xl:w-[260px]">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                <tr>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Lead Information
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Priority
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Last Interaction
                  </th>
                  <th className="px-6 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Quick Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-black ${
                            lead.initials === "JD"
                              ? "bg-blue-500/10 text-blue-500"
                              : lead.initials === "SM"
                              ? "bg-slate-500/10 text-slate-500"
                              : "bg-emerald-500/10 text-emerald-500"
                          }`}
                        >
                          {lead.initials}
                        </div>

                        <div>
                          <button
                            onClick={() => navigate("/distribution")}
                            className="text-left text-2 font-bold text-slate-900 transition hover:text-blue-600 dark:text-white"
                          >
                            {lead.name}
                          </button>
                          <p className="mt-1 text-sm text-slate-500">
                            {lead.company} • {lead.role}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black ${statusClasses(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="px-6 py-6">
                      <span className={`text-sm font-bold ${priorityClasses(lead.priority)}`}>
                        {lead.priority === "High"
                          ? "!  High"
                          : lead.priority === "Medium"
                          ? "—  Medium"
                          : "⌄  Low"}
                      </span>
                    </td>

                    <td className="px-6 py-6">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {lead.interactionAgo}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {lead.interactionType}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => toggleComplete(lead.id)}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                            lead.completed
                              ? "bg-blue-600 text-white"
                              : "text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.03]"
                          }`}
                        >
                          <CheckCircle2 size={18} />
                        </button>

                        <button className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/[0.03]">
                          <FilePlus2 size={18} />
                        </button>

                        <button className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/[0.03]">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-500 dark:text-slate-400">
              Showing 1 to 3 of 128 leads
            </p>

            <div className="flex items-center gap-3">
              <button className="auth-outline-btn flex items-center justify-center rounded-xl px-5 py-2.5">
                <ChevronLeft size={16} />
                <span className="ml-2">Previous</span>
              </button>

              <button className="auth-outline-btn flex items-center justify-center rounded-xl px-5 py-2.5">
                <span className="mr-2">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}