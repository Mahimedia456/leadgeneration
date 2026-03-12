import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  PlusCircle,
  MoreHorizontal,
  ArrowRight,
  AlertCircle,
  Filter,
} from "lucide-react";

const summaryStats = [
  { title: "Total Workspaces", value: "24", change: "~12%", tone: "blue" },
  { title: "Active", value: "18", change: "~5%", tone: "green" },
  { title: "Sync Issues", value: "02", change: "-10%", tone: "red" },
  { title: "Unassigned", value: "04", change: "Stable", tone: "slate" },
];

const workspacesData = [
  {
    id: "WS-1001",
    name: "Quantum Leap Labs",
    subtitle: "Global Production Hub",
    status: "Active",
    role: "Administrator",
    lastActivity: "2h ago",
    members: ["AR", "SM", "+12"],
    issue: "",
    logoText: "QL",
    heroTone: "from-blue-600/30 to-transparent",
    statusTone: "green",
  },
  {
    id: "WS-1002",
    name: "Aether Brands",
    subtitle: "Marketing & Creative",
    status: "Syncing",
    role: "Contributor",
    lastActivity: "14m ago",
    members: ["EC", "+5"],
    issue: "",
    logoText: "AB",
    heroTone: "from-indigo-600/20 to-transparent",
    statusTone: "blue",
  },
  {
    id: "WS-1003",
    name: "Vector Dynamics",
    subtitle: "Legacy R&D Archive",
    status: "Error",
    role: "Viewer Only",
    lastActivity: "3d ago",
    members: [],
    issue: "API Sync Failed",
    logoText: "VD",
    heroTone: "from-rose-600/20 to-transparent",
    statusTone: "red",
  },
  {
    id: "WS-1004",
    name: "Nexus Analytics",
    subtitle: "Data Science Unit",
    status: "Pending",
    role: "Analyst",
    lastActivity: "8h ago",
    members: ["AK"],
    issue: "",
    logoText: "NA",
    heroTone: "from-slate-600/20 to-transparent",
    statusTone: "slate",
  },
];

function statClasses(tone) {
  const map = {
    blue: "border-l-blue-600",
    green: "border-l-emerald-500",
    red: "border-l-rose-500",
    slate: "border-l-slate-500",
  };
  return map[tone] || map.blue;
}

function badgeClasses(tone) {
  const map = {
    green: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    blue: "border border-blue-500/20 bg-blue-500/10 text-blue-500",
    red: "border border-rose-500/20 bg-rose-500/10 text-rose-500",
    slate: "border border-slate-500/20 bg-slate-500/10 text-slate-400",
  };
  return map[tone] || map.blue;
}

export default function Workspaces() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filteredWorkspaces = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workspacesData;

    return workspacesData.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <AppShell>
      <div className="space-y-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Workspaces
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
              Central management hub for global brand assets and collaborative
              environments.
            </p>
          </div>

          <button
            onClick={() => navigate("/workspaces/create")}
            className="blue-gradient-btn flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-white shadow-xl"
          >
            <PlusCircle size={18} />
            Create New Workspace
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaryStats.map((item) => (
            <div
              key={item.title}
              className={`app-panel rounded-[1.5rem] border-l-4 p-6 ${statClasses(item.tone)}`}
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                {item.title}
              </p>
              <div className="mt-4 flex items-end gap-2">
                <span
                  className={`text-4xl font-black tracking-tight ${
                    item.tone === "red"
                      ? "text-rose-500"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {item.value}
                </span>
                <span
                  className={`pb-1 text-sm font-bold ${
                    item.tone === "green"
                      ? "text-emerald-500"
                      : item.tone === "blue"
                      ? "text-blue-500"
                      : "text-slate-500"
                  }`}
                >
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 xl:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name, role or owner..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="auth-minimal-input w-full rounded-2xl py-4 pl-12 pr-4 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="blue-gradient-btn rounded-2xl px-6 py-3 text-sm font-bold text-white">
              All
            </button>
            <button className="auth-outline-btn rounded-2xl px-5 py-3 text-sm font-semibold">
              Production
            </button>
            <button className="auth-outline-btn rounded-2xl px-5 py-3 text-sm font-semibold">
              Staging
            </button>
            <button className="auth-outline-btn rounded-2xl px-5 py-3 text-sm font-semibold">
              Archived
            </button>
            <button className="auth-outline-btn flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold">
              Status
              <Filter size={15} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredWorkspaces.map((workspace) => (
            <div
              key={workspace.id}
              className={`app-panel overflow-hidden rounded-[1.75rem] ${
                workspace.statusTone === "red" ? "border-rose-500/20" : ""
              }`}
            >
              <div
                className={`relative h-24 border-b border-slate-200/10 bg-gradient-to-r ${workspace.heroTone} p-6 dark:border-white/10`}
              >
                <div className="absolute -bottom-8 left-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-black text-slate-900 shadow-xl dark:border-white/10 dark:bg-[#111318] dark:text-white">
                  {workspace.logoText}
                </div>

                <span
                  className={`ml-auto inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${badgeClasses(
                    workspace.statusTone
                  )}`}
                >
                  {workspace.status}
                </span>
              </div>

              <div className="px-6 pb-6 pt-12">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <button
                      onClick={() => navigate(`/workspaces/${workspace.id}`)}
                      className="text-left text-2xl font-black tracking-tight text-slate-900 transition hover:text-blue-600 dark:text-white"
                    >
                      {workspace.name}
                    </button>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {workspace.subtitle}
                    </p>
                  </div>

                  <button className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/[0.04]">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200/60 bg-slate-50/40 p-4 dark:border-white/10 dark:bg-white/[0.02]">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      My Role
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                      {workspace.role}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/60 bg-slate-50/40 p-4 dark:border-white/10 dark:bg-white/[0.02]">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Last Activity
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                      {workspace.lastActivity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  {workspace.issue ? (
                    <div className="flex items-center gap-2 text-sm font-bold text-rose-500">
                      <AlertCircle size={16} />
                      {workspace.issue}
                    </div>
                  ) : (
                    <div className="flex -space-x-2">
                      {workspace.members.map((member) => (
                        <div
                          key={member}
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-black text-slate-700 dark:border-[#0f1115] dark:bg-[#1a1f2b] dark:text-slate-300"
                        >
                          {member}
                        </div>
                      ))}
                    </div>
                  )}

                  {workspace.issue ? (
                    <button className="rounded-xl bg-rose-500 px-5 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-rose-600">
                      Resolve
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/workspaces/${workspace.id}`)}
                      className="flex items-center gap-1 text-sm font-black text-blue-600 transition hover:translate-x-1 dark:text-blue-400"
                    >
                      Enter Workspace
                      <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => navigate("/workspaces/create")}
            className="flex min-h-[360px] flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-blue-500/30 bg-transparent p-8 transition hover:border-blue-500/60 hover:bg-blue-500/[0.03]"
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-blue-500/20 bg-slate-100 text-blue-600 dark:bg-white/[0.03] dark:text-blue-400">
              <PlusCircle size={28} />
            </div>
            <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Create New Workspace
            </p>
            <p className="mt-3 max-w-[220px] text-center text-base text-slate-500 dark:text-slate-400">
              Launch a new collaborative environment for your brand.
            </p>
          </button>
        </div>
      </div>
    </AppShell>
  );
}