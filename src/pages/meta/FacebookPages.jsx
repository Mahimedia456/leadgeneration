import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  Upload,
  Plus,
  FileText,
  RefreshCcw,
  Users,
  Unplug,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  Settings,
  AlertTriangle,
  Link2,
  CheckCircle2,
  Clock3,
  Layers3,
} from "lucide-react";

const initialPageStats = [
  {
    title: "Total Pages",
    value: "24",
    change: "+12%",
    icon: FileText,
    tone: "blue",
  },
  {
    title: "Active Sync",
    value: "21",
    change: "Active",
    icon: RefreshCcw,
    tone: "emerald",
  },
  {
    title: "Total Leads (24h)",
    value: "1,284",
    change: "High Vol",
    icon: Users,
    tone: "amber",
  },
  {
    title: "Disconnected",
    value: "3",
    change: "Critical",
    icon: Unplug,
    tone: "rose",
  },
];

const initialPages = [
  {
    id: "PG-8291048293",
    name: "Lumina Electronics",
    brand: "Tech Global",
    leadCount: 428,
    leadChange: "+12%",
    status: "Synced",
    logoBg: "from-sky-950 to-blue-700",
  },
  {
    id: "PG-2194820194",
    name: "Eco Living Essentials",
    brand: "Sustainable Co.",
    leadCount: 82,
    leadChange: "-4%",
    status: "Pending Sync",
    logoBg: "from-emerald-950 to-emerald-700",
  },
  {
    id: "PG-9402910482",
    name: "Velocity Sportswear",
    brand: "Velocity Inc.",
    leadCount: 1029,
    leadChange: "+52%",
    status: "Auth Failed",
    logoBg: "from-rose-950 to-rose-700",
  },
  {
    id: "PG-7720918441",
    name: "Northline Furnishings",
    brand: "Northline Home",
    leadCount: 314,
    leadChange: "+8%",
    status: "Synced",
    logoBg: "from-slate-950 to-slate-700",
  },
];

const quickStatus = [
  {
    title: "Bulk Sync Health",
    value: "87%",
    icon: CheckCircle2,
    tone: "emerald",
    note: "18 pages fully healthy",
  },
  {
    title: "Failed Connections",
    value: "03",
    icon: AlertTriangle,
    tone: "rose",
    note: "Reconnect required",
  },
  {
    title: "Next Sweep",
    value: "12m",
    icon: Clock3,
    tone: "amber",
    note: "Scheduled poll cycle",
  },
];

function statToneClasses(tone) {
  const map = {
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    rose: "bg-rose-500/10 text-rose-500",
  };
  return map[tone] || map.blue;
}

function statusClasses(status) {
  if (status === "Synced") {
    return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  }
  if (status === "Pending Sync") {
    return "border border-amber-500/20 bg-amber-500/10 text-amber-500";
  }
  if (status === "Auth Failed") {
    return "border border-rose-500/20 bg-rose-500/10 text-rose-500";
  }
  return "border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500";
}

function statusDot(status) {
  if (status === "Synced") return "bg-emerald-500";
  if (status === "Pending Sync") return "bg-amber-500";
  if (status === "Auth Failed") return "bg-rose-500";
  return "bg-slate-400";
}

function leadTone(change) {
  return change.startsWith("+") ? "text-emerald-500" : "text-slate-500";
}

