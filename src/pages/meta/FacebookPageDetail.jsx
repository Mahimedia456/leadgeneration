import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  ArrowLeft,
  FileText,
  Building2,
  Users,
  RefreshCcw,
  ShieldCheck,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  Activity,
  Link2,
  Settings,
  ExternalLink,
  LoaderCircle,
} from "lucide-react";
import { getMetaPageDetailApi } from "../../lib/metaApi";

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

function healthTone(health) {
  if (health >= 90) {
    return { bar: "bg-emerald-500", text: "text-emerald-500" };
  }
  if (health >= 70) {
    return { bar: "bg-amber-500", text: "text-amber-500" };
  }
  return { bar: "bg-rose-500", text: "text-rose-500" };
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

export default function FacebookPageDetail() {
  const navigate = useNavigate();
  const { pageId } = useParams();

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await getMetaPageDetailApi(pageId);
        const item = res.item;

        setPage({
          id: item.page_id,
          name: item.page_name,
          brand: "Current Workspace",
          leadCount: Number(item.meta_leads?.[0]?.count || 0),
          leadChange: "+0%",
          status:
            item.status === "connected"
              ? "Synced"
              : item.status === "pending"
              ? "Pending Sync"
              : "Auth Failed",
          pageHealth: item.status === "connected" ? 96 : 48,
          responseRate: "Live",
          lastSync: timeAgo(item.last_synced_at),
          pageType: item.page_category || "Facebook Page",
          connectedBy: "Workspace Admin",
          businessManager: "Meta Workspace Connection",
          audienceSize: "--",
          logoBg: "from-sky-950 to-blue-700",
          description:
            "Connected Facebook lead generation page for workspace campaigns, form sync, and asset monitoring.",
          forms: item.meta_lead_forms || [],
          instagramAccounts: item.meta_instagram_accounts || [],
        });
      } catch (err) {
        setError(err.message || "Failed to load page detail");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [pageId]);

  const recentLeadSources = useMemo(() => {
    if (!page) return [];
    const forms = page.forms || [];
    if (!forms.length) {
      return [{ source: "Lead Forms", volume: page.leadCount, conversion: "Live" }];
    }
    return forms.map((form) => ({
      source: form.form_name || form.form_id,
      volume: Math.max(1, Math.floor(page.leadCount / forms.length || 0)),
      conversion: "Live",
    }));
  }, [page]);

  const recentSyncEvents = useMemo(() => {
    if (!page) return [];
    return [
      { title: "Lead form sync completed", time: page.lastSync, status: "Success" },
      { title: "Permissions validated", time: page.lastSync, status: "Success" },
      {
        title: page.instagramAccounts?.length
          ? "Instagram link detected"
          : "Instagram account not linked",
        time: page.lastSync,
        status: page.instagramAccounts?.length ? "Success" : "Queued",
      },
      { title: "Audience refresh queued", time: page.lastSync, status: "Queued" },
    ];
  }, [page]);

  if (loading) {
    return (
      <AppShell>
        <div className="app-panel p-10 text-sm text-slate-500">
          <div className="inline-flex items-center gap-2">
            <LoaderCircle size={18} className="animate-spin" />
            Loading Facebook page detail...
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !page) {
    return (
      <AppShell>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-500">
          {error || "Page not found"}
        </div>
      </AppShell>
    );
  }

  const health = healthTone(page.pageHealth);

  const topStats = [
    {
      title: "Leads",
      value: page.leadCount.toLocaleString(),
      change: page.leadChange,
      icon: Users,
      tone: "blue",
    },
    {
      title: "Page Health",
      value: `${page.pageHealth}%`,
      change: page.status,
      icon: ShieldCheck,
      tone: page.pageHealth >= 90 ? "emerald" : page.pageHealth >= 70 ? "amber" : "rose",
    },
    {
      title: "Response Rate",
      value: page.responseRate,
      change: "Realtime",
      icon: Activity,
      tone: "indigo",
    },
    {
      title: "Last Sync",
      value: page.lastSync,
      change: "Meta",
      icon: RefreshCcw,
      tone: "emerald",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <button
              onClick={() => navigate("/meta/pages")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Pages
            </button>

            <div className="flex items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${page.logoBg} text-sm font-black text-white shadow-md`}
              >
                {page.name.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {page.name}
                </h1>
                <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                  {page.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <ExternalLink size={16} />
              Open Page
            </button>

            <button
              onClick={() => navigate("/meta/pages")}
              className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              <Settings size={16} />
              Back to Pages
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {topStats.map((item) => {
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="app-panel p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Page Overview
                </h2>
                <span
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${statusClasses(
                    page.status
                  )}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      page.status === "Synced"
                        ? "bg-emerald-500"
                        : page.status === "Pending Sync"
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                  />
                  {page.status}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Brand Assignment
                      </p>
                      <p className="text-xs text-slate-500">Linked workspace context</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Brand</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {page.brand}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Business Manager</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {page.businessManager}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Connected By</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {page.connectedBy}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Page Metadata
                      </p>
                      <p className="text-xs text-slate-500">Identity and sync footprint</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Page ID</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {page.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Category</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {page.pageType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Audience Size</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {page.audienceSize}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="app-panel overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-5 dark:border-white/10">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Lead Source Breakdown
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                    <tr>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Source
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Volume
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Conversion Rate
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {recentLeadSources.map((item) => (
                      <tr
                        key={item.source}
                        className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                      >
                        <td className="px-8 py-5 text-sm font-bold text-slate-900 dark:text-white">
                          {item.source}
                        </td>
                        <td className="px-8 py-5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {item.volume}
                        </td>
                        <td className="px-8 py-5 text-sm font-semibold text-emerald-500">
                          {item.conversion}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="app-panel p-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Health Score
              </h3>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Overall stability</span>
                  <span className={`text-sm font-bold ${health.text}`}>
                    {page.pageHealth}%
                  </span>
                </div>

                <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${health.bar}`}
                    style={{ width: `${page.pageHealth}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-3">
                    <RefreshCcw className="text-blue-500" size={18} />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Sync Reliability
                      </p>
                      <p className="text-xs text-slate-500">
                        Last successful pull {page.lastSync}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-3">
                    <Link2 className="text-emerald-500" size={18} />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Lead Routing
                      </p>
                      <p className="text-xs text-slate-500">
                        Connected to active campaign distribution flow
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="app-panel overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-5 dark:border-white/10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Recent Sync Events
                </h3>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-white/10">
                {recentSyncEvents.map((event) => (
                  <div key={`${event.title}-${event.time}`} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 flex h-9 w-9 items-center justify-center rounded-xl ${
                            event.status === "Success"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : event.status === "Warning"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {event.status === "Success" ? (
                            <CheckCircle2 size={16} />
                          ) : event.status === "Warning" ? (
                            <AlertTriangle size={16} />
                          ) : (
                            <Clock3 size={16} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {event.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{event.time}</p>
                        </div>
                      </div>

                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        {event.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}