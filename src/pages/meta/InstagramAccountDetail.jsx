import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  ArrowLeft,
  Instagram,
  Users,
  Activity,
  HeartHandshake,
  AlertTriangle,
  CheckCircle2,
  PauseCircle,
  Link2,
  Settings,
  ExternalLink,
  Megaphone,
  ShieldCheck,
  TrendingUp,
  LoaderCircle,
} from "lucide-react";
import { getMetaInstagramDetailApi } from "../../lib/metaApi";

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

function stateClasses(state) {
  if (state === "Healthy") {
    return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  }
  if (state === "Paused") {
    return "border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500";
  }
  if (state === "Flagged") {
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

export default function InstagramAccountDetail() {
  const navigate = useNavigate();
  const { accountId } = useParams();

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await getMetaInstagramDetailApi(accountId);
        const item = res.item;

        setAccount({
          id: item.ig_user_id,
          handle: `@${item.username}`,
          niche: "Instagram Business",
          linkedPage: item.meta_pages?.page_name || "Unlinked",
          followers: Number(item.followers_count || 0).toLocaleString(),
          growth: "+0%",
          campaignStatus: "Active",
          permission: "Admin",
          state: item.status === "connected" ? "Healthy" : "Flagged",
          avatarBg: "from-fuchsia-500 to-pink-600",
          engagementRate: "Live",
          reach: Number(item.media_count || 0).toLocaleString(),
          profileHealth: item.status === "connected" ? 94 : 42,
          lastSync: timeAgo(item.last_synced_at),
          connectedBy: "Workspace Admin",
          businessManager: "Meta Workspace Connection",
          description:
            "Connected Instagram business account synced through the active workspace Meta connection.",
        });
      } catch (err) {
        setError(err.message || "Failed to load Instagram account detail");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [accountId]);

  const contentPerformance = useMemo(() => {
    if (!account) return [];
    return [
      { type: "Reels Campaign", impressions: account.reach, engagement: account.engagementRate },
      { type: "Story Retargeting", impressions: account.reach, engagement: account.engagementRate },
      { type: "Lead Form CTA", impressions: account.reach, engagement: account.engagementRate },
      { type: "Organic Carousel", impressions: account.reach, engagement: account.engagementRate },
    ];
  }, [account]);

  const accountEvents = useMemo(() => {
    if (!account) return [];
    return [
      { title: "Instagram sync completed", time: account.lastSync, status: "Success" },
      { title: "Page permissions verified", time: account.lastSync, status: "Success" },
      { title: "Campaign access monitored", time: account.lastSync, status: "Paused" },
      { title: "Connection review required", time: account.lastSync, status: "Warning" },
    ];
  }, [account]);

  if (loading) {
    return (
      <AppShell>
        <div className="app-panel p-10 text-sm text-slate-500">
          <div className="inline-flex items-center gap-2">
            <LoaderCircle size={18} className="animate-spin" />
            Loading Instagram account detail...
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !account) {
    return (
      <AppShell>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-500">
          {error || "Instagram account not found"}
        </div>
      </AppShell>
    );
  }

  const health = healthTone(account.profileHealth);

  const topStats = [
    {
      title: "Followers",
      value: account.followers,
      change: account.growth,
      icon: Users,
      tone: "blue",
    },
    {
      title: "Engagement Rate",
      value: account.engagementRate,
      change: "Live",
      icon: HeartHandshake,
      tone: "emerald",
    },
    {
      title: "Reach",
      value: account.reach,
      change: "Media",
      icon: TrendingUp,
      tone: "indigo",
    },
    {
      title: "Profile Health",
      value: `${account.profileHealth}%`,
      change: account.state,
      icon: ShieldCheck,
      tone:
        account.profileHealth >= 90
          ? "emerald"
          : account.profileHealth >= 70
          ? "amber"
          : "rose",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <button
              onClick={() => navigate("/meta/instagram")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Instagram
            </button>

            <div className="flex items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${account.avatarBg} text-white shadow-md`}
              >
                <Instagram size={22} />
              </div>

              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {account.handle}
                </h1>
                <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                  {account.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <ExternalLink size={16} />
              Open Profile
            </button>

            <button
              onClick={() => navigate("/meta/instagram")}
              className="blue-gradient-btn flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              <Settings size={16} />
              Back to Instagram
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
                  Account Overview
                </h2>
                <span
                  className={`inline-flex rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${stateClasses(
                    account.state
                  )}`}
                >
                  {account.state}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500">
                      <Instagram size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Account Metadata
                      </p>
                      <p className="text-xs text-slate-500">Business profile context</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Account ID</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {account.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Niche</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {account.niche}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Permission</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {account.permission}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                      <Link2 size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Linked Facebook Page
                      </p>
                      <p className="text-xs text-slate-500">Cross-platform mapping</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Page</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {account.linkedPage}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Business Manager</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {account.businessManager}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Connected By</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {account.connectedBy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="app-panel overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-5 dark:border-white/10">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Content Performance
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                    <tr>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Format
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Impressions
                      </th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Engagement
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {contentPerformance.map((item) => (
                      <tr
                        key={item.type}
                        className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                      >
                        <td className="px-8 py-5 text-sm font-bold text-slate-900 dark:text-white">
                          {item.type}
                        </td>
                        <td className="px-8 py-5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {item.impressions}
                        </td>
                        <td className="px-8 py-5 text-sm font-semibold text-emerald-500">
                          {item.engagement}
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
                Profile Health
              </h3>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Connection integrity</span>
                  <span className={`text-sm font-bold ${health.text}`}>
                    {account.profileHealth}%
                  </span>
                </div>

                <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${health.bar}`}
                    style={{ width: `${account.profileHealth}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-3">
                    <Megaphone className="text-blue-500" size={18} />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Campaign Status
                      </p>
                      <p className="text-xs text-slate-500">
                        {account.campaignStatus}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-3">
                    <Activity className="text-emerald-500" size={18} />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Last Sync
                      </p>
                      <p className="text-xs text-slate-500">{account.lastSync}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="app-panel overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-5 dark:border-white/10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Recent Account Events
                </h3>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-white/10">
                {accountEvents.map((event) => (
                  <div key={`${event.title}-${event.time}`} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 flex h-9 w-9 items-center justify-center rounded-xl ${
                            event.status === "Success"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : event.status === "Paused"
                              ? "bg-slate-200 text-slate-500 dark:bg-white/10"
                              : "bg-rose-500/10 text-rose-500"
                          }`}
                        >
                          {event.status === "Success" ? (
                            <CheckCircle2 size={16} />
                          ) : event.status === "Paused" ? (
                            <PauseCircle size={16} />
                          ) : (
                            <AlertTriangle size={16} />
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