export default function FacebookPages() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [pages, setPages] = useState(initialPages);
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredPages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pages;

    return pages.filter(
      (page) =>
        page.name.toLowerCase().includes(q) ||
        page.id.toLowerCase().includes(q) ||
        page.brand.toLowerCase().includes(q) ||
        page.status.toLowerCase().includes(q)
    );
  }, [query, pages]);

  const handleDelete = (pageId, pageName) => {
    const ok = window.confirm(`Disconnect "${pageName}"?`);
    if (!ok) return;

    setPages((prev) => prev.filter((page) => page.id !== pageId));
    setOpenMenuId(null);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Facebook Pages
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Manage connected brand pages, monitor sync status, and track lead volume across all brands.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <Upload size={16} />
              Export Pages
            </button>

            <button
              onClick={() => navigate("/meta/pages/connect")}
              className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              <Plus size={16} />
              Connect Page
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {initialPageStats.map((item) => {
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

        <div className="app-panel overflow-hidden">
          <div className="border-b border-slate-200 p-6 dark:border-white/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search pages by name, page ID, brand, or sync state..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="auth-outline-btn flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
                    <Filter size={16} />
                    Status: All
                  </button>

                  <button className="auth-outline-btn flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
                    <Layers3 size={16} />
                    Lead Volume: High
                  </button>
                </div>
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Showing 1–{filteredPages.length} of {pages.length} pages
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                <tr>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Page Details
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Brand Assignment
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Lead Count (24h)
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Sync Status
                  </th>
                  <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filteredPages.map((page) => (
                  <tr
                    key={page.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${page.logoBg} text-xs font-black text-white shadow-md`}
                        >
                          {page.name.slice(0, 2).toUpperCase()}
                        </div>

                        <div>
                          <button
                            onClick={() => navigate(`/meta/pages/${page.id}`)}
                            className="text-left text-sm font-bold text-slate-900 transition hover:text-blue-600 dark:text-white"
                          >
                            {page.name}
                          </button>
                          <p className="mt-1 text-xs text-slate-500">ID: {page.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <span className="inline-flex rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-blue-500">
                        {page.brand}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {page.leadCount.toLocaleString()}
                        </p>
                        <p className={`mt-1 text-xs font-bold ${leadTone(page.leadChange)}`}>
                          {page.leadChange}
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${statusClasses(
                          page.status
                        )}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDot(page.status)}`} />
                        {page.status}
                      </span>
                    </td>

                    <td className="relative px-8 py-6">
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            setOpenMenuId((prev) => (prev === page.id ? null : page.id))
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/5"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </div>

                      {openMenuId === page.id && (
                        <div className="absolute right-8 top-[72px] z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#111111]">
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              navigate(`/meta/pages/${page.id}`);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                          >
                            <Eye size={16} />
                            View Details
                          </button>

                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              navigate(`/meta/pages/${page.id}/settings`);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                          >
                            <Settings size={16} />
                            Manage Page
                          </button>

                          <button
                            onClick={() => handleDelete(page.id, page.name)}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                          >
                            <Trash2 size={16} />
                            Disconnect
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-6 border-t border-slate-200 p-6 dark:border-white/10 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-2xl border border-slate-200 p-6 dark:border-white/10">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Need to sync multiple pages?
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Launch the bulk wizard to connect up to 50 pages from Business Manager in one flow.
                  </p>
                </div>
                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 md:flex">
                  <Link2 size={20} />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="blue-gradient-btn rounded-xl px-5 py-3 text-sm font-semibold text-white">
                  Launch Bulk Wizard
                </button>
                <button className="auth-outline-btn rounded-xl px-5 py-3 text-sm font-semibold">
                  Review Assignments
                </button>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 p-6 dark:border-white/10">
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-400">
                Page Sync Snapshot
              </h3>

              {quickStatus.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${statToneClasses(
                          item.tone
                        )}`}
                      >
                        <Icon size={18} />
                      </div>
                      <p className="text-xl font-black text-slate-900 dark:text-white">
                        {item.value}
                      </p>
                    </div>
                    <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{item.note}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-8 py-5 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-500 dark:text-slate-400">
              Displaying{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                1 to {filteredPages.length}
              </span>{" "}
              of {pages.length} connected pages
            </p>

            <div className="flex items-center gap-2">
              <button className="auth-outline-btn flex h-9 w-9 items-center justify-center rounded-lg opacity-50">
                <ChevronLeft size={16} />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                1
              </button>
              <button className="auth-outline-btn flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold">
                2
              </button>
              <button className="auth-outline-btn flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold">
                3
              </button>
              <button className="auth-outline-btn flex h-9 w-9 items-center justify-center rounded-lg">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
