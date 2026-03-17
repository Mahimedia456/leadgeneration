import { useEffect, useMemo, useState } from "react";
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
  Eye,
  AlertTriangle,
  Link2,
  CheckCircle2,
  Clock3,
  Layers3,
  LoaderCircle,
} from "lucide-react";
import { getMetaPagesApi } from "../../lib/metaApi";

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
  return String(change).startsWith("+") ? "text-emerald-500" : "text-slate-500";
}

export default function FacebookPages() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [pages, setPages] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await getMetaPagesApi();

        const mapped = (res.items || []).map((page) => ({
          id: page.page_id,
          dbId: page.id,
          name: page.page_name,
          brand: "Current Workspace",
          leadCount: Number(page.leads_last_24h || 0),
          leadChange: "+0%",
          status:
            page.status === "connected"
              ? "Synced"
              : page.status === "pending"
              ? "Pending Sync"
              : "Auth Failed",
          logoBg: "from-sky-950 to-blue-700",
          raw: page,
        }));

        setPages(mapped);
      } catch (err) {
        setError(err.message || "Failed to load Meta pages");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

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

  const totalPages = pages.length;
  const syncedPages = pages.filter((page) => page.status === "Synced").length;
  const disconnectedPages = pages.filter((page) => page.status === "Auth Failed").length;
  const totalLeads = pages.reduce((sum, page) => sum + Number(page.leadCount || 0), 0);

  const pageStats = [
    {
      title: "Total Pages",
      value: String(totalPages),
      change: totalPages ? "+Active" : "0",
      icon: FileText,
      tone: "blue",
    },
    {
      title: "Active Sync",
      value: String(syncedPages),
      change: syncedPages ? "Active" : "Idle",
      icon: RefreshCcw,
      tone: "emerald",
    },
    {
      title: "Total Leads (24h)",
      value: String(totalLeads),
      change: totalLeads ? "Live" : "No Data",
      icon: Users,
      tone: "amber",
    },
    {
      title: "Disconnected",
      value: String(disconnectedPages),
      change: disconnectedPages ? "Critical" : "Healthy",
      icon: Unplug,
      tone: "rose",
    },
  ];

  const quickStatus = [
    {
      title: "Bulk Sync Health",
      value: `${Math.max(0, Math.min(100, totalPages ? Math.round((syncedPages / totalPages) * 100) : 0))}%`,
      icon: CheckCircle2,
      tone: "emerald",
      note: `${syncedPages} pages fully healthy`,
    },
    {
      title: "Failed Connections",
      value: String(disconnectedPages).padStart(2, "0"),
      icon: AlertTriangle,
      tone: "rose",
      note: "Reconnect required",
    },
    {
      title: "Live Pages",
      value: String(totalPages),
      icon: Clock3,
      tone: "amber",
      note: "Workspace scope",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Facebook Pages
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Manage connected brand pages, monitor sync status, and track lead volume across all workspace assets.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <Upload size={16} />
              Export Pages
            </button>

            <button
              onClick={() => navigate("/meta-connections")}
              className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              <Plus size={16} />
              Connect Page
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-500">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pageStats.map((item) => {
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
                    Lead Volume: All
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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-sm text-slate-500">
                      <div className="inline-flex items-center gap-2">
                        <LoaderCircle size={18} className="animate-spin" />
                        Loading Facebook pages...
                      </div>
                    </td>
                  </tr>
                ) : filteredPages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-sm text-slate-500">
                      No pages found.
                    </td>
                  </tr>
                ) : (
                  filteredPages.map((page) => (
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
                                navigate("/meta-connections");
                              }}
                              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                            >
                              <Link2 size={16} />
                              Meta Connections
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
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
                    Launch the connection flow from Meta Connections and pull all workspace pages from the active business context.
                  </p>
                </div>
                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 md:flex">
                  <Link2 size={20} />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/meta-connections")}
                  className="blue-gradient-btn rounded-xl px-5 py-3 text-sm font-semibold text-white"
                >
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
              <button className="auth-outline-btn flex h-9 w-9 items-center justify-center rounded-lg opacity-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}