import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  Upload,
  Plus,
  Link2,
  ShieldCheck,
  RefreshCcw,
  Building2,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Workflow,
  LoaderCircle,
  Facebook,
  Instagram,
} from "lucide-react";
import {
  getMetaConnectionsApi,
  getMetaOAuthUrlApi,
  syncMetaConnectionApi,
  deleteMetaConnectionApi,
} from "../../lib/metaApi";

const initialConnectionTabs = ["Connected Accounts"];

const syncEngines = [
  {
    name: "Meta Ads API",
    status: "Operational",
    latency: "Live",
    tone: "emerald",
    icon: CheckCircle2,
  },
  {
    name: "Conversions API",
    status: "Connected",
    latency: "Live",
    tone: "blue",
    icon: Workflow,
  },
  {
    name: "Instagram Graph API",
    status: "Monitoring",
    latency: "Live",
    tone: "amber",
    icon: Clock3,
  },
];

function statToneClasses(tone) {
  const map = {
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    indigo: "bg-indigo-500/10 text-indigo-500",
  };
  return map[tone] || map.blue;
}

function statusClasses(status) {
  const key = String(status || "").toLowerCase();

  if (key === "healthy") {
    return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  }
  if (key === "retrying") {
    return "border border-amber-500/20 bg-amber-500/10 text-amber-500";
  }
  if (key === "warning") {
    return "border border-rose-500/20 bg-rose-500/10 text-rose-500";
  }

  return "border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500";
}

function riskClasses(risk) {
  const key = String(risk || "").toLowerCase();
  if (key === "low") return "text-emerald-500";
  if (key === "medium") return "text-amber-500";
  return "text-rose-500";
}

