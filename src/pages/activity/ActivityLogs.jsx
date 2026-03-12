import { useMemo, useState } from "react";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  Bell,
  HelpCircle,
  Download,
  CalendarDays,
  ChevronDown,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Gauge,
} from "lucide-react";

const rows = [
  {
    id: 1,
    timestamp: "Oct 24, 2023 14:23:01",
    initials: "JD",
    actor: "Jane Doe",
    email: "jane.doe@enterprise.com",
    action: "User Login Success",
    resource: "Authentication Service",
    status: "Success",
    ip: "192.168.1.105",
  },
  {
    id: 2,
    timestamp: "Oct 24, 2023 14:18:44",
    initials: "SK",
    actor: "Sarah King",
    email: "s.king@internal.net",
    action: "Data Export (JSON)",
    resource: "Financial_Records_Q3",
    status: "Notice",
    ip: "45.22.112.9",
  },
  {
    id: 3,
    timestamp: "Oct 24, 2023 13:55:12",
    initials: "MA",
    actor: "Mark Adams",
    email: "system-bot@service.io",
    action: "Failed Login Attempt",
    resource: "Admin Panel Access",
    status: "Critical",
    ip: "201.55.88.10",
  },
  {
    id: 4,
    timestamp: "Oct 24, 2023 13:42:01",
    initials: "TC",
    actor: "Tom Chen",
    email: "t.chen@enterprise.com",
    action: "Policy Update",
    resource: "Firewall Ruleset #42",
    status: "Warning",
    ip: "10.0.4.22",
  },
  {
    id: 5,
    timestamp: "Oct 24, 2023 13:30:59",
    initials: "AR",
    actor: "Alex Rivera",
    email: "alex.rivera@enterprise.com",
    action: "API Key Rotated",
    resource: "Security Module",
    status: "Success",
    ip: "192.168.1.1",
  },
];

function statusClass(status) {
  if (status === "Success") {
    return "bg-emerald-500/10 text-emerald-500";
  }
  if (status === "Notice") {
    return "bg-blue-500/10 text-blue-500";
  }
  if (status === "Critical") {
    return "bg-rose-500/10 text-rose-500";
  }
  if (status === "Warning") {
    return "bg-amber-500/10 text-amber-500";
  }
  return "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400";
}

function initialsClass(initials) {
  const map = {
    JD: "bg-blue-500/10 text-blue-500",
    SK: "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400",
    MA: "bg-rose-500/10 text-rose-500",
    TC: "bg-amber-500/10 text-amber-500",
    AR: "bg-blue-500/10 text-blue-500",
  };
  return map[initials] || "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400";
}

export default function ActivityLogs() {
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter(
      (row) =>
        row.actor.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.action.toLowerCase().includes(q) ||
        row.resource.toLowerCase().includes(q) ||
        row.ip.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
              Audit Center
            </p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
              Activity Logs
            </h1>
            <p className="max-w-3xl text-slate-500 dark:text-slate-400">
              Detailed audit trail monitoring for real-time system events, user actions,
              exports, authentication, and security activity across your workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:text-blue-500 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10">
              <Bell size={16} />
            </button>

            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:text-blue-500 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10">
              <HelpCircle size={16} />
            </button>

            <div className="hidden h-6 w-px bg-slate-200 dark:bg-white/10 md:block" />

            <button className="blue-gradient-btn flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white">
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search activity logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="auth-minimal-input w-full rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 dark:text-white"
            />
          </div>

          <button className="auth-outline-btn flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold">
            <CalendarDays size={16} />
            Last 24 Hours
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="app-panel p-3 md:p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[260px] flex-1">
              <div className="app-panel-soft flex items-center gap-3 rounded-2xl px-4 py-3">
                <Filter size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by actor, resource, or IP..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                />
              </div>
            </div>

            {["Status: All", "Event Type", "Severity"].map((item) => (
              <button
                key={item}
                className="app-panel-soft flex items-center gap-2 rounded-2xl px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300"
              >
                {item}
                <ChevronDown size={14} className="text-slate-400" />
              </button>
            ))}

            <button className="ml-auto rounded-2xl px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-blue-500 transition hover:bg-blue-500/5">
              Clear All
            </button>
          </div>
        </div>

        <div className="app-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-white/[0.02]">
                  {[
                    "Timestamp",
                    "Actor",
                    "Action",
                    "Target Resource",
                    "Status",
                    "IP Address",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-8 py-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition hover:bg-slate-50/70 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-8 py-6 whitespace-nowrap text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {row.timestamp}
                    </td>

                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black ${initialsClass(
                            row.initials
                          )}`}
                        >
                          {row.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {row.actor}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {row.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td
                      className={`px-8 py-6 whitespace-nowrap text-sm font-bold ${
                        row.status === "Critical"
                          ? "text-rose-500"
                          : "text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {row.action}
                    </td>

                    <td className="px-8 py-6 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {row.resource}
                    </td>

                    <td className="px-8 py-6 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] ${statusClass(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td className="px-8 py-6 whitespace-nowrap text-right font-mono text-xs font-medium text-slate-400">
                      {row.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-8 py-5 md:flex-row md:items-center md:justify-between dark:border-white/10">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Showing 1-{filteredRows.length} of 4,290 results
            </p>

            <div className="flex items-center gap-2">
              <button className="auth-outline-btn rounded-2xl px-4 py-2 text-xs font-semibold opacity-50">
                Previous
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.7)]">
                1
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-white">
                2
              </button>
              <button className="auth-outline-btn rounded-2xl px-4 py-2 text-xs font-semibold">
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="app-panel p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 size={22} />
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-500">
                Optimal
              </span>
            </div>

            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
              System Success Rate
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
              99.2%
            </p>

            <div className="mt-5 h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10">
              <div className="h-full w-[99.2%] rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.45)]" />
            </div>
          </div>

          <div className="app-panel p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                <AlertTriangle size={22} />
              </div>
              <span className="rounded-full bg-rose-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-rose-500">
                Action Required
              </span>
            </div>

            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Anomalies Detected
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
              12
            </p>
            <p className="mt-3 text-xs font-bold text-rose-500">+3 since last hour</p>
          </div>

          <div className="app-panel p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                <Gauge size={22} />
              </div>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-500">
                Stable
              </span>
            </div>

            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Avg. Response Time
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
              24ms
            </p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Optimized performance across audit endpoints.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}