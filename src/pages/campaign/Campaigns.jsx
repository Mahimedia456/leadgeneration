import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  RefreshCcw,
  Megaphone,
  PlayCircle,
  PauseCircle,
  DollarSign,
  Users,
  BadgeDollarSign,
  Building2,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
} from "lucide-react";
import { deleteCampaignApi, getCampaignsApi } from "../../lib/api";

function statToneClasses(tone) {
  const map = {
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    indigo: "bg-indigo-500/10 text-indigo-500",
    rose: "bg-rose-500/10 text-rose-500",
  };
  return map[tone] || map.blue;
}

function statusClasses(status) {
  if (status === "active") {
    return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  }
  if (status === "paused") {
    return "border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500";
  }
  if (status === "draft") {
    return "border border-amber-500/20 bg-amber-500/10 text-amber-500";
  }
  return "border border-blue-500/20 bg-blue-500/10 text-blue-500";
}

function filterBtnClass(active) {
  return active
    ? "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
    : "border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export default function Campaigns() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    active: 0,
    paused: 0,
    draft: 0,
    totalSpend: 0,
    totalLeads: 0,
    avgCpl: 0,
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCampaigns(currentQuery = query, currentStatus = status) {
    try {
      setLoading(true);
      setError("");

      const data = await getCampaignsApi({
        q: currentQuery,
        status: currentStatus,
      });

      setCampaigns(data?.campaigns || []);
      setStats(
        data?.stats || {
          totalCampaigns: 0,
          active: 0,
          paused: 0,
          draft: 0,
          totalSpend: 0,
          totalLeads: 0,
          avgCpl: 0,
        }
      );
    } catch (err) {
      setError(err.message || "Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCampaigns(query, status);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, status]);

  const statCards = useMemo(() => {
    return [
      {
        title: "Total Campaigns",
        value: stats.totalCampaigns,
        icon: Megaphone,
        tone: "blue",
      },
      {
        title: "Active",
        value: stats.active,
        icon: PlayCircle,
        tone: "emerald",
      },
      {
        title: "Paused",
        value: stats.paused,
        icon: PauseCircle,
        tone: "rose",
      },
      {
        title: "Total Spend",
        value: formatCurrency(stats.totalSpend),
        icon: DollarSign,
        tone: "indigo",
      },
      {
        title: "Total Leads",
        value: stats.totalLeads,
        icon: Users,
        tone: "emerald",
      },
      {
        title: "Avg CPL",
        value: formatCurrency(stats.avgCpl),
        icon: BadgeDollarSign,
        tone: "amber",
      },
    ];
  }, [stats]);

  async function handleDelete(campaignId, campaignName) {
    const ok = window.confirm(`Remove "${campaignName}" from local synced records?`);
    if (!ok) return;

    try {
      await deleteCampaignApi(campaignId);
      await loadCampaigns();
      setOpenMenuId(null);
    } catch (err) {
      window.alert(err.message || "Failed to remove campaign.");
    }
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Campaigns
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Meta-synced campaigns stored in your local workspace database.
            </p>
          </div>

          <button
            onClick={() => loadCampaigns()}
            className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {statCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="metric-card app-panel-glow">
                <div className="mb-6 flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${statToneClasses(item.tone)}`}>
                    <Icon size={20} />
                  </div>
                  <span className={`rounded-lg px-3 py-1 text-xs font-bold ${statToneClasses(item.tone)}`}>
                    Live
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
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search campaigns by name, region or objective..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setStatus("")}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold ${filterBtnClass(status === "")}`}
                >
                  <Filter size={14} />
                  All Statuses
                </button>

                <button
                  onClick={() => setStatus("active")}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold ${filterBtnClass(status === "active")}`}
                >
                  <PlayCircle size={14} />
                  Active
                </button>

                <button
                  onClick={() => setStatus("paused")}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold ${filterBtnClass(status === "paused")}`}
                >
                  <PauseCircle size={14} />
                  Paused
                </button>

                <button
                  onClick={() => setStatus("draft")}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold ${filterBtnClass(status === "draft")}`}
                >
                  <Building2 size={14} />
                  Draft
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="px-8 py-12 text-sm text-slate-500 dark:text-slate-400">
              Loading campaigns...
            </div>
          ) : error ? (
            <div className="px-8 py-12 text-sm text-rose-500">{error}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1080px] text-left">
                  <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                    <tr>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Campaign Details
                      </th>
                      <th className="px-8 py-5 text-center text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Status
                      </th>
                      <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Budget
                      </th>
                      <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Spend
                      </th>
                      <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Leads
                      </th>
                      <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        CPL
                      </th>
                      <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {campaigns.map((campaign) => (
                      <tr
                        key={campaign.id}
                        className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                      >
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <button
                              onClick={() => navigate(`/campaigns/${campaign.id}`)}
                              className="text-left text-sm font-bold text-slate-900 transition hover:text-blue-600 dark:text-white"
                            >
                              {campaign.name}
                            </button>
                            <p className="mt-1 text-xs text-slate-500">
                              {campaign.brandName || "No Brand"} • {campaign.objective} • {campaign.platform?.join(", ") || "No Platform"}
                            </p>
                            {campaign.metaAdAccountId ? (
                              <p className="mt-1 text-[11px] text-slate-400">
                                Ad Account: {campaign.metaAdAccountId}
                              </p>
                            ) : null}
                          </div>
                        </td>

                        <td className="px-8 py-6 text-center">
                          <span className={`inline-flex rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${statusClasses(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </td>

                        <td className="px-8 py-6 text-right text-sm font-bold text-slate-900 dark:text-white">
                          {formatCurrency(campaign.budget)}
                        </td>

                        <td className="px-8 py-6 text-right text-sm font-bold text-slate-900 dark:text-white">
                          {formatCurrency(campaign.spend)}
                        </td>

                        <td className="px-8 py-6 text-right text-sm font-bold text-slate-900 dark:text-white">
                          {campaign.leads}
                        </td>

                        <td className="px-8 py-6 text-right text-sm font-black text-blue-600 dark:text-blue-400">
                          {formatCurrency(campaign.cpl)}
                        </td>

                        <td className="relative px-8 py-6">
                          <div className="flex justify-end">
                            <button
                              onClick={() => setOpenMenuId((prev) => (prev === campaign.id ? null : campaign.id))}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/5"
                            >
                              <MoreHorizontal size={18} />
                            </button>
                          </div>

                          {openMenuId === campaign.id && (
                            <div className="absolute right-8 top-[72px] z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#111111]">
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  navigate(`/campaigns/${campaign.id}`);
                                }}
                                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                              >
                                <Eye size={16} />
                                View Details
                              </button>

                              <button
                                onClick={() => handleDelete(campaign.id, campaign.name)}
                                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                              >
                                <Trash2 size={16} />
                                Remove Local Copy
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                    {!campaigns.length && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-8 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                        >
                          No synced campaigns found. Sync from Meta ad account first.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-4 border-t border-slate-200 px-8 py-5 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-slate-500 dark:text-slate-400">
                  Showing <span className="font-bold text-slate-900 dark:text-white">{campaigns.length}</span> campaigns
                </p>

                <div className="flex items-center gap-2">
                  <button className="auth-outline-btn flex h-9 items-center justify-center rounded-lg px-4 opacity-50">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="auth-outline-btn flex h-9 items-center justify-center rounded-lg px-4 text-xs font-bold">
                    Previous
                  </button>
                  <button className="auth-outline-btn flex h-9 items-center justify-center rounded-lg px-4 text-xs font-bold">
                    Next
                  </button>
                  <button className="auth-outline-btn flex h-9 items-center justify-center rounded-lg px-4 opacity-50">
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