import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import {
  ArrowLeft,
  Share2,
  MonitorCog,
  Layers3,
  Image,
  DollarSign,
  Eye,
  MousePointerClick,
  BadgeDollarSign,
  Sparkles,
} from "lucide-react";
import { getCampaignDetailApi } from "../../lib/api";

function statToneClasses(tone) {
  const map = {
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    rose: "bg-rose-500/10 text-rose-500",
  };
  return map[tone] || map.blue;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export default function CampaignDetail() {
  const navigate = useNavigate();
  const { campaignId } = useParams();

  const [campaign, setCampaign] = useState(null);
  const [adSets, setAdSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCampaignDetail() {
      try {
        setLoading(true);
        setError("");

        const data = await getCampaignDetailApi(campaignId);

        if (!active) return;

        setCampaign(data?.campaign || null);
        setAdSets(data?.adSets || []);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load campaign detail.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCampaignDetail();

    return () => {
      active = false;
    };
  }, [campaignId]);

  const metricCards = useMemo(() => {
    if (!campaign) return [];

    return [
      {
        title: "Budget",
        value: formatCurrency(campaign.budget),
        change: campaign.status,
        icon: DollarSign,
        tone: "emerald",
        sub: campaign.budgetType || "Budget",
      },
      {
        title: "Reach",
        value: Number(campaign.reach || 0).toLocaleString(),
        change: "Live",
        icon: Eye,
        tone: "emerald",
        sub: "Unique Viewers",
      },
      {
        title: "CTR",
        value: `${campaign.ctr || 0}%`,
        change: "Live",
        icon: MousePointerClick,
        tone: "rose",
        sub: `${Number(campaign.clicks || 0).toLocaleString()} Clicks`,
      },
      {
        title: "CPL",
        value: formatCurrency(campaign.cpl),
        change: `${campaign.leads || 0} Leads`,
        icon: BadgeDollarSign,
        tone: "emerald",
        sub: formatCurrency(campaign.spend),
      },
    ];
  }, [campaign]);

  if (loading) {
    return (
      <AppShell>
        <div className="app-panel p-8 text-sm text-slate-500 dark:text-slate-400">
          Loading campaign detail...
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="app-panel p-8 text-sm text-rose-500">{error}</div>
      </AppShell>
    );
  }

  if (!campaign) {
    return (
      <AppShell>
        <div className="app-panel p-8 text-sm text-slate-500 dark:text-slate-400">
          Campaign not found.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <button
              onClick={() => navigate("/campaigns")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Campaigns
            </button>

            <div className="mb-2 flex items-center gap-3">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                {campaign.status}
              </span>
              <span className="text-sm font-medium text-slate-400">
                Brand: {campaign.brandName || "N/A"}
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {campaign.name}
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              {campaign.objective} • {campaign.region || "No region"} • {campaign.platform?.join(", ") || "No platform"}
            </p>
            {campaign.metaAdAccountId ? (
              <p className="mt-2 text-sm text-slate-400">
                Meta Ad Account: {campaign.metaAdAccountId}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="auth-outline-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <Share2 size={16} />
              Share Report
            </button>
          </div>
        </div>

        <div className="border-b border-slate-200 dark:border-white/10">
          <div className="flex flex-wrap gap-8">
            <button className="border-b-2 border-blue-600 pb-4 text-sm font-bold text-blue-600 dark:border-blue-400 dark:text-blue-400">
              Overview
            </button>
            <button
              onClick={() => navigate(`/adset?campaignId=${campaign.id}`)}
              className="pb-4 text-sm font-bold text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
            >
              Ad Sets
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="metric-card app-panel-glow">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    {item.title}
                  </p>
                  <span className={`rounded-lg px-3 py-1 text-xs font-bold ${statToneClasses(item.tone)}`}>
                    {item.change}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${statToneClasses(item.tone)}`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                </div>

                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                  {item.sub}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="space-y-8 xl:col-span-2">
            <div className="app-panel p-8">
              <div className="mb-8">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Campaign Summary
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Campaign audience, timing and description
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Audience</p>
                  <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                    {campaign.audience || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Schedule</p>
                  <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                    {campaign.startDate || "N/A"} → {campaign.endDate || "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10 md:col-span-2">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Description</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {campaign.description || "No description added yet."}
                  </p>
                </div>
              </div>
            </div>

            <div className="app-panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6 dark:border-white/10">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Synced Ad Sets
                </h3>
                <button
                  onClick={() => navigate(`/adset?campaignId=${campaign.id}`)}
                  className="text-sm font-bold text-blue-600 dark:text-blue-400"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-slate-50/80 dark:bg-white/[0.03]">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Ad Set Name</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Budget</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Leads</th>
                      <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">CPL</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {adSets.map((item) => (
                      <tr key={item.id} className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                        <td className="px-8 py-5 text-sm font-bold text-slate-900 dark:text-white">{item.name}</td>
                        <td className="px-8 py-5">
                          <span className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {item.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {formatCurrency(item.budget)}
                        </td>
                        <td className="px-8 py-5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {item.leads}
                        </td>
                        <td className="px-8 py-5 text-right text-sm font-black text-slate-900 dark:text-white">
                          {formatCurrency(item.cpl)}
                        </td>
                      </tr>
                    ))}

                    {!adSets.length && (
                      <tr>
                        <td colSpan={5} className="px-8 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                          No ad sets found for this campaign.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="app-panel p-7">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Audience Breakdown
              </h3>

              <div className="mt-8 space-y-7">
                {[
                  { label: "Facebook", value: campaign.platform?.includes("Facebook") ? 55 : 0 },
                  { label: "Instagram", value: campaign.platform?.includes("Instagram") ? 35 : 0 },
                  { label: "Other", value: 10 },
                ].map((item, index) => (
                  <div key={item.label}>
                    <div className="mb-2.5 flex justify-between text-xs font-bold">
                      <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                      <span className="text-slate-900 dark:text-white">{item.value}%</span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div
                        className={`h-full rounded-full ${
                          index === 0 ? "bg-blue-600" : index === 1 ? "bg-blue-500/70" : "bg-blue-500/40"
                        }`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-t border-slate-100 pt-7 dark:border-white/10">
                <h5 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Device Distribution
                </h5>

                <div className="flex items-center gap-4">
                  {[
                    { icon: MonitorCog, label: "Feeds" },
                    { icon: Layers3, label: "Stories" },
                    { icon: Image, label: "Reels" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex-1 text-center">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]">
                          <Icon size={16} className="text-slate-400" />
                        </div>
                        <p className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">
                          {item.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-blue-600 p-7 text-white shadow-2xl shadow-blue-600/20">
              <div className="relative z-10">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles size={18} />
                  <h4 className="text-lg font-extrabold tracking-tight">
                    AI Campaign Insights
                  </h4>
                </div>

                <p className="mb-8 text-sm font-medium leading-relaxed text-white/85">
                  This campaign has generated {campaign.leads || 0} leads with an estimated CPL of {formatCurrency(campaign.cpl)}.
                </p>

                <button className="w-full rounded-xl bg-white py-3 text-sm font-black text-blue-600 transition hover:bg-slate-50">
                  Apply Optimization
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}