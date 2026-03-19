import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  RefreshCcw,
} from "lucide-react";
import { getAdSetsApi } from "../../lib/api";

function statusClasses(status) {
  if (status === "active") {
    return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  }
  if (status === "learning" || status === "draft") {
    return "border border-amber-500/20 bg-amber-500/10 text-amber-500";
  }
  return "border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500";
}

function formatCurrency(val) {
  return `$${Number(val || 0).toLocaleString()}`;
}

export default function AdSet() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const campaignId = params.get("campaignId") || "";

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [adSets, setAdSets] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);

      const data = await getAdSetsApi({
        campaignId,
        q: query,
        status,
      });

      setAdSets(data?.adSets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [campaignId, query, status]);

  const filtered = useMemo(() => adSets, [adSets]);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Ad Sets
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              {campaignId
                ? "Showing ad sets for selected synced campaign."
                : "Showing all synced ad sets from your campaigns."}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={load}
              className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              placeholder="Search ad sets..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="auth-minimal-input w-full px-4 py-3 pl-11 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setStatus("")}
              className={`rounded-xl border px-4 py-2 text-xs font-bold ${status === "" ? "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400" : "border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"}`}
            >
              <Filter size={14} className="inline mr-2" />
              All
            </button>

            <button
              onClick={() => setStatus("active")}
              className={`rounded-xl border px-4 py-2 text-xs font-bold ${status === "active" ? "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400" : "border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"}`}
            >
              Active
            </button>

            <button
              onClick={() => setStatus("paused")}
              className={`rounded-xl border px-4 py-2 text-xs font-bold ${status === "paused" ? "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400" : "border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"}`}
            >
              Paused
            </button>

            <button
              onClick={() => setStatus("draft")}
              className={`rounded-xl border px-4 py-2 text-xs font-bold ${status === "draft" ? "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400" : "border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"}`}
            >
              Draft
            </button>
          </div>
        </div>

        <div className="app-panel overflow-hidden">
          {loading ? (
            <div className="px-8 py-12 text-sm text-slate-500 dark:text-slate-400">
              Loading ad sets...
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left">
                  <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                    <tr>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Ad Set Detail</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Campaign</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Status</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Budget</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Leads</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">CPL</th>
                      <th className="px-6 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {filtered.map((item) => (
                      <tr key={item.id} className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                        <td className="px-6 py-6">
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">
                              {item.name}
                            </p>
                            {item.metaAdsetId ? (
                              <p className="mt-1 text-xs text-slate-500">
                                Meta Ad Set ID: {item.metaAdsetId}
                              </p>
                            ) : null}
                          </div>
                        </td>

                        <td className="px-6 py-6 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {item.campaignName || item.campaignId}
                        </td>

                        <td className="px-6 py-6">
                          <span className={`inline-flex rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${statusClasses(item.status)}`}>
                            {item.status}
                          </span>
                        </td>

                        <td className="px-6 py-6 text-sm font-black text-slate-900 dark:text-white">
                          {formatCurrency(item.budget)}
                        </td>

                        <td className="px-6 py-6 text-sm font-black text-slate-900 dark:text-white">
                          {item.leads}
                        </td>

                        <td className="px-6 py-6 text-sm font-black text-blue-600 dark:text-blue-400">
                          {formatCurrency(item.cpl)}
                        </td>

                        <td className="px-6 py-6 text-right">
                          <button className="text-slate-500 transition hover:text-blue-600 dark:hover:text-white">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {!filtered.length && (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                          No synced ad sets found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-4 border-t border-slate-200 px-8 py-5 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-slate-500 dark:text-slate-400">
                  Showing <span className="font-bold text-slate-900 dark:text-white">{filtered.length}</span> ad sets
                </p>

                <div className="flex items-center gap-2">
                  <button className="auth-outline-btn flex h-9 w-9 items-center justify-center rounded-lg">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="auth-outline-btn flex h-9 w-9 items-center justify-center rounded-lg">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}