function timeAgo(dateString) {
  if (!dateString) return "--";
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hrs ago`;
  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
}

export default function MetaConnections() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [connections, setConnections] = useState([]);
  const [activeTab, setActiveTab] = useState(initialConnectionTabs[0]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");

  const loadConnections = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getMetaConnectionsApi();

      const mapped = (res.items || []).map((item) => {
        const pagesCount = Number(item.meta_pages?.[0]?.count || 0);
        const igCount = Number(item.meta_instagram_accounts?.[0]?.count || 0);
        const adCount = Number(item.meta_ad_accounts?.[0]?.count || 0);
        const assetTotal = pagesCount + igCount + adCount;

        return {
          id: item.id,
          name: item.business_name || item.meta_user_name || "Meta Connection",
          type: item.business_name ? "Business Manager" : "Meta User",
          status: item.status === "active" ? "Healthy" : "Warning",
          assets: assetTotal,
          pagesCount,
          igCount,
          adCount,
          syncedAt: timeAgo(item.last_synced_at),
          latency: "Live",
          risk: item.status === "active" ? "Low" : "High",
          logoBg: "from-blue-950 to-indigo-700",
          raw: item,
        };
      });

      setConnections(mapped);
    } catch (err) {
      setError(err.message || "Failed to load Meta connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  const filteredConnections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return connections;

    return connections.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q)
    );
  }, [query, connections]);

  const handleNewConnection = async () => {
    try {
      const res = await getMetaOAuthUrlApi();
      window.location.href = res.url;
    } catch (err) {
      alert(err.message || "Failed to start Meta connection");
    }
  };

  const handleSync = async (connectionId) => {
    try {
      setActionLoadingId(`sync-${connectionId}`);
      await syncMetaConnectionApi(connectionId);
      await loadConnections();
      setOpenMenuId(null);
    } catch (err) {
      alert(err.message || "Sync failed");
    } finally {
      setActionLoadingId("");
    }
  };

  const handleDelete = async (connectionId, connectionName) => {
    const ok = window.confirm(`Remove "${connectionName}" connection?`);
    if (!ok) return;

    try {
      setActionLoadingId(`delete-${connectionId}`);
      await deleteMetaConnectionApi(connectionId);
      await loadConnections();
      setOpenMenuId(null);
    } catch (err) {
      alert(err.message || "Delete failed");
    } finally {
      setActionLoadingId("");
    }
  };

  const totalAssets = connections.reduce((sum, item) => sum + Number(item.assets || 0), 0);

  const connectionStats = [
    {
      title: "Connection Health",
      value: connections.length ? "98.2%" : "0%",
      change: connections.length ? "+1.2%" : "No data",
      icon: ShieldCheck,
      tone: "emerald",
    },
    {
      title: "Active Managers",
      value: String(connections.length),
      change: connections.length ? "+1" : "0",
      icon: Building2,
      tone: "blue",
    },
    {
      title: "Synced Assets",
      value: String(totalAssets),
      change: totalAssets ? `+${totalAssets}` : "0",
      icon: RefreshCcw,
      tone: "indigo",
    },
    {
      title: "API Latency",
      value: "Live",
      change: "Connected",
      icon: Activity,
      tone: "amber",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Meta Connections
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Manage business managers, synced assets, permissions, and real-time connection health.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <Upload size={16} />
              Export Logs
            </button>

            <button
              onClick={handleNewConnection}
              className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              <Plus size={16} />
              New Connection
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-500">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {connectionStats.map((item) => {
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
                    className={`rounded-lg px-3 py-1 text-xs font-bold ${
                      item.tone === "amber"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-emerald-500/10 text-emerald-500"
                    }`}
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
          <div className="border-b border-slate-200 px-6 pt-6 dark:border-white/10">
            <div className="flex flex-wrap gap-8">
              {initialConnectionTabs.map((tab) => {
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`border-b-2 pb-4 text-sm font-bold transition ${
                      active
                        ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                        : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search by connection name, ID, asset type or status..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                />
              </div>

              <button className="auth-outline-btn flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
                <Filter size={16} />
                Filter View
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left">
                  <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                    <tr>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Connection Identity
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Type
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Status
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Synced Assets
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Last Sync / Latency
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Risk Level
                      </th>
                      <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-8 py-12 text-center text-sm text-slate-500"
                        >
                          <div className="inline-flex items-center gap-2">
                            <LoaderCircle size={18} className="animate-spin" />
                            Loading Meta connections...
                          </div>
                        </td>
                      </tr>
                    ) : filteredConnections.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-8 py-12 text-center text-sm text-slate-500"
                        >
                          No Meta connections found.
                        </td>
                      </tr>
                    ) : (
                      filteredConnections.map((item) => (
                        <tr
                          key={item.id}
                          className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.logoBg} text-xs font-black text-white shadow-md`}
                              >
                                {item.name.slice(0, 2).toUpperCase()}
                              </div>

                              <div>
                                <p className="text-left text-sm font-bold text-slate-900 dark:text-white">
                                  {item.name}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">ID: {item.id}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-8 py-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                            {item.type}
                          </td>

                          <td className="px-8 py-6">
                            <span
                              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${statusClasses(
                                item.status
                              )}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  item.status === "Healthy"
                                    ? "bg-emerald-500"
                                    : item.status === "Retrying"
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                                }`}
                              />
                              {item.status}
                            </span>
                          </td>

                          <td className="px-8 py-6 text-sm font-bold text-slate-900 dark:text-white">
                            {item.assets}
                          </td>

                          <td className="px-8 py-6">
                            <div>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {item.syncedAt}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">Latency: {item.latency}</p>
                            </div>
                          </td>

                          <td className="px-8 py-6">
                            <span
                              className={`text-xs font-bold uppercase tracking-[0.12em] ${riskClasses(
                                item.risk
                              )}`}
                            >
                              {item.risk}
                            </span>
                          </td>

                          <td className="relative px-8 py-6">
                            <div className="flex justify-end">
                              <button
                                onClick={() =>
                                  setOpenMenuId((prev) => (prev === item.id ? null : item.id))
                                }
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/5"
                              >
                                <MoreHorizontal size={18} />
                              </button>
                            </div>

                            {openMenuId === item.id && (
                              <div className="absolute right-8 top-[72px] z-20 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#111111]">
                                <button
                                  onClick={() => handleSync(item.id)}
                                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                                >
                                  <RefreshCcw size={16} />
                                  {actionLoadingId === `sync-${item.id}` ? "Syncing..." : "Sync Now"}
                                </button>

                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    navigate("/meta/pages");
                                  }}
                                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                                >
                                  <Facebook size={16} />
                                  Open Facebook Pages
                                </button>

                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    navigate("/meta/instagram");
                                  }}
                                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                                >
                                  <Instagram size={16} />
                                  Open Instagram Accounts
                                </button>

                                <button
                                  onClick={() => handleDelete(item.id, item.name)}
                                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                >
                                  <Trash2 size={16} />
                                  {actionLoadingId === `delete-${item.id}` ? "Removing..." : "Remove Connection"}
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
            </div>

            <div className="space-y-6">
              <div className="app-panel-glow rounded-[28px] bg-slate-950 p-6 text-white shadow-2xl">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black">Security Health</h3>
                    <p className="text-xs text-slate-400">Enterprise permission audit</p>
                  </div>
                </div>

                <p className="text-sm leading-6 text-slate-300">
                  Review active workspace access, token expiry windows, and Meta asset permissions before high-volume lead sync operations.
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em]">
                      <span className="text-slate-500">Admin Exposure</span>
                      <span className="text-amber-400">Monitored</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[68%] rounded-full bg-amber-400" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em]">
                      <span className="text-slate-500">Key Expiry</span>
                      <span className="text-emerald-400">Healthy</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[32%] rounded-full bg-emerald-400" />
                    </div>
                  </div>
                </div>

                <button className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-500">
                  Audit Permissions
                </button>
              </div>

              <div className="app-panel p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Sync Engine Status</h3>
                  <Link2 size={18} className="text-blue-500" />
                </div>

                <div className="space-y-5">
                  {syncEngines.map((engine) => {
                    const Icon = engine.icon;
                    return (
                      <div key={engine.name} className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl ${statToneClasses(
                              engine.tone
                            )}`}
                          >
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{engine.name}</p>
                            <p className="mt-1 text-xs text-slate-500">{engine.status}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-400">{engine.latency}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Next Scheduled Sync
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                    Manual + On Demand
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Use Sync Now on any active Meta connection.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-8 py-5 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-500 dark:text-slate-400">
              Displaying{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                1 to {filteredConnections.length}
              </span>{" "}
              of {connections.length} connections
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